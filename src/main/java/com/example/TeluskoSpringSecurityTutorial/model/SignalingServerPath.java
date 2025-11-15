package com.example.TeluskoSpringSecurityTutorial.model;

public enum SignalingServerPath {
    CREATE_BOOKING("/createbooking"),
    BOOKING_RESPONSE("/bookingresponse"),
    ACCEPT_BOOKING_RESPONSE("/acceptbookingresponse"),
    DECLINE_BOOKING_RESPONSE("/declinebookingresponse"),
    WITHDRAW_BOOKING_RESPONSE("/withdrawbookingresponse"),
    WITHDRAW_ACCEPT_BOOKING_RESPONSE("/withdrawacceptbookingresponse"),
    CANCEL_BOOKING("/cancelbooking");

    private final String displayName;

    // Constructor
    SignalingServerPath(String displayName) {
        this.displayName = displayName;
    }

    // Getter
    public String get() {
        return displayName;
    }
}