---
title: "疊代器模式 Iterator Pattern"
published: 2020-10-07
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

**不用知道Aggregate Object的內部細節**，即**可依序存取**內含的每一個元素

## 適用

- 即使對Aggregate Object內部結構一無所知，仍可存取物件內容。以多種方式巡訪Aggregate Object。以一致介面巡訪各種不同的Aggregate Object時（多型巡訪）。

## 結構及成員

**Collaborations**: ConcreteIterator**記載已巡訪到聚合體的哪一個元素**，並可依序巡訪下一個。
![](/uploads/2021/08/iterator-participants.png)
- Iterator:宣告存取巡訪元素的介面。ConcreteIterator: like the ArrayIterator, ListIterator, PreorderIterator具體實作出Iterator。記載正在巡訪的現行元素位置。Aggregate:此介面宣告出建立Iterator物件之操作。ConcreteAggregate:具體實作出建立Iterator物件之介面，傳回適當的ConcreteIterator物件實體。

## 影響結果

### 好處

- 可提供多種巡訪方式，可以輕易改變巡訪演算法，也可以衍生新的Iterator子類別提供新的巡訪方式。Iterator可簡化Aggregate介面。Aggregate不必覆寫巡訪方法。針對同一聚合體，可以同時存在許多Iterator在其中，各Iterator物件會記載自己的巡訪狀態。

### 壞處

- Iterator和Aggregate之間有額外的通訊負擔。

## 實作

#### 誰來控制巡訪過程？

- 如果是由Client控制，這就是外部Iterator；由Iterator自己主導，就是內部Iterator。外部Iterator比內部Iterator更有彈性。

#### 誰來定義巡訪演算法？

- Aggregate Object也可能會定義，此時Iterator只是拿來記錄巡訪狀態而已。這種Iterator就是Cursor，Client以游標當參數呼叫Aggregate Object的Next()，而Next()會改變游標的操作。如果有Iterator負責巡訪演算法，就很容易用不同方式巡訪同一個Aggregate Object。但巡訪演算法可能需要存取Private Attribute，會破壞封裝。

#### Iterator有多穩健？

- 在巡訪Aggregate Object的同時還去改變Aggregate Object的內容會很危險。若有增刪元素，就可能會重複存取，也可能完全略過。可以透過先複製一份Aggregate Object再巡訪來解決，但會耗效能。穩健（Robust）的Iterator不必將Aggregate Object再複製一份，大部分都需要向Aggregate Object索取Iterator物件，一有增刪動作，Aggregate Object會主動調整Iterator的內部狀態，或者乾脆自己維謢必要資訊以確保巡訪時的正常運作。

#### 其他額外的Iterator操作

最小的操作會包含**First()**、**Next()**、**IsDone()**、**CurrentItem()**等，但也可能有**Previous()**、**SkipTo()**等。

## Example:

### GlyphStorage

```java
// Abstract Aggregate  （類似Java 的 abstract class List）
// 自己設計的Storage資料結構
public interface GlyphStorage {
    void add(int index, Glyph element);
    void add(Glyph element);
    void remove(int index);
    void remove(Glyph glyph);
    int size();
    Glyph get(int index);
    Iterator iterator();
}
```

```java
// Concrete Aggregate  （類似Java 的 LinkedList或ArrayList）
// 在此資料型態用array，但也可以是其他種
// 內部的method()是為了array而設計，可以不深入研究
public class ArrayGlyphStorage implements GlyphStorage{
    private Glyph[] glyphs = new Glyph[10];
    private int index = 0;

    @Override
    public void add(int index, Glyph element) {
        int i = index++;
        expandArray(glyphs.length+1);
        for(int pos = i+1; i = glyphs.length)
            throw new ArrayIndexOutOfBoundsException();
        return glyphs[index];
    }

    @Override
    public Iterator iterator() {
        return new ArrayGlyphIterator(this);
    }

    private void expandArray(int size) {
        if(size >= glyphs.length) {
            Glyph[] newGlyphs = new Glyph[size];
            System.arraycopy(glyphs, 0, newGlyphs, 0, glyphs.length);
            glyphs = newGlyphs;
        }
    }
}
```

```java
// Concrete Aggregate  （類似Java 的 LinkedList或ArrayList）
// 在此資料型態用arrayList，但也可以是其他種
// 內部的method()是為了arrayList而設計，直接拿內建arrayList來用
public class ListGlyphStorage implements GlyphStorage{
    private ArrayList glyphs = new ArrayList<>();
    private int index = 0;

    @Override
    public void add(int index, Glyph element) {
        glyphs.add(index, element);
    }

    @Override
    public void add(Glyph element) {
        glyphs.add(element);
    }

    @Override
    public void remove(int index) {
        glyphs.remove(index);
    }

    @Override
    public void remove(Glyph glyph) {
        glyphs.remove(glyph);
    }

    @Override
    public int size() {
        return glyphs.size();
    }

    @Override
    public Glyph get(int index) {
        return glyphs.get(index);
    }

    @Override
    public Iterator iterator() {
        return new ListGlyphIterator(this);
    }
}
```

