---
title: "抽象工廠模式 Abstract Factory Pattern"
published: 2020-09-30
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

以**同一個介面建立一整族相關的物件**，不需點明各物件真正所屬的實體類別。

## 適用

- 使用者無法預測要實例化的Class時。系統必須與最終Product的生成、組合、表達方式保持獨立。能讓各陣營的Product和系統互相搭配時使用，並且需要強制約束這件事。一整族相關物件由相同Factory生成，確保不會搭配錯誤。你把類別函式庫貢獻出來，但只想公開介面，不想公開實作細節。

## 結構及成員

**Collaborations**: 在執行期，**ConcreteFactory只有單獨一個，如果想生成其他陣營的，就要換另一種ConcreteFactory**。AbstractFactory**將製造Product的責任交付給子類別ConcreteFactory**處理。
![](/uploads/2021/08/af-participants.png)
- AbstractFactory: like the GUIFactory, WidgetFactory此Interface宣告出可生成各抽象成品物件的方法。ConcreteFactory: like the MotifFactory, PMWWidgetFactory.實作出可產生實體Product物件的方法。AbstractProduct: like the ScrollBar, AbstractProductA宣告某成品物件類型之介面。ConcreteProduct: like the MotifScrollBar, PMScrollBarConcreteFactory 所建構的成品物件。AbstractProduct 介面的實體實作。Client只觸及AbstractFactory和AbstractProduct兩抽象類別所訂之介面。

## 影響結果

### 好處

- 將實體類別隔離開來，Product類別都被ConcreteFactory藏了起來，Client無從得知。易於將整族成品物件抽換掉，因為AbstractFactory可生成一整族成品物件，所以只要換成其他Factory，就能一舉將成品物件組態整個換掉。增進成品物件的一致性。

### 壞處

- 難以提供新的成品物件種類，讓AbstractFactory產生新的Product類型，不是容易的事，得修改AbstractFatory類別及所有子類別。

## 實作

#### 將Factory做成Singleton

正常情況下，**應用程式只需對一族（陣營）的Product配一個ConcreteFactory**，因此最好做成Singleton Pattern。

#### 產生成品物件

- AbstractFactory只含製造Product的介面而已，實作是由各ConcreteFactory子類別負責。常見做法是一種Product定義一種Method，然後ConcreteFactory可以Override各自的Method。如果會有好幾族成品物件同時並存，可以採用Prototype Pattern來製作ConcreteFactory。（先將各族系各成品弄一個Prototype物件給ConcreteFactory，以複製Prototype的方式製作新成品）

#### 定義可延伸的Factory

AbstractFactory通常會替每種可能產生的物件定義方法，若想增加新Product類型，就得修改有牽連的類別，因此**可使用Make搭配參數來決定該建造哪種Product**。

## Example: Parser

```java
//Abstra: AbstractParserFactory

public interface AbstractParserFactory {

	public XMLParser getParserInstance(String parserType);
}
```

```java
//Class: Interface XMLParser

public interface XMLParser {

	public String parse();

}
```

```java
//Class: ParserFactoryProducer

public final class ParserFactoryProducer {

	private ParserFactoryProducer(){
		throw new AssertionError();
	}

	public static AbstractParserFactory getFactory(String factoryType){

		switch(factoryType)
		{
			case "NYFactory": return new NYParserFactory();
			case "TWFactory": return new TWParserFactory();
		}

		return null;
	}

}
```

```java
//Class: NYParserFactory

public class NYParserFactory implements AbstractParserFactory {

	@Override
	public XMLParser getParserInstance(String parserType) {

		switch(parserType){
			case "NYERROR": return new NYErrorXMLParser();
			case "NYFEEDBACK": return new NYFeedbackXMLParser();
			case "NYORDER": return new NYOrderXMLParser();
			case "NYRESPONSE": return new NYResponseXMLParser();
		}

		return null;
	}

}
```

```java
//Class: NYErrorXMLParser

public class NYErrorXMLParser implements XMLParser{

	@Override
	public String parse() {
		System.out.println("NY Parsing error XML...");
		return "NY Error XML Message";
	}

}
```

```java
//Class: NYFeedbackXMLParser

public class NYFeedbackXMLParser implements XMLParser{

	@Override
	public String parse() {
		System.out.println("NY Parsing feedback XML...");
		return "NY Feedback XML Message";
	}

}
```

```java
//Class: NYOrderXMLParser

public class NYOrderXMLParser implements XMLParser{

	@Override
	public String parse() {
		System.out.println("NY Parsing order XML...");
		return "NY Order XML Message";
	}

}
```

```java
//Class: NYResponseParser

public class NYResponseXMLParser implements XMLParser{

	@Override
	public String parse() {
		System.out.println("NY Parsing response XML...");
		return "NY Response XML Message";
	}

}
```

```java
//Class: TWParserFactory

public class TWParserFactory implements AbstractParserFactory {

	@Override
	public XMLParser getParserInstance(String parserType) {

		switch(parserType){
			case "TWERROR": return new TWErrorXMLParser();
			case "TWFEEDBACK": return new TWFeedbackXMLParser();
			case "TWORDER": return new TWOrderXMLParser();
			case "TWRESPONSE": return new TWResponseXMLParser();
		}

		return null;
	}

}
```

```java
//Class: TWErrorXMLParser

public class TWErrorXMLParser implements XMLParser{

	@Override
	public String parse() {
		System.out.println("TW Parsing error XML...");
		return "TW Error XML Message";
	}

}
```

```java
//Class: TWFeedbackXMLParser

public class TWFeedbackXMLParser implements XMLParser{

	@Override
	public String parse() {
		System.out.println("TW Parsing feedback XML...");
		return "TW Feedback XML Message";
	}

}
```

```java
//Class: TWOrderXMLParser

public class TWOrderXMLParser implements XMLParser{

	@Override
	public String parse() {
		System.out.println("TW Parsing order XML...");
		return "TW Order XML Message";
	}

}
```

```java
//Class: TWResponseXMLParser

public class TWResponseXMLParser implements XMLParser{

	@Override
	public String parse() {
		System.out.println("TW Parsing response XML...");
		return "TW Response XML Message";
	}

}
```

```java
//Class: TestAbstractFactoryPattern

public class TestAbstractFactoryPattern {

	public static void main(String[] args) {

		AbstractParserFactory parserFactory = ParserFactoryProducer.getFactory("NYFactory");
		XMLParser parser = parserFactory.getParserInstance("NYORDER");
		String msg="";
		msg = parser.parse();
		System.out.println(msg);

		System.out.println("************************************");

		parserFactory = ParserFactoryProducer.getFactory("TWFactory");
		parser = parserFactory.getParserInstance("TWFEEDBACK");
		msg = parser.parse();
		System.out.println(msg);
	}

}
```

```
Result:

NY Parsing order XML...
NY Order XML Message
************************************
TW Parsing feedback XML...
TW Feedback XML Message
```
