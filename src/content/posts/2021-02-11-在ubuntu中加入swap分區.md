---
title: "在Ubuntu中加入SWAP分區"
published: 2021-02-11
category: "Ubuntu"
tags: ["開發環境"]
---

我們在架設伺服器時，有時會選擇使用雲端主機，但是為了節省經費會選擇硬體需求較低的主機。此時，就可能會發生**記憶體容量不足**的問題，這時候就可以設置**SWAP交換分區**，它的功能就好像Windows虛擬記憶體一樣，可以把部分的硬碟空間當作記憶體進行讀寫。

## SWAP分區要設多大？

根據Ubuntu官方的解釋，如果RAM小於1GB，那SWAP至少設為1GB，至少應該要設定和RAM相等大小的SWAP；然而SWAP的大小超過RAM的2倍時，會有效益的遞減問題。並且根據休眠設定與否也會有設定上的差異，Ubuntu官方的建議值大致如下：（參考來源：[https://help.ubuntu.com/community/SwapFaq](https://help.ubuntu.com/community/SwapFaq)）

## 1. 檢查SWAP空間存不存在

如果顯示的內容是空的，表示SWAP空間不存在。

```bash
swapon -s
```

## （如果要）取消原本的交換分區

```
sudo swapoff /swapfile
```

## 2. 檢查空間是否足夠

檢查一下系統是否有足夠的硬碟空間來設置SWAP。

```bash
df -hal
```

## 3. 新增SWAP分區

bs表示每一次讀取的大小，單位是bytes；count表示數量。因此以下範例為 1024bytes * 1048576 = 1GB

```bash
sudo dd if=/dev/zero of=/swapfile bs=1024 count=1048576
```

會收到訊息

```bash
輸入 1048576+0 個紀錄
輸出 1048576+0 個紀錄
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 3.86487 s, 278 MB/s
```

## 4. 格式化SWAP分區

```bash
sudo mkswap /swapfile
```

會收到訊息

```bash
Setting up swapspace version 1, size = 1024 MiB (1073737728 bytes)
無標籤， UUID=cdf569da-3621-41ee-9551-9cce3bb0fd98
```

## 5. 啟動SWAP分區

```bash
sudo swapon /swapfile
```

此時再查看一次SWAP交換空間

```bash
swapon -s
```

會發現已經存在交換分區了

```bash
Filename                                Type            Size    Used    Priority
/swapfile                               file            1048572 0       -2
```

## 6. 自動掛載SWAP分區

用vim之類的文字編輯器打開 /etc/fstab 檔案，在最後面加上此行

```bash
/swapfile          swap            swap    defaults        0 0
```

並且設定SWAP檔案的存取權限

```bash
sudo chown root:root /swapfile
sudo chmod 600 /swapfile
```

## 7. 優化SWAP分區使用頻率

Linux對於進程 (Process) （即：執行中的程式）會分成**「就緒 (Standby)」、「睡眠 (Sleep)」、和「活動 (Active)」**。當被分類為睡眠時，會被保存在SWAP分區內，但是如果RAM夠大，那麼可以透過設定swappiness來降低SWAP分區的使用頻率，讓系統不要頻繁讀寫硬碟！

當swappiness為0時表示積極使用RAM；為100時表示積極使用SWAP分區，而Ubuntu預設值為60。

我們可以透過以下指令檢查目前的swappiness：

```bash
cat /proc/sys/vm/swappiness
```

### 7-1. 臨時性調整

若要將swappiness調整為為10（舉例），可以使用以下指令更改：

```
sudo sysctl vm.swappiness=10
```

### 7-2. 要永久性調整

用vim之類的文字編輯器打開 /etc/sysctl.conf 檔案，在最後面加上此行 

```bash
# Search for the vm.swappiness setting.  Uncomment and change it as necessary.
vm.swappiness=10
```
