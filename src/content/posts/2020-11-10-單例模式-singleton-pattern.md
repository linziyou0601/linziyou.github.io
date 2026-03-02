---
title: "單例模式 Singleton Pattern"
published: 2020-11-10
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

只有一個實例，而且自行實例化並向整個系統提供這個實例。

Ensure a class only has one instance, and provide a global point of access to it.

## 適用

當整個系統只需要、或必須只允許只有一個該類別物件存在時使用。

## 結構及成員

**Collaborations**: 該類別本身。
![](/uploads/2021/08/singleton-participants.jpg)
- Singleton:宣告外部存取該物件的介面。宣告私有的建構子，讓它不能被外界存取。

## 影響結果

### 好處

- 對唯一存在的實例化物件能夠受限制的存取。減少應用程式的命名空間。可以透過子類別擴展。實例化物件的數量可以改變。有靈活性的操作。

## 實作

#### 方法

- 依情況，可以實作為積極單例（Eaget）、懶散單例（Lazy）、或懶散雙重鎖單例（Double Lazy）等等。

## Example:

### Eager Singleton

```java
public class EagerSingleton {
	private static EagerSingleton instance = new EagerSingleton();
	private EagerSingleton() {}
	public static EagerSingleton getInstance() {
		return instance;
	}
}
```

### Lazy Singleton

```java
public class LazySingleton {
	private static LazySingleton instance;
	private LazySingleton() {}
	public static LazySingleton getInstance() {
		if (instance == null) instance = new LazySingleton();
		return instance;
	}
}
```

### Lazy Double Singleton

```java
public class LazyDoubleSingleton {
	private static LazyDoubleSingleton instance;
	private LazyDoubleSingleton() {}
	public static LazyDoubleSingleton getInstance() {
		if (instance == null) {
			synchronized(LazyDoubleSingleton.class) {
				if (instance == null) instance = new LazyDoubleSingleton();
			}
		}
		return instance;
	}
}
```
