---
title: "訪問者模式 Visitor Pattern"
published: 2020-10-13
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

定義能**逐一施行於物件結構裡各個元素的操作**，讓你不必修改作用對象的類別介面，就能定義新的操作；將**操作集中到物件結構上**，以讓它們**能獨立變化，但仍以多型方式進行**。

## 適用

- 物件結構含有許多介面各異的類別，希望能依據物件的實體類別來執行對應的動作時。需要對整個物件結構體系執行各種互不相干的操作，不會造成干擾。物件結構的類別不常變動，但施於其上的操作卻常有增減時。

## 結構及成員

**Collaborations**: 
**Client先建立一個ConcreteVisitor物件**，再於**巡訪**物件結構的**過程中**，**將Visitor物件餵給每一個遇到的Element**。
**Element**被巡訪到時，會**呼叫Visitor相對應的操作**，如有必要，也會把自己列入參數傳送過去讓Visitor存取。
![](/uploads/2021/08/visitor-participants.png)
- Visitor: like the NodeVisitor替每一種ConcreteElement制訂對應的Visit()方法。Visitor藉由方法的名字和簽名（Sinature）（多型）區分是哪個ConcreteElement送過來的訊息。將訊息轉傳給ConcreteVisitor。ConcreteVisitor: like the TypeCheckingVisitor, SpellingVisitor具體實作出Visitor。演算法可從ConcreteVisitor得知目前的Context，在整個巡訪過程中均可在此儲存局部狀態以累積資訊。Element: like the Glyph, Node宣告以Visitor物件當參數的Accept()介面。ConcreteElement: like the Row, Column, Text, Image, etc.具體實作出Accept()方法。Client:可巡訪整群Element物件。可提供高階介面讓Visitor巡訪Element。可以是Composite，也可以是容器（List、Set）。

## 影響結果

### 好處

- 容易增添新的操作，新增一個Visitor即可新增操作。每一種Visitor都將相關操作集中起來，將無關的摒除在外。處理不同的類別階層, Iterator只能巡訪Item或Item的子類別，而Visitor只要把相關類別寫入方法，就沒有巡訪限制。累積狀態。Visitor可在拜訪物件結構各個元素時順便累積狀態。

### 壞處

- 難以增添新的ConcreteElement類別。Visitor可能會迫使ConcreteElement公開一些可存取的Element內部狀態，破壞封裝。

## 實作

#### 雙重分派（Double Dispatch）？

- 在單一分派程式語言，呼叫哪個Overload方法，由方法呼叫者和方法參數共同在執行期間依靜態類別決定。如：以下程式碼所有的ride()出來都會是「騎馬」，因為他們的靜態類別都是Horse。

```java
public class Mozi {
    public void ride(Horse h){ System.out.println("騎馬"); }
    public void ride(WhiteHorse wh){ System.out.println("騎白馬"); }
    public void ride(BlackHorse bh){ System.out.println("騎黑馬"); }

    public static void main(String[] args) {
        Horse wh = new WhiteHorse();
        Horse bh = new BlackHorse();
        Mozi mozi = new Mozi();
        mozi.ride(wh);
        mozi.ride(bh);
    }
}
```

但JAVA可以透過Override實作動態分派

```java
public class Horse {
    public void ride(){ System.out.println("騎馬"); }
}
public class WhiteHorse extends Horse {
    public void ride(){ System.out.println("騎白馬"); }
}
public class BlackHorse extends Horse {
    public void ride(){ System.out.println("騎黑馬"); }
}
public class Mozi {
    public static void main(String[] args) {
        Horse wh = new WhiteHorse();
        Horse bh = new BlackHorse();
        wh.ride();
        bh.ride();
    }
}
```

- Visitor模式將真正會啟用的操作，依Visitor的型別和作用對象的型別決定，不用把靜態操作繫結在Element介面裡。

#### 誰負責巡訪物件結構？

有三種角色可以幫Visitor一一拜訪物件結構裡的每一個元素：物件結構、Visitor物件、Iterator物件。

## Example: Liquor

```java
//Interface: Visitable
package liquor;

interface Visitable {

	public double accept(Visitor visitor);

}
```

