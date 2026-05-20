# Lab 01-A - decK GitOps & CI/CD

> **Goal.** In ~90 minutes you'll implement a full GitOps pipeline for Kong configuration using decK and GitHub Actions. PRs trigger a diff preview; merges to main sync to Kong. Look for **✅ Checkpoint** markers after each step.

---

## Before you start

```bash
# Verify decK is installed
deck version
# decK v1.43+

# Verify Konnect connectivity
deck gateway ping --konnect-token "$KONNECT_TOKEN" \
  --konnect-control-plane-name dev-control-plane
```

---

## GitOps Philosophy

```
Git = Source of Truth
  ↓
PR opened → CI validates YAML + previews diff
  ↓
PR merged → CD syncs to Kong (dev/staging/prod)
  ↓
Kong state always matches the YAML in Git
```

## Repository Structure

```
kong-config/
├── environments/
│   ├── dev.env          ← DEV Kong Admin URL + token
│   ├── staging.env
│   └── prod.env
├── global/
│   ├── plugins.yaml     ← Global plugins (CORS, correlation-id)
│   └── consumers.yaml   ← All consumers + credentials
├── services/
│   ├── mytravel-api.yaml
│   ├── ai-gateway.yaml
│   ├── mcp-services.yaml
│   └── a2a-services.yaml
└── upstreams/
    └── mytravel-upstream.yaml
```

## Step 1 - Environment files (5 min)

Create the `kong-config/environments/` directory and add environment-specific connection details.

`environments/dev.env`:
```bash
KONG_ADDR=http://localhost:8001
KONNECT_ADDR=https://us.api.konghq.com
KONNECT_TOKEN=${KONNECT_TOKEN_DEV}
CONTROL_PLANE=dev-control-plane
```

`environments/prod.env`:
```bash
KONG_ADDR=https://prod-kong-admin.internal:8444
KONNECT_ADDR=https://us.api.konghq.com
KONNECT_TOKEN=${KONNECT_TOKEN_PROD}
CONTROL_PLANE=prod-control-plane
```

**✅ Checkpoint.** Both `dev.env` and `prod.env` files exist with environment-specific variables.

---

## Step 2 - decK Sync Script (10 min)

Create a reusable script that wraps `deck` commands with environment awareness.

`scripts/deck-sync.sh`:

```bash
#!/usr/bin/env bash
# deck-sync.sh - diff or sync all Kong config files
set -euo pipefail

ENV="${1:-dev}"
ACTION="${2:-diff}"  # diff | sync | validate

ENV_FILE="environments/${ENV}.env"
[[ -f "$ENV_FILE" ]] || { echo "Unknown env: $ENV"; exit 1; }
# shellcheck disable=SC1090
source "$ENV_FILE"

CONFIG_FILES=(
  global/plugins.yaml
  global/consumers.yaml
  upstreams/mytravel-upstream.yaml
  services/mytravel-api.yaml
  services/ai-gateway.yaml
  services/mcp-services.yaml
)

echo "==> Environment: $ENV | Action: $ACTION"

case "$ACTION" in
  validate)
    for f in "${CONFIG_FILES[@]}"; do
      echo "  Validating $f..."
      deck file validate "$f"
    done
    echo "==> All files valid"
    ;;

  diff)
    deck gateway diff \
      --kong-addr "${KONG_ADDR}" \
      "${CONFIG_FILES[@]}"
    ;;

  sync)
    deck gateway sync \
      --kong-addr "${KONG_ADDR}" \
      --parallelism 10 \
      "${CONFIG_FILES[@]}"
    echo "==> Sync complete"
    ;;

  dump)
    deck gateway dump \
      --kong-addr "${KONG_ADDR}" \
      --output-file "dump-$(date +%Y%m%d-%H%M%S).yaml"
    ;;

  *)
    echo "Usage: $0 <env> <validate|diff|sync|dump>"
    exit 1
    ;;
esac
```

```bash
chmod +x scripts/deck-sync.sh

# Usage
./scripts/deck-sync.sh dev validate
./scripts/deck-sync.sh dev diff
./scripts/deck-sync.sh dev sync
```

**✅ Checkpoint.** Run `./scripts/deck-sync.sh dev validate` - all files should report valid.

::: tip decK actions cheatsheet
| Command | What it does |
|---|---|
| `deck file validate` | Checks YAML syntax - catches typos before they hit Kong |
| `deck gateway diff` | Compares local YAML against live Kong - shows what would change |
| `deck gateway sync` | Applies the diff - makes Kong match the YAML |
| `deck gateway dump` | Exports live Kong state to a YAML file |
:::

---

## Step 3 - GitHub Actions: PR Validation (15 min)

`.github/workflows/validate.yml`:

```yaml
name: Kong Config Validation

on:
  pull_request:
    paths:
      - 'kong-config/**'
      - '.github/workflows/**'

jobs:
  validate:
    name: Validate & Diff
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install decK
        run: |
          curl -sL https://github.com/Kong/deck/releases/latest/download/deck_linux_amd64.tar.gz \
            | tar -xz -C /usr/local/bin deck

      - name: Validate YAML syntax
        run: |
          for f in kong-config/global/*.yaml kong-config/services/*.yaml kong-config/upstreams/*.yaml; do
            echo "Validating $f..."
            deck file validate "$f"
          done

      - name: Lint with deck
        run: |
          deck file lint \
            --state kong-config/global/plugins.yaml \
            --state kong-config/services/mytravel-api.yaml

      - name: Diff against DEV
        if: github.base_ref == 'main'
        env:
          KONNECT_TOKEN: ${{ secrets.KONNECT_TOKEN_DEV }}
        run: |
          deck gateway diff \
            --konnect-token "$KONNECT_TOKEN" \
            --konnect-control-plane-name dev-control-plane \
            kong-config/global/plugins.yaml \
            kong-config/services/mytravel-api.yaml \
            2>&1 | tee diff-output.txt

      - name: Comment PR with diff
        uses: actions/github-script@v7
        if: always()
        with:
          script: |
            const fs = require('fs');
            const diff = fs.readFileSync('diff-output.txt', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Kong Config Diff\n\`\`\`\n${diff}\n\`\`\``
            });
