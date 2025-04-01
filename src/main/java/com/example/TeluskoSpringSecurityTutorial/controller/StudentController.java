package com.example.TeluskoSpringSecurityTutorial.controller;

import com.example.TeluskoSpringSecurityTutorial.model.Student;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class StudentController {

    private List<Student> students = new ArrayList<>(List.of(
            new Student(1, "John", "A"),
            new Student(2, "Jane", "B"),
            new Student(3, "Jack", "C")
    ));

    // Method to add a student
    @GetMapping("/students")
    public List<Student> getStudents(){
        return students;
    }

    @GetMapping("/csrf-token")
    public CsrfToken getCrsfToken(HttpServletRequest request) {
        System.out.println("Fetching " + CsrfToken.class.getName() + " attribute");
        return (CsrfToken) request.getAttribute(CsrfToken.class.getName());
    }

    @PostMapping("/students")
    public String addStudent(@RequestBody Student student) {
        System.out.println("Adding student: " + student);
        students.add(student);
        return "Student "+ student.getName() + " added successfully!";
    }
}
