# Configuration

## Purpose

This document defines standards for configuring Docusaurus projects, including SEO, internationalization, and theme settings.

---

## Basic configuration - P1

### Use TypeScript configuration

Use `docusaurus.config.ts` instead of `.js` for type safety.

**Required settings:**

```typescript
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Product Name - Tagline",
  tagline: "Brief description of the product",
  favicon: "img/app-icon.png",

  // Enable Docusaurus v4 compatibility
  future: {
    v4: true,
  },

  // Production URL
  url: "https://{product}.labee.dev",
  baseUrl: "/",

  // GitHub Pages config
  organizationName: "LabeeHive",
  projectName: "{ProductName}",

  // Fail on broken links
  onBrokenLinks: "throw",

  // ... rest of config
};

export default config;
```

---

## SEO configuration - P1

### Required headTags

Every product site must include these SEO meta tags in `headTags`:

```typescript
headTags: [
  // Keywords for search engines
  {
    tagName: 'meta',
    attributes: {
      name: 'keywords',
      content: 'keyword1, keyword2, keyword3, ...',
    },
  },
  // Author
  {
    tagName: 'meta',
    attributes: {
      name: 'author',
      content: 'LabeeHive',
    },
  },
  // Open Graph
  {
    tagName: 'meta',
    attributes: {
      property: 'og:type',
      content: 'website',
    },
  },
  {
    tagName: 'meta',
    attributes: {
      property: 'og:image',
      content: 'https://{product}.labee.dev/img/og-image.png',
    },
  },
  {
    tagName: 'meta',
    attributes: {
      property: 'og:image:width',
      content: '1200',
    },
  },
  {
    tagName: 'meta',
    attributes: {
      property: 'og:image:height',
      content: '630',
    },
  },
  // Twitter Card
  {
    tagName: 'meta',
    attributes: {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'twitter:site',
      content: '@labeehive',
    },
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'twitter:image',
      content: 'https://{product}.labee.dev/img/og-image.png',
    },
  },
  // Canonical URL
  {
    tagName: 'link',
    attributes: {
      rel: 'canonical',
      href: 'https://{product}.labee.dev/',
    },
  },
],
```

### Structured Data

Include JSON-LD structured data for better search engine understanding:

```typescript
headTags: [
  // ... meta tags above

  // Organization
  {
    tagName: 'script',
    attributes: {
      type: 'application/ld+json',
    },
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Labee LLC',
      url: 'https://labee.jp',
      logo: 'https://{product}.labee.dev/img/app-icon.png',
      sameAs: [
        'https://x.com/labeehive',
      ],
    }),
  },
  // WebSite
  {
    tagName: 'script',
    attributes: {
      type: 'application/ld+json',
    },
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: '{ProductName}',
      url: 'https://{product}.labee.dev',
      description: 'Product description',
      publisher: {
        '@type': 'Organization',
        name: 'Labee LLC',
      },
    }),
  },
],
```

### Theme metadata

Add description in `themeConfig.metadata`:

```typescript
themeConfig: {
  image: "img/og-image.png",
  metadata: [
    {
      name: 'description',
      content: 'Full product description for search results.',
    },
    {
      name: 'og:description',
      content: 'Shorter description for social sharing.',
    },
  ],
  // ...
},
```

---

## Internationalization - P1

### Default locales

Support English and Japanese:

```typescript
i18n: {
  defaultLocale: "en",
  locales: ["en", "ja"],
},
```

### Translation files

Place translations in `i18n/ja/`:

```text
i18n/
└── ja/
    ├── docusaurus-plugin-content-docs/
    │   └── current/
    │       └── intro.md
    └── docusaurus-theme-classic/
        └── navbar.json
```

---

## Sitemap - P1

### Google-recommended settings

Configure sitemap for optimal Google crawling:

```typescript
presets: [
  [
    "classic",
    {
      // ...
      sitemap: {
        lastmod: 'date',      // Google uses this for crawl prioritization
        changefreq: null,     // Google ignores this
        priority: null,       // Google ignores this
        ignorePatterns: ['/tags/**'],
        filename: 'sitemap.xml',
      },
    },
  ],
],
```

---

## Preset configuration - P1

### Classic preset

Use the classic preset with these settings:

```typescript
presets: [
  [
    "classic",
    {
      docs: {
        sidebarPath: "./sidebars.ts",
        // Disable "Edit this page" for public sites
        // editUrl: 'https://github.com/LabeeHive/{Product}/tree/main/pages/',
      },
      blog: false,  // Disable blog unless needed
      theme: {
        customCss: "./src/css/custom.css",
      },
      sitemap: {
        // ... sitemap config
      },
    } satisfies Preset.Options,
  ],
],
```

---

## Theme configuration - P2

### Navbar

Standard navbar configuration:

```typescript
themeConfig: {
  navbar: {
    title: "{ProductName}",
    logo: {
      alt: "{ProductName} Logo",
      src: "img/app-icon.png",
      srcDark: "img/app-icon-dark.png",  // Optional
    },
    items: [
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        position: "left",
        label: "Documentation",
      },
      // Language switcher (enable when translations are ready)
      // {
      //   type: 'localeDropdown',
      //   position: 'right',
      // },
    ],
  },
},
```

### Footer

Standard footer with company links:

```typescript
themeConfig: {
  footer: {
    style: "dark",
    links: [
      {
        title: "Product",
        items: [
          {
            label: "Documentation",
            to: "/docs/intro",
          },
        ],
      },
      {
        title: "Company",
        items: [
          {
            label: "About Labee LLC",
            href: "https://labee.jp",
          },
          {
            label: "Privacy Policy",
            href: "https://labee.jp/privacy",
          },
          {
            label: "X (Twitter)",
            href: "https://x.com/labeehive",
          },
        ],
      },
    ],
    copyright: `Copyright © ${new Date().getFullYear()} Labee LLC. All rights reserved.`,
  },
},
```

### Color mode

Enable dark mode with system preference:

```typescript
themeConfig: {
  colorMode: {
    defaultMode: "light",
    disableSwitch: false,
    respectPrefersColorScheme: true,
  },
},
```

### Prism (code highlighting)

Use GitHub/Dracula themes:

```typescript
import { themes as prismThemes } from "prism-react-renderer";

themeConfig: {
  prism: {
    theme: prismThemes.github,
    darkTheme: prismThemes.dracula,
  },
},
```

---

## Google Analytics - P2

### Configure gtag

Use Google Analytics via the gtag plugin. With preset-classic, no additional installation is required.

```typescript
presets: [
  [
    "classic",
    {
      // ... other settings
      gtag: {
        trackingID: 'G-XXXXXXXXXX',
        anonymizeIP: true,
      },
    } satisfies Preset.Options,
  ],
],
```

### Configuration options

| Option | Type | Description |
|--------|------|-------------|
| `trackingID` | string / string[] | **Required.** GA4 measurement ID (G-XXXXXX) |
| `anonymizeIP` | boolean | Anonymize visitor IP addresses (recommended: true) |

### Notes

- **Development**: gtag is disabled in development mode to avoid polluting statistics
- **Verification**: Use [Google Tag Assistant](https://tagassistant.google.com/) to verify setup
- **GDPR**: For Japan-targeted sites, cookie consent banners are not required. If targeting EU, implement consent management separately

---

## References

- [Docusaurus Configuration](https://docusaurus.io/docs/configuration)
- [Docusaurus SEO](https://docusaurus.io/docs/seo)
- [Docusaurus i18n](https://docusaurus.io/docs/i18n/introduction)
- [Docusaurus plugin-google-gtag](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
