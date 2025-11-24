package com.fungiflow.fungiflow.dto;

import com.fungiflow.fungiflow.model.UserRole;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank
    private String username;

    @NotBlank
    @Size(min = 6, max = 120)
    private String password;

    @NotNull
    private UserRole role;
}