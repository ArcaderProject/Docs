import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://arcader.hazdu.de',
  integrations: [
    starlight({
      title: 'Arcader',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Deutsch', lang: 'de' },
      },
      logo: {
        src: './src/assets/logo.png',
        alt: 'Arcader',
      },
      favicon: '/assets/logo.png',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/ArcaderProject/Arcader' },
      ],
      editLink: {
        baseUrl: 'https://github.com/ArcaderProject/Arcader/edit/main/Docs/',
      },
      customCss: ['./src/styles/retro.css'],
      head: [
        {
          tag: 'script',
          attrs: {
            type: 'module',
            src: 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js',
          },
        },
      ],
      sidebar: [
        { label: 'Willkommen', slug: 'index' },
        { label: 'Vorbereitung', slug: 'preparation' },
        { label: 'Aufbau', slug: 'hardware' },
        { label: 'Software', slug: 'software' },
        { label: 'Eigenes Frontend', slug: 'frontend' },
      ],
    }),
  ],
});
