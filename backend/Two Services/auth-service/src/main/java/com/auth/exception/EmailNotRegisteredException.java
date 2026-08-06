package com.auth.exception;

public class EmailNotRegisteredException extends RuntimeException {
    public EmailNotRegisteredException(String message) {
        super(message);
    }
}
