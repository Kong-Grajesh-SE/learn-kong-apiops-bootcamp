# Kong APIOps Bootcamp

![Kong Gateway 3.14+](https://img.shields.io/badge/Kong%20Gateway-3.14%2B-CCFF00?style=for-the-badge&labelColor=001408)
![Platform: Konnect](https://img.shields.io/badge/Platform-Konnect-CCFF00?style=for-the-badge&labelColor=001408)
![Modules: 1](https://img.shields.io/badge/Modules-1-CCFF00?style=for-the-badge&labelColor=001408)

> ⚙️ **Requires Kong Gateway 3.14 or newer** and decK 1.43+.

A hands-on bootcamp for implementing APIOps with Kong Gateway using declarative configuration, GitOps pipelines, and CI/CD automation.

## Overview

| | |
|---|---|
| **Kong version** | **Kong Gateway 3.14+** |
| **Format** | 1 module, 1 lab (~90 min) |
| **Flow** | Repository structure → sync script → CI validation → CD deployment |
| **Platform** | decK CLI + GitHub Actions → Kong Konnect |

## Bootcamp Modules

| # | Module | Key Topics |
|---|---|---|
| 01 | **APIOps with decK** | Declarative config, `deck diff`, `deck sync`, GitHub Actions CI/CD, multi-environment promotion |

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

Private - for internal training use.
