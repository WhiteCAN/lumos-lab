package com.study.lab.javafundamental.concurrency;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class JavaConcurrencyService {

    public ConcurrencyDemoResponse demo(ConcurrencyDemoRequest request) {
        String scenario = request.scenario().trim().toUpperCase(Locale.ROOT);
        List<String> steps = new ArrayList<>();
        for (int index = 1; index <= request.taskCount(); index++) {
            steps.add("작업 " + index + " 제출");
        }

        if ("SYNCHRONIZED".equals(scenario)) {
            steps.add("공유 자원에 한 번에 하나의 스레드만 진입하도록 잠급니다.");
            return new ConcurrencyDemoResponse(
                    scenario,
                    steps,
                    "잠금 범위가 넓으면 처리량이 떨어지고 데드락 위험이 생깁니다.",
                    """
                    synchronized (lock) {
                        balance += amount;
                    }
                    """
            );
        }

        steps.add("CompletableFuture.allOf(...)로 완료 시점을 모읍니다.");
        return new ConcurrencyDemoResponse(
                "COMPLETABLE_FUTURE",
                steps,
                "DB 트랜잭션과 스레드 경계가 섞이면 ThreadLocal 기반 컨텍스트가 이어지지 않을 수 있습니다.",
                """
                List<CompletableFuture<String>> futures = tasks.stream()
                    .map(task -> CompletableFuture.supplyAsync(() -> run(task)))
                    .toList();
                CompletableFuture.allOf(futures.toArray(CompletableFuture[]::new)).join();
                """
        );
    }
}