```

**✅ Checkpoint.** Push this workflow to a branch, open a PR that changes a YAML file, and confirm the CI job runs (green check or diff comment on the PR).

::: warning Keep secrets out of YAML
Never put Konnect tokens or API keys directly in YAML files. Always use GitHub Secrets (e.g. `secrets.KONNECT_TOKEN_DEV`) and environment variables.
:::

---

## Step 4 - GitHub Actions: Deploy on Merge (15 min)

`.github/workflows/deploy.yml`:

```yaml
name: Deploy Kong Config

on:
  push:
    branches: [main]
    paths:
      - 'kong-config/**'

jobs:
  deploy-dev:
    name: Deploy to DEV
    runs-on: ubuntu-latest
    environment: development

    steps:
      - uses: actions/checkout@v4

      - name: Install decK
        run: |
          curl -sL https://github.com/Kong/deck/releases/latest/download/deck_linux_amd64.tar.gz \
            | tar -xz -C /usr/local/bin deck

      - name: Sync to DEV
        env:
          KONNECT_TOKEN: ${{ secrets.KONNECT_TOKEN_DEV }}
        run: |
          deck gateway sync \
            --konnect-token "$KONNECT_TOKEN" \
            --konnect-control-plane-name dev-control-plane \
            --parallelism 10 \
            kong-config/global/plugins.yaml \
            kong-config/services/mytravel-api.yaml \
            kong-config/services/ai-gateway.yaml

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment: staging
    needs: deploy-dev

    steps:
      - uses: actions/checkout@v4
      - name: Install decK
        run: |
          curl -sL https://github.com/Kong/deck/releases/latest/download/deck_linux_amd64.tar.gz \
            | tar -xz -C /usr/local/bin deck
      - name: Sync to Staging
        env:
          KONNECT_TOKEN: ${{ secrets.KONNECT_TOKEN_STAGING }}
        run: |
          deck gateway sync \
            --konnect-token "$KONNECT_TOKEN" \
            --konnect-control-plane-name staging-control-plane \
            kong-config/global/plugins.yaml \
            kong-config/services/mytravel-api.yaml

  deploy-prod:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment: production          # requires manual approval
    needs: deploy-staging

    steps:
      - uses: actions/checkout@v4
      - name: Install decK
        run: |
          curl -sL https://github.com/Kong/deck/releases/latest/download/deck_linux_amd64.tar.gz \
            | tar -xz -C /usr/local/bin deck
      - name: Sync to Production
        env:
          KONNECT_TOKEN: ${{ secrets.KONNECT_TOKEN_PROD }}
        run: |
          deck gateway sync \
            --konnect-token "$KONNECT_TOKEN" \
            --konnect-control-plane-name prod-control-plane \
            --parallelism 5 \
            kong-config/global/plugins.yaml \
            kong-config/services/mytravel-api.yaml
```

**✅ Checkpoint.** Merge a PR to `main` and confirm the deploy pipeline runs: dev → staging → production (with manual approval gate on prod).

---

## Step 5 - Set GitHub Secrets (5 min)

In your GitHub repo → Settings → Secrets → Actions:

| Secret | Description |
|---|---|
| `KONNECT_TOKEN_DEV` | Konnect PAT for dev control plane |
| `KONNECT_TOKEN_STAGING` | Konnect PAT for staging |
| `KONNECT_TOKEN_PROD` | Konnect PAT for production |

**✅ Checkpoint.** All three secrets are set in GitHub → Settings → Secrets → Actions.

---

## Step 6 - Promotion workflow (10 min)

```bash
# Make a config change
git checkout -b feat/add-weather-rate-limit
# Edit kong-config/services/mytravel-api.yaml
git add -A && git commit -m "feat: add rate limiting to weather endpoint"
git push origin feat/add-weather-rate-limit

# Open PR → CI runs:
#   1. deck file validate (lint)
#   2. deck gateway diff (preview changes)
#   3. Posts diff as PR comment

# Review + merge → CD runs:
#   1. Deploy to DEV automatically
#   2. Deploy to Staging automatically (after DEV succeeds)
#   3. Deploy to Production with manual approval gate
```

**✅ Checkpoint.** The PR shows a diff comment. After merge, Kong's dev environment has the new rate-limiting plugin.

---

## decK Best Practices

| Practice | Why |
|---|---|
| Separate files per service | Easier reviews, less merge conflicts |
| Use `--parallelism` | Faster syncs for large configs |
| Always diff before sync | Prevents surprises |
| Use environment files | Single source for env-specific URLs |
| Tag all resources | Enables filtered operations |
| Version your YAML (`_format_version: '3.0'`) | Future compatibility |

---

---

*Lab 01-A complete. [← Back to Module Overview](/module-01-apiops/)*
