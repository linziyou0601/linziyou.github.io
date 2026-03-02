---
title: "用pm2在Ubuntu上部署NuxtJS的網站"
published: 2021-11-07
category: "JavaScript"
tags: ["Ubuntu", "Vue.js", "開發環境"]
---

## pm2是什麼

pm2 是 nodeJS 的 process manager，可以用來管理node服務、自動重啟服務、也可以設定多程序等等，透過簡單的方式部署node服務。

詳見：[https://pm2.keymetrics.io/](https://pm2.keymetrics.io/)

## 在Ubuntu上部署NuxtJS網站

### 1. 安裝nodejs及npm

更新repositories

```bash
sudo apt-get update
sudo apt-get upgrade
```

安裝新版nodejs及npm（本文章發佈時使用的是nodejs 16）

先從Nodesource（提供nodejs的第三方repositories）取得16版的nodejs

```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
```

檢查node及npm版本

```
node -v

# 輸出
v16.13.0
```

```
npm -v

# 輸出
8.1.0
```

### 2. 測試部署NuxtJS

進入專案目錄，安裝必要套件後，建立並執行nuxt

```bash
cd >
sudo npm install
sudo npm run build
sudo npm run start
```

現在應該可以在http://localhost:3000上看到建立的網站

## 使用pm2管理NuxtJS服務

安裝pm2

```bash
sudo npm install pm2 -g
```

透過pm2啟動服務（依情況決定是否使用sudo）

```
# 以下指令做的事為 sudo npm run start
sudo pm2 start npm -- run start                       # 不指定服務名稱
sudo pm2 start npm --name "你的服務名稱" -- run start  # 指定服務名稱
```

也可以修改package.json裡的script，加入「deploy」讓它做「nuxt build && npm start」，就可以讓服務每次啟動時都自動執行nuxt build

```json
{
  "scripts": {
    "dev": "nuxt",
    "build": "nuxt build",
    "start": "nuxt start",
    "generate": "nuxt generate",
    "lint:js": "eslint --ext \".js,.vue\" --ignore-path .gitignore .",
    "lint": "npm run lint:js",
    "deploy": "nuxt build && npm start"
  }
}
```

接著可以改以該指令啟動

```bash
sudo pm2 start npm --name "你的服務名稱" -- run deploy
```

## 其他相關指令

```bash
sudo pm2 status                 # 查看所有的pm2 （sudo和非sudo是分開的）
sudo pm2 start service_name     # 啟動服務
sudo pm2 restart service_name   # 重新啟動服務（先stop再start）
sudo pm2 reload service_name    # 重新啟動服務（0停機，一個一個process重啟，至少有一個process在運作）
sudo pm2 stop service_name      # 停止服務
sudo pm2 delete service_name    # 刪除服務
sudo pm2 log                    # 查看執行log
```
