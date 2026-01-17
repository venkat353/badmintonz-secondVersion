package com.badMinz.court_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // 1. Tells Spring: "Listen to errors from ALL Controllers"
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class) // 2. Catch RuntimeException
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());

        // Return 409 Conflict (Good for logic errors like overlaps)
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }
}