package com.example.TeluskoSpringSecurityTutorial.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

//@RestController
public class HelloController {

    @GetMapping("/")
    public String greet(HttpServletRequest request){
        return "redirect:/index.html";
    }


}
