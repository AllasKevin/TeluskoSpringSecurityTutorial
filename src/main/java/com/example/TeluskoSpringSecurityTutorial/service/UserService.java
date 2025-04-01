package com.example.TeluskoSpringSecurityTutorial.service;

import com.example.TeluskoSpringSecurityTutorial.model.Users;
import com.example.TeluskoSpringSecurityTutorial.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    public Users register(Users user) {
        return repo.save(user);
    }

    public String verify(Users user) {
        // The parameter is unauthenticated and return value is authenticated
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if (authentication.isAuthenticated()) {
            return jwtService.genereateToken();
        } else {
            return "User is not authenticated";
        }
    }
}
