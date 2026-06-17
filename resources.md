---
title: Lab Resources
description: Downloadable decK files, OpenAPI specs, lint rules, and pipeline assets for APIOps labs.
---

# Lab Resources

::: tip Download and use alongside the labs
These are the actual configuration files used in the bootcamp labs. Download the ones you need or clone the full `resources/` folder to follow along.
:::

## decK Configuration Files

| File | Steps | What it configures |
|---|---|---|
| [01-bookstore-base.yaml](resources/deck/01-bookstore-base.yaml) | 1-4 | Base bookstore service + route |
| [02-bookstore-plugins.yaml](resources/deck/02-bookstore-plugins.yaml) | 5-6 | + rate-limiting, correlation-id, request-transformer |
| [03-bookstore-consumers.yaml](resources/deck/03-bookstore-consumers.yaml) | 7 | + key-auth, consumers |
| [04-bookstore-tagged.yaml](resources/deck/04-bookstore-tagged.yaml) | 10, 16-18 | Tagged service for lint and tag operations |
| [05-bookstore-templated.yaml](resources/deck/05-bookstore-templated.yaml) | 13 | Templated service with env var placeholders |
| [partial-services.yaml](resources/deck/partial-services.yaml) | 12 | Partial: just the service |
| [partial-plugins.yaml](resources/deck/partial-plugins.yaml) | 12 | Partial: just the plugins |
| [partial-consumers.yaml](resources/deck/partial-consumers.yaml) | 12 | Partial: just the consumers |
| [plugin-cors.yaml](resources/deck/plugin-cors.yaml) | 15 | CORS plugin for add-plugins |
| [patch-timeouts.json](resources/deck/patch-timeouts.json) | 14 | JSONPath patch for timeouts |

### How to apply

```bash
# Sync a config file
deck gateway sync resources/deck/01-bookstore-base.yaml \
  --konnect-token $KONNECT_TOKEN \
  --konnect-control-plane-name "$CP_NAME"

# Add plugins to a base file
deck file add-plugins \
  -s resources/deck/01-bookstore-base.yaml \
  resources/deck/plugin-cors.yaml \
  --output-file output/with-cors.yaml
```

---

## OpenAPI Spec

| File | Description |
|---|---|
| [bookstore-api.yaml](resources/openapi/bookstore-api.yaml) | Bookstore API OpenAPI 3.0 spec (used with `deck file openapi2kong`) |

```bash
deck file openapi2kong \
  --spec resources/openapi/bookstore-api.yaml \
  --output-file output/from-openapi.yaml
```

---

## Lint Rules

| File | Description |
|---|---|
| [ruleset.yaml](resources/lint/ruleset.yaml) | Custom governance rules (naming, tags, timeouts) |

```bash
deck file lint -s resources/deck/04-bookstore-tagged.yaml resources/lint/ruleset.yaml
```

---

## Architecture Diagrams

| File | Description |
|---|---|
| [gitops_pipeline.png](resources/assets/gitops_pipeline.png) | GitOps CI/CD pipeline for APIOps |

---

## Source

These resources are sourced from the [Kong Bootcamp Repo](https://github.com/Kong-Grajesh-SE/bootcamp-repo/tree/main/02-apiops).
