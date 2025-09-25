package com.example.TeluskoSpringSecurityTutorial.model;

public class BookingResponse {
    private Users responder;
    private boolean accepted;

    public BookingResponse(Users responder, boolean accepted) {
        this.responder = responder;
        this.accepted = accepted;
    }

    public BookingResponse() {}

    public Users getResponder() {
        return responder;
    }

    public void setResponder(Users responder) {
        this.responder = responder;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }


}
