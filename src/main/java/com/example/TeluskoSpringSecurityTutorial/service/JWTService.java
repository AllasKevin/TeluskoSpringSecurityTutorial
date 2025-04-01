package com.example.TeluskoSpringSecurityTutorial.service;

import org.springframework.stereotype.Service;

@Service
public class JWTService {
    public String genereateToken() {
        return "JWT Token";
    }
}
