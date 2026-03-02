---
title: "將 Ubuntu 18.04 的 python 換至 python 3.7"
published: 2020-03-19
category: "Python"
tags: ["Ubuntu", "開發環境"]
---

### 替換Python版本至3.7

```bash
sudo apt update -y
sudo apt install python3.7
```

### 將Python 3.6和Python 3.7添加到更新替代選項

```bash
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.6 1
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.7 2
```

### 更新Python 3以指向Python 3.7

```bash
sudo update-alternatives --config python3
```

### 備用更新Python 3指向Python3.7

```bash
sudo rm /usr/bin/python3
sudo ln -s python3.7 /usr/bin/python3
```

### 測試python3的版本

```bash
python3 -V
```

### 錯誤排除

若後續使用python3時出現若「ModuleNotFoundError: No module named 'apt_pkg'」，則執行以下指令，複製python3.6的套件給python3.7

※其他套件同理，複製一份並將路徑當中之「36m」改為「37m」

```bash
 cd /usr/lib/python3/dist-packages/
 sudo cp apt_pkg.cpython-36m-x86_64-linux-gnu.so apt_pkg.cpython-37m-x86_64-linux-gnu.so
```
