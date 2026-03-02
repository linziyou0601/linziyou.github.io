---
title: "GoF 設計模式 Design Pattern"
published: 2021-01-20
category: "設計模式"
tags: ["Java", "物件導向"]
---

設計模式（design pattern）是對軟體設計中**普遍存在、或是會反覆出現的各種問題**所提出的解決方案，因此它提供了在各種不同的情況下，要如何解決問題的一種方案。在物件導向的設計模式中，通常會用類別、物件來描述其中的關係和相互作用，且使用設計模式能夠**讓模組間有穩定的依賴、也讓實體類別依賴於抽象類別，避免引起緊密耦合，以加強軟體設計之適應未來變化的能力**。

## 關於耦合（Coupling）與內聚（Cohesion）

耦合與內聚，分別代表模組之間的依賴程度、以及模組本身內部的相關程度。詳細可閱讀之前的文章：

- [物件導向程式 低耦合、高內聚 內聚編 Cohesion](/posts/2020-05-08-物件導向程式-低耦合、高內聚-內聚編-cohesion/)
- [物件導向程式 低耦合、高內聚 耦合編 Coupling](/posts/2020-05-07-物件導向程式-低耦合、高內聚-耦合編-coupling/)

設計模式依據Gang of Four（GoF）的定義，大致可分為生成型、結構型與行為型模式：

## 生成型模式（Creational Patterns）

生成型模式會牽涉到將物件實例化、它會提供一個方法，讓Client能夠從實例化物件的過程分離出來。

- [工廠方法 Factory Method](/posts/2020-09-30-工廠模式-factory-pattern/)
- [抽象工廠 Abstract Factory](/posts/2020-09-30-抽象工廠模式-abstract-factory-pattern/)
- [建構者 Builder](/posts/2020-11-02-建構者模式-builder-pattern/)
- [單例 Singleton](/posts/2020-11-10-單例模式-singleton-pattern/)
- [原型 Prototype](/posts/2020-12-22-原型模式-prototype-pattern/)

## 結構型模式（Structural Patterns）

結構型模式可以讓小物件合併成為大型物件。

- [合成 Composite](/posts/2020-09-28-合成模式-composite-pattern/)
- [裝飾者 Decorator](/posts/2020-09-29-裝飾者模式-decorator-pattern/)
- [橋接 Bridge](/posts/2020-10-06-橋接模式-bridge-pattern/)
- [享元 Flyweight](/posts/2020-11-03-享元模式-flyweight-pattern/)
- [代理人 Proxy](/posts/2020-11-23-代理人模式-proxy-pattern/)
- [轉接器 Adapter](/posts/2020-11-17-轉接器模式-adapter-pattern/)
- 表象 Facade

## 行為型模式（Behavioral Patterns）

行為型模式可以描述類別和物件如何互動，以及它們各自的責任。

- [策略 Strategy](/posts/2020-09-29-策略模式-strategy-pattern/)
- [命令 Command](/posts/2020-10-06-命令模式-command-pattern/)
- [疊代器 Iterator](/posts/2020-10-07-疊代器模式-iterator-pattern/)
- [狀態 State](/posts/2020-10-27-狀態模式-state-pattern/)
- [訪問者 Visitor](/posts/2020-10-13-訪問者模式-visitor-pattern/)
- [備忘錄 Memento](/posts/2020-11-02-備忘錄模式-memento-pattern/)
- [觀察者 Observer](/posts/2020-11-16-觀察者模式-observer-pattern/)
- [責任鏈 Chain of Responsibility](/posts/2020-11-17-責任鏈模式-chain-of-responsibility-pattern/)
- [樣板方法 Template Method](/posts/2020-12-01-樣板方法模式-template-method-pattern/)
- 解譯器 Interpreter
- 中介者 Mediator
