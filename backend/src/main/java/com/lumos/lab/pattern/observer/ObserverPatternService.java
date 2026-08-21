package com.lumos.lab.pattern.observer;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ObserverPatternService {

    public ObserverPatternResponse run(ObserverPatternRequest request) {
        long startedAt = System.nanoTime();
        List<String> steps = new ArrayList<>();
        NewsPublisher publisher = new NewsPublisher(steps);

        publisher.subscribe(new EmailSubscriber());
        publisher.subscribe(new SlackSubscriber());
        publisher.subscribe(new AuditSubscriber());

        String event = request.normalizedEvent();
        steps.add("Publisher 상태 변경: " + event);
        List<String> messages = publisher.publish(event);

        return new ObserverPatternResponse(
                "Observer Pattern",
                String.join(" / ", messages),
                List.of("EmailSubscriber", "SlackSubscriber", "AuditSubscriber"),
                steps,
                System.nanoTime() - startedAt
        );
    }

    private interface Subscriber {
        String update(String event);
    }

    private static class NewsPublisher {
        private final List<Subscriber> subscribers = new ArrayList<>();
        private final List<String> steps;

        NewsPublisher(List<String> steps) {
            this.steps = steps;
        }

        void subscribe(Subscriber subscriber) {
            subscribers.add(subscriber);
            steps.add(subscriber.getClass().getSimpleName() + " 구독 등록");
        }

        List<String> publish(String event) {
            List<String> messages = new ArrayList<>();
            for (Subscriber subscriber : subscribers) {
                String message = subscriber.update(event);
                messages.add(message);
                steps.add(subscriber.getClass().getSimpleName() + "에게 알림 전파");
            }
            return messages;
        }
    }

    private static class EmailSubscriber implements Subscriber {
        public String update(String event) {
            return "Email 수신: " + event;
        }
    }

    private static class SlackSubscriber implements Subscriber {
        public String update(String event) {
            return "Slack 수신: " + event;
        }
    }

    private static class AuditSubscriber implements Subscriber {
        public String update(String event) {
            return "Audit 기록: " + event;
        }
    }
}
