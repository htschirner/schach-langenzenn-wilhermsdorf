import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://htschirner.github.io/schach-langenzenn-wilhermsdorf',
  base: '/schach-langenzenn-wilhermsdorf',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('impressum-datenschutz'),
    }),
  ],
});
