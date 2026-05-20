---
outline: deep
description: Everything you need installed before starting the Kong APIOps Bootcamp.
---

# Prerequisites

::: warning Kong Gateway 3.14+ required
All labs in this bootcamp target Kong Gateway 3.14 on Konnect. decK syntax and plugin schemas assume 3.14 or newer.
:::

## Required tools

| Tool | Purpose | Min Version | Install |
|---|---|---|---|
| **decK** | Declarative Kong configuration (validate, diff, sync) | **1.43+** | `brew install kong/deck/deck` |
| **Git** | Version control | Latest | `brew install git` |
| **GitHub account** | CI/CD hosting for Actions workflows | - | [github.com](https://github.com) |
| **Kong Konnect** | Cloud control plane (free tier works) | - | [cloud.konghq.com](https://cloud.konghq.com) |
| **jq** | Parse JSON responses | 1.6+ | `brew install jq` |
| **Node.js** | Run the docs site locally | 20 LTS | `brew install node@20` |

## Verify your setup

```bash
# decK
deck version
# Should show v1.43 or higher

# Konnect connectivity
export KONNECT_TOKEN="kpat_..."
deck gateway ping --konnect-token "$KONNECT_TOKEN" \
  --konnect-control-plane-name dev-control-plane
# Connected to Kong

# jq
jq --version
# jq-1.6+

# Git
git --version
```

## Konnect setup

1. Sign up at [cloud.konghq.com](https://cloud.konghq.com) (free tier works)
2. Create a Personal Access Token (PAT): **Account** → **Tokens** → **Generate Token**
3. Create at least one Control Plane named `dev-control-plane`

```bash
export KONNECT_TOKEN="kpat_your_token_here"
```

---

*Ready? Start with [Module 01 - APIOps with decK →](/module-01-apiops/)*
