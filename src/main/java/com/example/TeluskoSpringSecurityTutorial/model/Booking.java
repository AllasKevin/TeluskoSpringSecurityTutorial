package com.example.TeluskoSpringSecurityTutorial.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.time.Instant;
import java.util.List;

public class Booking {
    @Id
    private ObjectId id;
    private Users initialBookerUser;
    private List<BookingResponse> responses;
    private Instant bookedTime;
    private BookingStatus status;
    private String practice;

    public Booking() {}

    public Booking(Users initialBookerUser, List<BookingResponse> responses, Instant bookedTime, BookingStatus status, String practice) {
        this.initialBookerUser = initialBookerUser;
        this.responses = responses;
        this.bookedTime = bookedTime;
        this.status = status;
        this.practice = practice;
    }

    public String getPractice() {
        return practice;
    }

    public void setPractice(String practice) {
        this.practice = practice;
    }

    public List<BookingResponse> getBookingResponses() {
        return responses;
    }

    public void setBookingResponses(List<BookingResponse> responses) {
        this.responses = responses;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public Users getInitialBookerUser() {
        return initialBookerUser;
    }

    public void setInitialBookerUser(Users initialBookerUser) {
        this.initialBookerUser = initialBookerUser;
    }



    public Instant getBookedTime() {
        return bookedTime;
    }

    public void setBookedTime(Instant bookedTime) {
        this.bookedTime = bookedTime;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", initialBookerUser=" + initialBookerUser +
                ", responses=" + responses +
                ", bookedTime=" + bookedTime +
                ", status=" + status +
                ", practice='" + practice + '\'' +
                '}';
    }
}
