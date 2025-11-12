import { set } from "react-hook-form";

const clientSocketForServerUpdatesListeners = (socket, bookingReminderRef)=>{

    socket.on('bookingUpdate',bookingUpdate=>{
        console.log("bookingReminderRef: " + bookingReminderRef);
        console.log("bookingReminderRef?.current: " + bookingReminderRef?.current);
        console.log("bookingReminderRef?.current?.checkForUpcomingBookings: " + bookingReminderRef?.current?.checkForUpcomingBookings);
        bookingReminderRef?.current?.checkForUpcomingBookings();
        const timestamp = bookingUpdate.bookedTime; // seconds
        const date = new Date(timestamp * 1000); // convert to ms

        console.log("timestamp: " + timestamp);
        console.log("date: " + date);
        const formatted = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Europe/Stockholm",
            dateStyle: "full",
            timeStyle: "short"
            }).format(date);

        console.log(formatted);
        console.log("bookingUpdate called. A change has been made to your booking of practice " + bookingUpdate.practice + " at " + formatted +  " with " + bookingUpdate.initialBookerUser.username +  ". New status: " + bookingUpdate.status);
    })
    console.log("clientSocketForServerUpdatesListeners initialized. socket.connected: " + socket.connected);
}

export default clientSocketForServerUpdatesListeners