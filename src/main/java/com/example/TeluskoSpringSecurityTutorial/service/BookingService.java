package com.example.TeluskoSpringSecurityTutorial.service;

import com.example.TeluskoSpringSecurityTutorial.model.Booking;
import com.example.TeluskoSpringSecurityTutorial.model.BookingResponse;
import com.example.TeluskoSpringSecurityTutorial.model.BookingStatus;
import com.example.TeluskoSpringSecurityTutorial.model.Users;
import com.example.TeluskoSpringSecurityTutorial.repo.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepo repo;

    public Booking save(Booking booking) {
        if (getBookingByInitialBookerUser(booking) != null) {
            System.out.println("Booking already exists for this user with this practice at this time.");
            return booking;
        }
        return repo.save(booking);
    }

    public List<Booking> getBookingsForUser(String username) {
        List<Booking> bookingsAsBooker = repo.findByInitialBookerUser_Username(username);
        List<Booking> bookingsAsResponder = repo.findByResponses_Responder_Username(username);
        System.out.println("BookingService: Bookings as booker: " + bookingsAsBooker + ", Bookings as responder: " + bookingsAsResponder);
        bookingsAsBooker.addAll(bookingsAsResponder);
        return bookingsAsBooker;
    }

    public List<Booking> getBookingsBetween(Instant startTime, Instant endTime) {
        return repo.findByBookedTimeBetweenAndStatus(startTime, endTime, BookingStatus.PENDING);
    }

    public Booking respondToBooking(Booking booking, String responderUsername) {
        Booking existingBooking = this.getBookingByInitialBookerUser(booking);

        setRespondToBooking(responderUsername, existingBooking);

        return repo.save(existingBooking);
    }

    public Booking acceptBookingResponse(Booking booking, String accepterUsername, String acceptedResponderUsername) {
        Booking existingBooking = this.getBookingByInitialBookerUser(booking);

        setAcceptBookingResponse(accepterUsername, acceptedResponderUsername, existingBooking);

        return repo.save(existingBooking);
    }

    public Booking withdrawAcceptBooking(Booking booking, String username, String otherUsername) {
        Booking existingBooking = this.getBookingByInitialBookerUserOrResponderUsername(booking, otherUsername);

        if (existingBooking.getInitialBookerUser().getUsername().equals(username))
        {
            withdrawAcceptBookingResponse(username, otherUsername, existingBooking);
        }
        else
        {
            withdrawBookingResponse(username, otherUsername, existingBooking);
        }

        return repo.save(existingBooking);
    }

    public Booking deleteBooking(Booking booking) {
        System.out.println("user: " + booking.getInitialBookerUser() + " deleting booking response");
        if (booking == null) {
            throw new RuntimeException("No such booking found to accept.");
        }

        return repo.deleteByInitialBookerUser_UsernameAndBookedTimeAndPractice(booking.getInitialBookerUser().getUsername(), booking.getBookedTime(), booking.getPractice());
    }

    public Booking getBookingByInitialBookerUser(Booking booking) {
        return repo.findByInitialBookerUser_UsernameAndBookedTimeAndPracticeAndStatus(booking.getInitialBookerUser().getUsername(), booking.getBookedTime(), booking.getPractice(), booking.getStatus());
    }

    public Booking getBookingByInitialBookerUserOrResponderUsername(Booking booking, String responderUsername) {
        return repo.findByInitialBookerUser_UsernameOrResponses_Responder_UsernameAndBookedTimeAndPracticeAndStatus(booking.getInitialBookerUser().getUsername(), responderUsername, booking.getBookedTime(), booking.getPractice(), booking.getStatus());
    }

    private void setRespondToBooking(String responderUsername, Booking booking) {
        System.out.println("Responding user: " + responderUsername + " to booking: " + booking + " " + booking.getId());
        if (booking == null) {
            throw new RuntimeException("No such booking found to respond to.");
        }

        List<BookingResponse> responses = booking.getBookingResponses();
        if (responses == null) {
            responses = new ArrayList<>();
        }

        Users currentResponder = new Users();
        currentResponder.setUsername(responderUsername);

        BookingResponse currentResponse = new BookingResponse();
        currentResponse.setResponder(currentResponder);
        responses.add(currentResponse);

        booking.setBookingResponses(responses);
    }

    private void setAcceptBookingResponse(String acceptingUsername, String acceptedResponderUsername, Booking booking) {
        System.out.println("Accepting user: " + acceptingUsername + " to booking: " + booking + " " + booking.getId());
        if (booking == null) {
            throw new RuntimeException("No such booking found to accept.");
        }

        List<BookingResponse> responses = booking.getBookingResponses();

        responses.stream()
                .filter(r -> r.getResponder().getUsername().equals(acceptedResponderUsername))
                .forEach(r -> r.setAccepted(true));

        booking.setBookingResponses(responses);
        booking.setStatus(BookingStatus.CONFIRMED);
    }

    private void withdrawAcceptBookingResponse(String username, String otherUsername, Booking booking) {
        System.out.println("user: " + username + " withdrawing acceptance from " + otherUsername + " in booking: " + booking + " " + booking.getId());
        if (booking == null) {
            throw new RuntimeException("No such booking found to accept.");
        }

        List<BookingResponse> responses = booking.getBookingResponses();

        responses.stream()
                .filter(r -> r.getResponder().getUsername().equals(otherUsername) && r.isAccepted())
                .forEach(r -> r.setAccepted(false));

        booking.setBookingResponses(responses);
        booking.setStatus(BookingStatus.PENDING);
    }

    private void withdrawBookingResponse(String username, String otherUsername, Booking booking) {
        System.out.println("user: " + username + " withdrawing booking response from " + otherUsername + " in booking: " + booking + " " + booking.getId());
        if (booking == null) {
            throw new RuntimeException("No such booking found to accept.");
        }

        List<BookingResponse> responses = booking.getBookingResponses();

        responses.removeIf(r -> r.getResponder().getUsername().equals(username));

        booking.setBookingResponses(responses);
        booking.setStatus(BookingStatus.PENDING);
    }
}