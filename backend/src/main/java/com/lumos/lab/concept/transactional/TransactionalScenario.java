package com.lumos.lab.concept.transactional;

public enum TransactionalScenario {
    NORMAL_COMMIT,
    RUNTIME_EXCEPTION_ROLLBACK,
    CHECKED_EXCEPTION_DEFAULT_COMMIT,
    CHECKED_EXCEPTION_ROLLBACK_FOR
}
