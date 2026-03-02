---
title: "可SSH登入，但無法透過瀏覽器SSH連線到GOOGLE Compute Engine Instance的解決方案"
published: 2020-03-21
category: "開發環境"
---

### 檢查服務運作狀態

```bash
sudo systemctl list-unit-files | grep google | grep enabled
```

顯示如下：

```
google-accounts-daemon.service             enabled
google-clock-skew-daemon.service           enabled
google-instance-setup.service              enabled
google-network-daemon.service              enabled
google-shutdown-scripts.service            enabled
google-startup-scripts.service             enabled
```

### 啟動列表中沒啟動的項目

```bash
sudo systemctl enable {SERVICE_NAME}
sudo systemctl start {SERVICE_NAME}
```

### 檢查network daemon和accounts daemon是否有在運行

```bash
sudo ps aux | grep google
```
