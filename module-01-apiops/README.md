# Module 01 - APIOps with decK

> **Scenario.** You've built a working Kong deployment across the API Gateway, AI Gateway, and Agentic bootcamps. Services, routes, plugins, consumers, and upstreams are all running. But everything was configured through the Admin API or Kong Manager - there's no audit trail, no way to reproduce the setup, and no safety net. In this module you'll learn decK: the CLI that turns Kong configuration into versionable, diffable, deployable YAML files.

## Module outcomes

By the end of this module, you will be able to:

- Capture live Kong state with `deck gateway dump`
- Preview changes safely with `deck gateway diff`
- Deploy config with `deck gateway sync` and `deck gateway apply`
- Validate YAML offline with `deck file validate` and enforce governance with `deck file lint`
- Convert OpenAPI specs to Kong config with `deck file openapi2kong`
- Compose and manipulate config files with `deck file merge`, `render`, `patch`, and `add-plugins`
- Use tags and `--select-tag` for multi-team ownership boundaries

## Prerequisites

You have completed (or are familiar with) the earlier bootcamps and have a running Kong Gateway with services, routes, and plugins configured.

```bash
# Verify decK
deck version
# decK v1.43+

# Verify connectivity (on-prem)
deck gateway ping --kong-addr http://localhost:8001

# Verify connectivity (Konnect)
deck gateway ping \
  --konnect-token "$KONNECT_TOKEN" \
  --konnect-control-plane-name default
```

## What you need

| Tool | Purpose | Minimum |
|---|---|---|
| decK CLI | Declarative Kong config management | 1.43+ |
| Kong Gateway or Konnect | Running instance with existing config | 3.14+ |
| jq | JSON inspection | 1.6+ |

## Labs

| Lab | Focus | Time |
|---|---|---|
| [01 - deck gateway commands](/module-01-apiops/labs/01-deck-gateway) | `ping`, `dump`, `diff`, `sync`, `apply`, `validate`, `reset` | ~75 min |
| [02 - deck file commands](/module-01-apiops/labs/02-deck-file) | `validate`, `lint`, `openapi2kong`, `merge`, `render`, `patch`, `add-plugins`, tags | ~80 min |
| [03 - Putting it all together](/module-01-apiops/labs/03-deck-workflow) | Multi-team tagging, change workflow, OpenAPI-driven pipeline, backup/recovery | ~55 min |

## Suggested reading

- [decK overview](https://developer.konghq.com/deck/)
- [deck gateway commands](https://developer.konghq.com/deck/gateway/)
- [deck file commands](https://developer.konghq.com/deck/file/)
- [Tags and select-tags](https://developer.konghq.com/deck/gateway/tags/)
- [APIOps with decK](https://developer.konghq.com/deck/apiops/)
- [Federated configuration](https://developer.konghq.com/deck/apiops/federated-configuration/)

## Exit ticket

1. What is the difference between `deck gateway sync` and `deck gateway apply`? When would you choose each?
2. How do tags and `--select-tag` prevent teams from deleting each other's configuration?
3. What does `deck file validate` catch that `deck gateway validate` doesn't, and vice versa?
4. Describe the standard change workflow: what commands do you run, in what order, before deploying a config change?

## Common pitfalls

| Symptom | Likely cause | Mitigation |
|---|---|---|
| `sync` deletes services you didn't expect | YAML file doesn't describe all entities | Use `--select-tag` to scope, or use `apply` instead |
| `file validate` passes but `gateway validate` fails | Plugin config invalid for your Kong version | Always run `gateway validate` before first deploy |
| Two teams overwrite each other | No tags, both syncing full state | Tag all entities, use `--select-tag` per team |
| Diff shows changes you didn't make | Kong added default values not in your YAML | Dump, compare, and add missing defaults to your file |
| `openapi2kong` creates duplicate entities | Same spec converted twice with different settings | Use `--uuid-base` for stable IDs |

---

*[← Home](/) · End of APIOps Bootcamp*
