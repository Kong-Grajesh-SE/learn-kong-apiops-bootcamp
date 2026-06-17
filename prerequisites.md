---
outline: deep
description: Everything you need installed before starting the Kong APIOps Bootcamp.
---

# Prerequisites

::: warning Continues from earlier bootcamps
This bootcamp assumes you have a running Kong Gateway with services, routes, and plugins configured from the API Gateway, AI Gateway, or Agentic bootcamps. You need an existing Kong state for decK to work with.
:::

## Required tools

| Tool | Purpose | Min Version | Install |
|---|---|---|---|
| **decK** | Declarative Kong configuration (validate, diff, sync) | **1.43+** | `brew install kong/deck/deck` |
| **Kong Gateway** | Running instance with existing configuration | **3.14+** | From earlier bootcamp |
| **jq** | Parse JSON responses | 1.6+ | `brew install jq` |
| **Node.js** | Run the docs site locally | 20 LTS | `brew install node@20` |

## Prior bootcamp experience

You should have completed at least one of:

- [API Gateway Bootcamp](../api-gateway-bootcamp/) - Services, Routes, Plugins, Consumers, Upstreams
- [AI Gateway Bootcamp](../ai-gateway-bootcamp/) - AI proxy configuration
- [Agentic Bootcamp](../agentic-bootcamp/) - MCP services and guardrails

## Verify your setup

```bash
# decK
deck version
# Should show v1.43 or higher

# Kong connectivity (on-prem)
deck gateway ping --konnect-token $KONNECT_TOKEN \
  --konnect-control-plane-name "$CP_NAME"

# Or Konnect connectivity
export KONNECT_TOKEN="kpat_..."
deck gateway ping --konnect-token "$KONNECT_TOKEN" \
  --konnect-control-plane-name default

# jq
jq --version
# jq-1.6+
```

## Konnect setup (if using Konnect)

1. Sign up at [cloud.konghq.com](https://cloud.konghq.com) (free tier works)
2. Create a Personal Access Token (PAT): **Account** → **Tokens** → **Generate Token**
3. Have at least one Control Plane with existing config

```bash
export KONNECT_TOKEN="kpat_your_token_here"
```

---

*Ready? Start with [Lab 01 - deck gateway commands →](/module-01-apiops/labs/01-deck-gateway)*
