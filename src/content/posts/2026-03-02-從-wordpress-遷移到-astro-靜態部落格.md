---
title: "從 WordPress 遷移到 Astro 靜態部落格"
published: 2026-03-02
category: "開發環境"
tags: ["Astro", "WordPress"]
---

原本的部落格架在 WordPress 上，用了幾年後決定遷移到靜態網站。主要原因是也荒在這邊幾年了，加上 WordPress 需要維護伺服器和資料庫，而靜態網站產生器可以直接部署到 GitHub Pages，不用管後端，想把 GCP 上的資源關一關。

本篇記錄整個遷移過程，從技術選型到踩坑經驗。

感謝有 Claude Code，不到半個晚上的時間就完成了大約 80% 的工作，包括主題客製化、CSS 除錯、文章格式轉換腳本、圖片命名整理、README/CHANGELOG 撰寫等。剩下的 20% 主要是內容校對和個人偏好微調。

## 為什麼選 Astro + Firefly

考慮過幾個方案：

| 方案 | 優點 | 缺點 |
|------|------|------|
| Hugo | 建置速度極快 | Go template 語法不直覺 |
| Hexo | 中文社群大 | 生態系老化，插件品質參差 |
| Astro | 現代框架、Island Architecture、支援多種 UI 框架 | 相對新 |

