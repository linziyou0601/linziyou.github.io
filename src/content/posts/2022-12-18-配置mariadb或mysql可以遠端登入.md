---
title: "配置MariaDB或MySQL可以遠端登入"
published: 2022-12-18
category: "Ubuntu"
tags: ["開發環境"]
---

正常來說，MariaDB或MySQL的預設配置會把「--bind-address」綁定到「127.0.0.1」上，因此除了本機電腦之外，LAN及WAN上的機器將無法直接存取。

## 配置檔位置

my.cnf檔案通常會在以下位置

```bash
/etc/my.cnf         (*nix/BSD)
$MYSQL_HOME/my.cnf  (*nix/BSD) *通常會是 /etc/mysql/my.cnf
SYSCONFDIR/my.cnf   (*nix/BSD)
DATADIR\my.ini      (Windows)
```

## 查看目前啟動選項

查看mysqld程式位置

```bash
which mysqld

# 輸出為
/usr/sbin/mysqld
```

查看啟動選項，如果使用「sudo」啟動，指令前面要加上「sudo」；否則可以不加

```bash
sudo /usr/sbin/mysqld --print-defaults

# 輸出為
/usr/sbin/mysqld would have been started with the following arguments:
--socket=/run/mysqld/mysqld.sock --pid-file=/run/mysqld/mysqld.pid --basedir=/usr --bind-address=127.0.0.1 --expire_logs_days=10 --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci
```

## 修改配置檔

通常會看到以下的配置選項（沒有這兩個選項也沒關係）

```ini
[mysqld]
    ...
    skip-networking
    ...
    bind-address =
    ...
```

- 將以上選項刪除後，在my.cnf的「最下面」加上

```bash
[mysqld]
...
skip-networking=0
skip-bind-address
```

- 或是

```bash
[mysqld]
...
bind-address = 0.0.0.0
```

再次查看啟動選項，

```bash
sudo /usr/sbin/mysqld --print-defaults

# 輸出為
/usr/sbin/mysqld would have been started with the following arguments:
--socket=/run/mysqld/mysqld.sock --pid-file=/run/mysqld/mysqld.pid --basedir=/usr --bind-address=127.0.0.1 --expire_logs_days=10 --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci --skip-networking=0 --skip-bind-address

# 或是
/usr/sbin/mysqld would have been started with the following arguments:
--socket=/run/mysqld/mysqld.sock --pid-file=/run/mysqld/mysqld.pid --basedir=/usr --bind-address=127.0.0.1 --expire_logs_days=10 --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci --bind-address=0.0.0.0
```

## 啟用配置

重啟資料庫伺服器

```bash
# 重啟MariaDB
sudo systemctl restart mariadb
# 停止MariaDB
sudo systemctl stop mariadb
# 啟動MariaDB
sudo systemctl start mariadb
```
