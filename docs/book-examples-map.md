# 책 예제 소스 지도

기준: 제공된 cd1 예제 아카이브, 『Java 언어로 배우는 디자인 패턴 입문 3판』, 유키 히로시. 원본은 보존하고 API용 코드를 별도 작성했습니다. 라이선스: [MIT 고지](third-party/design-patterns-MIT.txt).

| 장 | 기본 예제 파일 | 연습문제·해답 폴더 |
| --- | --- | --- |
| 1 Iterator | `Book.java`, `BookShelf.java`, `BookShelfIterator.java`, `Main.java` | A1 |
| 2 Adapter | `Sample1/Main.java`, `Sample1/Banner.java`, `Sample1/Print.java`, `Sample1/PrintBanner.java`, `Sample2/Main.java`, `Sample2/Banner.java`, `Sample2/Print.java`, `Sample2/PrintBanner.java` | A2, Q2, Sample1, Sample2 |
| 3 TemplateMethod | `AbstractDisplay.java`, `CharDisplay.java`, `Main.java`, `StringDisplay.java` | A4 |
| 4 FactoryMethod | `Main.java`, `framework/Factory.java`, `framework/Product.java`, `idcard/IDCard.java`, `idcard/IDCardFactory.java` | A2 |
| 5 Singleton | `Main.java`, `Singleton.java` | A1, A2a, A2b, A3a, A3b, Q1, Q3 |
| 6 Prototype | `Main.java`, `MessageBox.java`, `UnderlinePen.java`, `framework/Manager.java`, `framework/Product.java` | A1a, A1b, A2 |
| 7 Builder | `Builder.java`, `Director.java`, `HTMLBuilder.java`, `Main.java`, `TextBuilder.java` | A2, A3, A4 |
| 8 AbstractFactory | `Main.java`, `divfactory/DivFactory.java`, `divfactory/DivLink.java`, `divfactory/DivPage.java`, `divfactory/DivTray.java`, `factory/Factory.java`, `factory/Item.java`, `factory/Link.java`, `factory/Page.java`, `factory/Tray.java`, `listfactory/ListFactory.java`, `listfactory/ListLink.java`, `listfactory/ListPage.java`, `listfactory/ListTray.java` | A2 |
| 9 Bridge | `CountDisplay.java`, `Display.java`, `DisplayImpl.java`, `Main.java`, `StringDisplayImpl.java` | A1, A2, A3 |
| 10 Strategy | `Hand.java`, `Main.java`, `Player.java`, `ProbStrategy.java`, `Strategy.java`, `WinningStrategy.java` | A1, A4a, A4b, Q4 |
| 11 Composite | `Directory.java`, `Entry.java`, `File.java`, `Main.java` | A2 |
| 12 Decorator | `Border.java`, `Display.java`, `FullBorder.java`, `Main.java`, `SideBorder.java`, `StringDisplay.java` | A1, A2, Q1, Q2 |
| 13 Visitor | `Directory.java`, `Element.java`, `Entry.java`, `File.java`, `ListVisitor.java`, `Main.java`, `Visitor.java` | A1, A2, A3a, A3b, A3c, Q1, Q3 |
| 14 ChainOfResponsibility | `LimitSupport.java`, `Main.java`, `NoSupport.java`, `OddSupport.java`, `SpecialSupport.java`, `Support.java`, `Trouble.java` | A3 |
| 15 Facade | `Main.java`, `pagemaker/Database.java`, `pagemaker/HtmlWriter.java`, `pagemaker/PageMaker.java` | A2, A3, Q2, Q3 |
| 16 Mediator | `Colleague.java`, `ColleagueButton.java`, `ColleagueCheckbox.java`, `ColleagueTextField.java`, `LoginFrame.java`, `Main.java`, `Mediator.java` | A1 |
| 17 Observer | `DigitObserver.java`, `GraphObserver.java`, `Main.java`, `NumberGenerator.java`, `Observer.java`, `RandomNumberGenerator.java` | A1, A2, Q1 |
| 18 Memento | `Main.java`, `game/Gamer.java`, `game/Memento.java` | A4 |
| 19 State | `Context.java`, `DayState.java`, `Main.java`, `NightState.java`, `SafeFrame.java`, `State.java` | A1, A3, A4 |
| 20 Flyweight | `BigChar.java`, `BigCharFactory.java`, `BigString.java`, `Main.java` | A1, A2 |
| 21 Proxy | `Main.java`, `Printable.java`, `Printer.java`, `PrinterProxy.java` | A1 |
| 22 Command | `Main.java`, `command/Command.java`, `command/MacroCommand.java`, `drawer/DrawCanvas.java`, `drawer/DrawCommand.java`, `drawer/Drawable.java` | A1, A2, A3 |
| 23 Interpreter | `CommandListNode.java`, `CommandNode.java`, `Context.java`, `Main.java`, `Node.java`, `ParseException.java`, `PrimitiveCommandNode.java`, `ProgramNode.java`, `RepeatCommandNode.java` | A1 |

