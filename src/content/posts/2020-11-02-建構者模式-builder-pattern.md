---
title: "建構者模式 Builder Pattern"
published: 2020-11-02
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

將建構邏輯從物件**轉移到建構器**。從複雜物件的佈局中抽取出生成程序**，以便用同一個生成程序製造各種不同的物件佈局**。

## 適用

- 欲將「建造複雜物件的演算法」與物件的零件及組裝方式保持獨立時。想讓同一個物件生成程序能夠產生數種不同佈局形式的物件時。若一個產品生產程序太過複雜，Concrete Factory可以把產品生成責任委託給Builder。設計流程和製造流程可以隨產品而變化。

## 結構及成員

**Collaborations**: 
Client **先建立 Director物件**，並將**組態設定**成想要的 Builder 物件。
Director 會在需要建立 Product 的各個零件時通知 Builder。
**Builder 處理 Director 送來的命令，將零件一一加進 Product 裡**。
最後 **Client 從 Builder 手中取得 Product**。
![](/uploads/2021/08/builder-participants.png)
- Builder: like the TextConverter抽象介面，用來生成Product的各零件。ConcreteBuilder: like the ASCIIConverter, TeXConverter, and TextWidgetConverterBuilder介面的具體實作，負責建構及組裝Product的各零件。定義並記載它所造出的物件之佈局形式。存取Product的介面（如：GetASCIIText、GetTextWidget）Director: like the RTFReader利用Builder介面來建構物件。Product: like the ASCIIText, TeXText, TextWidget.欲產生的最終複雜物件。它的內部佈局形式以及組裝程序，全都是由ConcreteBuilder負責定義。包含各零件的類別，類別裡又含有可將這些零件組裝成最終結果的介面。

## 影響結果

### 好處

- 能夠改變成品物件的內部佈局形式。只要定義新的Builder，就能改變成品物件的內部構造。將生成程序與內部佈局的程式碼隔離開來。Client不必知道成品物件內部結構是由哪些類別所定義的，因為這些類別名稱都沒有出現在Builder的外顯介面裡。對生成程序掌控得更細緻。成品物件是在Director的監控下一步步建出來的，等到完全建好之後Director才向Builder索取成品物件。所以Builder的面比其他生成模式更著重在建構成品物件的細步程序。

## 實作

#### 組裝及建構介面

Builder類別的介面**必須一般化到能滿足各種ConcreteBuilder所需的**生成程序。

#### 為什麼成品物件沒有抽象介面？

- 一般而言，ConcreteBuilder所建的成品物件內部佈局方式差異相當大，並不值得費力抽出共同的父類別。Client通常都會用適切的ConcreteBuilder去設定Director物態，它很清楚自己正在用哪一種Builder實體子類別，能夠正確處理成品物件。

　　可能有些人會覺得，同樣都是建立物件，那直接 Abstract Factory Pattern 來建立物件不就好了？這裡要注意的是，**Builder 著重在隱藏複雜物件生成的步驟，且生成的物件（通常是複雜物件）彼此會有「部份」（Part of）的概念**。而 **Abstract Factory 則是著重在管理有關聯性的物件，但這些物件不會有「部份」（Part of）的概念**。實務上這個模式還滿常被使用到的，如 JAVA SDK 裡的 StringBuilder，StringBuffer，以及 Android SDK 裡的 AlertDialog.Builder，有興趣的人可以參考看看。

　　Builder Pattern的特點就是將複雜物件的**產生過程隱藏起來**，使用者無法碰到，且**允許物件用多個步驟建立（跟 Factory Method 只有一個步驟不同）**，因為它的特性，因此經**常用來建立合成結構**。但對於使用者而言，**要是不知道有哪些 setXXX() 方法可以用，也無法建立出想要的物件**，這是要注意的地方。

 某些時候，會看到有些寫法會將 Builder 的各個 **Setter() 回傳 Builder 物件本身**（即：**public XXBuilder setCompA(...)**）。以便能以**Fluent Interface的風格**進行Builder的設定（如：**Product p = builder.setCompA(...).setCompB(...).setC().build()**）。

