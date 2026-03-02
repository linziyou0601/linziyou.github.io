---
title: "工廠方法模式 Factory Method Pattern"
published: 2020-09-30
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

定義可生成物件的介面，但**讓子類別決定該實體化哪種**類別的物件。讓類別**把實體化的程序推遲給子類別去實作**。

## 適用

- 當類別無法明指想要生成的物件類別時。當類別希望子類別去指定想要生成的物件類型時。將類別將權力下放一個或多個子類別，你又希望將「交付給哪些子類別」的知識集中在一個地方時。

## 結構及成員

**Collaborations**: Creator的子類別必須**定義Factory Method實體，以回傳適當的Concrete Product物件**。
![](/uploads/2021/08/factory-participants.png)
- Product: like the Document定義Factory Method所造物件的介面。ConcreteProduct: like the MyDocument.具體實作出Product介面。AbstractProduct: like the ScrollBar, AbstractProductA宣告某成品物件類型之介面。Creator: like the Application宣告Factory Method，它會回傳Product類型的物件（ConcreteProduct）。ConcreteCreator: like the MyApplicationOverride Factory Method以傳回ConcreteProduct的物件個體。

## 影響結果

### 好處

- 替子類別預留掛鉤（Provides hooks for subclasses），以Factory Method的類別產生物件比直接產生物件更有彈性，只要Override他的方法，就能生成特殊的物件。連接平行地位的類別階層（Connects parallel class hierarchies）。一般來說，Factory Method只會被Creator引用，但不一定非得如此，也可以用在平行地位類別階層的關係。如下圖所示，Figure和Manipulator會平行地各自發展。每個Figure類別預留相對應的Factory Method CreateManipulator()，讓Client能建立與Figure相對應的Manipulator。Figure也可以將自己的CreateManipulator()寫成回傳一個預設的Manipulator物件實體。可以理解為：ConcreteCreator 跟 ConcreteProduct 會成對的增加。
![](/uploads/2021/08/factory-parallel-class-hierarchies.png)

平行地位類別階層**通常會發生在「類別將某些權責委託給其他類別處理」的情況**，如繪圖程式中，特定操弄圖形的動作，**如：伸長直線要移動某個端點；伸長圖形可以移動好幾個點；伸長文字方塊要調整行距……**因此，需要被Create的Manipulator [註：Manipulator地位同Product] 也會不一樣（以操作為例，在繪圖程式中，**不同的繪圖物件要有不同的Manipulator物件處理不同的行為**）。

但儘管如此，**一個Factory（Figure）仍只能製造一種Product（Minupulator）**，因此如果要讓一個Factory可以製造多個Product，或多個同Style的Product，詳見 Abstract Factory Pattern。

### 壞處

- 潛在的缺點，客戶碼必須自Creator類別衍生出子類別，才能造出特定的ConcreteProduct物件。

## 實作

#### 兩種主要形式

- Creator是Abstract Class，Factory Method只是空殼。Creator是Concrete Class，Factory Method有預設行為。

#### 參數化Factory Method

可**傳入參數**指明要產生什麼Product。

#### 命名慣例

好的命名慣例會讓Factory Method更一目瞭然。

## Example: DBConnection Factory

```java
//Interface: DBConnection

package db.connection;

public interface DBConnection {
	void getConnection();

}
```

```java
//Class: MySQLDBConnection

package db.connection;

public class MySQLDBConnection implements DBConnection {
	public void getConnection(){
		System.out.println("MySQL DB is connected");
	}

}
```

```java
//Class: JavaDBConnection

package db.connection;

public class JavaDBConnection implements DBConnection{
	public void getConnection(){
		System.out.println("Java DB is connected");
	}

}
```

```java
//Class: OracleDBConnection

package db.connection;

public class OracleDBConnection implements DBConnection{
	public void getConnection(){
		System.out.println("Oracle DB is connected");
	}

}
```

```java
//Interface: DBConnectionFactory

package db.connection;

public interface DBConnectionFactory {
	DBConnection createConnection();

}
```

```java
//Interface: MyDBConnectionFactory

package db.connection;

public class MyDBConnectionFactory implements DBConnectionFactory{
	private String type;
	public MyDBConnectionFactory(String type){
		this.type=type;
	}

	public DBConnection createConnection(){
		if (type.equalsIgnoreCase("Oracle")){
			return new OracleDBConnection();
		} else if (type.equalsIgnoreCase("MySQL")){
			return new MySQLDBConnection();
			} else if (type.equalsIgnoreCase("JavaDB")){
				return new JavaDBConnection();
			} else {
				//default product
				return new OracleDBConnection();

			}
		}
	}
}
```

```java
//Class: Main

package db.connection;

public class Main {

	public static void main(String[] args) {
		MyDBConnectionFactory factory = new MyDBConnectionFactory("JavaDB");
		factory.createConnection().getConnection();

		factory = new MyDBConnectionFactory("MySQL");
		factory.createConnection().getConnection();

		factory = new MyDBConnectionFactory("Oracle");
		factory.createConnection().getConnection();

	}

}
```

```
Result:

Java DB is connected
MySQL DB is connected
Oracle DB is connected
```
