package com.lumos.lab.datastructure.queue;

import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

@Service
public class QueueService {
    private final Deque<Integer> queue = new ArrayDeque<>();

    public synchronized QueueResponse current() {
        return response("current", List.of("read queue from front to rear"));
    }

    public synchronized QueueResponse offer(Integer value) {
        List<String> steps = new ArrayList<>();
        steps.add("before offer: " + values());
        queue.addLast(value);
        steps.add("add " + value + " to the rear");
        steps.add("after offer: " + values());
        return response("offer(" + value + ")", steps);
    }

    public synchronized QueueResponse poll() {
        if (queue.isEmpty()) {
            throw new IllegalArgumentException("Queue is empty. Offer a value first.");
        }

        List<String> steps = new ArrayList<>();
        steps.add("before poll: " + values());
        Integer removed = queue.removeFirst();
        steps.add("remove front value: " + removed);
        steps.add("after poll: " + values());
        return response("poll() -> " + removed, steps);
    }

    public synchronized QueueResponse peek() {
        if (queue.isEmpty()) {
            throw new IllegalArgumentException("Queue is empty. Offer a value first.");
        }

        Integer front = queue.peekFirst();
        return response("peek() -> " + front, List.of(
                "read front value without removing it",
                "front value: " + front,
                "queue remains: " + values()
        ));
    }

    public synchronized QueueResponse clear() {
        List<String> steps = new ArrayList<>();
        steps.add("before clear: " + values());
        queue.clear();
        steps.add("remove every value");
        steps.add("after clear: []");
        return response("clear()", steps);
    }

    private QueueResponse response(String lastAction, List<String> steps) {
        return new QueueResponse(
                values(),
                queue.peekFirst(),
                queue.peekLast(),
                queue.size(),
                lastAction,
                steps
        );
    }

    private List<Integer> values() {
        return List.copyOf(queue);
    }
}
