package com.example.TeluskoSpringSecurityTutorial.service;

import com.example.TeluskoSpringSecurityTutorial.model.*;
import com.example.TeluskoSpringSecurityTutorial.repo.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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

    public List<Booking> getAllFreeBookings(String username) {
        Sort sort = Sort.by(Sort.Direction.ASC, "bookedTime");
        List<Booking> bookings = repo.findByStatus(BookingStatus.PENDING, sort);
        for (Booking booking : bookings) {
            if (booking.getBookingResponses() != null)
            {
                booking.getBookingResponses().removeIf(
                        response -> !response.getResponder().getUsername().equals(username)
                );
            }
        }
        return bookings;
    }

    public Booking respondToBooking(Booking booking, String responderUsername) {
        Booking existingBooking = this.getBookingByInitialBookerUser(booking);

        setRespondToBooking(responderUsername, existingBooking);

        return repo.save(existingBooking);
    }

    public Booking acceptBookingResponse(Booking booking, String accepterUsername, String acceptedResponderUsername) {
        Booking existingBooking = this.getBookingByInitialBookerUser(booking);

        setResponseStatus(accepterUsername, acceptedResponderUsername, existingBooking, ResponseStatus.ACCEPTED);

        return repo.save(existingBooking);
    }

    public Booking declineBookingResponse(Booking booking, String declinerUsername, String declinedResponderUsername) {
        Booking existingBooking = this.getBookingByInitialBookerUser(booking);

        setResponseStatus(declinerUsername, declinedResponderUsername, existingBooking, ResponseStatus.DECLINED);

        return repo.save(existingBooking);
    }

    public Booking withdrawAcceptBooking(Booking booking, String username, String responderUsername) {
        Booking existingBooking = this.getBookingByInitialBookerUserAndResponderUsername(booking, username, responderUsername);

        System.out.println("Withdrawing acceptance to response called. Booking: ");
        System.out.println(existingBooking);


        if (existingBooking == null) throw new RuntimeException("No such booking found to withdraw from.");

        withdrawAcceptBookingResponse(username, responderUsername, existingBooking);


        return repo.save(existingBooking);
    }

    public Booking withdrawBookingResponse(Booking booking, String username) {
        String initialBookerUsername = booking.getInitialBookerUser().getUsername();
        Booking existingBooking = this.getBookingByInitialBookerUserAndResponderUsername(booking, initialBookerUsername, username);

        System.out.println("Withdrawing booking response called. Booking: ");
        System.out.println(existingBooking);

        if (existingBooking == null) throw new RuntimeException("No such booking found to withdraw from.");

        withdrawBookingResponse(username, initialBookerUsername, existingBooking);

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

    public Booking getBookingByInitialBookerUserAndResponderUsername(Booking booking, String initialBookerUsername, String responderUsername) {
        return repo.findByInitialBookerUser_UsernameAndResponses_Responder_UsernameAndBookedTimeAndPracticeAndStatus(initialBookerUsername, responderUsername, booking.getBookedTime(), booking.getPractice(), booking.getStatus());
    }


    private void setRespondToBooking(String responderUsername, Booking booking) {
        if (booking == null) {
            throw new RuntimeException("No such booking found to respond to.");
        }
        System.out.println("Responding user: " + responderUsername + " to booking: " + booking + " " + booking.getId());

        List<BookingResponse> responses = booking.getBookingResponses();
        if (responses == null) {
            responses = new ArrayList<>();
        }
        else if(responses.stream().anyMatch(r -> r.getResponder().getUsername().equals(responderUsername))) {
            System.out.println("User has already responded to this booking.");
            return;
        }



        Users currentResponder = new Users();
        currentResponder.setUsername(responderUsername);

        BookingResponse currentResponse = new BookingResponse();
        currentResponse.setResponder(currentResponder);
        responses.add(currentResponse);

        booking.setBookingResponses(responses);
    }

    private void setResponseStatus(String initialBookerUsername, String responderUsername, Booking booking, ResponseStatus status) {
        if (booking == null) {
            throw new RuntimeException("No such booking found to accept.");
        }
        System.out.println("Accepting user: " + initialBookerUsername + " to booking: " + booking + " " + booking.getId());

        List<BookingResponse> responses = booking.getBookingResponses();

        responses.stream()
                .filter(r -> r.getResponder().getUsername().equals(responderUsername))
                .forEach(r -> r.setResponseStatus(status));

        booking.setBookingResponses(responses);

        if (status == ResponseStatus.ACCEPTED) {
            booking.setStatus(BookingStatus.CONFIRMED);
        }
    }



    private void withdrawAcceptBookingResponse(String username, String otherUsername, Booking booking) {
        if (booking == null) {
            throw new RuntimeException("No such booking found to accept.");
        }
        System.out.println("user: " + username + " withdrawing acceptance from " + otherUsername + " in booking: " + booking + " " + booking.getId());

        List<BookingResponse> responses = booking.getBookingResponses();

        responses.stream()
                .filter(r -> r.getResponder().getUsername().equals(otherUsername) && r.getResponseStatus() == ResponseStatus.ACCEPTED)
                .forEach(r -> r.setResponseStatus(ResponseStatus.DECLINED));

        booking.setBookingResponses(responses);
        booking.setStatus(BookingStatus.PENDING);
    }

    private void withdrawBookingResponse(String username, String otherUsername, Booking booking) {
        if (booking == null) {
            throw new RuntimeException("No such booking found to accept.");
        }
        System.out.println("user: " + username + " withdrawing booking response from " + otherUsername + " in booking: " + booking + " " + booking.getId());

        List<BookingResponse> responses = booking.getBookingResponses();

        responses.removeIf(r -> r.getResponder().getUsername().equals(username));

        booking.setBookingResponses(responses);
        booking.setStatus(BookingStatus.PENDING);
    }
}