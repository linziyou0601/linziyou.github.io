---
title: "在 Ubuntu 20.04 LTS 上安裝 Apache、MariaDB及php"
published: 2020-03-24
category: "Ubuntu"
tags: ["開發環境"]
---

## 更新 Ubuntu Server

```bash
sudo apt update && sudo apt upgrade && sudo apt dist-upgrade
```

## 改時區 Asia/Taipei （依需求執行）

```bash
sudo timedatectl set-timezone Asia/Taipei
```

## 改語言 zh_TW （依需求執行）

下載語言包

```bash
sudo apt-get install language-pack-zh-hant language-pack-zh-hant-base manpages
```

將 /etc/default/locale 打開，將檔案內容改為以下內容

```ini
LANG="zh_TW.UTF-8"
```

最後，執行以下指令進行套用，或重開機自動套用

```bash
. /etc/default/locale
```

---

## 安裝LAMP

### 1. Apache 網頁伺服器

安裝

```bash
sudo apt install -y apache2 apache2-utils
```

檢查安裝結果

```bash
systemctl status apache2
```

以下為其他常用指令

```bash
sudo systemctl start apache2    #將apache2啟用為系統服務
sudo systemctl enable apache2   #將apache2自系統服務關閉
apache2 -v                      #檢查apache2版本
```

開啟防火牆的 80 port

```bash
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo ufw allow http
```

將Web根目錄的擁有者設為「www-data」

```bash
sudo chown -R www-data:www-data /var/www/html/
```

檢查設定檔是否有誤

```bash
sudo apache2ctl -t
```

若執行上述程式碼時遇到錯誤「AH00558: apache2: ...」錯誤時，編輯「/etc/apache2/conf-available/servername.conf」並加入一行「ServerName localhost」之後執行以下指令

```bash
sudo a2enconf servername.conf
sudo systemctl reload apache2
```

### 2. MariaDB 資料庫

安裝 software-properties-common 並下載金鑰

```bash
sudo apt-get install software-properties-common
sudo apt-key adv --fetch-keys 'https://mariadb.org/mariadb_release_signing_key.asc'
```

指定版本安裝 （此文章發布時最新版為 mariadb 10.5版）

```bash
sudo add-apt-repository 'deb [arch=amd64] http://mariadb.mirror.globo.tech/repo/10.5/ubuntu focal main'
sudo apt-get update
sudo apt-get install mariadb-server mariadb-client
```

檢查安裝結果

```bash
systemctl status mariadb
```

以下為其他常用指令

```bash
sudo systemctl start mariadb    #將mariadb啟用為系統服務
sudo systemctl enable mariadb   #將mariadb自系統服務關閉
mariadb --version               #檢查mariadb版本
```

以root帳號（有密碼）登入資料庫指令

```bash
mysql -u root -p
```

### 3. php 7.4

安裝php及常用的相關模組

```bash
sudo apt install php7.4 libapache2-mod-php7.4 php7.4-mysql php-common php7.4-cli php7.4-common php7.4-json php7.4-opcache php7.4-readline
```

啟用php模組並重啟apache2

```bash
sudo a2enmod php7.4
sudo systemctl restart apache2
```

檢查php版本

```bash
php --version
```

---

## 安裝phpMyAdmin

執行指令，並依照畫面提示安裝

```bash
sudo apt install phpmyadmin
```

---

## 設定資料庫root密碼

### 1. 安裝 mysql_secure 設定

執行指令，並依照畫面提示設定

```bash
sudo mysql_secure_installation
```

### 2. 進入資料庫手動設定

```bash
sudo mysql -u root mysql
```

```sql
#mysql(mariadb)指令頁
UPDATE user SET plugin='mysql_native_password' WHERE User='root';
FLUSH PRIVILEGES;
exit;
```

```sql
#查看密碼設定
select User,Host,Password,Plugin from mysql.user;
#變更密碼Plugin
ALTER USER root@localhost IDENTIFIED VIA mysql_native_password;
#變更密碼
ALTER USER root@localhost IDENTIFIED VIA mysql_native_password USING PASSWORD("password");
```

---

### 【後記】安裝 mariaDB後 無法正常運作之排除

- 發生mariadb常常自己關掉開了mariadb沒多久就關掉下了service mariadb start指令後直接timeout

### 1. 安裝AppArmor管理工具

安裝 AppArmor 並查詢 /usr/sbin/mysqld

```bash
sudo apt-get install apparmor-utils
sudo aa-status
```

### 2. 移掉/usr/sbin/mysqld

方法一

```bash
sudo ln -s /etc/apparmor.d/usr.sbin.mysqld /etc/apparmor.d/disable/
sudo reboot
```

方法二

```bash
sudo aa-remove-unknown
sudo reboot
```

### 3. 故障排除參考來源

- http://n.sfs.tw/content/index/10657https://stackoverflow.com/questions/40997257/mysql-service-fails-to-start-hangs-up-timeout-ubuntu-mariadb

摘要：

```bash
sudo aa-complain /usr/sbin/mysqld
```

```
Setting /usr/sbin/mysqld to complain mode.
ERROR: /etc/apparmor.d/usr.sbin.mysqld contains no profile
```

add the lines to /etc/apparmor.d/usr.sbin.mysqld, and then I could set it to complain mode successfully.

```ini
/usr/sbin/mysqld {
}
```
