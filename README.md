# Kong APIOps Bootcamp

> **Git is the source of truth. decK syncs Kong state declaratively. GitHub Actions validates on PRs and deploys on merge.**

A hands-on bootcamp for implementing APIOps with Kong Gateway using declarative configuration, GitOps pipelines, and CI/CD automation.

## What You'll Learn

- **decK GitOps** — Full GitOps pipeline for Kong config. PRs trigger a diff preview; merges to main sync to Kong.
- **GitHub Actions CI/CD** — Validate YAML on PR, diff against live config, sync on merge to main.
- **Declarative Config** — Manage Kong objects (services, routes, plugins, consumers, upstreams) as version-controlled YAML.
- **Multi-Environment Promotion** — Promote config from dev → staging → prod with environment-specific variable injection.
- **Diff & Validate** — Use `deck diff` to preview changes and `deck validate` to catch errors before they reach production.

## Modules

| Module | Topic |
|---|---|
| [Module 01 - APIOps](./module-01-apiops/) | decK GitOps & CI/CD with GitHub Actions |

## Prerequisites

- [Kong Gateway](https://docs.konghq.com/gateway/latest/) or [Kong Konnect](https://cloud.konghq.com) account
- [decK CLI](https://docs.konghq.com/deck/latest/installation/) installed
- [Node.js](https://nodejs.org/) 18+ (for docs site)
- Git & GitHub account (for CI/CD labs)

## Getting Started

### Run the Docs Site Locally

```bash
npm install
npm run docs:dev
```

The docs site will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run docs:build
npm run docs:preview
```

## Project Structure

```
apiops-bootcamp/
├── docs/                        # VitePress documentation source
│   └── .vitepress/              # VitePress config & theme
├── module-01-apiops/
│   ├── README.md                # Module overview
│   └── labs/
│       └── 09-deck-cicd.md      # decK GitOps & CI/CD lab
├── index.md                     # Home page
└── package.json
```

## Stack

| Tool | Purpose |
|---|---|
| [Kong Gateway](https://docs.konghq.com/gateway/latest/) | API gateway |
| [decK](https://docs.konghq.com/deck/latest/) | Declarative Kong config management |
| [GitHub Actions](https://docs.github.com/en/actions) | CI/CD automation |
| [Kong Konnect](https://cloud.konghq.com) | Managed control plane |
| [VitePress](https://vitepress.dev/) | Documentation site |

## License

Private — for internal training use.
