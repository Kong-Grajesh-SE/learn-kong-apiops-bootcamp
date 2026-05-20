# Module 01 - APIOps with decK

> **The scenario.** Your team has been configuring Kong manually - clicking through Kong Manager or running ad-hoc Admin API calls. Configuration drift between dev and production is constant. A junior engineer accidentally deleted a rate-limiting plugin in prod, and nobody noticed until customers complained.
>
> In the next ~2 hours you'll implement a GitOps workflow where Git is the single source of truth for all Kong configuration. PRs trigger automated validation and diff previews; merges to main deploy to dev → staging → production with quality gates at each stage.

## What you'll have at the end

- A `kong-config/` repository structure with per-service YAML, global plugins, and environment files
- A `deck-sync.sh` script for local validate/diff/sync operations
- A GitHub Actions PR workflow: `deck file validate` → `deck gateway diff` → comment on PR
- A GitHub Actions deploy workflow: dev → staging → production (with manual approval gate)
- Full promotion flow tested end-to-end

## Who this module is for

You have a Kong Konnect account with at least one control plane. You understand Services, Routes, and plugins from the API Gateway Bootcamp (or equivalent experience). decK CLI is installed locally.

```bash
# Verify decK
deck version
# decK v1.43+

# Verify Konnect connectivity
deck gateway ping --konnect-token "$KONNECT_TOKEN" \
  --konnect-control-plane-name dev-control-plane
```

## What you'll need

| Tool | Purpose | Min Version |
|---|---|---|
| decK CLI | Declarative Kong configuration management | 1.43+ |
| Git + GitHub | Version control and CI/CD hosting | - |
| Kong Konnect | Cloud control plane (free tier works) | - |
| jq | Parse JSON output | 1.6+ |

## Three concepts you need today

| Concept | What it is | Why it matters |
|---|---|---|
| **Declarative config** | Kong state described as YAML files under version control | No more manual clicks - every change is reviewable, auditable, and rollback-able |
| **deck diff** | Compares local YAML against live Kong state and shows what would change | Prevents surprises - you see exactly what a sync will do before it runs |
| **Environment promotion** | Same YAML, different environment variables (dev → staging → prod) | Ensures config consistency across environments with environment-specific overrides |

## Labs

| Lab | Topic | Time |
|---|---|---|
| [01-A: decK GitOps & CI/CD](/module-01-apiops/labs/01-deck-cicd) | Repository structure, sync script, GitHub Actions PR + deploy workflows | ~90 min |

## Exit ticket

1. What is the difference between `deck gateway diff` and `deck gateway sync`? When do you use each?
2. Your PR workflow runs `deck file validate` but the diff still fails. What could cause this?
3. The production deploy job requires `environment: production` with a manual approval gate. Where in GitHub is this configured?

## Common pitfalls

| Symptom | Likely cause |
|---|---|
| `deck gateway diff` shows unexpected deletions | YAML files don't cover all Services - decK thinks missing ones should be deleted. Use `--select-tag` to scope |
| Secrets appear in PR diff comments | Konnect token or API keys in YAML - use `deck file add-plugins` with `--select-tag` or environment variables |
| Sync fails with "duplicate" error | Two YAML files define the same Service name - consolidate or use `--select-tag` |
| CI passes but deploy fails | PR validated against dev but deploying to staging - schema differences between environments |
| `_format_version` mismatch | YAML uses `'1.1'` but Kong 3.14 expects `'3.0'` |

---

*[← Home](/) · End of APIOps Bootcamp*
