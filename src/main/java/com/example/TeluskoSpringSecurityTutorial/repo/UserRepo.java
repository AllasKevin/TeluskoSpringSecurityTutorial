package com.example.TeluskoSpringSecurityTutorial.repo;

import com.example.TeluskoSpringSecurityTutorial.model.Users;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepo extends MongoRepository<Users, ObjectId> {
    Users findByUsername(String username);
}


