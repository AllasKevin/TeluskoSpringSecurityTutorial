package com.example.TeluskoSpringSecurityTutorial.repo;

import com.example.TeluskoSpringSecurityTutorial.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<Users, Integer> {
    Users findByUsername(String username);
}


