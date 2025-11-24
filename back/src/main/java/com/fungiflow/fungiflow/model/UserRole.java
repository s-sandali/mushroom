package com.fungiflow.fungiflow.model;

/**
 * Centralized list of application roles used for access control across the
 * backend and frontend. Names must stay in sync with the React guards.
 */
public enum UserRole {
    ADMIN,
    LAB,
    INVENTORY,
    SALES
}