// 각 문자열은 독립적으로 컴파일하는 Java 21 학습 예제입니다.
export const solidExamples = {
  S: `import java.util.ArrayList;
import java.util.List;

interface UserRepository {
    void save(String name);
}

class MemoryUserRepository implements UserRepository {
    private final List<String> names = new ArrayList<>();

    public void save(String name) {
        names.add(name);
    }

    public int count() { return names.size(); }
}

class UserService {
    private final UserRepository users;

    UserService(UserRepository users) {
        this.users = users;
    }

    public void register(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("이름 필수");
        }
        users.save(name);
    }
}`,
  O: `interface Area {
    double area();
}

record Circle(double radius) implements Area {
    Circle {
        if (!Double.isFinite(radius) || radius < 0) {
            throw new IllegalArgumentException("반지름 오류");
        }
    }

    public double area() {
        return Math.PI * radius * radius;
    }
}

record Rectangle(double width, double height) implements Area {
    Rectangle {
        if (!Double.isFinite(width) || width < 0
                || !Double.isFinite(height) || height < 0) {
            throw new IllegalArgumentException("길이 오류");
        }
    }

    public double area() { return width * height; }
}

class AreaCalculator {
    public double measure(Area shape) {
        return shape.area();
    }
}`,
  L: `interface FlyingBird {
    String fly();
}

class Sparrow implements FlyingBird {
    public String fly() { return "비행 중"; }
}

class Ostrich {
    public String run() { return "달리는 중"; }
}

class Flight {
    public String launch(FlyingBird bird) {
        return bird.fly();
    }
}
// new Flight().launch(new Sparrow())는 가능
// Ostrich는 FlyingBird로 전달할 수 없음`,
  I: `interface Printer {
    String print();
}

interface ScannerDevice {
    String scan();
}

class SimplePrinter implements Printer {
    public String print() { return "인쇄 완료"; }
}

class CopyMachine implements Printer, ScannerDevice {
    public String print() { return "인쇄 완료"; }
    public String scan() { return "스캔 완료"; }
}`,
  D: `import java.math.BigDecimal;

interface Payment {
    String pay(BigDecimal amount);
}

// 학습용 구현: 실제 카드사에 요청하지 않습니다.
class CardPayment implements Payment {
    public String pay(BigDecimal amount) {
        return "결제 모형: " + amount.toPlainString();
    }
}

class OrderService {
    private final Payment payment;

    OrderService(Payment payment) {
        this.payment = payment;
    }

    public String checkout(BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException("금액 오류");
        }
        return payment.pay(amount);
    }
}`,
};
