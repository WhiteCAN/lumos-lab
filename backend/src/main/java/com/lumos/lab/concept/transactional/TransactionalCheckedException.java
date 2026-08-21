package com.lumos.lab.concept.transactional;

public class TransactionalCheckedException extends Exception {
    public TransactionalCheckedException(String message) {
        super(message);
    }
}
