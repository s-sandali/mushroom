package com.fungiflow.fungiflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.fungiflow.fungiflow.service.UserAccountService;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserAccountService userAccountService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/signup").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/", "/error").permitAll()
                        .requestMatchers("/api/admin/**", "/api/reports/**", "/api/employees/**", "/debug")
                        .hasRole("ADMIN")
                        .requestMatchers("/api/v1/**", "/api/v2/**", "/api/v3/**", "/api/v4/**",
                                "/api/inventory/**", "/api/material-requests/**").hasAnyRole("INVENTORY", "ADMIN")
                        .requestMatchers("/api/allocations/**").hasAnyRole("LAB", "SALES", "ADMIN")
                        .requestMatchers("/api/batches/**", "/api/daily-updates/**", "/api/seeds/**")
                        .hasAnyRole("LAB", "ADMIN")
                        .requestMatchers("/api/Sold/**", "/api/preorders/**", "/api/preorderAllocation/**",
                                "/api/branch/**", "/api/product/**").hasAnyRole("SALES", "ADMIN")
                        .requestMatchers("/api/auth/**").authenticated()
                        .anyRequest().authenticated())
                .userDetailsService(userAccountService)
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}