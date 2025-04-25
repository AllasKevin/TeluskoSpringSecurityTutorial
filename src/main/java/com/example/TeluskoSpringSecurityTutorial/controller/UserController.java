package com.example.TeluskoSpringSecurityTutorial.controller;

import com.example.TeluskoSpringSecurityTutorial.model.Users;
import com.example.TeluskoSpringSecurityTutorial.service.UserService;
import com.mongodb.MongoWriteException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @PostMapping("/register")
    public String registerUser(@RequestBody Users user) {
        try {
            user.setPassword(encoder.encode(user.getPassword()));
            userService.register(user);

            return user.getUsername() + " registered successfully!";
        }
        catch (Exception e){
            System.out.println("Error: " + e.getMessage());

            if (e.getMessage().contains("duplicate key error")) {
                return "User already exists";
            }

            return "Error registering user";
        }
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

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        System.out.println("Logging out user");
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // only if you're using HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(0); // deletes the cookie
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    private Map<String, String> color;

    public UserController(){
        System.out.println("UserController constructor called");
        color = new HashMap<>();
        color.put("color", "blue");
    }

    @GetMapping("/color")
    @ResponseBody
    public Map<String, String> greet(){
        return this.color;
    }

    @PostMapping("/changecolor")
    @ResponseBody
    public ResponseEntity<Map<String, String>> changeColor(@RequestBody Map<String, String> body) {
        this.color.put("color", body.get("color")); // TODO: validate color. This could be a problem if the user sends a malicious request.
        return ResponseEntity.ok(this.color);
    }
}