## Example: Car

```java
Class: Car

package builder.car;

public class Car {

	private String bodyStyle;
	private String power;
	private String engine;
	private String breaks;
	private String seats;
	private String windows;
	private String fuelType;
	private String carType;

	public Car (String carType){
		this.carType = carType;
	}

	public String getBodyStyle() {
		return bodyStyle;
	}
	public void setBodyStyle(String bodyStyle) {
		this.bodyStyle = bodyStyle;
	}
	public String getPower() {
		return power;
	}
	public void setPower(String power) {
		this.power = power;
	}
	public String getEngine() {
		return engine;
	}
	public void setEngine(String engine) {
		this.engine = engine;
	}
	public String getBreaks() {
		return breaks;
	}
	public void setBreaks(String breaks) {
		this.breaks = breaks;
	}
	public String getSeats() {
		return seats;
	}
	public void setSeats(String seats) {
		this.seats = seats;
	}
	public String getWindows() {
		return windows;
	}
	public void setWindows(String windows) {
		this.windows = windows;
	}
	public String getFuelType() {
		return fuelType;
	}
	public void setFuelType(String fuelType) {
		this.fuelType = fuelType;
	}

	@Override
	public String toString(){
		StringBuilder sb = new StringBuilder();
		sb.append("--------------"+carType+"--------------------- \n");
		sb.append(" Body: ");
		sb.append(bodyStyle);
		sb.append("\n Power: ");
		sb.append(power);
		sb.append("\n Engine: ");
		sb.append(engine);
		sb.append("\n Breaks: ");
		sb.append(breaks);
		sb.append("\n Seats: ");
		sb.append(seats);
		sb.append("\n Windows: ");
		sb.append(windows);
		sb.append("\n Fuel Type: ");
		sb.append(fuelType);

		return sb.toString();
	}
}
```

```java
Class: CarDirector

package builder.car;

public class CarDirector {

	private CarBuilder carBuilder;

	public CarDirector(CarBuilder carBuilder){
		this.carBuilder = carBuilder;
	}

	public void build(){
		carBuilder.buildBodyStyle();
		carBuilder.buildPower();
		carBuilder.buildEngine();
		carBuilder.buildBreaks();
		carBuilder.buildSeats();
		carBuilder.buildWindows();
		carBuilder.buildFuelType();
	}
}
```

```java
Interface: CarBuilder


package builder.car;

public interface CarBuilder {

	public void buildBodyStyle();
	public void buildPower();
	public void buildEngine();
	public void buildBreaks();
	public void buildSeats();
	public void buildWindows();
	public void buildFuelType();
	public Car getCar();
}
```

```java
Class: SedanCarBuilder

package builder.car;

public class SedanCarBuilder implements CarBuilder{

	private final Car car = new Car("SEDAN");

	@Override
	public void buildBodyStyle() {
		car.setBodyStyle("External dimensions: overall length (inches): 202.9, " +
"overall width (inches): 76.2, overall height (inches): 60.7, wheelbase (inches): 112.9," + " front track (inches): 65.3, rear track (inches): 65.5 and curb to curb turning circle (feet): 39.5");
	}

	@Override
	public void buildPower(){
		car.setPower("285 hp @ 6,500 rpm; 253 ft lb of torque @ 4,000 rpm");
	}

	@Override
	public void buildEngine() {
		car.setEngine("3.5L Duramax V 6 DOHC");
	}

	@Override
	public void buildBreaks() {
		car.setBreaks("Four-wheel disc brakes: two ventilated. Electronic brake distribution");
	}

	@Override
	public void buildSeats() {
		car.setSeats("Front seat center armrest.Rear seat center armrest.Split-folding rear seats");
	}

	@Override
	public void buildWindows() {
		car.setWindows("Laminated side windows.Fixed rear window with defroster");

	}

	@Override
	public void buildFuelType() {
		car.setFuelType("Gasoline 19 MPG city, 29 MPG highway, 23 MPG combined and 437 mi. range");

	}

	@Override
	public Car getCar(){
		return car;
	}

}
```

