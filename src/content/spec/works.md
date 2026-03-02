<style>
.post-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  text-decoration: none;
  background-color: oklch(.95 .025 var(--hue));
  color: oklch(.55 .12 var(--hue));
}
:root.dark .post-badge {
  background-color: oklch(.33 .035 var(--hue));
  color: oklch(.75 .1 var(--hue));
}
</style>

<div class="flex gap-6 mb-4 items-start flex-wrap">
<div class="flex-none w-60"><img src="/uploads/2026/03/claude-dash-demo.gif" alt="Claude Code Dashboard" class="rounded-xl w-full" /></div>
<div class="flex-1 min-w-52">
<div class="text-xl font-bold">Claude Code Dashboard</div>
<div class="flex items-center gap-2 mt-1 text-sm text-neutral-400">
<span>2026/02 ~ 仍在進行</span>
<span class="post-badge">Open Source</span>
</div>

- Claude Code 的終端 Dashboard 工具，即時顯示 token 用量和 Agent 狀態
- Python TUI，使用 Rich 建構終端介面
- Pixel sprite 動畫 (Unicode Braille 字元渲染，5 種狀態各 2 幀動畫)
- 支援多 session 偵測、雙主題、12/24 小時制、多語系
- 已發佈至 PyPI，可透過 `pip install claude-code-dashboard` 安裝

<div class="flex gap-3 flex-wrap mt-2">
<a href="https://github.com/linziyou0601/claude-code-dashboard" target="_blank" class="post-badge">GitHub</a>
</div>
</div>
</div>

---

<div class="flex gap-6 mb-4 items-start flex-wrap">
<div class="flex-none w-60"><img src="/uploads/2026/01/hoya-money-pwa.jpeg" alt="Hoya 記帳 PWA" class="rounded-xl w-full" /></div>
<div class="flex-1 min-w-52">
<div class="text-xl font-bold">Hoya 記帳 v2 - PWA 版</div>
<div class="flex items-center gap-2 mt-1 text-sm text-neutral-400">
<span>2025/08 ~ 仍在進行</span>
<span class="post-badge">Side Project</span>
</div>

- 原 Flutter 版的完全重寫，改為 PWA 跨平台架構
- 使用 Nuxt 4 + Vue 3 + Nuxt UI 開發
- 瀏覽器端內嵌 PostgreSQL (PGlite + Drizzle ORM)，支援離線使用
- Firebase 雲端同步與認證
- 支援多帳戶、多幣別、週期記帳、統計圖表、深色模式
- 支援中文、英文介面

<div class="flex gap-3 flex-wrap mt-2">
<a href="https://hoyamoney.web.app" target="_blank" class="post-badge">Demo</a>
<a href="https://github.com/linziyou0601/hoya_money_pwa" target="_blank" class="post-badge">GitHub</a>
</div>
</div>
</div>

---

<div class="flex gap-6 mb-4 items-start flex-wrap">
<div class="flex-none w-60"><img src="/uploads/2025/10/chess-games.png" alt="線上棋類遊戲平台" class="rounded-xl w-full" /></div>
<div class="flex-1 min-w-52">
<div class="text-xl font-bold">線上棋類遊戲平台</div>
<div class="flex items-center gap-2 mt-1 text-sm text-neutral-400">
<span>2021/11 ~ 2025/10</span>
<span class="post-badge">Side Project</span>
</div>

- 黑白棋、暗棋線上即時對戰遊戲
- 最初使用 NuxtJS + Express + Socket.io，後重構為 Nuxt 4 + Vue 3 + Tailwind CSS
- Socket.io 即時連線對戰與房間管理
- 支援 PWA 安裝、深色模式、多語系 (中/英)
- 部署於 Google Cloud Run

<div class="flex gap-3 flex-wrap mt-2">
<a href="https://chess-games.linziyou.info" target="_blank" class="post-badge">Demo</a>
<a href="https://github.com/linziyou0601/chess_games" target="_blank" class="post-badge">GitHub</a>
</div>
</div>
</div>

---

<div class="flex gap-6 mb-4 items-start flex-wrap">
<div class="flex-none w-60"><img src="/uploads/2021/11/hoya-money.jpg" alt="Hoya 記帳 Flutter" class="rounded-xl w-full" /></div>
<div class="flex-1 min-w-52">
<div class="text-xl font-bold">Hoya 記帳 - Flutter 版</div>
<div class="flex items-center gap-2 mt-1 text-sm text-neutral-400">
<span>2021/07 ~ 2024/12</span>
<span class="post-badge">Side Project</span>
</div>

