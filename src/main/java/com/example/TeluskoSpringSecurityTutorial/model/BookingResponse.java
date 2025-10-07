package com.example.TeluskoSpringSecurityTutorial.model;

public class BookingResponse {
    private Users responder;
    private ResponseStatus responseStatus = ResponseStatus.NOT_ANSWERED;

    public BookingResponse(Users responder, ResponseStatus responseStatus) {
        this.responder = responder;
        this.responseStatus = responseStatus;
    }

    public BookingResponse() {}

    public Users getResponder() {
        return responder;
    }

    public void setResponder(Users responder) {
        this.responder = responder;
    }

    public ResponseStatus getResponseStatus() {
        return responseStatus;
    }

    public void setResponseStatus(ResponseStatus responseStatus) {
        this.responseStatus = responseStatus;
    }

    @Override
    public String toString() {
        return "BookingResponse{" +
                "responder=" + responder +
                ", responseStatus=" + responseStatus +
                '}';
    }
}


