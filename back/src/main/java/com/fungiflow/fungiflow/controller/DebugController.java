package com.fungiflow.fungiflow.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DebugController {
    @GetMapping("/debug")
    public Map<String, String> debug() {
        Map<String, String> env = new HashMap<>();
        env.put("MYSQLHOST", System.getenv("MYSQLHOST"));
        env.put("MYSQLPORT", System.getenv("MYSQLPORT"));
        env.put("MYSQLDATABASE", System.getenv("MYSQLDATABASE"));
        return env;
    }
}
