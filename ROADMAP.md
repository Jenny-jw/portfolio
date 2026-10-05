# 實作路線

照編號做。每做完一步，在瀏覽器看過再進下一步。公開說明在 [README.md](README.md)。

成品是一頁英文作品集，手機上單欄可讀。工具是 Vite 與 TypeScript。五張卡片由 TypeScript 在瀏覽器裡畫出來。

## 第一版不做

- 部落格、聯絡表單、標籤篩選、深色模式
- 每個作品的長文頁
- 建置時呼叫 GitHub API
- 社群分享圖、動畫、自訂網域
- 用 iframe 嵌入 demo

## 內容規則

- 作品維持 README 裡的 5 筆，手改 `src/projects.ts`
- 每筆有名稱、一行英文摘要、1 到 4 個技術標籤、GitHub 連結
- 只有公開 demo 才加 `demo`。目前只有 mern-blog
- demo 是一般連結，開到對方的網站
- 只連公開專案，倉庫裡不放密鑰、`.env` 或憑證

## 頁面細節

- `<html lang="en">`、分頁標題、`meta name="description"`、favicon
- 頁首有標題、一句介紹，以及連到 <https://github.com/Jenny-jw> 的連結
- 介紹句直接當作 meta description，不必另寫一段
- 系統字型、欄寬約 40rem、標籤自動換行、連結有可見的 focus 樣式
- 窄螢幕沒有橫向捲軸

## 標籤草稿

實作時可以改用詞，每筆仍最多四個。

| 作品 | 標籤 |
| --- | --- |
| mern-blog | MongoDB, Express, React, Node.js |
| assetManager | TypeScript, Python |
| AI-image-classifier | React, FastAPI, PyTorch, MobileNetV2 |
| questionnaire | TypeScript, JWT |
| shortenUrl | Node.js, Express, MongoDB, TypeScript |

## 1. 先寫兩句文案

在動手之前寫下：

- 分頁與頁首標題，用你的名字，例如 `Jenny — Portfolio`
- 一句英文介紹，說明這個頁面在展示什麼

介紹保持一句。作品摘要用 README 表格裡的原文。

## 2. 建立 Vite 專案

倉庫裡已經有 README，不要在非空目錄直接產生專案，以免範本詢問要不要清掉現有檔案。

```bash
npm create vite@latest /tmp/portfolio-vite -- --template vanilla-ts
```

把這些移進倉庫根目錄：`.gitignore`、`index.html`、`package.json`、`tsconfig.json`、`src/`、`public/`。

然後：

- 把 `package.json` 的 `name` 改成 `portfolio`
- 刪掉 `src/counter.ts`、`src/assets/`、`public/icons.svg`
- `public/favicon.svg` 先留著，步驟 7 會換掉
- 在倉庫根目錄執行 `npm install`，產生 `package-lock.json`

目前的 Vite 範本沒有 `vite.config.ts`，下一步自己新增。`tsconfig` 開了 `verbatimModuleSyntax` 與 `allowImportingTsExtensions`，所以型別用 `import type`，本機模組路徑帶 `.ts`。

## 3. 設定網站 base

新增 `vite.config.ts`：

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/portfolio/',
})
```

之後開發網址是 <http://localhost:5173/portfolio/>，預覽網址是 <http://localhost:4173/portfolio/>。`index.html` 裡的 `/favicon.svg` 與 `/src/main.ts` 讓 Vite 在建置時加上這個 base，不要改成自己拼路徑。

## 4. 寫作品資料

新增 `src/projects.ts`。五筆都放進 `projects`，摘要與 README 相同。沒有 demo 的作品不要加 `demo` 欄位。

```ts
export type Project = {
  name: string
  summary: string
  tags: string[]
  github: string
  demo?: string
}

export const projects: Project[] = [
  {
    name: 'mern-blog',
    summary:
      'MERN blog for notes on life, travel, and books. Comments are reviewed before they appear.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    github: 'https://github.com/Jenny-jw/mern-blog',
    demo: 'http://takosnote.onrender.com/',
  },
]
```

## 5. 畫出頁面

用步驟 1 的標題與介紹換成下面的常數。`src/main.ts` 整份改成這支程式，並刪掉對計數器與範本圖檔的 import。

```ts
import './style.css'
import { projects } from './projects.ts'
import type { Project } from './projects.ts'

const pageTitle = 'Jenny — Portfolio'
const introduction = 'One English sentence about this page.'

function link(href: string, label: string): HTMLAnchorElement {
  const url = new URL(href)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`Unsupported link: ${href}`)
  }
  const anchor = document.createElement('a')
  anchor.href = url.href
  anchor.textContent = label
  return anchor
}

