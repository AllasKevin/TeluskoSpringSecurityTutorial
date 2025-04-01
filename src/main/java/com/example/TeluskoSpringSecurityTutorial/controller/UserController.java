package com.example.TeluskoSpringSecurityTutorial.controller;

import com.example.TeluskoSpringSecurityTutorial.model.Users;
import com.example.TeluskoSpringSecurityTutorial.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
    public String login(@RequestBody Users user) {
        System.out.println("Trying to Log in User: " + user);
        return userService.verify(user);
    }
}
