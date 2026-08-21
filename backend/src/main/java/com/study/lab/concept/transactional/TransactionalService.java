package com.study.lab.concept.transactional;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TransactionalService {

    private final TransactionLogRepository repository;
    private final TransactionalWorker worker;

    public TransactionalService(TransactionLogRepository repository, TransactionalWorker worker) {
        this.repository = repository;
        this.worker = worker;
    }

    public TransactionalResponse run(TransactionalScenario scenario, String label) {
        List<TransactionalLogResponse> beforeLogs = findLogs();
        List<String> steps = new ArrayList<>();
        steps.add("요청 시작: 현재 저장된 로그 " + beforeLogs.size() + "개");
        steps.add("TransactionalWorker의 public 메서드를 호출합니다. 프록시를 거쳐야 @Transactional이 적용됩니다.");

        String result = executeScenario(scenario, label, steps);
        List<TransactionalLogResponse> afterLogs = findLogs();
        steps.add("요청 종료: 현재 저장된 로그 " + afterLogs.size() + "개");

        return new TransactionalResponse(
                scenario,
                result,
                beforeLogs.size(),
                afterLogs.size(),
                beforeLogs,
                afterLogs,
                steps
        );
    }

    public List<TransactionalLogResponse> findLogs() {
        return repository.findAll()
                .stream()
                .map(TransactionalLogResponse::from)
                .toList();
    }

    public List<TransactionalLogResponse> clearLogs() {
        repository.deleteAll();
        return findLogs();
    }

    private String executeScenario(TransactionalScenario scenario, String label, List<String> steps) {
        try {
            switch (scenario) {
                case NORMAL_COMMIT -> {
                    steps.add("DB insert 후 예외 없이 메서드가 끝납니다.");
                    worker.normalCommit(label);
                    steps.add("예외가 없어서 트랜잭션이 커밋됩니다.");
                    return "커밋됨";
                }
                case RUNTIME_EXCEPTION_ROLLBACK -> {
                    steps.add("DB insert 후 RuntimeException을 던집니다.");
                    worker.runtimeRollback(label);
                    return "도달하지 않음";
                }
                case CHECKED_EXCEPTION_DEFAULT_COMMIT -> {
                    steps.add("DB insert 후 checked exception을 던집니다.");
                    worker.checkedDefaultCommit(label);
                    return "도달하지 않음";
                }
                case CHECKED_EXCEPTION_ROLLBACK_FOR -> {
                    steps.add("DB insert 후 checked exception을 던지지만 rollbackFor가 설정되어 있습니다.");
                    worker.checkedRollbackFor(label);
                    return "도달하지 않음";
                }
            }
        } catch (TransactionalCheckedException exception) {
            steps.add("checked exception 포착: " + exception.getMessage());
            if (scenario == TransactionalScenario.CHECKED_EXCEPTION_DEFAULT_COMMIT) {
                steps.add("기본 규칙에서는 checked exception만으로 롤백 표시가 되지 않아 커밋됩니다.");
                return "예외 발생, 하지만 커밋됨";
            }
            steps.add("rollbackFor 설정 때문에 롤백됩니다.");
            return "예외 발생, rollbackFor로 롤백됨";
        } catch (RuntimeException exception) {
            steps.add("RuntimeException 포착: " + exception.getMessage());
            steps.add("Spring 기본 규칙에 따라 RuntimeException은 롤백됩니다.");
            return "예외 발생, 롤백됨";
        }

        throw new IllegalArgumentException("지원하지 않는 시나리오입니다: " + scenario);
    }
}
