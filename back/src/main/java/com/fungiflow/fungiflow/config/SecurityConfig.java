package com.fungiflow.fungiflow.config;

import java.util.List;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/signup").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/", "/error").permitAll()
                        // Admin-only endpoints
                        .requestMatchers("/api/admin/**", "/api/reports/**", "/api/employees/**", "/debug")
                        .hasRole("ADMIN")
                        // LAB + SALES read-only access to selected inventory endpoints
                        .requestMatchers(HttpMethod.GET,
                                "/api/inventory",
                                "/api/inventory/low-stock",
                                "/api/inventory/*",
                                "/api/inventory/material-requests")
                        .hasAnyRole("LAB", "SALES", "INVENTORY", "ADMIN")
                        // LAB + SALES read-only access to stock snapshot endpoints under /api/v4/**
                        .requestMatchers(HttpMethod.GET, "/api/v4/**")
                        .hasAnyRole("LAB", "SALES", "INVENTORY", "ADMIN")
                        // Inventory and material-requests full access for INVENTORY and ADMIN
                        .requestMatchers("/api/v1/**", "/api/v2/**", "/api/v3/**", "/api/v4/**",
                                "/api/inventory/**", "/api/material-requests/**").hasAnyRole("INVENTORY", "ADMIN")
                        // Allocations: LAB, SALES, ADMIN
                        .requestMatchers("/api/allocations/**").hasAnyRole("LAB", "SALES", "ADMIN")
                        // Lab-specific endpoints
                        .requestMatchers("/api/batches/**", "/api/daily-updates/**", "/api/seeds/**")
                        .hasAnyRole("LAB", "ADMIN")
                        // Sales-specific endpoints
                        .requestMatchers("/api/Sold/**", "/api/preorders/**", "/api/preorderAllocation/**",
                                "/api/branch/**", "/api/product/**").hasAnyRole("SALES", "ADMIN")
                        // Auth endpoints require any authenticated user
                        .requestMatchers("/api/auth/**").authenticated()
                        // Everything else must be authenticated
                        .anyRequest().authenticated())
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "http://127.0.0.1:*",
            "https://mushroom-git-main-s-sandalis-projects.vercel.app",
            "https://mushroom-tawny.vercel.app"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
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