import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kong APIOps Bootcamp',
  description: 'Kong Partner Enablement — APIOps with decK: GitOps, CI/CD pipelines, declarative config, and GitHub Actions for Kong Gateway.',

  srcDir: '..',
  outDir: '../dist',
  cacheDir: '../.vitepress-cache',

  base: '/learn-kong-apiops-bootcamp/',

  appearance: 'force-dark',
  cleanUrls: true,

  ignoreDeadLinks: true,

  rewrites: {
    'module-01-apiops/README.md': 'module-01-apiops/index.md',
  },

  srcExclude: [
    'node_modules/**',
    'dist/**',
    'docs/.vitepress/**',
    '.vitepress-cache/**',
    'README.md',
    '.github/**',
  ],

  head: [
    ['link', { rel: 'icon',           href: '/learn-kong-apiops-bootcamp/favicon.png', type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'shortcut icon',  href: '/learn-kong-apiops-bootcamp/favicon.png', type: 'image/png' }],
    ['link', { rel: 'apple-touch-icon', href: '/learn-kong-apiops-bootcamp/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#000F06' }],
    ['meta', { property: 'og:title', content: 'Kong APIOps Bootcamp' }],
    ['meta', { property: 'og:description', content: 'Hands-on APIOps: decK GitOps, GitHub Actions CI/CD, declarative config' }],
    ['meta', { property: 'og:image', content: '/learn-kong-apiops-bootcamp/kong-gateway-logo.svg' }],
  ],

  markdown: {
    theme: { light: 'github-light', dark: 'one-dark-pro' },
    lineNumbers: true,
  },

  themeConfig: {
    logo: '/kong-logomark-lime.svg',
    siteTitle: 'APIOps Bootcamp',

    nav: [
      { text: '🏠 Home', link: '/' },
      {
        text: '📚 Module',
        items: [
          { text: '📋 Overview',          link: '/module-01-apiops/' },
          { text: '🔄 decK & CI/CD',      link: '/module-01-apiops/labs/09-deck-cicd' },
        ],
      },
      {
        text: '🔗 Resources',
        items: [
          { text: '📖 decK Docs',    link: 'https://developer.konghq.com/deck/', target: '_blank' },
          { text: '📖 Konnect Docs', link: 'https://developer.konghq.com/konnect/', target: '_blank' },
          { text: '☁️ Konnect',      link: 'https://cloud.konghq.com', target: '_blank' },
        ],
      },
    ],

    sidebar: [
      {
        text: '🔄 APIOps with decK',
        collapsed: false,
        items: [
          { text: '📋 Overview',        link: '/module-01-apiops/' },
          { text: '🔄 Lab: decK & CI/CD', link: '/module-01-apiops/labs/09-deck-cicd' },
        ],
      },
    ],

    editLink: {
      pattern: 'https://github.com/Kong-Grajesh-SE/learn-apiops/edit/main/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Updated',
      formatOptions: { dateStyle: 'medium' },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Kong-Grajesh-SE/learn-apiops' },
    ],

    footer: {
      message: 'Kong APIOps Bootcamp — Partner Enablement',
      copyright: '© Kong Inc. 2026 — The AI Connectivity Company',
    },

    search: { provider: 'local' },
  },
})
