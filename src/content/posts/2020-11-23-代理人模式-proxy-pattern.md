---
title: "代理人模式 Proxy Pattern"
published: 2020-11-23
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

替其他物件**預留代理者空位**，藉此控制存取其他物件。

## 適用

- 遠端代理者（remote proxy）用來代理位於不同定址空間的其他物件。虛擬代理者（virtual proxy）會在需要時才建立耗資源的物件，例如ImageProxy。設限代理者（protection proxy）控制原始物件的存取權限，用來對同一物件設定各種不同的存取權限。智慧型指涉者（smart reference）彌補指標的不足，可在存取物件的同時進行額外的動作。

Smart Reference典型的**應用**：
①**累計物件被用幾次**，不用時釋放空間。
②**第一次**用到時才將**永久性物件（persistent object）載入記憶體**。
③在**使用前先檢查**是否已**鎖定完成**，確保不會被其他物件更改內容。
參見：[http://corrupt003-design-pattern.blogspot.com/2016/10/proxy-pattern.html](http://corrupt003-design-pattern.blogspot.com/2016/10/proxy-pattern.html)

## 結構及成員

**Collaborations**: 如果合適（看Proxy的類型而定），Proxy會將訊息轉遞給RealSubject。
![](/uploads/2021/08/proxy-participants.png)
- Proxy: like the ImageProxy持有指向RealSubject物件的reference以便存取真正的物件。如果RealSubject和Subject的介面完全一樣，Proxy也可以直接指向Subject。提供和Subject相同的介面，以便能用在RealSubject所能出現的任何地方。掌控對RealSubject的存取動作，可能還會負責建立及刪除。其他權責要視Proxy種類而定：遠端代理者：負責編碼訊息和參數，再送交給位於不同定址空間的RealSubject。虛擬代理者：可能會快取RealSubject的某些資訊以延緩存取時機（像ImageProxy會快取影像的寬度、高度）。設限代理者：檢查呼叫者是否有存取能力。Subject: like the Graphic制訂RealSubject和Proxy所共同遵循的介面，好讓Proxy可用在RealSubject所能出現的任何地方。RealSubject: like the Image定義Proxy所代表的真正物件。

## 影響結果

- 遠端代理者可隱瞞「物件位於不同定址空間」一事。虛擬代理者可做些最佳化措施，像是需要時才建物件。設限代理者和智慧型指涉者都可在存取物件時做些額外的事。寫入時才拷貝：複製大而複雜的物件是很耗資源的事，如果複製對象的內容沒有被更動過，就不必虛耗資源，用Proxy延遲拷貝程序確保唯有在內容有變時才付出代價。 需加上參用計數功能，此時複製Proxy就只是去遞增計數器內容。當外界更動到Subject內容，Proxy才會真的去拷貝一份並遞減計數器。計數器附為零，就砍Subject。

## 實作

#### 代理者未必需要知道RealSubject的確切型別

- 如果Proxy類別只透過抽象介面來處理Subject物件，就不用替每一種RealSubject各做一個Proxy類別（Proxy會一視同仁的對待他們）。但如果Proxy會實體化RealSubject（如：虛擬代理者），就必須知道實體類別是誰。

## Example: ImageProxy

```java
// Proxy 實作跟 RealSubject 共同的介面 Icon
public class ImageProxy implements Icon {

    // 這是我們的 RealSubject,
    // 也就是真正要顯示圖的物件
    private ImageIcon mImageIcon;
    private URL mUrl;
    private Thread mRetrievalThread;
    private boolean mRetrieving = false;

    // 此範例是從網路上取得圖
    public ImageProxy(URL url)
    {
        mUrl = url;
    }

    @Override
    public int getIconWidth()
    {
        // 在圖下載完成前, 先傳回預設的值
        if(mImageIcon != null)
        {
            return mImageIcon.getIconWidth();
        }
        else
        {
            return 0;
        }
    }

    @Override
    public int getIconHeight()
    {
        // 在圖下載完成前, 先傳回預設的值
        if(mImageIcon != null)
        {
            return mImageIcon.getIconHeight();
        }
        else
        {
            return 0;
        }
    }

    @Override
    public int paintIcon(...)
    {
        // 圖下載好了, 畫圖的事就轉給
        // RealSubject 做
        if(mImageIcon != null)
        {
            mImageIcon.paintIcon(...);
        }
        else
        {
            // 第一次下載圖
            drawString("Loading icon, please wait...");
            if(!mRetrieving)
            {
                mRetrieving = true;

                mRetrievalThread = new Thread(new Runnable() {

                    @Override
                    public void run()
                    {
                        mImageIcon = new ImageIcon(mUrl, "icon");
                    }
                });
                mRetrievalThread.start();
            }
        }
    }
}
```
