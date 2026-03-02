---
title: "迪米特法則 Low of Demeter (LoD)"
published: 2020-06-03
category: "物件導向"
tags: ["Java"]
---

## 定義

對於物件 Obj 的一個方法 fun() 而言， fun() 只能存取以下類型的物件：
- 自己或父類別的方法（to itself (Obj itself). You can play with yourself.）自己或父類屬性中的其他物件（to objects contained in attributes of itself or a superclass (Obj's direct component objects). You can play with your own toys.）方法可以使用參數傳進來的物件（to an object that is passed as a parameter to the method (fun’s parameters). You can play with toys that were given to you.）使用自己所創造出來的物件（to an object that is created by the method (Any objects created/instantiated within fun). And you can play with toys you've made yourself.）全域變數中的物件（to an object that is stored in a global variable.）

---

## 範例

```java
/* Class A */
public class A {
	private int a1;
	C c;
	F f;
	G g = new G();

	public A(C c) {               // LoD 1
		this.c = c;
	}
	public void useSelf() {       // LoD 1
		go();
	}
	public void go() {            // 沒有符合任何LoD，因為僅print且無使用object。
		System.out.println("A go");
	}
	public void setA1(int a1) {   // LoD 1
		this.a1 = a1;
	}
	public int getA1() {          // 沒有符合任何LoD，因為僅回傳而已。
		return this.a1;
	}
	public void setC(C c) {       // LoD 1
		this.c = c;
	}
	public C getC() {             // 沒有符合任何LoD，因為僅回傳而已。
		return c;
	}
	private void useC() {         // LoD 2
		System.out.println(c);
		c.go();
	}
	public void useE(E e) {       // LoD 3
		e.go();
	}
	public void useD() {          // LoD 4
		D d = new D();
		d.go();
	}
	public void useF() {          // LoD 4
		f = new F();
		f.go()
	}
	public void useG() {          // LoD 4
		g.go();
	}
}

/* Class B */
public class B extends A {
	public B(C c) {
		super(c);
	}
	public void useSuperclassAttributeC() {  // LoD 2
		c.go();
	}
	public void useSuperclassAttributeG() {  // LoD 2
		g.go();
	}
}

/* Class C */
public class C {
	public void go() {
		System.out.println("C go");
	}
}

/* Class D */
public class D {
	public void go() {
		System.out.println("D go");
	}
}

/* Class E */
public class E {
	public void go() {
		System.out.println("E go");
	}
}

/* Class F */
public class F {
	public void go() {
		System.out.println("F go");
	}
}

/* Class G */
public class G {
	public void go() {
		System.out.println("G go");
	}
}
```