function projectCard(project: Project): HTMLLIElement {
  if (project.tags.length < 1 || project.tags.length > 4) {
    throw new Error(`${project.name} must have 1 to 4 tags`)
  }

  const item = document.createElement('li')
  item.className = 'project'

  const heading = document.createElement('h2')
  heading.textContent = project.name

  const summary = document.createElement('p')
  summary.textContent = project.summary

  const tags = document.createElement('ul')
  tags.className = 'tags'
  for (const tag of project.tags) {
    const tagItem = document.createElement('li')
    tagItem.textContent = tag
    tags.append(tagItem)
  }

  const links = document.createElement('div')
  links.className = 'links'
  links.append(link(project.github, 'GitHub'))
  if (project.demo) links.append(link(project.demo, 'Demo'))

  item.append(heading, summary, tags, links)
  return item
}

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Missing #app')

const main = document.createElement('main')
main.className = 'wrap'

const header = document.createElement('header')
const title = document.createElement('h1')
title.textContent = pageTitle
const intro = document.createElement('p')
intro.className = 'intro'
intro.textContent = introduction
header.append(title, intro, link('https://github.com/Jenny-jw', 'GitHub'))

const list = document.createElement('ul')
list.className = 'projects'
list.append(...projects.map(projectCard))

main.append(header, list)
app.replaceChildren(main)
document.title = pageTitle
```

文字用 `textContent`。連結只用 `http:` 與 `https:`。

## 6. 換掉樣式

`src/style.css` 整份換成：

```css
:root {
  color: #1c1917;
  background: #fafaf9;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
}

body {
  margin: 0;
}

.wrap {
  max-width: 40rem;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

h1 {
  font-size: 1.75rem;
  line-height: 1.2;
  margin: 0 0 0.5rem;
}

.intro {
  margin: 0 0 1rem;
}

.projects {
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.project {
  border: 1px solid #e7e5e4;
  border-radius: 0.75rem;
  padding: 1rem 1.1rem;
}

.project h2 {
  font-size: 1.125rem;
  margin: 0 0 0.35rem;
}

.project p {
  margin: 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
}

.tags li {
  font-size: 0.875rem;
  background: #f5f5f4;
  border-radius: 999px;
  padding: 0.1rem 0.55rem;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  margin-top: 0.75rem;
}

a {
  color: #1d4ed8;
}

a:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}
```

## 7. 標題、說明、favicon

`index.html` 的 `<head>` 保留 charset、viewport，以及指向 `/favicon.svg` 的 icon。補上說明，並把 `<title>` 改成步驟 1 的標題：

```html
<meta
  name="description"
  content="One English sentence about this page."
/>
<title>Jenny — Portfolio</title>
```

`public/favicon.svg` 換成一個簡單圖示，不要留 Vite 的 logo：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#1c1917"/>
</svg>
```

## 8. 本機檢查

```bash
npm run dev
```

打開 <http://localhost:5173/portfolio/>，確認：

- 五張卡片都在，摘要與 README 一致
- 只有 mern-blog 有 Demo
- 每筆標籤是 1 到 4 個
- 頁首有 GitHub 個人檔連結
- 把視窗縮到約 320px，文字換行，沒有橫向捲軸
- 用鍵盤 Tab，連結上看得到 focus 框

再跑正式建置：

```bash
npm run build && npm run preview
```

打開 <http://localhost:4173/portfolio/>，確認同一頁仍然完整。

## 9. 發布到 GitHub Pages

確認 `.gitignore` 有 `node_modules` 與 `dist`，而且 `package-lock.json` 已進版控。新增 `.github/workflows/deploy.yml`：

```yaml
name: Deploy static content to Pages

on:
  push:
    branches: ['master']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6
      - name: Set up Node
        uses: actions/setup-node@v6
        with:
          node-version: lts/*
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v6
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: ./dist
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

到 GitHub 倉庫的 Settings → Pages → Build and deployment，Source 選 **GitHub Actions**。這個流程在推上 `master` 時建置並發布，網站網址是 <https://jenny-jw.github.io/portfolio/>。

## 10. 檢查線上結果

Actions 綠燈之後打開線上網址，重看步驟 8 的清單。再確認倉庫裡沒有 `node_modules`、`dist`、`.env` 或憑證。

## 做完的標準

- 線上網址看得到五個作品，內容與 README 一致
- 只有 mern-blog 有 Demo，而且是連結
- 每筆標籤最多四個
- 分頁標題、一句介紹、favicon、GitHub 個人檔連結都在
- 約 320px 寬度可以讀，沒有橫向捲軸
- 發布方式是 GitHub Actions，base 為 `/portfolio/`
