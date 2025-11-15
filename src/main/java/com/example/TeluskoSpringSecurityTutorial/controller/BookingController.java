package com.example.TeluskoSpringSecurityTutorial.controller;

import com.example.TeluskoSpringSecurityTutorial.model.Booking;
import com.example.TeluskoSpringSecurityTutorial.model.BookingStatus;
import com.example.TeluskoSpringSecurityTutorial.model.SignalingServerPath;
import com.example.TeluskoSpringSecurityTutorial.model.Users;
import com.example.TeluskoSpringSecurityTutorial.service.BookingService;
import com.example.TeluskoSpringSecurityTutorial.service.JWTService;
import com.example.TeluskoSpringSecurityTutorial.service.RestTemplateService;
import com.example.TeluskoSpringSecurityTutorial.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
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
    ObjectMapper mapper;
    @PostConstruct
    public void verifyMapper() throws Exception {
        var obj = new org.bson.types.ObjectId();
        System.out.println("ObjectId test: " + mapper.writeValueAsString(obj));
    }

    @Autowired
    private BookingService service;
    @Autowired
    private RestTemplateService restTemp;

    @PostMapping("/bookcall")
    public ResponseEntity<Booking> bookCall(@CookieValue("jwt") String jwt, @RequestParam Instant bookedtime, @RequestParam String practice) {
        System.out.println(("/bookCall called"));
        String userFromToken = JWTService.extractUsername(jwt);
        Users user = new Users();
        user.setUsername(userFromToken);
        Booking booking = new Booking();
        booking.setInitialBookerUser(user);
        booking.setBookedTime(bookedtime);
        booking.setPractice(practice);
        booking.setStatus(BookingStatus.PENDING); // TODO: det kommer att gå att skapa en ny bokning när status är annat än pending. Lös detta.
        if (service.bookingExists(booking)) return ResponseEntity.badRequest().body(null);
        booking = service.save(booking);
        restTemp.sendRequest(SignalingServerPath.CREATE_BOOKING.get(), booking); // Only send request if it's a new booking
        return ResponseEntity.ok(booking);
    }

    /** Endpoint to get all bookings for the user identified by the JWT token in the cookie.
     *
     * @param jwt The JWT token from the cookie.
     * @return A list of bookings for the user.
     */
    @GetMapping("/bookings")
    public List<Booking> getBookings(@CookieValue("jwt") String jwt) {
        String userFromToken = JWTService.extractUsername(jwt);
        System.out.println("Fetching bookings for user: " + userFromToken);
        return service.getBookingsForUser(userFromToken);
    }

    @GetMapping("/freebookingsbetween")
    public List<Booking> getFreebookingsbetween(@RequestParam Instant starttime, @RequestParam Instant endtime) {
        return service.getBookingsBetween(starttime, endtime);
    }

    @GetMapping("/allfreebookings")
    public List<Booking> getAllFreeBookings(@CookieValue("jwt") String jwt) {
        String userFromToken = JWTService.extractUsername(jwt);
        return service.getAllFreeBookings(userFromToken);
    }

    @PostMapping("/respondtobooking")
    public Booking respondToBooking(@CookieValue("jwt") String jwt, @RequestBody Booking booking) {
        System.out.println("Responding to booking called. Booking: ");
        String userFromToken = JWTService.extractUsername(jwt);
        System.out.println(booking);

        Booking updatedBooking = service.respondToBooking(booking, userFromToken);
        restTemp.sendRequest(SignalingServerPath.BOOKING_RESPONSE.get(), updatedBooking);
        return service.respondToBooking(booking, userFromToken);
    }

    @PostMapping("/acceptbookingresponse")
    public ResponseEntity<Booking> acceptBookingResponse(@CookieValue("jwt") String jwt, @RequestBody Booking booking, @RequestParam String acceptedresponderusername) {
        String userFromToken = JWTService.extractUsername(jwt);
        if(userFromToken.equals(acceptedresponderusername)){
            return ResponseEntity.badRequest().body(null);
        }

        Booking updatedBooking = service.acceptBookingResponse(booking, userFromToken, acceptedresponderusername);
        restTemp.sendRequest(SignalingServerPath.ACCEPT_BOOKING_RESPONSE.get(), updatedBooking);
        return ResponseEntity.ok(updatedBooking);
    }

    @PostMapping("/declinebookingresponse")
    public ResponseEntity<Booking> declineBookingResponse(@CookieValue("jwt") String jwt, @RequestBody Booking booking, @RequestParam String declinedresponderusername) {
        System.out.println("declineBookingResponse called with booking: ");
        System.out.println(booking);
        String userFromToken = JWTService.extractUsername(jwt);
        if(userFromToken.equals(declinedresponderusername)){
            return ResponseEntity.badRequest().body(null);
        }
        Booking updatedBooking = service.declineBookingResponse(booking, userFromToken, declinedresponderusername);
        Booking updatedBookingForDeclinedUser = service.removeAllOtherUsers(declinedresponderusername, updatedBooking);
        updatedBookingForDeclinedUser.setStatus(BookingStatus.CANCELLED);
        restTemp.sendRequest(SignalingServerPath.DECLINE_BOOKING_RESPONSE.get(), updatedBookingForDeclinedUser);
        return ResponseEntity.ok(updatedBooking);
    }

    /*** Endpoint to withdraw a response or the acceptance to a response.
     * @param jwt The JWT token from the cookie.
     * @param booking The booking to withdraw acceptance from.
     * @return The updated booking after withdrawing acceptance, or a bad request response if the operation is invalid.
     */
    @PostMapping("/withdrawacceptbooking")
    public ResponseEntity<Booking> withdrawAcceptBooking(@CookieValue("jwt") String jwt, @RequestBody Booking booking, @RequestParam String responderusername) {
        System.out.println("withdrawAcceptBooking called with booking: ");
        System.out.println(booking);
        String userFromToken = JWTService.extractUsername(jwt);
        Booking updatedBooking = service.withdrawAcceptBooking(booking, userFromToken, responderusername);
        restTemp.sendRequest(SignalingServerPath.WITHDRAW_ACCEPT_BOOKING_RESPONSE.get(), updatedBooking);
        return ResponseEntity.ok(updatedBooking);
    }

    @PostMapping("/withdrawbookingresponse")
    public ResponseEntity<Booking> withdrawBookingResponse(@CookieValue("jwt") String jwt, @RequestBody Booking booking) {
        System.out.println("withdrawBookingResponse called with booking: ");
        System.out.println(booking);
        String userFromToken = JWTService.extractUsername(jwt);
        Booking updatedBooking = service.withdrawBookingResponse(booking, userFromToken);
        restTemp.sendRequest(SignalingServerPath.WITHDRAW_BOOKING_RESPONSE.get(), updatedBooking);
        return ResponseEntity.ok(updatedBooking);
    }


    @PostMapping("/deletebooking")
    public ResponseEntity<Booking> deleteBooking(@CookieValue("jwt") String jwt, @RequestBody Booking booking) {
        System.out.println("deletebooking called");

        String userFromToken = JWTService.extractUsername(jwt);
        if(!userFromToken.equals(booking.getInitialBookerUser().getUsername())){
            return ResponseEntity.badRequest().body(null);
        }
        Booking updatedBooking = service.deleteBooking(booking);
        updatedBooking.setStatus(BookingStatus.CANCELLED);
        restTemp.sendRequest(SignalingServerPath.CANCEL_BOOKING.get(), updatedBooking);
        return ResponseEntity.ok(updatedBooking);
    }

    public BookingController(){
        System.out.println("BookingController constructor called");
    }



}
