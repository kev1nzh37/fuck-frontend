import { defineConfig } from 'dumi';

const repo = 'fuck-frontend';

export default defineConfig({
  title: repo,
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  hash: true,
  // Because of using GitHub Pages
  base: `/${repo}/`,
  publicPath: `/${repo}/`,
  locales: [['中文', '中文']],
  navs: [
    // {
    //   title: 'Leetcode 标签分类',
    //   path: '/tags'
    // },
    {
      title: 'Leetcode',
      path: '/group',
    },
    {
      title: '思维导图笔记',
      path: '/end',
    },
    {
      title: '八股文',
      children: [
        {
          title: 'Javascript',
          path: '/question',
        },
        {
          title: 'React',
          path: '/react',
        },
        {
          title: '工程化',
          path: '/bundle',
        },
        {
          title: '扩展',
          path: '/script',
        },
        {
          title: '浏览器和网络',
          path: '/chrome',
        },
        {
          title: 'Node',
          path: '/node',
        },
        {
          title: 'CSS',
          path: '/css',
        },
      ],
    },
    {
      title: 'GitHub',
      path: 'https://github.com/kev1nzh37/fuck-frontend',
    },
  ],
  // more config: https://d.umijs.org/config
});
