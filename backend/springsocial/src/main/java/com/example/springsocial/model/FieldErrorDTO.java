package com.example.springsocial.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;
import java.util.List;

@Getter
@Setter
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

    public FieldErrorDTO(final String message, final String error) {
        super();
        this.message = message;
        errors = Arrays.asList(error);
    }
}
