# LinZiyou Dev Blog

基於 [Astro](https://astro.build/) 靜態網站產生器 + [Firefly](https://github.com/CuteLeaf/Firefly) 主題的個人技術部落格。

<br>

## 快速開始

```bash
pnpm install    # 安裝依賴
pnpm dev        # 啟動開發伺服器 (http://localhost:4321)
pnpm build      # 建置靜態網站到 dist/
pnpm preview    # 預覽建置結果
```

> **注意**：搜尋（Pagefind）和 Sitemap 需要 `pnpm build` 後才能在 `pnpm preview` 中測試。

<br>

## 專案結構

```
├── .github/
│   ├── workflows/
│   │   ├── biome.yml                # CI: Biome 程式碼品質檢查
│   │   ├── build.yml                # CI: astro check + build (Node 22/23/24)
│   │   └── deploy.yml               # GitHub Pages 自動部署
│   └── dependabot.yml               # 自動檢查 npm 依賴更新
├── .vscode/                         # 編輯器設定（💡自行新增）
│   ├── extensions.json              # 推薦擴充套件 (Biome + Astro)
│   └── settings.json                # Biome 格式化設定
├── public/
│   ├── favicon/                     # Favicon
│   └── uploads/                     # 靜態圖片（💡自行新增，不經優化）
├── scripts/
│   └── new-post.js                  # 新增文章快捷腳本
├── src/
│   ├── assets/images/               # 圖片資源（會被 Astro 優化）
│   │   ├── avatar.jpg               # 大頭照（💡自行新增）
│   │   └── banner.jpeg              # 首頁橫幅（💡自行新增）
│   ├── components/                  # UI 元件 (Astro + Svelte)
│   ├── config/                      # ⭐ 網站設定（模組化），見下方「設定檔一覽」
│   ├── content/
│   │   ├── posts/                   # ⭐ 部落格文章 (Markdown)
│   │   │   └── YYYY-MM-DD-slug.md
│   │   └── spec/                    # ⭐ 特殊頁面
│   │       ├── about.md             #    關於我
│   │       └── works.md             #    專案作品（💡自行新增）
│   ├── content.config.ts            # Content Collections schema
│   ├── i18n/                        # 多語系翻譯
│   ├── layouts/                     # 頁面佈局
│   ├── pages/                       # 路由
│   │   ├── [...slug].astro          # 首頁（分頁文章列表）
│   │   ├── about.astro              # 關於頁
│   │   ├── archive.astro            # 文章彙整頁
│   │   ├── posts/[...slug].astro    # 文章內頁
│   │   └── works.astro              # 作品頁（💡自行新增）
│   ├── plugins/                     # Markdown / Expressive Code 插件
│   ├── styles/                      # CSS 樣式
│   ├── types/                       # TypeScript 型別定義
│   └── utils/                       # 工具函式
├── astro.config.mjs                 # Astro 框架設定
└── biome.json                       # Biome linter 設定
```

<br>

## 技術架構

| 元件 | 技術 |
|------|------|
| 框架 | [Astro 5](https://astro.build/) - 靜態網站產生器 |
| 主題 | [Firefly](https://github.com/CuteLeaf/Firefly)（基於 Fuwari 二次開發） |
| UI 元件 | Svelte 5 - 互動元件 |
| CSS | Tailwind CSS 4 + PostCSS |
| 程式碼高亮 | Expressive Code - 行號、摺疊、語言標籤 |
| 搜尋 | Pagefind - 建置時生成索引，客戶端搜尋 |
| 頁面轉場 | Swup.js - SPA 風格無刷新切頁 |
| 字體 | SweiGothic CJK (中文)、Allura (裝飾字體)、JetBrains Mono (程式碼) |
| 部署 | GitHub Pages + GitHub Actions 自動建置 |

<br>

## 日常維護

### 新增文章

在 `src/content/posts/` 建立 Markdown 檔案，命名格式：`YYYY-MM-DD-文章標題.md`

也可以用快捷腳本建立（會自動產生 frontmatter 模板）：

```bash
pnpm new-post 文章標題
```

```markdown
---
title: "文章標題"
published: 2026-01-01
category: "分類名稱"
tags: ["標籤1", "標籤2"]
image: "/uploads/2026/01/cover.jpg"
draft: true
pinned: false
---

文章內容...
```

#### Frontmatter 欄位一覽

| 欄位 | 必填 | 說明 |
|------|------|------|
| `title` | 是 | 文章標題 |
| `published` | 是 | 發佈日期（`YYYY-MM-DD`） |
| `category` | 否 | 分類，每篇只能一個 |
| `tags` | 否 | 標籤陣列，可多個 |
| `image` | 否 | 封面圖，指向 `public/` 下路徑；設為 `"api"` 可使用隨機封面圖（需在 `coverImageConfig.ts` 啟用） |
| `draft` | 否 | 草稿，設 `true` 不會發佈（預設 `false`） |
| `pinned` | 否 | 置頂文章（預設 `false`） |
| `updated` | 否 | 文章更新日期（`YYYY-MM-DD`），觸發「上次編輯」提示 |
| `description` | 否 | 文章摘要，用於 SEO 和文章列表 |
| `lang` | 否 | 文章語言（多語系文章用，如 `en`） |
| `author` | 否 | 作者名稱（多作者場景） |
| `sourceLink` | 否 | 原文連結（轉載文章用） |
| `licenseName` | 否 | 自訂授權名稱（覆蓋全站 `licenseConfig`） |
| `licenseUrl` | 否 | 自訂授權連結 |
| `comment` | 否 | 是否開啟留言（預設 `true`，需搭配 `commentConfig.ts`） |
| `password` | 否 | 文章密碼保護 |
| `passwordHint` | 否 | 密碼提示文字 |

> 文章間連結：使用 `/posts/YYYY-MM-DD-slug/` 格式

### 修改個人資料 / 導航列 / 橫幅 / Favicon

編輯 `src/config/` 目錄下的對應檔案：

| 檔案 | 用途 |
|------|------|
| `siteConfig.ts` | 站點標題、語系、主題色、favicon |
| `profileConfig.ts` | 側邊欄：大頭照、名稱、Bio、社群連結 |
| `navBarConfig.ts` | 導航列連結 |
| `backgroundWallpaper.ts` | 首頁橫幅圖 |
| `sidebarConfig.ts` | 側邊欄組件（分類、標籤、統計、日曆等） |
| `licenseConfig.ts` | CC 授權（顯示在每篇文章頂部） |
| `expressiveCodeConfig.ts` | 程式碼區塊高亮主題、折疊、語言徽章 |
| `commentConfig.ts` | 留言系統（支援 Twikoo / Waline / Giscus / Disqus / Artalk） |
| `coverImageConfig.ts` | 封面圖顯示設定、隨機封面圖 API |
| `friendsConfig.ts` | 友情連結頁面（連結清單、排序、隨機排序） |
| `galleryConfig.ts` | 相簿頁面（相簿清單、瀑布流欄寬） |
| `musicConfig.ts` | 音樂播放器（Meting API 歌單 / 本地音樂、歌詞、音量） |
| `announcementConfig.ts` | 側邊欄公告欄（標題、內容、連結） |
| `sponsorConfig.ts` | 贊助頁面（付款方式、QR Code、贊助者清單） |
| `adConfig.ts` | 側邊欄廣告組件（圖片廣告 / 內容廣告 / Google AdSense） |
| `footerConfig.ts` | 頁尾自訂 HTML 注入（備案號等） |
| `pioConfig.ts` | 看板娘（Live2D / Spine 模型、互動訊息） |
| `sakuraConfig.ts` | 櫻花飄落動畫特效（數量、速度、透明度） |

### 修改關於頁

直接編輯 `src/content/spec/about.md`。

### 圖片管理

| 類型 | 位置 | 引用方式 |
|------|------|----------|
| 文章內用圖 | `public/uploads/YYYY/MM/` | `![alt](/uploads/YYYY/MM/filename.jpg)` |
| 大頭照 / 橫幅 | `src/assets/images/` | 由 Astro 自動壓縮優化 |
| Favicon | `public/favicon/` | 在 `siteConfig.ts` 設定 |

<br>

## i18n 多語系

`src/i18n/` 是 Firefly 主題的 UI 翻譯機制，負責翻譯介面元素（首頁、彙整、字、分鐘等）。

- 語系由 `siteConfig.ts` 頂部的 `SITE_LANG` 決定（目前為 `zh_TW`）
- 支援語系：`zh_CN`、`zh_TW`、`en`、`ja`、`ru`
- 切換方式：修改 `siteConfig.ts` 中的 `SITE_LANG` 值即可

通常不需要修改 i18n 檔案，除非想自訂 UI 顯示文字。

<br>

## 部署

### GitHub Actions 自動建置

Push 到 `main` 分支後，GitHub Actions 會自動執行建置與部署（`.github/workflows/deploy.yml`）：

1. Checkout → pnpm 9 + Node 22 安裝依賴 → `pnpm build` 產生 `dist/`
2. 上傳 artifact → 部署到 GitHub Pages

也可在 GitHub Actions 頁面手動觸發（`workflow_dispatch`）。

> **注意**：`deploy.yml` 是獨立的部署流程，不依賴也不受下方 CI workflow 的執行結果影響。即使 `build.yml` 或 `biome.yml` 失敗，部署仍會正常執行。

### CI Workflows

除了部署以外，還有兩個 CI workflow 在 push/PR 時自動執行（僅做檢查，不影響部署）：

| Workflow | 檔案 | 用途 |
|----------|------|------|
| Build and Check | `build.yml` | 在 Node 22/23/24 上跑 `astro check` + `astro build` |
| Code quality | `biome.yml` | Biome linter 檢查 `./src` 下的程式碼品質 |

### Dependabot

`dependabot.yml` 設定每日自動檢查 npm 依賴的 patch/minor 更新，會自動開 PR。Major 版本更新會被忽略（避免破壞性升級）。

### GitHub 儲存庫設定

需在 GitHub repo 的 **Settings** 中完成以下設定：

| 設定位置 | 值 |
|----------|-----|
| Settings → Pages → Source | **GitHub Actions**（非 Deploy from a branch） |
| Settings → Pages → Custom domain | `linziyou.info` |
| Settings → Pages → Enforce HTTPS | 勾選 |

### DNS 設定（自訂網域）

在你的 DNS 服務商設定以下記錄，將 `linziyou.info` 指向 GitHub Pages：

| 類型 | 名稱 | 值 |
|------|------|-----|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `linziyou.github.io` |

設定完成後 GitHub 會自動驗證並申請 HTTPS 憑證（Let's Encrypt），約需幾分鐘。

可用以下指令驗證 DNS 是否生效：

```bash
dig linziyou.info +short    # 應顯示 185.199.x.x
```

<br>

## 授權

| 項目 | 授權 |
|------|------|
| 文章內容 | CC BY-NC-SA 4.0（顯示在每篇文章頂部） |
| 字體 | 全部為 OFL 1.1 開源授權 |
| 主題 | Firefly / Fuwari - MIT License |
