---
title: "策略模式 Strategy Pattern"
published: 2020-09-29
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

定義**一整族演算法**，將每一個演算法**封裝起來，可互換使用**，更可在不影響外界的情況下**個別抽換**所引用的演算法。

## 適用

- 當需要同一演算法的各種變形版本時，可以自由切換行為。演算法可以被封裝，讓外界不知道複雜的資料結構。可以用一個interface合併所有不同行為的封裝為同一類別。

## 結構及成員

**Collaborations**: Strategy和Context協議出該採用的演算法版本。**Context餵給Strategy會用到的資料**（也可能把自己傳給Strategy）。**Client通常會先建一個ConcreteStrategy餵給Context**，之後**Client就和Context打交道**，**Context會將Client傳來的訊息轉傳給Strateg****y**。
![](/uploads/2021/08/strategy-participants.png)
- Strategy: like the Compositor制訂所有演算法的共同介面。Context透過此介面呼叫ConcreteStrategy所實作的演算法。ConcreteStrategy: like the SimpleCompositor, TeXCompositor, etc.根據Strategy所訂的介面實作演算法。Context: like the Composition用ConcreteStrategy物件來設定組態。持有一個Strategy物件。可能會定義介面讓Strategy可以存取自己的資料。

## 影響結果

### 好處

- Strategy定義一整族演算法讓Context使用，繼承機制可將各演算法的共同功能抽取出來。若直接對Context用繼承的方法實作不同的演算法依然可執行，但會難以理解、維護、擴充和動態改變。去除條件陳述句（Eliminate conditional statements），降低複雜度。針對同一行為提供多種實作供Client動態地選擇。

### 壞處

- Client需要對各個Strategy有認知。Strategy可能需要知道Context的資料結構，會破壞封裝（Breaking encapsulation）。簡單的ConcreteStrategy也許不會用到Context送他的初始化參數，但Strategy介面會與Context通訊，增加負擔。會增加應用程式的物件數量，若將Strategy做成non-state物件，就可供Context共用。而其他狀態資訊院由Context維護，必要時才傳參給Strategy的方法。詳Flyweight Pattern。

## 實作

#### 制訂Strategy和Context介面

Strategy和Context介面必須提供有效率的存取介面，讓ConcreteStrategy和Context互相存取必要資訊。
- 做法一：Context主動傳遞資料給Strategy，降低耦合，但也可能送出Strategy不需要的資料。做法二：Context把自己當作傳參傳給Strategy，但耦合較高。

#### Strategy物件可有可無

Context可在存取Strategy之前先檢查在不在，**在就使用；不在就依預設做法進行**，這樣Context就不必處理任何Strategy物件。

#### 方便vs隨便

因為可以很方便的轉換到另一個Strategy，所以**要設有限制，才不會方便當隨便**（如：人類walk變成fly）。

## Example: Vehicle

```java
//Class: Vehicle

package vehicle.go;

public abstract class Vehicle {

	private GoAlgorithm algorithm;
	public void setGoAlgorithm(GoAlgorithm algorithm) {
		this.algorithm = algorithm;
	}

	public void go() {
		algorithm.go();
	}

}
```

```java
//Class: StreetRacer

package vehicle.go;

public class StreetRacer extends Vehicle {

	public StreetRacer() {
		setGoAlgorithm(new GoByDriving());
	}

}
```

```java
//Class: FormulaOne

package vehicle.go;

public class FormulaOne extends Vehicle {

	public FormulaOne() {
		setGoAlgorithm(new GoByDriving());
	}

}
```

```java
//Class: Helicopter

package vehicle.go;

public class Helicopter extends Vehicle {

	public Helicopter() {
		setGoAlgorithm(new GoByFlying());
	}

}
```

```java
//Class: Jet

package vehicle.go;

public class Jet extends Vehicle {

	public Jet() {
		setGoAlgorithm(new GoByFlyingFast());
	}

}
```

```java
//Class: GoAlgorithm

package vehicle.go;

public interface GoAlgorithm {

	public void go();

}
```

```java
//Class: GoByDriving

package vehicle.go;

public class GoByDriving implements GoAlgorithm {

	public void go() {
		System.out.println("Now I'm driving.");
	}

}
```

```java
//Class: GoByFlying

package vehicle.go;

public class GoByFlying implements GoAlgorithm {

	public void go() {
		System.out.println("Now I'm flying.");
	}

}
```

```java
//Class: GoByFlyingFast

package vehicle.go;

public class GoByFlyingFast implements GoAlgorithm {

	public void go() {
		System.out.println("Now I'm flying fast.");
	}

}
```

```java
//Class: Main

package vehicle.go;

public class Main {

	public static void main(String[] args) {
		StreetRacer streetRacer = new StreetRacer();
		FormulaOne formulaOne = new FormulaOne();
		Helicopter helicopter = new Helicopter();
		Jet jet = new Jet();

		streetRacer.go();
		formulaOne.go();
		helicopter.go();
		jet.go();

		Jet realJet = new Jet();
		realJet.setGoAlgorithm(new GoByDriving());
		realJet.go();
		realJet.setGoAlgorithm(new GoByFlyingFast());
		realJet.go();
		realJet.setGoAlgorithm(new GoByDriving());
		realJet.go();


	}

}
```

```
Result:

Now I'm driving.
Now I'm driving.
Now I'm flying.
Now I'm flying fast.
Now I'm driving.
Now I'm flying fast.
Now I'm driving.
```
