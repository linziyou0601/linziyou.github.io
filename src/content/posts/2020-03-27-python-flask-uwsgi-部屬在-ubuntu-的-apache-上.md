---
title: "Python Flask + uwsgi 部屬在 Ubuntu 的 Apache 上"
published: 2020-03-27
category: "Python"
tags: ["Ubuntu", "開發環境"]
---

## 1. 安裝Apache2

執行以下操作之前，要先在Ubuntu上安裝Apache2網頁伺服器，還沒安裝的人可以先看之前寫過的LAMP安裝文章進行安裝

---

## 2. 安裝必要項目

以 apt-get 安裝 python 必要項目（本文章發佈時最新版為python 3.8）

```bash
sudo apt-get install python3.8, python3-pip, python3.8-dev, build-essential
```

以 sudo su 安裝 uwsgi

```bash
sudo su
pip3 install uwsgi
```

安裝apache2-mod-proxy-uwsgi

```bash
sudo apt-get install libapache2-mod-proxy-uwsgi
```

啟用proxy_uwsgi模組

```bash
sudo a2enmod proxy_uwsgi
sudo service apache2 restart
```

---

## 3. 更改flask的執行參數

建立一個uwsgi.ini檔，並放在能夠存取的目錄（建議放在flask程式目錄的uwsgi目錄下，如：/var/www/<project_name/uwsgi/uwsgi.ini），內容如下：
（※：port的5000是對內開放的，到時候會用Apache的Proxy到uWSGI開放對放的port）

```ini
[uwsgi]
;app代表flask主程式為程式專案目錄下的app.py
module = app:app
;設定一個埠號對內開放的埠號（例：5000）
http-socket = :5000
;程式進程數量
processes = 3
;Project根目錄
chdir = /var/www/
;sock檔之權限
chmod-socket = 666
;log檔之權限
logfile-chmod = 664
;系統服務之前綴，例如：「myFlask」
procname-prefix-spaced = myFlask
;python程式更新時是否自動重載
py-autoreload = 1
;是否自動清理status, pid 及 socket檔
vacuum = true
;使用apache或nginx代理需用到
socket = %(chdir)/uwsgi/uwsgi.sock
;查看uwsgi狀態
status = %(chdir)/uwsgi/uwsgi.status
;查看uwsgi之PID（關閉、重啟需要）
pidfile = %(chdir)/uwsgi/uwsgi.pid
;後台啟動，並將訊息寫入log
daemonize = %(chdir)/uwsgi/uwsgi.log
```

例用uwsgi啟動flask相關指令如下

```bash
sudo uwsgi --ini /var/www//uwsgi/uwsgi.ini                 //啟動
sudo tail -f /var/www//uwsgi/uwsgi.log                     //查看log
sudo uwsgi --stop /var/www//uwsgi/uwsgi.pid                //關閉
sudo uwsgi --reload /var/www//uwsgi/uwsgi.pid              //重啟
```

若啟動時，查看log發現port被佔用，那可能是因為前次執行的時候uwsgi沒有被正常關閉。

可以用以下指令查詢佔用的PID

```bash
sudo netstat -tulpn      //(方法一) 查詢所有port
ps aux | grep myFlask    //(方法二) 查詢特定PID（myFlask為uwsgi.ini設定之前綴）
```

然後執行以下指令關閉程式

```bash
sudo kill -9
```

---

## 4. 配置Apache2 的 VHost

編輯「/etc/apache2/sites-available/000-default.conf」

```apache
    ServerName :6000
    ServerAlias
    # 代理設定
    ProxyPass / unix:/var/www//uwsgi/uwsgi.sock|uwsgi://127.0.0.1:5000/
```

編輯「/etc/apache2/ports.conf」打開apache監聽port

```apache
    Listen 6000


    Listen 6000
```

打開防火牆

```bash
ufw allow 6000
sudo ufw reload
```

此時前往 your.domain.name:6000 應該就能成功了！
