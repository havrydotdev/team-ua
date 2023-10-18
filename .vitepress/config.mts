import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'UA teammates',
  description: 'User-friendly telegram bot',
  srcDir: './docs',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation', link: '/install' },
          { text: 'Usage', link: '/usage' },
        ],
        base: '/getting-started',
      },
      {
        text: 'Examples',
        items: [{ text: 'Runtime API Examples', link: '/api-examples' }],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/gavrylenkoIvan/ua-teammates',
      },
    ],
  },
});
