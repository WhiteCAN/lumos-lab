package com.study.lab.concept.syncasync;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class SyncAsyncService {

    public TaskResponse runSync(TaskRequest request) {
        long startedAt = System.currentTimeMillis();
        List<String> steps = new ArrayList<>();
        List<TaskResult> results = new ArrayList<>();

        steps.add("SYNC: start tasks one by one");
        for (int i = 0; i < request.delaysMillis().size(); i++) {
            int taskNumber = i + 1;
            int delayMillis = request.delaysMillis().get(i);
            steps.add("task " + taskNumber + " start, delay=" + delayMillis + "ms");
            results.add(runTask(taskNumber, delayMillis));
            steps.add("task " + taskNumber + " done");
        }
        steps.add("SYNC: every task is finished");

        return new TaskResponse(
                "SYNC",
                request.delaysMillis(),
                results,
                steps,
                System.currentTimeMillis() - startedAt
        );
    }

    public TaskResponse runAsync(TaskRequest request) {
        long startedAt = System.currentTimeMillis();
        List<String> steps = new ArrayList<>();
        List<CompletableFuture<TaskResult>> futures = new ArrayList<>();

        steps.add("ASYNC: start every task first");
        for (int i = 0; i < request.delaysMillis().size(); i++) {
            int taskNumber = i + 1;
            int delayMillis = request.delaysMillis().get(i);
            steps.add("task " + taskNumber + " submitted, delay=" + delayMillis + "ms");
            futures.add(CompletableFuture.supplyAsync(() -> runTask(taskNumber, delayMillis)));
        }

        List<TaskResult> results = futures.stream()
                .map(CompletableFuture::join)
                .toList();
        steps.add("ASYNC: collect all completed task results");

        return new TaskResponse(
                "ASYNC",
                request.delaysMillis(),
                results,
                steps,
                System.currentTimeMillis() - startedAt
        );
    }

    private TaskResult runTask(int taskNumber, int delayMillis) {
        try {
            Thread.sleep(delayMillis);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Task was interrupted", exception);
        }

        return new TaskResult(taskNumber, delayMillis, "task " + taskNumber + " completed");
    }
}