```java
// Concrete Iterator 繼承 Java內建的 Iterator
// 專屬於 ArrayGlyphStorage的Iterator
// 像 ArrayList和ArrayListIterator的關係
public class ArrayGlyphIterator implements Iterator {
    int position = 0;
    ArrayGlyphStorage arrayGlyphStorage;
    public ArrayGlyphIterator(ArrayGlyphStorage arrayGlyphStorage){
        this.arrayGlyphStorage = arrayGlyphStorage;
    }

    @Override
    public boolean hasNext() {
        if(position >= arrayGlyphStorage.size() || arrayGlyphStorage.get(position) == null)
            return false;
        return true;
    }

    @Override
    public Glyph next() {
        return arrayGlyphStorage.get(position++);
    }

    @Override
    public void remove() {
        arrayGlyphStorage.remove(position-1);
        position -= 1;
    }
}
```

```java
// Concrete Iterator 繼承 Java內建的 Iterator
// 專屬於 ListGlyphStorage的Iterator
// 像 LinkedList和LinkedListIterator的關係
public class ListGlyphIterator implements Iterator {
    int position = 0;
    ListGlyphStorage listGlyphStorage;
    public ListGlyphIterator(ListGlyphStorage listGlyphStorage){
        this.listGlyphStorage = listGlyphStorage;
    }

    @Override
    public boolean hasNext() {
        if(position >= listGlyphStorage.size() || listGlyphStorage.get(position) == null)
            return false;
        return true;
    }

    @Override
    public Glyph next() {
        return listGlyphStorage.get(position++);
    }

    @Override
    public void remove() {
        listGlyphStorage.remove(position-1);
        position -= 1;
    }
}
```

```java
// 用例
public class MyGlyphIteratorPattern {

	public static void main(String[] args) {
		GlyphStorage storage = new ArrayGlyphStorage();
 		storage.add(new Row());
		storage.add(new Text());
		storage.add(new Image());

		Iterator iterator = storage.iterator();   //仿JAVA內建Iterator的用法
		while(iterator.hasNext()){
			System.out.println(iterator.next().detail());
		}
	}
}
```

```
Result:

This is row glyph
This is text glyph
This is image glyph
```

### Shape

```java
//Class: Shape

package iterator.shape;

public class Shape {

	private int id;
	private String name;

	public Shape(int id, String name){
		this.id = id;
		this.name = name;
	}

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString(){
		return "ID: "+id+" Shape: "+name;
	}

}
```

```java
//Class: ShapeStorage

package iterator.shape;

public class ShapeStorage {

	private Shape[] shapes = new Shape[5];
	private int index;

	public void addShape(String name){
		int i = index++;
		shapes[i] = new Shape(i,name);
	}

	public Shape[] getShapes(){
		return shapes;
	}
}
```

```java
//Class: ShapeIterator

package iterator.shape;

import java.util.Iterator;

public class ShapeIterator implements Iterator{

	private Shape [] shapes;
	int pos;

	public ShapeIterator(Shape[] shapes){
		this.shapes = shapes;
	}
	@Override
	public boolean hasNext() {
		if(pos >= shapes.length || shapes[pos] == null)
			return false;
		return true;
	}

	@Override
	public Shape next() {
		return shapes[pos++];
	}

	@Override
	public void remove() {
		if(pos <=0 )
			throw new IllegalStateException("Illegal position");
		if(shapes[pos-1] !=null){
			for (int i= pos-1; i<(shapes.length-1);i++){
				shapes[i] = shapes[i+1];
			}
			shapes[shapes.length-1] = null;
		}
	}
}
```

```java
//Class: TestIteratorPattern

package iterator.shape;

public class TestIteratorPattern {

	public static void main(String[] args) {
		ShapeStorage storage = new ShapeStorage();
 		storage.addShape("Polygon");
		storage.addShape("Hexagon");
		storage.addShape("Circle");
		storage.addShape("Rectangle");
		storage.addShape("Square");

		ShapeIterator iterator = new ShapeIterator(storage.getShapes());
		while(iterator.hasNext()){
			System.out.println(iterator.next());
		}
		System.out.println("Apply removing while iterating...");
		iterator = new ShapeIterator(storage.getShapes());
		while(iterator.hasNext()){
			System.out.println(iterator.next());
			iterator.remove();
		}
	}

}
```

```
Result:

ID: 0 Shape: Polygon
ID: 1 Shape: Hexagon
ID: 2 Shape: Circle
ID: 3 Shape: Rectangle
ID: 4 Shape: Square
Apply removing while iterating...
ID: 0 Shape: Polygon
ID: 2 Shape: Circle
ID: 4 Shape: Square
```
