import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kong APIOps Bootcamp',
  description: 'Kong Partner Enablement - APIOps with decK: gateway commands, file manipulation, multi-team workflows, and declarative Kong configuration.',

  srcDir: '..',
  outDir: '../dist',
  cacheDir: '../.vitepress-cache',

  base: '/learn-kong-apiops-bootcamp/',

  appearance: 'force-dark',
  cleanUrls: true,

  ignoreDeadLinks: true,

  rewrites: {
    'module-01-deck-gateway/README.md': 'module-01-deck-gateway/index.md',
    'module-02-deck-file/README.md': 'module-02-deck-file/index.md',
    'module-03-deck-workflow/README.md': 'module-03-deck-workflow/index.md',
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
    ['meta', { property: 'og:description', content: 'Hands-on APIOps: deck gateway commands, deck file operations, multi-team workflows' }],
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
        text: '🚀 Getting Started',
        items: [
          { text: '✅ Prerequisites', link: '/prerequisites' },
          { text: '📄 Bookstore API Spec', link: '/api-specs' },
          { text: '📦 Lab Resources', link: '/resources' },
        ],
      },
      {
        text: '📚 Modules',
        items: [
          { text: '|> Module 01: deck gateway Commands',  link: '/module-01-deck-gateway/' },
          { text: '{} Module 02: deck file Commands',      link: '/module-02-deck-file/' },
          { text: '<< Module 03: Multi-Team Workflows',    link: '/module-03-deck-workflow/' },
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
      { text: '🏠 All Bootcamps', link: 'https://kong-grajesh-se.github.io/learn-kong-bootcamps/', target: '_blank' },
    ],

    sidebar: [
      {
        text: '🚀 Getting Started',
        collapsed: false,
        items: [
          { text: '✅ Prerequisites', link: '/prerequisites' },
          { text: '📄 Bookstore API Spec', link: '/api-specs' },
          { text: '📦 Lab Resources', link: '/resources' },
        ],
      },
      {
        text: 'Module 01 - deck gateway Commands',
        collapsed: false,
        items: [
          { text: 'Overview',                        link: '/module-01-deck-gateway/' },
          { text: 'Lab 01: deck gateway commands',   link: '/module-01-deck-gateway/labs/01-deck-gateway' },
        ],
      },
      {
        text: 'Module 02 - deck file Commands',
        collapsed: false,
        items: [
          { text: 'Overview',                        link: '/module-02-deck-file/' },
          { text: 'Lab 01: deck file commands',      link: '/module-02-deck-file/labs/01-deck-file' },
        ],
      },
      {
        text: 'Module 03 - Multi-Team Workflows',
        collapsed: false,
        items: [
          { text: 'Overview',                        link: '/module-03-deck-workflow/' },
          { text: 'Lab 01: Multi-Team Workflows',   link: '/module-03-deck-workflow/labs/01-deck-workflow' },
        ],
      },
    ],

    editLink: {
      pattern: 'https://github.com/Kong-Grajesh-SE/learn-kong-apiops-bootcamp/edit/main/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Updated',
      formatOptions: { dateStyle: 'medium' },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Kong-Grajesh-SE/learn-kong-apiops-bootcamp' },
    ],

    footer: {
      message: 'Kong APIOps Bootcamp - Partner Enablement',
      copyright: '© Kong Inc. 2026 - The AI Connectivity Company',
    },

    search: { provider: 'local' },
  },
})
