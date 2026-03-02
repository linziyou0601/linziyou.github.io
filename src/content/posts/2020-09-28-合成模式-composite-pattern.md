---
title: "合成模式 Composite Pattern"
published: 2020-09-28
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

讓外界以**一致的方式**處理個別物件和整體物件（多個遞迴組合的物件）。

## 適用

- 物件必須是遞迴組合（部分-全體關係）個別物件和複合物件之間沒有差異或無需考慮其差異能以一致的方式處理複合結構裡的物件

## 結構及成員

 **Collaborations**: Client透過Component類別介面，與複合結構裡的Object互動。**如果對象是個Leaf，就直接處理**，**如果是Composite，就會將訊息傳遞給子節點去處理**，在傳遞之前或之後也可能會做些額外的事情。 
![](/uploads/2021/08/composite-participants.png)
- Component: like the Glyph宣告複合體內含物件之介面。替所有類別所共有的操作實作出合適的預設行為。宣告存取及管理子節點的介面。（可有可無）宣告存取父節點的介面；如果適當，也一併實作之。Leaf: like the Character, Rectangle, etc.複合結構之終端物件（不會有子節點）。定義基本物件的行為。Composite: like the Row, Column定義含子結構的節點之行為。儲存子節點。實作出Componet之中與子結構有關的介面。

## 影響結果

### 好處

- 定義包含基本物件（primitive object）和複合物件（composite object）的類別階層。基本物件可拼出更複雜的物件，不斷遞迴。任何能夠處理基本物件的Client也都能處理複合物件。Client能以一致性的角度處理複合結構和個別物件，不用知道所面對的是Leaf還是Composite。容易增加新的Component類型。不必修改Client程式。

### 壞處

- 可能會讓設計過於一般化。難以對Composite能包含的Component類型設限。可能會需要防止（prohibitive）物件數量過多。

## 實作

#### 設置父節點的Reference

**較易上溯結構、刪除節點**，也利於製作Chain of Responsibility Pattern。

#### 共用Component 

如果一個組件可以有好幾個父節點，**將父節點記錄在子節點中**。

#### 極大化Component介面 

Component類別**應盡可能涵蓋Composite和Leaf可能會有的操作**。**若遇到Leaf不會有的操作**（如：存取子節點），可以將其改為不會傳回任何子節點（或是**Exception**）。

#### 宣告管理子節點的操作（如：add()和remove()）

安全性（Safety）和通透性（Transparency）的取捨：
- 若定義在Component：通透性較好，安全性較差。無法避免別人寫出「可增、刪Leaf子節點」的程式。若定義在Composite：安全性較好，但通透性較差。因為Leaf和Composite的介面不同。

做法差異、顧及安全性的改寫方法：
![](/uploads/2021/08/composite-transparency.png)

 在此模式中，較強調通透性。因為如果型別資訊遺失**，就必須手動將Component轉型成Composite。** 

#### 該把「一群Component」的功能做進Component類別裡面嗎？（Component裡的Component物件存放的變數）

如果在Component裡宣告子節點的Component的變數，則Leaf也會背負這些空間。**唯有整個結構中只有少數幾個子節點時才值得這麼做**。

#### 子節點之間的相對順序

若有必要維持子節點的相對順序，就須**設計存取管理子節點的介面，可以使用Iterator Pattern**。

#### 以快取機制增進效率

若常常需要巡訪或搜尋composite object，可以使用快取處理（如快取Picture所佔的長方形區域）。但需要連帶做「向父節點申報作廢快取資訊」的介面。

#### 誰該負責刪除Component？

若程式語言沒有垃圾回收機制（Garbage Collection），**應讓Composite負責刪除動作。但共用的Leaf不能刪除**。

#### 儲存Component的最佳資料結構為何？

Linked List、Tree、Array、Hash Table等等都行，但有時一個變數對一個子節點就夠用。

## Example: Menu

```java
//Class: MenuComponent

package composite.menu;

import java.util.*;

public abstract class MenuComponent {

	public void add(MenuComponent menuComponent) {
		throw new UnsupportedOperationException();
	}
	public void remove(MenuComponent menuComponent) {
		throw new UnsupportedOperationException();
	}
	public MenuComponent getChild(int i) {
		throw new UnsupportedOperationException();
	}

	public String getName() {
		throw new UnsupportedOperationException();
	}
	public String getDescription() {
		throw new UnsupportedOperationException();
	}
	public double getPrice() {
		throw new UnsupportedOperationException();
	}
	public boolean isVegetarian() {
		throw new UnsupportedOperationException();
	}

	public void print() {
		throw new UnsupportedOperationException();
	}
}
```

