package com.example.TeluskoSpringSecurityTutorial.controller;

import com.example.TeluskoSpringSecurityTutorial.model.Users;
import com.example.TeluskoSpringSecurityTutorial.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Arrays;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @PostMapping("/register")
    public Users registerUser(@RequestBody Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        userService.register(user);
        return user;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user, HttpServletRequest request, HttpServletResponse response) {
        System.out.println("Trying to Log in User: " + user);
        String jwt = userService.verify(user);

        ResponseCookie jwtCookie = ResponseCookie.from("jwt", jwt)
                .httpOnly(true)
                .secure(false) // TODO: Set to true in production
                .path("/")
                .maxAge(Duration.ofHours(1))
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        System.out.println("cookies " + request.getCookies() + " request: " + request);

        if(request.getCookies() != null) {
            Arrays.stream(request.getCookies()).forEach(cookie -> {
                System.out.println(cookie.getName() + ": " + cookie.getValue());
            });
        }

        return ResponseEntity.ok("Login successful");
    }
}
