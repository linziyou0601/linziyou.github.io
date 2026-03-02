---
title: "責任鏈模式 Chain of Responsibility Pattern"
published: 2020-11-17
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

**讓多個物件都有機會處理某一訊息**，以降低訊息發送者和接收者之間的耦合關係。它將接收者物件串連起來，**讓訊息流經其中，直到被處理了為止**。

## 適用

- 希望訊息不只有一個物件可處理，至於哪個會雀層中選，事先並不知情；系統會自動挑選。希望能將某一訊息丟給好幾個物件，不必指明誰是接收者。希望能動態指定哪些物件可處理某一訊息。

## 結構及成員

**Collaborations**: 當Client發出訊息後，**訊息會在串鏈裡流竄**，**直到**有個ConcreteHandler物件**處理為止**。
![](/uploads/2021/08/chain-of-responsibility-participants.png)
- Handler: like the HelpHandler制訂處理訊息的介面。（可有可無）實作出指向後繼者的連結。ConcreteHandler: like the PrintButton, PrintDialog處理所負責的訊息。可存取後繼者。如果訊息可處理，便處理；否則就轉傳給後繼者。Client:將訊息送到串鏈裡的ConcreteHandler物件。

## 影響結果

### 好處

- 降低耦合性。不必事先知道哪個物件會處理訊息，只須相信訊息會被「妥善」處理。更有彈性地替物件上增添權責。此Pattern將權責彈性分配到許多物件上，在Runtime仍可增添或改變訊息處理權責，也能和子類別繼承功能搭配，靜態指定特別的Handler。

### 壞處

- 不保證會有最終接收者。

## 實作

#### 製作後繼者串鏈，大致有兩種做法

- 定義新的連結，較常使用（通常寫在Handler或ConcreteHandler裡）。使用既有的連結，重複利用（指標和Composite Pattern）。

#### 連接後繼者

- 如果沒有既存的連結可用，就得自己定義。也就是說Handler要定義訊息介面，也要維護後繼者。因此Handler通常會提供一個內定的HandleRequest()版本，如果子類別ConcreteHandler不想處理這個訊息，就不必改寫這操作，直接沿用。

#### 表達訊息？

- 方法一：寫成方法（如：HandleHelp()），既方便又簡單，但只能傳遞定義過且數目固定的類型。方法二：製作一個可接收訊息代碼參數的函數，並用另一個訊息物件來承載參數。（如：定義一個Request類別，再用子類別定義各種新的訊息類型參數）。

## Example: MailHandler

```java
// 所有處理郵件的子類別要繼承的介面
public abstract class MailHandler {

    // 每個處理郵件類別都要記錄下一個
    // 能處理的人是誰
    protected MailHandler mHandler;

    public MailHandler(MailHandler handler) {
        mHandler = handler;
    }

    public void toNext(Mail mail) {
        if(mHandler != null) {
            mHandler.handleMail(mail);
        } else {
            // 沒有後繼者, 表示是尾端了
            // 通常可以用最一般化的處理
        }
    }

    public abstract void handleMail(Mail mail);
}
```

```java
public class SpamMailHandler extneds MailHandler {
		SpamMailHandler(MailHandler handler){
				super(handler);
		}
    @Override
    public void handleMail(Mail mail) {
        // 假設已經能知道郵件分類了
        if(mail.isSpam()) {
            // 處理垃圾信
        } else {
            toNext(mail);
        }
    }
}
```

```java
public class ThankMailHandler extneds MailHandler {

    ...
}
```

```java
public class ComplainMailHandler extneds MailHandler {

    ...
}
```

```java
public class GeneralMailHandler extends MailHandler {

    ...
}
```

```java
public class Main {

	public static void main(String[] args) {
		// 可以這樣使用
		MailHandler handler = new ThankMailHandler(
		                      new ComplainMailHandler(
		                      new SpamMailHandler(
		                      new GeneralMailHandler(null))));
		// 假設有一封郵件要處理
		Mail mail = new Mail(...);
		handler.hanldeMail(mail);
  }
}
```