- 使用 Flutter 開發的 Android 記帳 App，目前仍在 Google Play 上架 (已停止維護)
- 多帳戶、多幣別、預算管理、統計圖表
- 客製化週期記帳、記帳提醒、繳款日提醒
- 資料備份匯入匯出、多種主題、支援中英文

<div class="flex gap-3 flex-wrap mt-2">
<a href="https://hoyamoney.linziyou.info" target="_blank" class="post-badge">官網</a>
</div>
</div>
</div>

---

<div class="flex gap-6 mb-4 items-start flex-wrap">
<div class="flex-none w-60"><img src="/uploads/2021/11/yugioh-card-maker.jpg" alt="遊戲王卡片及梗圖製造機" class="rounded-xl w-full" /></div>
<div class="flex-1 min-w-52">
<div class="text-xl font-bold">遊戲王卡片及梗圖製造機</div>
<div class="flex items-center gap-2 mt-1 text-sm text-neutral-400">
<span>2019/09 ~ 2019/12</span>
<span class="post-badge">Side Project</span>
</div>

- 因興趣製作的卡圖產生器，可自訂卡片內容並產生梗圖
- 使用 JavaScript + Canvas 繪圖，Vue.js 前端
- 因梗圖特性吸引不少使用者

<div class="flex gap-3 flex-wrap mt-2">
<a href="https://yugioh-card.linziyou.info/" target="_blank" class="post-badge">Demo</a>
</div>
</div>
</div>

---

<div class="flex gap-6 mb-4 items-start flex-wrap">
<div class="flex-none w-60"><img src="/uploads/2021/11/yuntech-ai-study.jpg" alt="雲科大智慧教育教學平台" class="rounded-xl w-full" /></div>
<div class="flex-1 min-w-52">
<div class="text-xl font-bold">雲科大 - 智慧教育教學平台</div>
<div class="flex items-center gap-2 mt-1 text-sm text-neutral-400">
<span>2020/03 ~ 2020/06</span>
<span class="post-badge">校內開發</span>
</div>

- 在校期間從零建置的非同步遠距教學平台
- 串接智慧教室人臉辨識系統，評估學生學習成效
- 分析學生成績，協助自訂學習目標與策略調整
- 配合聊天機器人建立專業科目知識庫
- 使用人數近 5,000 人 (目前已停用)

</div>
</div>

---

<div class="flex gap-6 mb-4 items-start flex-wrap">
<div class="flex-none w-60"><img src="/uploads/2021/11/icd-classification.jpg" alt="國際疾病碼分類研究" class="rounded-xl w-full" /></div>
<div class="flex-1 min-w-52">
<div class="text-xl font-bold">擴展資訊輔助病摘文本進行國際疾病碼分類</div>
<div class="flex items-center gap-2 mt-1 text-sm text-neutral-400">
<span>2020/10 ~ 2021/06</span>
<span class="post-badge">大學專題</span>
</div>

- 使用機器學習模型處理國際疾病分類碼的多標籤分類問題
- 對病摘文件進行前處理、詞向量轉換及資訊擴展
- 著重在降低訓練成本的同時提升分類器預測績效

</div>
</div>

---

<div class="flex gap-6 mb-4 items-start flex-wrap">
<div class="flex-none w-60"><img src="/uploads/2021/11/javafx-room-booking.jpg" alt="JavaFx 教室預約系統" class="rounded-xl w-full" /></div>
<div class="flex-1 min-w-52">
<div class="text-xl font-bold">JavaFx 教室預約系統</div>
<div class="flex items-center gap-2 mt-1 text-sm text-neutral-400">
<span>2020/03 ~ 2020/06</span>
<span class="post-badge">物件導向課程</span>
</div>

- 以 JavaFx 實作的教室預約系統桌面應用程式
- 實作多種 Design Pattern
- 註冊登錄、預訂管理教室、模擬 IoT 裝置狀態

<div class="flex gap-3 flex-wrap mt-2">
<a href="https://github.com/linziyou0601/OOSE_TW2_Application" target="_blank" class="post-badge">GitHub</a>
</div>
</div>
</div>
