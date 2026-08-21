package com.lumos.lab.pattern.command;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CommandPatternService {

    public CommandPatternResponse run(CommandPatternRequest request) {
        long startedAt = System.nanoTime();
        List<String> steps = new ArrayList<>();
        Light light = new Light();
        RemoteControl remoteControl = new RemoteControl(steps);

        remoteControl.execute(new LightOnCommand(light));
        String action = request.normalizedAction().toLowerCase();
        if (action.contains("off") || action.contains("끄")) {
            remoteControl.execute(new LightOffCommand(light));
        }
        remoteControl.undo();

        return new CommandPatternResponse(
                "Command Pattern",
                light.status(),
                remoteControl.historyNames(),
                steps,
                System.nanoTime() - startedAt
        );
    }

    private interface Command {
        void execute();

        void undo();

        String name();
    }

    private static class Light {
        private boolean on;

        void on() {
            on = true;
        }

        void off() {
            on = false;
        }

        String status() {
            return on ? "ON" : "OFF";
        }
    }

    private record LightOnCommand(Light light) implements Command {
        public void execute() {
            light.on();
        }

        public void undo() {
            light.off();
        }

        public String name() {
            return "LightOnCommand";
        }
    }

    private record LightOffCommand(Light light) implements Command {
        public void execute() {
            light.off();
        }

        public void undo() {
            light.on();
        }

        public String name() {
            return "LightOffCommand";
        }
    }

    private static class RemoteControl {
        private final List<Command> history = new ArrayList<>();
        private final List<String> steps;

        RemoteControl(List<String> steps) {
            this.steps = steps;
        }

        void execute(Command command) {
            command.execute();
            history.add(command);
            steps.add(command.name() + " 실행 후 history에 저장");
        }

        void undo() {
            if (history.isEmpty()) {
                steps.add("undo 대상 없음");
                return;
            }
            Command command = history.remove(history.size() - 1);
            command.undo();
            steps.add(command.name() + " undo 실행");
        }

        List<String> historyNames() {
            return history.stream().map(Command::name).toList();
        }
    }
}