```java
//Class: Liquor
package liquor;

class Liquor implements Visitable {

	private double price;

	Liquor(double item) {
		price = item;
	}

	public double accept(Visitor visitor) {
		return visitor.visit(this);
	}

	public double getPrice() {
		return price;
	}

}
```

```java
//Class: Necessity

package liquor;
class Necessity implements Visitable {

	private double price;

	Necessity(double item) {
		price = item;
	}

	public double accept(Visitor visitor) {
		return visitor.visit(this);
	}

	public double getPrice() {
		return price;
	}

}
```

```java
//Class: Tobaco

package liquor;
class Tobacco implements Visitable {

	private double price;

	Tobacco(double item) {
		price = item;
	}

	public double accept(Visitor visitor) {
		return visitor.visit(this);
	}

	public double getPrice() {
		return price;
	}

}
```

```java
//Interface: Visitor

package liquor;

interface Visitor {

	public double visit(Liquor liquorItem);

	public double visit(Tobacco tobaccoItem);

	public double visit(Necessity necessityItem);

}
```

```java
//Class: TaxVisitor

package liquor;

import java.text.DecimalFormat;

class TaxVisitor implements Visitor {


	DecimalFormat df = new DecimalFormat("#.##");

	public TaxVisitor() {
	}

	public double visit(Liquor liquorItem) {
		System.out.println("Liquor Item: Price with Tax");
		return Double.parseDouble(df.format((liquorItem.getPrice() * .18) + liquorItem.getPrice()));
	}

	public double visit(Tobacco tobaccoItem) {
		System.out.println("Tobacco Item: Price with Tax");
		return Double.parseDouble(df.format((tobaccoItem.getPrice() * .32) + tobaccoItem.getPrice()));
	}

	public double visit(Necessity necessityItem) {
		System.out.println("Necessity Item: Price with Tax");
		return Double.parseDouble(df.format(necessityItem.getPrice()));
	}

}
```

```java
//Class: TaxHolidayVisitor


package liquor;
import java.text.DecimalFormat;

class TaxHolidayVisitor implements Visitor {

		DecimalFormat df = new DecimalFormat("#.##");
	public TaxHolidayVisitor() {
	}

	public double visit(Liquor liquorItem) {
		System.out.println("Liquor Item: Price with Tax");
		return Double.parseDouble(df.format((liquorItem.getPrice() * .10) + liquorItem.getPrice()));
	}

	public double visit(Tobacco tobaccoItem) {
		System.out.println("Tobacco Item: Price with Tax");
		return Double.parseDouble(df.format((tobaccoItem.getPrice() * .30) + tobaccoItem.getPrice()));
	}


	public double visit(Necessity necessityItem) {
		System.out.println("Necessity Item: Price with Tax");
		return Double.parseDouble(df.format(necessityItem.getPrice()));
	}

}
```

```java
//Class: VisitorTest

package liquor;
public class VisitorTest {
	public static void main(String[] args) {

		TaxVisitor taxCalc = new TaxVisitor();
		TaxHolidayVisitor taxHolidayCalc = new TaxHolidayVisitor();

		Necessity milk = new Necessity(3.47);
		Liquor vodka = new Liquor(11.99);
		Tobacco cigars = new Tobacco(19.99);

		System.out.println(milk.accept(taxCalc) + "\n");
		System.out.println(vodka.accept(taxCalc) + "\n");
		System.out.println(cigars.accept(taxCalc) + "\n");

		System.out.println("TAX HOLIDAY PRICES\n");

		System.out.println(milk.accept(taxHolidayCalc) + "\n");
		System.out.println(vodka.accept(taxHolidayCalc) + "\n");
		System.out.println(cigars.accept(taxHolidayCalc) + "\n");

	}
}
```

```
Result:

Necessity Item: Price with Tax
3.47

Liquor Item: Price with Tax
14.15

Tobacco Item: Price with Tax
26.39

TAX HOLIDAY PRICES

Necessity Item: Price with Tax
3.47

Liquor Item: Price with Tax
13.19

Tobacco Item: Price with Tax
25.99
```