```java
//Class: Menu

package composite.menu;

import java.util.Iterator;
import java.util.ArrayList;

public class Menu extends MenuComponent {
	ArrayList menuComponents = new ArrayList();
	String name;
	String description;

	public Menu(String name, String description) {
		this.name = name;
		this.description = description;
	}

	public void add(MenuComponent menuComponent) {
		menuComponents.add(menuComponent);
	}

	public void remove(MenuComponent menuComponent) {
		menuComponents.remove(menuComponent);
	}

	public MenuComponent getChild(int i) {
		return (MenuComponent)menuComponents.get(i);
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public void print() {
		System.out.print("\n" + getName());
		System.out.println(", " + getDescription());
		System.out.println("---------------------");

		Iterator iterator = menuComponents.iterator();
		while (iterator.hasNext()) {
			MenuComponent menuComponent = (MenuComponent)iterator.next();
			menuComponent.print();
		}
	}
}
```

```java
//Class: MenuItem

package composite.menu;

import java.util.Iterator;
import java.util.ArrayList;

public class MenuItem extends MenuComponent {
	String name;
	String description;
	boolean vegetarian;
	double price;

	public MenuItem(String name,
	                String description,
	                boolean vegetarian,
	                double price)
	{
		this.name = name;
		this.description = description;
		this.vegetarian = vegetarian;
		this.price = price;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public double getPrice() {
		return price;
	}

	public boolean isVegetarian() {
		return vegetarian;
	}

	public void print() {
		System.out.print("  " + getName());
		if (isVegetarian()) {
			System.out.print("(v)");
		}
		System.out.println(", " + getPrice());
		System.out.println("     -- " + getDescription());
	}
}
```

```java
//Class: Waitress

package composite.menu;

import java.util.Iterator;

public class Waitress {
	MenuComponent allMenus;

	public Waitress(MenuComponent allMenus) {
		this.allMenus = allMenus;
	}

	public void printMenu() {
		allMenus.print();
	}
}
```

```java
//Class: MenuTestDrive

package composite.menu;

import java.util.*;

public class MenuTestDrive {
	public static void main(String args[]) {
		MenuComponent pancakeHouseMenu =
			new Menu("PANCAKE HOUSE MENU", "Breakfast");
		MenuComponent dinerMenu =
			new Menu("DINER MENU", "Lunch");
		MenuComponent cafeMenu =
			new Menu("CAFE MENU", "Dinner");
		MenuComponent dessertMenu =
			new Menu("DESSERT MENU", "Dessert of course!");
		MenuComponent coffeeMenu =
			new Menu("COFFEE MENU", "Stuff to go with your afternoon coffee");

		MenuComponent allMenus = new Menu("ALL MENUS", "All menus combined");

		allMenus.add(pancakeHouseMenu);
		allMenus.add(dinerMenu);
		allMenus.add(cafeMenu);

		pancakeHouseMenu.add(new MenuItem(
			"K&B's Pancake Breakfast",
			"Pancakes with scrambled eggs, and toast",
			true,
			2.99));
		pancakeHouseMenu.add(new MenuItem(
			"Regular Pancake Breakfast",
			"Pancakes with fried eggs, sausage",
			false,
			2.99));
		pancakeHouseMenu.add(new MenuItem(
			"Blueberry Pancakes",
			"Pancakes made with fresh blueberries, and blueberry syrup",
			true,
			3.49));
		pancakeHouseMenu.add(new MenuItem(
			"Waffles",
			"Waffles, with your choice of blueberries or strawberries",
			true,
			3.59));

		dinerMenu.add(new MenuItem(
			"Vegetarian BLT",
			"(Fakin') Bacon with lettuce & tomato on whole wheat",
			true,
			2.99));
		dinerMenu.add(new MenuItem(
			"BLT",
			"Bacon with lettuce & tomato on whole wheat",
			false,
			2.99));
		dinerMenu.add(new MenuItem(
			"Soup of the day",
			"A bowl of the soup of the day, with a side of potato salad",
			false,
			3.29));
		dinerMenu.add(new MenuItem(
			"Hotdog",
			"A hot dog, with saurkraut, relish, onions, topped with cheese",
			false,
			3.05));
		dinerMenu.add(new MenuItem(
			"Steamed Veggies and Brown Rice",
			"Steamed vegetables over brown rice",
			true,
			3.99));

		dinerMenu.add(new MenuItem(
			"Pasta",
			"Spaghetti with Marinara Sauce, and a slice of sourdough bread",
			true,
			3.89));

		dinerMenu.add(dessertMenu);

		dessertMenu.add(new MenuItem(
			"Apple Pie",
			"Apple pie with a flakey crust, topped with vanilla icecream",
			true,
			1.59));

		dessertMenu.add(new MenuItem(
			"Cheesecake",
			"Creamy New York cheesecake, with a chocolate graham crust",
			true,
			1.99));
		dessertMenu.add(new MenuItem(
			"Sorbet",
			"A scoop of raspberry and a scoop of lime",
			true,
			1.89));

		cafeMenu.add(new MenuItem(
			"Veggie Burger and Air Fries",
			"Veggie burger on a whole wheat bun, lettuce, tomato, and fries",
			true,
			3.99));
		cafeMenu.add(new MenuItem(
			"Soup of the day",
			"A cup of the soup of the day, with a side salad",
			false,
			3.69));
		cafeMenu.add(new MenuItem(
			"Burrito",
			"A large burrito, with whole pinto beans, salsa, guacamole",
			true,
			4.29));

		cafeMenu.add(coffeeMenu);

		coffeeMenu.add(new MenuItem(
			"Coffee Cake",
			"Crumbly cake topped with cinnamon and walnuts",
			true,
			1.59));
		coffeeMenu.add(new MenuItem(
			"Bagel",
			"Flavors include sesame, poppyseed, cinnamon raisin, pumpkin",
			false,
			0.69));
		coffeeMenu.add(new MenuItem(
			"Biscotti",
			"Three almond or hazelnut biscotti cookies",
			true,
			0.89));

		Waitress waitress = new Waitress(allMenus);

		waitress.printMenu();
	}
}
```