```java
Class: SportsCarBuilder

package builder.car;

public class SportsCarBuilder implements CarBuilder{

	private final Car car = new Car("SPORTS");

	@Override
	public void buildBodyStyle() {
		car.setBodyStyle("External dimensions: overall length (inches): 192.3," +
" overall width (inches): 75.5, overall height (inches): 54.2, wheelbase (inches): 12.3," + " front track (inches): 63.7, rear track (inches): 64.1 and curb to curb turning circle (feet): 37.7");
	}

	@Override
	public void buildPower(){
		car.setPower("323 hp @ 6,800 rpm; 278 ft lb of torque @ 4,800 rpm");
	}

	@Override
	public void buildEngine() {
		car.setEngine("3.6L V 6 DOHC and variable valve timing");
	}

	@Override
	public void buildBreaks() {
		car.setBreaks("Four-wheel disc brakes: two ventilated. Electronic brake distribution. StabiliTrak stability control");

	}

	@Override
	public void buildSeats() {
		car.setSeats("Driver sports front seat with one power adjustments manual height, front passenger seat sports front seat with one power adjustments");
	}

	@Override
	public void buildWindows() {
		car.setWindows("Front windows with one-touch on two windows");

	}

	@Override
	public void buildFuelType() {
		car.setFuelType("Gasoline 17 MPG city, 28 MPG highway, 20 MPG combined and 380 mi. range");
	}

	@Override
	public Car getCar(){
		return car;
	}

}
```

```java
Class: TestBuilderPattern

package builder.car;

public class TestBuilderPattern {

	public static void main(String[] args) {
		CarBuilder carBuilder = new SedanCarBuilder();
		CarDirector director = new CarDirector(carBuilder);
		director.build();
		Car car = carBuilder.getCar();
		System.out.println(car);

		carBuilder = new SportsCarBuilder();
		director = new CarDirector(carBuilder);
		director.build();
		car = carBuilder.getCar();
		System.out.println(car);
	}

}
```

```
Result:

--------------SEDAN---------------------
 Body: External dimensions: overall length (inches): 202.9, overall width (inches): 76.2, overall height (inches): 60.7, wheelbase (inches): 112.9, front track (inches): 65.3, rear track (inches): 65.5 and curb to curb turning circle (feet): 39.5
 Power: 285 hp @ 6,500 rpm; 253 ft lb of torque @ 4,000 rpm
 Engine: 3.5L Duramax V 6 DOHC
 Breaks: Four-wheel disc brakes: two ventilated. Electronic brake distribution
 Seats: Front seat center armrest.Rear seat center armrest.Split-folding rear seats
 Windows: Laminated side windows.Fixed rear window with defroster
 Fuel Type: Gasoline 19 MPG city, 29 MPG highway, 23 MPG combined and 437 mi. range
--------------SPORTS---------------------
 Body: External dimensions: overall length (inches): 192.3, overall width (inches): 75.5, overall height (inches): 54.2, wheelbase (inches): 112.3, front track (inches): 63.7, rear track (inches): 64.1 and curb to curb turning circle (feet): 37.7
 Power: 323 hp @ 6,800 rpm; 278 ft lb of torque @ 4,800 rpm
 Engine: 3.6L V 6 DOHC and variable valve timing
 Breaks: Four-wheel disc brakes: two ventilated. Electronic brake distribution. StabiliTrak stability control
 Seats: Driver sports front seat with one power adjustments manual height, front passenger seat sports front seat with one power adjustments
 Windows: Front windows with one-touch on two windows
 Fuel Type: Gasoline 17 MPG city, 28 MPG highway, 20 MPG combined and 380 mi. range
```
