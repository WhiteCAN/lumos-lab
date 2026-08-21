package com.study.lab.pattern.factory;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class FactoryPatternService {

    public FactoryPatternResponse run(FactoryPatternRequest request) {
        long startedAt = System.nanoTime();
        List<String> steps = new ArrayList<>();
        String channel = request.normalizedChannel();

        steps.add("클라이언트가 channel=" + channel + " 알림 생성을 요청합니다.");
        Notification notification = createNotification(channel, steps);
        String result = notification.send("Factory Pattern 학습 알림");
        steps.add("클라이언트는 구체 클래스를 몰라도 Notification.send()만 호출합니다.");

        return new FactoryPatternResponse(
                "Factory Pattern",
                notification.getClass().getSimpleName(),
                result,
                List.of("FactoryPatternService", "Notification", "EmailNotification", "SmsNotification", "PushNotification"),
                steps,
                System.nanoTime() - startedAt
        );
    }

    private Notification createNotification(String channel, List<String> steps) {
        String normalized = channel.toLowerCase();
        if (normalized.contains("sms")) {
            steps.add("Factory가 SmsNotification을 선택합니다.");
            return new SmsNotification();
        }
        if (normalized.contains("push")) {
            steps.add("Factory가 PushNotification을 선택합니다.");
            return new PushNotification();
        }
        steps.add("Factory가 EmailNotification을 선택합니다.");
        return new EmailNotification();
    }

    private interface Notification {
        String send(String message);
    }

    private static class EmailNotification implements Notification {
        public String send(String message) {
            return "EMAIL 전송: " + message;
        }
    }

    private static class SmsNotification implements Notification {
        public String send(String message) {
            return "SMS 전송: " + message;
        }
    }

    private static class PushNotification implements Notification {
        public String send(String message) {
            return "PUSH 전송: " + message;
        }
    }
}