## API로 옮긴 범위

- 각 장 Sample의 협력 구조와 대표 Q/A 차이를 페이지에서 설명합니다. 모든 Q/A 코드를 실행 API로 옮긴 것은 아닙니다.
- 콘솔 출력은 응답의 steps·result로 수집합니다. GUI, 파일 생성, 긴 대기와 무한 루프는 요청별 데이터와 횟수 제한으로 바꿉니다.
- 원본 클래스명과 API 구현 위치를 구분합니다. 디버깅은 backend/src/main/java/com/lumos/lab/pattern/book/에서 진행합니다.

## 페이지·API 연결

| 장 | 페이지 | API 패턴 ID |
| --- | --- | --- |
| 1 · 반복자 · Iterator | `/patterns/iterator` | `iterator` |
| 2 · 어댑터 · Adapter | `/patterns/adapter` | `adapter` |
| 3 · 템플릿 메서드 · Template Method | `/patterns/template-method` | `template-method` |
| 4 · 팩토리 메서드 · Factory Method | `/patterns/factory` | `factory-method` |
| 5 · 싱글턴 · Singleton | `/patterns/singleton` | `singleton` |
| 6 · 프로토타입 · Prototype | `/patterns/prototype` | `prototype` |
| 7 · 빌더 · Builder | `/patterns/builder` | `builder` |
| 8 · 추상 팩토리 · Abstract Factory | `/patterns/abstract-factory` | `abstract-factory` |
| 9 · Bridge · 기능과 구현의 두 계층 | `/patterns/bridge` | `bridge` |
| 10 · Strategy · 가위바위보 전략 교체 | `/patterns/strategy` | `strategy` |
| 11 · Composite · 파일과 디렉터리의 동일한 취급 | `/patterns/composite` | `composite` |
| 12 · Decorator · 문자열에 테두리 겹치기 | `/patterns/decorator` | `decorator` |
| 13 · Visitor · 파일 구조 밖으로 연산 분리 | `/patterns/visitor` | `visitor` |
| 14 · Chain of Responsibility · 처리 책임 넘기기 | `/patterns/chain-of-responsibility` | `chain-of-responsibility` |
| 15 · Facade · 환영 페이지 제작의 단일 창구 | `/patterns/facade` | `facade` |
| 16 · Mediator · 로그인 UI의 활성화 규칙 | `/patterns/mediator` | `mediator` |
| 17 · Observer · 숫자 변화를 여러 표현에 알리기 | `/patterns/observer` | `observer` |
| 18 · Memento · 게임 상태 저장과 복구 | `/patterns/memento` | `memento` |
| 19 · State · 주간과 야간의 금고 동작 | `/patterns/state` | `state` |
| 20 · Flyweight · 문자 객체 공유 | `/patterns/flyweight` | `flyweight` |
| 21 · Proxy · 프린터의 지연 생성 | `/patterns/proxy` | `proxy` |
| 22 · Command · 그리기 명령의 이력과 실행 취소 | `/patterns/command` | `command` |
| 23 · Interpreter · 작은 언어의 파싱과 실행 | `/patterns/interpreter` | `interpreter` |
