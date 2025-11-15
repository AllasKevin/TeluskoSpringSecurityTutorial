package com.example.TeluskoSpringSecurityTutorial.service;

import com.example.TeluskoSpringSecurityTutorial.model.*;
import com.example.TeluskoSpringSecurityTutorial.repo.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        // Combine both lists
        List<Booking> allBookings = new ArrayList<>();
        allBookings.addAll(bookingsAsBooker);
        allBookings.addAll(bookingsAsResponder);

        // Filter out any bookings where ANY response is DECLINED TODO: bad practice to mutate object in stream
        return allBookings.stream()
                .filter(booking -> booking.getBookingResponses() == null
                        || booking.getBookingResponses().stream()
                        .noneMatch(response -> (response.getResponseStatus() == ResponseStatus.DECLINED
                                // Exclude if the booking has been confirmed but it is not this users response that was accepted
                                    || (booking.getStatus() == BookingStatus.CONFIRMED && response.getResponseStatus() != ResponseStatus.NOT_ANSWERED))))
                .toList();
    }

    public List<Booking> getBookingsBetween(Instant startTime, Instant endTime) {
        return repo.findByBookedTimeBetweenAndStatus(startTime, endTime, BookingStatus.PENDING);
    }

    public List<Booking> getAllFreeBookings(String username) {
        Sort sort = Sort.by(Sort.Direction.ASC, "bookedTime");
        List<Booking> bookings = repo.findByStatus(BookingStatus.PENDING, sort);
        bookings.removeIf(b -> b.getBookingResponses() != null &&
                b.getBookingResponses().stream()
                        .anyMatch(r -> r.getResponder().getUsername().equals(username)
                        && r.getResponseStatus() == ResponseStatus.DECLINED)
        );
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
        // TODO: Booking should have unique ID, use that instead of all these fields to identify booking
        return repo.findByInitialBookerUser_UsernameAndResponses_Responder_UsernameAndBookedTimeAndPracticeAndStatus(initialBookerUsername, responderUsername, booking.getBookedTime(), booking.getPractice(), booking.getStatus());
    }

    /**
     * Remove all users from the booking except the specified username.
     * @param username The username to retain in the booking.
     * @param booking The original Booking object.
     * @return A copied new Booking object with only the specified user retained.
     */
    public Booking removeAllOtherUsers(String username, Booking booking) {
        Booking newBooking = new Booking();
        newBooking.setId(booking.getId());
        newBooking.setBookedTime(booking.getBookedTime());
        newBooking.setPractice(booking.getPractice());
        newBooking.setStatus(booking.getStatus());
        if (booking.getInitialBookerUser() != null && booking.getInitialBookerUser().getUsername().equals(username)) {
            Users newUser = new Users();
            newUser.setUsername(username);
            newBooking.setInitialBookerUser(newUser);
            return newBooking;
        }

        if (booking.getBookingResponses() != null) {
            Optional<BookingResponse> newBookingResponse =
                    booking.getBookingResponses().stream()
                            .filter(response -> response.getResponder().getUsername().equals(username))
                            .findFirst();

            if(newBookingResponse.isPresent()) {
                newBooking.setBookingResponses(List.of(newBookingResponse.get()));
                return newBooking;
            }
        }

        throw new RuntimeException("No such user found in booking to retain.");
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

        responses.stream() // TODO: bad practice to mutate object in stream
                .filter(r -> r.getResponder().getUsername().equals(otherUsername) && r.getResponseStatus() == ResponseStatus.ACCEPTED)
                .forEach(r -> r.setResponseStatus(ResponseStatus.NOT_ANSWERED));

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