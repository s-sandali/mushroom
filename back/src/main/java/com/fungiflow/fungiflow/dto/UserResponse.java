package com.fungiflow.fungiflow.dto;

import com.fungiflow.fungiflow.model.UserAccount;
import com.fungiflow.fungiflow.model.UserRole;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserResponse {
    Long id;
    String username;
    UserRole role;

    public static UserResponse from(UserAccount account) {
        return UserResponse.builder()
                .id(account.getId())
                .username(account.getUsername())
                .role(account.getRole())
                .build();
    }
}