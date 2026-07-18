# Yunmo

Yunmo 是一个基于 Astro 的轻盈博客主题，整体风格偏干净、通透、安静，带有玻璃质感导航栏与更偏东方气质的视觉表达。

## 预览特点

- 轻量首页与文章列表布局
- 玻璃质感顶栏
- 自适应深浅色模式
- 首页随机一言
- 文章封面、标签、归档时间线
- 自动目录高亮
- 图片灯箱预览
- 代码块复制按钮
- 分享面板与微信二维码分享
- 友链页面
- SEO 基础配置

## 技术栈

- Astro 5
- TypeScript
- 原生 CSS

## 本地开发

先安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

本地构建：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

## 可用脚本

```bash
npm run dev
npm run build
npm run preview
npm run check:seo
npm run check:links
npm run verify
npm run backup
npm run indexnow
```

## 配置说明

主要配置文件：

- `src/config/site.ts`
- `astro.config.mjs`

你可以在 `src/config/site.ts` 中修改这些内容：

- 网站名称
- 网站描述
- 背景图
- 浏览器标签页图标
- 首页名言来源
- 导航栏项目

## 域名与 SEO

项目支持按部署环境自动识别站点域名。

优先识别这些环境变量：

- `PUBLIC_SITE_URL`
- `SITE_URL`
- `VERCEL_PROJECT_PRODUCTION_URL`
- `VERCEL_URL`
- `DEPLOY_PRIME_URL`
- `DEPLOY_URL`
- `CF_PAGES_URL`
- `URL`

说明：

- 如果部署环境提供域名变量，`sitemap` 会自动生成
- 如果没有提供域名变量，站点依然可以正常构建和访问
- 页面运行时分享链接、二维码与部分 SEO 地址会按当前访问域名自适应

## 项目结构

```text
src/
  components/   组件
  config/       站点配置
  content/      文章内容
  data/         数据文件
  layouts/      页面布局
  pages/        路由页面
  styles/       全局样式
  utils/        工具函数

public/
  scripts/      前端交互脚本
```

## 说明

当前仓库内包含示例文章与默认友链数据，适合继续二次改造为个人博客主题。
