package com.fungiflow.fungiflow.dto;

import com.fungiflow.fungiflow.model.UserRole;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    /**
     * Optional role hint supplied by the client. If present the backend validates
     * that the authenticated user really has this role.
     */
    private UserRole role;
}