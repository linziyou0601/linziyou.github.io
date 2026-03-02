---
title: "橋接模式 Bridge Pattern"
published: 2020-10-06
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

**將實作體系與抽象體系分開**，讓兩者能各自更動。

## 適用

- 想避免將抽象和實體綁死在一起。需要一個統一的介面來交換層次結構。抽象體和實作體都能用子類別去個別擴充。實作體有變但抽象體沒變時，不應影響client。隱藏實作方式。能在多個物件之間共享實作碼，但不影響client。

## 結構及成員

**Collaborations**: Abstraction將Client的訊息請求**轉傳給對應的Implementor**去處理。
![](/uploads/2021/08/bridge-participants.png)
- Abstraction: like the Window抽象體的介面。持有Implementor。RefinedAbstraction: like the PopupWindow, IconWindow.擴充Abstraction。Implementor: like the WindowImp, ColorImp, FontImp定義實作類別之共同介面，可以和Abstraction相去甚遠。通常只含最基本的操作，讓Abstraction組出更高階的操作。ConcreteImplementor: like the XWindowImp, PMWindowImpImplementor 介面的實體實作。

## 影響結果

### 好處

- 將介面與實作隔離開來，在Run-Time，實作不會被綁死，可動態設定、抽換，系統的高階部分只需要知道Abstraction和Implementor即可。易於擴充，Abstraction和Implementor均可個別擴充。隱藏內部實作細節。

### 壞處

- 一種尺寸適合所有（one-size-fits-all）Abstraction 和 Implementor 的 interfaces。

## 實作

#### 只有一種Implementor

**如果實作體只會有一種，那抽象類別Implementor就不必存在（如：DBMgr）**，但如果希望類別內容不會影響Client，那對Bridge仍有幫助。

#### 建立正確的Implementor物件

- 若Abstraction能認得所有的ConcreteImplementor，便可在建構子依參數決定要實體化哪一個。若有大小容器，可以先預設用小的容器實作，超過臨界值再用大的容器實作。也可以將決定權妥託給其他物件，如Abstract Factory。

## Example

### DrawAPI

```java
public abstract class Shape {
   protected DrawAPI drawAPI;

   protected Shape(DrawAPI drawAPI){
      this.drawAPI = drawAPI;
   }
   public abstract void draw();
}
```

```java
public class Circle extends Shape {
   private int x, y, radius;

   public Circle(int x, int y, int radius, DrawAPI drawAPI) {
      super(drawAPI);
      this.x = x;
      this.y = y;
      this.radius = radius;
   }

   public void draw() {
      drawAPI.drawCircle(radius,x,y);
   }
}
```

```java
public interface DrawAPI {
   public void drawCircle(int radius, int x, int y);
}
```

```java
public class RedCircle implements DrawAPI {
   @Override
   public void drawCircle(int radius, int x, int y) {
      System.out.println("Drawing Circle[ color: red, radius: " + radius + ", x: " + x + ", " + y + "]");
   }
}
```

```java
public class GreenCircle implements DrawAPI {
   @Override
   public void drawCircle(int radius, int x, int y) {
      System.out.println("Drawing Circle[ color: green, radius: " + radius + ", x: " + x + ", " + y + "]");
   }
}
```

```java
public class BridgePatternDemo {
   public static void main(String[] args) {
      Shape redCircle = new Circle(100,100, 10, new RedCircle());
      Shape greenCircle = new Circle(100,100, 10, new GreenCircle());

      redCircle.draw();
      greenCircle.draw();
   }
}
```

```
Result:

Drawing Circle[ color: red, radius: 10, x: 100, 100]
Drawing Circle[  color: green, radius: 10, x: 100, 100]
```

### Car Remote Controller

```java
//Class: Car

package car.remotecontrol;

public abstract class Car {

	private final Product product;
	private final String carType;

	public Car(Product product, String carType){
		this.product = product;
		this.carType = carType;
	}

	public abstract void assemble();
	public abstract void produceProduct();

	public void printDetails(){
		System.out.println("Car: "+carType+", Product:"+product.productName());
	}
}
```

```java
//Class: Motoren

package car.remotecontrol;

public class Motoren extends Car{

	private final Product product;
	private final String carType;

	public Motoren(Product product, String carType) {
		super(product, carType);
		this.product = product;
		this.carType = carType;
	}

	@Override
	public void assemble() {
		System.out.println("Assembling "+product.productName()+" for "+carType);
	}

	@Override
	public void produceProduct() {
		product.produce();
		System.out.println("Modifing product "+product.productName()+" according to "+carType);
	}

}
```

```java
//Class: BigWheel

package car.remotecontrol;

public class BigWheel extends Car{

	private final Product product;
	private final String carType;

	public BigWheel(Product product, String carType) {
		super(product, carType);
		this.product = product;
		this.carType = carType;
	}

	@Override
	public void assemble() {
		System.out.println("Assembling "+product.productName()+" for "+carType);
	}

	@Override
	public void produceProduct() {
		product.produce();
		System.out.println("Modifing product "+product.productName()+" according to "+carType);
	}

}
```

```java
//Interface: Product

package car.remotecontrol;

public interface Product {

	public String productName();
	public void produce();
}
```

```java
//Class: GearLocking

package car.remotecontrol;

public class GearLocking implements Product{

	private final String productName;

	public GearLocking(String productName){
		this.productName = productName;
	}

	@Override
	public String productName() {
		return productName;
	}

	@Override
	public void produce() {
		System.out.println("Producing Gear Locking System");
	}

}
```

```java
//Class: CentralLocking

package car.remotecontrol;

public class CentralLocking implements Product{

	private final String productName;

	public CentralLocking(String productName){
		this.productName = productName;
	}

	@Override
	public String productName() {
		return productName;
	}

	@Override
	public void produce() {
		System.out.println("Producing Central Locking System");
	}

}
```

```java
//Class: TestBridgePattern

package car.remotecontrol;

public class TestBridgePattern {

	public static void main(String[] args) {
		Product product = new CentralLocking("Central Locking System");
		Product product2 = new GearLocking("Gear Locking System");
		Car car = new BigWheel(product , "BigWheel xz model");
		car.produceProduct();
		car.assemble();
		car.printDetails();

		System.out.println();

		car = new BigWheel(product2 , "BigWheel xz model");
		car.produceProduct();
		car.assemble();
		car.printDetails();

		System.out.println("-----------------------------------------------------");

		car = new Motoren(product, "Motoren lm model");
		car.produceProduct();
		car.assemble();
		car.printDetails();

		System.out.println();

		car = new Motoren(product2, "Motoren lm model");
		car.produceProduct();
		car.assemble();
		car.printDetails();

	}

}
```

```
Result:

Producing Central Locking System
Modifing product Central Locking System according to BigWheel xz model
Assembling Central Locking System for BigWheel xz model
Car: BigWheel xz model, Product:Central Locking System

Producing Gear Locking System
Modifing product Gear Locking System according to BigWheel xz model
Assembling Gear Locking System for BigWheel xz model
Car: BigWheel xz model, Product:Gear Locking System
-----------------------------------------------------
Producing Central Locking System
Modifing product Central Locking System according to Motoren lm model
Assembling Central Locking System for Motoren lm model
Car: Motoren lm model, Product:Central Locking System

Producing Gear Locking System
Modifing product Gear Locking System according to Motoren lm model
Assembling Gear Locking System for Motoren lm model
Car: Motoren lm model, Product:Gear Locking System
```
