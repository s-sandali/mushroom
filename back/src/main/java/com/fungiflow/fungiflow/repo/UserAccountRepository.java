package com.fungiflow.fungiflow.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fungiflow.fungiflow.model.UserAccount;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByUsernameIgnoreCase(String username);

    boolean existsByUsernameIgnoreCase(String username);
}