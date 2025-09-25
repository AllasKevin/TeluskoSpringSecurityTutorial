package com.example.TeluskoSpringSecurityTutorial.controller;

import com.example.TeluskoSpringSecurityTutorial.model.Booking;
import com.example.TeluskoSpringSecurityTutorial.model.BookingStatus;
import com.example.TeluskoSpringSecurityTutorial.model.Users;
import com.example.TeluskoSpringSecurityTutorial.service.BookingService;
import com.example.TeluskoSpringSecurityTutorial.service.JWTService;
import com.example.TeluskoSpringSecurityTutorial.service.UserService;
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
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.ResponseEntity.ok;

@RestController
public class BookingController {

    @Autowired
    private BookingService service;

    @PostMapping("/bookcall")
    public Booking bookCall(@CookieValue("jwt") String jwt, @RequestParam Instant bookedtime, @RequestParam String practice) {
        String userFromToken = JWTService.extractUsername(jwt);
        Users user = new Users();
        user.setUsername(userFromToken);
        Booking booking = new Booking();
        booking.setInitialBookerUser(user);
        booking.setBookedTime(bookedtime);
        booking.setPractice("bestpractice");
        booking.setStatus(BookingStatus.PENDING);
        return service.save(booking);
    }

    @GetMapping("/bookings")
    public List<Booking> getBookings(@CookieValue("jwt") String jwt) {
        String userFromToken = JWTService.extractUsername(jwt);
        System.out.println("Fetching bookings for user: " + userFromToken);
        return service.getBookingsForUser(userFromToken);
    }

    @GetMapping("/freebookingsbetween")
    public List<Booking> getFreeBookingsBetween(@RequestParam Instant starttime, @RequestParam Instant endtime) {
        return service.getBookingsBetween(starttime, endtime);
    }

    @PostMapping("/respondtobooking")
    public Booking respondToBooking(@CookieValue("jwt") String jwt, @RequestBody Booking booking) {
        String userFromToken = JWTService.extractUsername(jwt);
        return service.respondToBooking(booking, userFromToken);
    }

    @PostMapping("/acceptbookingresponse")
    public ResponseEntity<Booking> acceptBookingResponse(@CookieValue("jwt") String jwt, @RequestBody Booking booking, @RequestParam String acceptedresponderusername) {
        String userFromToken = JWTService.extractUsername(jwt);
        if(userFromToken.equals(acceptedresponderusername)){
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(service.acceptBookingResponse(booking, userFromToken, acceptedresponderusername));
    }

    @PostMapping("/withdrawacceptbooking")
    public ResponseEntity<Booking> withdrawAcceptBooking(@CookieValue("jwt") String jwt, @RequestBody Booking booking, @RequestParam String otherusername) {
        System.out.println("withdrawAcceptBooking called with booking: ");
        System.out.println(booking);
        String userFromToken = JWTService.extractUsername(jwt);
        if(userFromToken.equals(otherusername)){
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(service.withdrawAcceptBooking(booking, userFromToken, otherusername));
    }

    @DeleteMapping("/deletebooking")
    public ResponseEntity<Booking> deleteBooking(@CookieValue("jwt") String jwt, @RequestBody Booking booking) {
        System.out.println("deletebooking called");

        String userFromToken = JWTService.extractUsername(jwt);
        if(!userFromToken.equals(booking.getInitialBookerUser().getUsername())){
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(service.deleteBooking(booking));
    }

    public BookingController(){
        System.out.println("BookingController constructor called");
    }



}
