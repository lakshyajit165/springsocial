package com.example.springsocial.model;

import java.util.Arrays;
import java.util.List;


public class FieldErrorDTO {

    private String message;
    private List<String> errors;

    public FieldErrorDTO() {
        super();
    }

    public FieldErrorDTO(final String message, final List<String> errors) {
        super();
        this.message = message;
        this.errors = errors;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public FieldErrorDTO(final String message, final String error) {
        super();
        this.message = message;
        errors = Arrays.asList(error);
    }
}
