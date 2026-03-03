# Changelog

此文件記錄本站在配置、架構、主題客製化方面的變更紀錄。
文章新增/編輯、頁面內容維護不在此記錄（參見 [README.md](README.md) 的日常維護章節）。

基底主題：[Firefly](https://github.com/CuteLeaf/Firefly) v6.7.7 (Astro 5 + Svelte 5 + Tailwind CSS 4)

<br>

## 2026-03-03 - 移除 Allura 字體、作品頁導覽列圖示

### 設定檔修改

| 檔案 | 修改內容 |
|------|----------|
| `src/config/fontConfig.ts` | `selected` 移除 `"allura"`，修正手機瀏覽器英文字全套用 Allura 的問題 |
| `src/config/navBarConfig.ts` | 「作品」連結新增 `material-symbols:photo-album-rounded` 圖示 |

> **附帶影響**：`src/components/layout/Navbar.astro` 的導覽列標題原有 `font-allura` class，Allura 不再載入後該 class 無作用，標題字體 fallback 至 SweiGothic / 系統字體。

<br>

## 2026-03-02 - 新增 Google AdSense 廣告與贊助連結

在左側邊欄 Tags 組件下方加入 Google AdSense 廣告單元（手動投放），並在 profile 卡片新增 Portaly 贊助連結。

### 設定檔修改

| 檔案 | 修改內容 |
|------|----------|
| `src/config/adConfig.ts` | 新增 `adConfigAdSense` 匯出（AdSense 廣告設定），原有 `adConfig1`、`adConfig2` 保留不變 |
| `src/config/profileConfig.ts` | 社群連結新增贊助按鈕（`fa7-solid:hand-holding-heart`，連結至 Portaly） |
| `src/config/sidebarConfig.ts` | 左側邊欄 `advertisement` 組件 `enable: false` → `true`、`configId` 改為 `"adsense"` |

### 主題客製化（原始碼修改，升級時需手動合併）

| 檔案 | 修改 | 原因 |
|------|------|------|
| `src/components/widget/Advertisement.astro` | 新增 `adConfigAdSense` import、switch case `"adsense"`、AdSense `<ins>` 渲染區塊及動態載入 adsbygoogle.js | 原始碼僅支援自訂圖片廣告，需擴充支援 AdSense |
| `src/types/config.ts` | `AdConfig` 新增 `adsense?: { client, slot }` 欄位 | 支援 AdSense 配置 |

<br>

## 2026-03-02 - 初始建站

從 WordPress 遷移至 Astro 靜態部落格，基於 Firefly 主題建立。

### 設定檔修改（Firefly 預期使用者會改的欄位）

| 檔案 | 修改內容 |
|------|----------|
| `src/config/backgroundWallpaper.ts` | 桌面/手機背景改為 `banner.jpeg`、啟用首頁橫幅文字（標題 `LinZiyou Dev Blog`、副標題 `我的程式札記`）、關閉圖片來源顯示 |
| `src/config/expressiveCodeConfig.ts` | 啟用語言徽章（`pluginLanguageBadge.enable: true`） |
| `src/config/fontConfig.ts` | 啟用自訂字體：SweiGothic CJK TC (CDN) + Allura (Google Fonts)、fallback 字體堆疊 |
| `src/config/musicConfig.ts` | 關閉導覽列音樂播放器入口（`showInNavbar: false`） |
| `src/config/navBarConfig.ts` | 改為 Home / Archive / Work / About 四個連結 |
| `src/config/profileConfig.ts` | 頭像 `avatar.jpg`、名稱 `Lin Ziyou`、Bio `Hi! I'm Jerry~`、GitHub 連結 + RSS |
| `src/config/sakuraConfig.ts` | 關閉櫻花飄落特效（`enable: false`，預設關閉，未來視需求開啟或新增使用者控制） |
| `src/config/sidebarConfig.ts` | 關閉公告組件、關閉音樂播放器（左側邊欄 + 行動版底部） |
| `src/config/siteConfig.ts` | 標題 `LinZiyou Dev Blog`、副標題 `我的程式札記`、語系 `zh_TW`、站點 URL `https://linziyou.info`、主題色 hue 250、favicon、navbar logo/title、站點起始日期、時區 `Asia/Taipei`、關閉 sponsor（贊助）/ guestbook（留言板）/ bangumi（番組計劃，追番記錄）/ gallery（相簿）頁面 |

### CI/CD 修改

| 檔案 | 修改內容 |
|------|----------|
| `.github/workflows/biome.yml` | 分支 `master` → `main` |
| `.github/workflows/build.yml` | 分支 `master` → `main`、Node 矩陣新增 24（原 22/23） |
| `.github/workflows/deploy.yml` | 改寫為 GitHub Pages 官方部署方式（upload-pages-artifact + deploy-pages），分支改為 `main` |

### 新增檔案

| 檔案 | 說明 |
|------|------|
| `CHANGELOG.md` | 本檔案 |
| `public/favicon/apple-touch-icon.png` | Apple Touch Icon |
| `public/favicon/favicon-32x32.png` | Favicon 32x32 |
| `public/favicon/favicon.ico` | Favicon（覆蓋原有） |
| `public/uploads/` | 文章圖片（從 WordPress 遷移） |
| `public/ads.txt` | Google AdSense ads.txt 授權檔案 |
| `README.md` | 專案說明（完整重寫） |
| `src/assets/images/avatar.jpg` | 大頭照 |
| `src/assets/images/banner.jpeg` | 首頁橫幅圖 |
| `src/content/posts/*.md` | 部落格文章（44 篇從 WordPress 遷移 + 1 篇遷移紀錄） |
| `src/content/spec/about.md` | 關於我頁面內容 |
| `src/content/spec/works.md` | 專案作品頁面內容 |
| `src/pages/works.astro` | 作品頁路由（Firefly 無此頁面，新增） |

### 刪除的 Firefly 原始檔案

| 檔案 | 說明 |
|------|------|
| `.github/FUNDING.yml` | GitHub Sponsor 設定（Firefly 作者用） |
| `.github/ISSUE_TEMPLATE/` | Issue 模板（3 個，Firefly 開源用） |
| `.github/pull_request_template.md` | PR 模板 |
| `CONTRIBUTING.md` | 開源貢獻指南（Firefly 開源用） |
| `public/assets/images/sponsor/` | Firefly 作者的贊助 QR Code（afdian / alipay / wechat），sponsor 功能已關閉 |
| `public/assets/music/cover/109951169585655912.webp` | Firefly demo 音樂封面圖 |
| `public/assets/music/使一颗心免于哀伤-哼唱.mp3` | Firefly demo 音樂，音樂播放器已全部關閉 |
| `public/favicon/favicon-{dark,light}-*.png` | Firefly 預設深/淺色各尺寸 favicon（共 8 個），siteConfig 已指定自訂 favicon |
| `public/gallery/firefly-2026/` | Firefly demo 相簿圖片（9 張 .avif），gallery 功能已關閉 |
| `src/assets/images/avatar.avif` | 無引用的多餘圖片 |
| `src/assets/images/DesktopWallpaper/` | Firefly demo 桌面背景（d1–d6），已改用 `banner.jpeg` |
| `src/assets/images/MobileWallpaper/` | Firefly demo 手機背景（m1–m6），已改用 `banner.jpeg` |
| `src/assets/images/firefly.png` | 無引用的多餘圖片 |
| `src/content/posts/*.md` | Demo 文章（11 篇 + images/ + guide/） |
| `vercel.json` | Vercel 部署設定（改用 GitHub Pages） |

### 修改的 Firefly 原始檔案（覆蓋內容）

| 檔案 | 說明 |
|------|------|
| `README.md` | 專案說明（反映 Firefly 主題與本站設定） |
| `src/content/posts/2026-03-02-從-wordpress-遷移到-astro-靜態部落格.md` | 遷移紀錄文章（反映 Firefly 主題） |
| `src/content/spec/friends.mdx` | 清空內容（保留空 frontmatter，友情連結頁面需要此檔案存在） |
| `src/content/spec/guestbook.md` | 清空內容（保留空 frontmatter，留言板頁面需要此檔案存在） |

### 主題客製化（原始碼修改，升級時需手動合併）

| 檔案 | 修改 | 原因 |
|------|------|------|
| `src/components/layout/Navbar.astro` | 導覽列標題文字加上 `font-allura text-2xl` class | 套用 Allura 字體並放大字級於 Logo 旁標題 |
| `src/i18n/languages/zh_TW.ts` | 大量用詞修正（見下方明細） | 統一為台灣正體中文慣用詞 |

`zh_TW.ts` 用詞修正明細：

| 原文 | 修改後 |
|------|--------|
| 關於我 | 關於 |
| 歸檔 | 彙整 |
| 加載 | 載入 |
| 音頻 | 音樂 |
| 數據 | 資料 |
| 用戶名 | 使用者名稱 |
| 網絡 | 網路 |
| 友鏈 | 友情連結 |
| 獲取 | 取得 |
| 通過 | 透過 |
| 鏈接 | 連結 |
| 互相訪問 | 互相拜訪 |
| 訪問（其餘處） | 存取 |
| 剪貼板 | 剪貼簿 |
| 本文 | 文章 |
| 壁紙 | 背景圖 |
| 全屏 | 全螢幕 |
| 運行時長 | 運作天數 |
| 生成 | 製作 |
| 保存 | 儲存 |
| 掃碼 | 掃描 QR Code |
| 代碼 | 程式碼 |

### 開發環境設定

| 檔案 | 說明 |
|------|------|
| `.vscode/extensions.json` | 推薦擴充套件：Biome + Astro |
| `.vscode/settings.json` | Biome 格式化、FrontMatter dashboard 設定 |