最後選了 [Astro](https://astro.build/)，搭配 [Firefly](https://github.com/CuteLeaf/Firefly) 主題。Firefly 是基於 Astro 5 + Svelte 5 + Tailwind CSS 4 的部落格主題，由 Fuwari 二次開發而來，功能完整（搜尋、暗色模式、程式碼高亮、雙側邊欄、TOC、RSS），介面設計美觀，支援多欄布局和豐富的側邊欄組件。

## 遷移步驟

### 1. 匯出 WordPress 資料

在 WordPress 後台 → 工具 → 匯出，選擇「所有內容」匯出成 XML 檔案（WXR 格式）。這個檔案包含所有文章、分類、標籤、圖片路徑等。

### 2. 安裝 Firefly

```bash
git clone https://github.com/CuteLeaf/Firefly.git <repo目錄>
cd <repo目錄>
pnpm install
```

安裝完先跑 `pnpm dev` 確認 demo 站可以正常運作。

### 3. 清除 demo 內容

刪掉 Firefly 預設的 demo 文章和圖片：

```bash
rm -rf src/content/posts/*
```

### 4. 轉換文章格式

這是最花時間的部分。WordPress 的 WXR XML 需要轉換成 Astro 的 Markdown 格式。

這部分是請 AI 產的 Python 轉換腳本，要求輸出需符合以下條件：

- 解析 WXR XML 中的文章標題、日期、分類、標籤
- 將 HTML 內容轉換為 Markdown（用 `html2text`）
- 移除 WordPress block comments（`<!-- wp:xxx -->`）
- 將 `wp-content/uploads/` 路徑改寫為 `/uploads/`
- 將 URL 編碼的 slug 解碼回中文（`urllib.parse.unquote()`）
- 清除 XML 中的控制字元（`\x00`-`\x08` 等），避免 parser 報錯
- 產生符合 Astro Content Collections 的 frontmatter
- 檔名格式為 `YYYY-MM-DD-文章標題.md`

完整腳本大約 140 行，直接貼上來：

```python
#!/usr/bin/env python3
"""
Parse WordPress WXR (XML) export and convert posts to Astro Markdown files.
"""
import re
import os
import json
from datetime import datetime
from lxml import etree as ET
import html2text

XML_FILE = "linziyoudevblog.WordPress.2026-03-01.xml"
OUT_DIR = "posts"

os.makedirs(OUT_DIR, exist_ok=True)

# ── Namespaces ──
NS = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'wp':      'http://wordpress.org/export/1.2/',
    'dc':      'http://purl.org/dc/elements/1.1/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
}

# ── HTML → Markdown converter ──
h = html2text.HTML2Text()
h.ignore_links = False
h.body_width = 0
h.protect_links = True
h.wrap_links = False

h_plain = html2text.HTML2Text()
h_plain.ignore_links = True
h_plain.ignore_images = True
h_plain.body_width = 0

def to_markdown(html_content):
    if not html_content:
        return ''
    # Rewrite wp-content/uploads URLs to relative /uploads/
    content = re.sub(
        r'https?://[^/]+/wp-content/uploads/',
        '/uploads/',
        html_content
    )
    # Remove WordPress block comments
    content = re.sub(r'<!-- /?wp:[^>]* -->', '', content)
    return h.handle(content).strip()

def to_plain(html_content):
    if not html_content:
        return ''
    return h_plain.handle(html_content).strip()

# ── Parse XML (with recovery for invalid chars) ──
parser = ET.XMLParser(recover=True, encoding='utf-8')
with open(XML_FILE, 'rb') as f:
    raw = f.read()
# Strip invalid XML control characters
raw = re.sub(rb'[\x00-\x08\x0b\x0c\x0e-\x1f]', b'', raw)
root = ET.fromstring(raw, parser)
channel = root.find('channel')

posts = []
for item in channel.findall('item'):
    post_type = item.find('wp:post_type', NS)
    status     = item.find('wp:status', NS)

    if post_type is None or status is None:
        continue
    if post_type.text != 'post' or status.text != 'publish':
        continue

    title    = item.findtext('title') or ''
    slug     = item.findtext('wp:post_name', namespaces=NS) or ''
    date_str = item.findtext('wp:post_date', namespaces=NS) or ''
    content  = item.findtext('content:encoded', namespaces=NS) or ''
    excerpt  = item.findtext('excerpt:encoded', namespaces=NS) or ''

    # Categories and tags
    categories, tags = [], []
    for cat in item.findall('category'):
        domain = cat.get('domain', '')
        name   = cat.text or ''
        if domain == 'category':
            categories.append(name)
        elif domain == 'post_tag':
            tags.append(name)

    # Parse date
    try:
        dt = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
        date_iso = dt.strftime('%Y-%m-%d')
    except:
        date_iso = date_str[:10] if date_str else '2020-01-01'

    posts.append({
        'title': title, 'slug': slug, 'date': date_iso,
        'content': content, 'excerpt': excerpt,
        'categories': categories, 'tags': tags,
    })

print(f"Found {len(posts)} published posts")

# ── Write Markdown files ──
for post in posts:
    body    = to_markdown(post['content'])
    excerpt = to_plain(post['excerpt']).replace('\n', ' ').strip()[:200]

    from urllib.parse import unquote
    slug_decoded = unquote(post['slug'])
    filename = f"{post['date']}-{slug_decoded}.md"

    lines = ['---']
    lines.append(f'title: {json.dumps(post["title"], ensure_ascii=False)}')
    lines.append(f'published: "{post["date"]}"')
    if post['categories']:
        lines.append(f'category: {json.dumps(post["categories"][0], ensure_ascii=False)}')
    if post['tags']:
        lines.append(f'tags: {json.dumps(post["tags"], ensure_ascii=False)}')
    if excerpt:
        lines.append(f'description: {json.dumps(excerpt, ensure_ascii=False)}')
    lines.append('draft: false')
    lines.append('---')
    lines.append('')
    lines.append(body)

    out_path = os.path.join(OUT_DIR, filename)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print(f"  [{post['date']}] {post['title'][:60]}")

print(f"\nDone! {len(posts)} files → ./{OUT_DIR}/")
```

跑完之後再人工檢查每篇文章的格式是否正確。

轉換後的檔案命名格式是 `YYYY-MM-DD-文章標題.md`，Astro 會用檔名作為 URL slug。

### 5. 搬移圖片

WordPress 的圖片存在 `wp-content/uploads/YYYY/MM/` 下。對應到 Astro 是放在 `public/uploads/YYYY/MM/`，然後在 Markdown 中用 `![alt](/uploads/YYYY/MM/filename.jpg)` 引用。

轉換腳本已經會自動把 `wp-content/uploads/` 路徑改寫成 `/uploads/`，所以只要把圖片目錄整包搬過去就好。

### 6. 設定 config

Firefly 的設定集中在 `src/config/` 目錄下，每個面向一個檔案：

```
src/config/
├── siteConfig.ts           # 站點標題、語系、主題色、favicon 等
├── profileConfig.ts        # 個人資料：頭像、名稱、社群連結
├── navBarConfig.ts         # 導航列連結
├── backgroundWallpaper.ts  # 橫幅背景圖
├── fontConfig.ts           # 自訂字體
├── sidebarConfig.ts        # 側邊欄組件配置
├── licenseConfig.ts        # CC 授權
└── expressiveCodeConfig.ts # 程式碼區塊高亮
```

### 7. 自訂字體

原本 WordPress 用的字體是 SweiGothic CJK（中文）和 Allura（標題），遷移後也要保留。Firefly 有內建的字體設定系統，在 `fontConfig.ts` 中配置 CDN 載入即可，不需要手動修改 Layout。

### 8. 建置與部署

```bash
pnpm build    # 靜態網站產生到 dist/
pnpm preview  # 本地預覽
```

部署用 GitHub Actions 自動建置，push 到 main 分支就會自動部署到 GitHub Pages。

## 踩到的坑

### WordPress 程式碼區塊的語言資訊

WordPress 的 `loos-hcb/code-block` plugin 把語言資訊存在 HTML comment 裡面，格式是 JSON：

```html
<!-- wp:loos-hcb/code-block {"langType":"java"} -->
```

轉換腳本需要特別解析這個 comment 才能正確產生 fenced code block 的語言標籤。

### URL 編碼的檔名

從 WordPress 匯出的 slug 是 URL 編碼的（例如 `%e5%b7%a5%e5%bb%a0%e6%a8%a1%e5%bc%8f`），直接拿來當檔名會導致 Astro 產生的 URL 也是亂碼。需要用 `urllib.parse.unquote()` 解碼回中文。

### XML 中的控制字元

WordPress 匯出的 XML 偶爾會包含控制字元（如 backspace `\x08`），導致 XML parser 報錯。需要先用 regex 清除：

```python
import re
data = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', data)
```

### 搜尋功能只在 build 後才能用

Firefly 用的是 [Pagefind](https://pagefind.app/)，它在 `pnpm build` 時才會建立搜尋索引。所以在 `pnpm dev` 模式下搜尋功能是不能用的，要測試搜尋必須先 build 再 preview。

## 遷移結果

- 文章全部遷移完成，但關於我、專案作品等頁面還是要自己微調
- 所有圖片、程式碼區塊、內部連結都正常運作
- 靜態網站不需要伺服器，部署在 GitHub Pages 上
- 搜尋、RSS、Sitemap 都有

整體來說遷移過程最麻煩的是文章格式轉換，特別是 WordPress 各種 plugin 的客製化格式需要逐一處理。但一旦腳本寫好，剩下的就只是設定和微調。

就醬，掰～
