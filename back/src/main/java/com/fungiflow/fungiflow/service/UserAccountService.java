package com.fungiflow.fungiflow.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fungiflow.fungiflow.dto.SignupRequest;
import com.fungiflow.fungiflow.dto.UserResponse;
import com.fungiflow.fungiflow.model.UserAccount;
import com.fungiflow.fungiflow.repo.UserAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAccountService implements UserDetailsService {

    private final UserAccountRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse register(SignupRequest request) {
        String normalizedUsername = request.getUsername().trim();
        if (normalizedUsername.isEmpty()) {
            throw new IllegalArgumentException("Username cannot be blank");
        }

        if (repository.existsByUsernameIgnoreCase(normalizedUsername)) {
            throw new IllegalArgumentException("Username is already in use");
        }

        UserAccount account = UserAccount.builder()
                .username(normalizedUsername)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        return UserResponse.from(repository.save(account));
    }

    public Optional<UserAccount> findByUsername(String username) {
        return repository.findByUsernameIgnoreCase(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount account = repository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return User.builder()
                .username(account.getUsername())
                .password(account.getPassword())
                .roles(account.getRole().name())
                .build();
    }
}