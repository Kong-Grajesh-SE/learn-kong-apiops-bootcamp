---
layout: home

hero:
  name: "Kong APIOps"
  text: "Bootcamp"
  tagline: "Git is the source of truth. decK syncs Kong state declaratively. GitHub Actions validates on PRs and deploys on merge."
  image:
    src: /kong-logomark-lime.svg
    alt: Kong APIOps
  actions:
    - theme: brand
      text: "Start Module →"
      link: /module-01-apiops/
    - theme: brand
      text: "🔄 decK CI/CD Lab"
      link: /module-01-apiops/labs/09-deck-cicd
    - theme: alt
      text: "☁️ Konnect ↗"
      link: https://cloud.konghq.com

features:
  - icon: 🔄
    title: "decK GitOps"
    details: "Implement a full GitOps pipeline for Kong config. PRs trigger a diff preview; merges to main sync to Kong. Config always matches Git."
    link: /module-01-apiops/labs/09-deck-cicd
    linkText: Start lab →

  - icon: 🤖
    title: "GitHub Actions CI/CD"
    details: "Automate Kong config deployment with GitHub Actions. Validate YAML on PR, diff against live config, sync on merge to main."
    link: /module-01-apiops/labs/09-deck-cicd
    linkText: Build pipeline →

  - icon: 📁
    title: "Declarative Config"
    details: "Manage all Kong objects as YAML: services, routes, plugins, consumers, upstreams. Everything version-controlled and reviewable."
    link: /module-01-apiops/labs/09-deck-cicd
    linkText: Write config →

  - icon: 🌍
    title: "Multi-Environment"
    details: "Promote config from dev → staging → prod with environment-specific variable injection. One YAML, multiple targets."
    link: /module-01-apiops/labs/09-deck-cicd
    linkText: Multi-env →

  - icon: 🔍
    title: "Diff & Validate"
    details: "Use `deck diff` to preview exactly what will change before applying. `deck validate` catches YAML errors before they reach production."
    link: /module-01-apiops/labs/09-deck-cicd
    linkText: Validate first →

  - icon: ☁️
    title: "Konnect Target"
    details: "All decK commands target Konnect control plane via --konnect-token. No local Admin API needed — manage everything from Git."
    link: /module-01-apiops/
    linkText: Deploy to Konnect →
---
