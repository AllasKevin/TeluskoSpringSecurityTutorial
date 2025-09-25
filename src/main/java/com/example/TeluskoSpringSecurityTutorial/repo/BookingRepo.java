package com.example.TeluskoSpringSecurityTutorial.repo;

import com.example.TeluskoSpringSecurityTutorial.model.Booking;
import com.example.TeluskoSpringSecurityTutorial.model.BookingStatus;
import com.example.TeluskoSpringSecurityTutorial.model.Users;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface BookingRepo extends MongoRepository<Booking, ObjectId> {
    List<Booking> findByInitialBookerUser_Username(String username);
    List<Booking> findByResponses_Responder_Username(String username);
    List<Booking> findByBookedTimeBetweenAndStatus(Instant start, Instant end, BookingStatus status);
    Booking findByInitialBookerUser_UsernameAndBookedTimeAndPracticeAndStatus(String initialBookerUsername, Instant bookedTime, String practice, BookingStatus status);
    Booking findByInitialBookerUser_UsernameOrResponses_Responder_UsernameAndBookedTimeAndPracticeAndStatus(String initialBookerUsername, String responderUsername, Instant bookedTime, String practice, BookingStatus status);
    Booking deleteByInitialBookerUser_UsernameAndBookedTimeAndPractice(String initialBookerUsername, Instant bookedTime, String practice);
}