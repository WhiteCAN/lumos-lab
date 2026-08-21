package com.study.lab.datastructure.stack;

import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

@Service
public class StackService {
    private final Deque<Integer> stack = new ArrayDeque<>();

    public synchronized StackResponse current() {
        return response("current", List.of("read stack from top to bottom"));
    }

    public synchronized StackResponse push(Integer value) {
        List<String> steps = new ArrayList<>();
        steps.add("before push: " + values());
        stack.push(value);
        steps.add("push " + value + " to the top");
        steps.add("after push: " + values());
        return response("push(" + value + ")", steps);
    }

    public synchronized StackResponse pop() {
        if (stack.isEmpty()) {
            throw new IllegalArgumentException("Stack is empty. Push a value first.");
        }

        List<String> steps = new ArrayList<>();
        steps.add("before pop: " + values());
        Integer popped = stack.pop();
        steps.add("remove top value: " + popped);
        steps.add("after pop: " + values());
        return response("pop() -> " + popped, steps);
    }

    public synchronized StackResponse peek() {
        if (stack.isEmpty()) {
            throw new IllegalArgumentException("Stack is empty. Push a value first.");
        }

        Integer top = stack.peek();
        return response("peek() -> " + top, List.of(
                "read top value without removing it",
                "top value: " + top,
                "stack remains: " + values()
        ));
    }

    public synchronized StackResponse clear() {
        List<String> steps = new ArrayList<>();
        steps.add("before clear: " + values());
        stack.clear();
        steps.add("remove every value");
        steps.add("after clear: []");
        return response("clear()", steps);
    }

    private StackResponse response(String lastAction, List<String> steps) {
        return new StackResponse(values(), stack.peek(), stack.size(), lastAction, steps);
    }

    private List<Integer> values() {
        return List.copyOf(stack);
    }
}