```
Result:

ALL MENUS, All menus combined
---------------------

PANCAKE HOUSE MENU, Breakfast
---------------------
  K&B's Pancake Breakfast(v), 2.99
     -- Pancakes with scrambled eggs, and toast
  Regular Pancake Breakfast, 2.99
     -- Pancakes with fried eggs, sausage
  Blueberry Pancakes(v), 3.49
     -- Pancakes made with fresh blueberries, and blueberry syrup
  Waffles(v), 3.59
     -- Waffles, with your choice of blueberries or strawberries

DINER MENU, Lunch
---------------------
  Vegetarian BLT(v), 2.99
     -- (Fakin') Bacon with lettuce & tomato on whole wheat
  BLT, 2.99
     -- Bacon with lettuce & tomato on whole wheat
  Soup of the day, 3.29
     -- A bowl of the soup of the day, with a side of potato salad
  Hotdog, 3.05
     -- A hot dog, with saurkraut, relish, onions, topped with cheese
  Steamed Veggies and Brown Rice(v), 3.99
     -- Steamed vegetables over brown rice
  Pasta(v), 3.89
     -- Spaghetti with Marinara Sauce, and a slice of sourdough bread

DESSERT MENU, Dessert of course!
---------------------
  Apple Pie(v), 1.59
     -- Apple pie with a flakey crust, topped with vanilla icecream
  Cheesecake(v), 1.99
     -- Creamy New York cheesecake, with a chocolate graham crust
  Sorbet(v), 1.89
     -- A scoop of raspberry and a scoop of lime

CAFE MENU, Dinner
---------------------
  Veggie Burger and Air Fries(v), 3.99
     -- Veggie burger on a whole wheat bun, lettuce, tomato, and fries
  Soup of the day, 3.69
     -- A cup of the soup of the day, with a side salad
  Burrito(v), 4.29
     -- A large burrito, with whole pinto beans, salsa, guacamole

COFFEE MENU, Stuff to go with your afternoon coffee
---------------------
  Coffee Cake(v), 1.59
     -- Crumbly cake topped with cinnamon and walnuts
  Bagel, 0.69
     -- Flavors include sesame, poppyseed, cinnamon raisin, pumpkin
  Biscotti(v), 0.89
     -- Three almond or hazelnut biscotti cookies
```
