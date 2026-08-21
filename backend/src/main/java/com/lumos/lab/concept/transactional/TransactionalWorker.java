package com.lumos.lab.concept.transactional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionalWorker {

    private final TransactionLogRepository repository;

    public TransactionalWorker(TransactionLogRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void normalCommit(String label) {
        repository.save(new TransactionLog(
                TransactionalScenario.NORMAL_COMMIT.name(),
                label + " - 정상 종료되어 커밋됩니다."
        ));
    }

    @Transactional
    public void runtimeRollback(String label) {
        repository.save(new TransactionLog(
                TransactionalScenario.RUNTIME_EXCEPTION_ROLLBACK.name(),
                label + " - RuntimeException 직전에 저장을 시도합니다."
        ));
        throw new IllegalStateException("RuntimeException 계열은 기본 롤백 대상입니다.");
    }

    @Transactional
    public void checkedDefaultCommit(String label) throws TransactionalCheckedException {
        repository.save(new TransactionLog(
                TransactionalScenario.CHECKED_EXCEPTION_DEFAULT_COMMIT.name(),
                label + " - checked exception이지만 기본 설정에서는 커밋됩니다."
        ));
        throw new TransactionalCheckedException("checked exception은 기본적으로 롤백 대상이 아닙니다.");
    }

    @Transactional(rollbackFor = TransactionalCheckedException.class)
    public void checkedRollbackFor(String label) throws TransactionalCheckedException {
        repository.save(new TransactionLog(
                TransactionalScenario.CHECKED_EXCEPTION_ROLLBACK_FOR.name(),
                label + " - rollbackFor 설정으로 저장이 롤백됩니다."
        ));
        throw new TransactionalCheckedException("rollbackFor로 checked exception도 롤백합니다.");
    }
}
