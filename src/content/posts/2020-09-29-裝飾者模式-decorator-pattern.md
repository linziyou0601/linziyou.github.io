---
title: "裝飾者模式 Decorator Pattern"
published: 2020-09-29
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

**動態地**將額外權責附加於物件上，**不必衍生子類別（透明地）**即可彈性地**擴增物件功能**。

## 適用

- 想擴充功能，但子類別繼承方式是不切實際時（功能太多，繼承數量龐大）。在不影響其他物件的情況下，可以動態而透明的增加權責到個別物件上，也可以動態撤銷。

## 結構及成員

**Collaborations**: **Decorator會將訊息轉傳給Component處理**，且在轉傳之前或之後**可以做額外的事**。（簡單說就是可以在原本Component要做的事，利用Decorator多做其他事）
![](/uploads/2021/08/decorator-participants.png)
- Component: like the Glyph制定可以被Decorator動態增加權責的物件之介面。ConcreteComponent: like the Composition, Row, Column, Character, etc.定義可以被Decorator動態增加權責的物件。Decorator: like the MonoGlyph持有一個Component（須制訂符合Component的介面/Method）。ConcoreteDecorator: like the Border, Frame, Scrollbar將額外的權責新增到Component（ConcreteComponent）身上。

## 影響結果

### 好處

- 比靜態繼承機制更有彈性，可在運行時增加、刪除職責，避免子類過多。如果有使用同個Decorator兩次，或使用多個Decorator，可以Recursive nesting（遞回嵌套）。

### 壞處

- Decorator和Component並不一樣，雖然它是使用透明包覆，但外覆的Component已不是原先的Component物件。小型物件太多，不同之處只在互連的方式而不在所屬類別或變數內容。易客製化，不易學習和除錯。

## 實作

#### 遵循介面／介面一致性（conformance）

Decorator物件的介面必須和Component一係，所以**每一種ConcreteDecorator類別都要繼承同一種Decorator**。

#### （輕量化）Decorator抽象類別

如果只要增加一個權責，則Decorator的抽象就可不定義，**直接將Decorator的訊息轉入ConcreteDecorator**。

#### 維持Component類別的輕巧

Component只設介面，不存資料。**讓ConcreteComponent處理複雜的資料**。

#### 變臉 vs. 換骨

**Decorator Pattern像是包在物件外面的一層皮**，而 **Strategy Pattern 像是改變物件的內臟**。如果Component本身太過臃腫，可以改用Strategy Pattern，Strategy Pattern同樣可以連續串接Strategy Pattern。

## Example: Beverage

```java
//Class: Beverage

public abstract class Beverage {
    String description = "Unknown Beverage"

    public String getDescription() {
        return description;
    }

    // 留給子類別實作
    public abstract double cost();
}
```

```java
//Class: CondimentDecorator

public abstract class CondimentDecorator extends Beverage {

    // 因為希望配料也能顯示出來,
    // 因此所有子類別都要實作這個 method
    public abstract String getDescription();
}
```

```java
//Class: Espresso

public class Espresso extends Beverage {

    public Espresso {
        // 這個變數是繼承自 Beverage 的
        description = "Espresso";
    }

    public double cost() {
        // 目前這邊只是單純 Espresso 的價格,
        // 不含任何配料
        return 1.99;
    }
}
```

```java
//Class: Mocha

// 摩卡是一個裝飾者, 因此讓它繼承自 CondimentDecorator
// 而且別忘了, CondimentDecorator 繼承自 Beverage 喔
public class Mocha extends CondimentDecorator {

    // 要讓摩卡能參考到 Beverage,
    // 因此需要這個成員變數
    Beverage mBeverage;

    public Mocha(Beverage beverage) {
        this.mBeverage = beverage;
    }

    // 以下兩個 method 的作法都是利用委派(delegation) 的方式,
    // 從被裝飾者拿到資訊後, 再加上裝飾者的資訊
    public String getDescription() {
        return mBeverage.getDescription() + ", Mocha";
    }

    public double cost() {
        return .20 + mBeverage.cost();
    }
}
```

```java
//Class: Milk

// 牛奶裝飾者基本上寫法跟摩卡裝飾者一樣
public class Milk extends CondimentDecorator {

    Beverage mBeverage;

    public Milk(Beverage beverage)
    {
        this.mBeverage = beverage;
    }

    public String getDescription()
    {
        return mBeverage.getDescription() + ", Milk";
    }

    public double cost()
    {
        return .30 + mBeverage.cost();
    }
}
```

```java
//Class: BevrageTest

public class BeverageTest {

    pubilc static void main(String[] args)
    {
        // 點了一杯 Espresso, 印出它的資訊
        Beverage beverage = new Espresso();
        System.out.println(beverage.getDescription() +
            " $" + beverage.cost());

        // 再點一杯 Espresso
        Beverage beverage2 = new Espresso();

        // 用摩卡裝飾 Espresso
        beverage2 = new Mocha(beverage2);

        // 用牛奶裝飾加了摩卡的 Espresso
        beverage2 = new Milk(beverage2);
        System.out.println(beverage2.getDescription() +
            " $" + beverage2.cost());
    }
}
```

```
Result:

Espresso $1.99
Espresso, Mocha, Milk $2.49
```
