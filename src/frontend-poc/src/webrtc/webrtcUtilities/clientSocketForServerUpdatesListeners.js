import { set } from "react-hook-form";

const clientSocketForServerUpdatesListeners = (socket, bookingReminderRef, myBookingsRef, setMyBookings, allBookings, setAllBookings)=>{

    socket.on('bookingUpdate',bookingUpdate=>{
        console.log("bookingReminderRef: " + bookingReminderRef);
        console.log("bookingReminderRef?.current: " + bookingReminderRef?.current);
        console.log("bookingReminderRef?.current?.checkForUpcomingBookings: " + bookingReminderRef?.current?.checkForUpcomingBookings);
        bookingReminderRef?.current?.checkForUpcomingBookings();
        const date = new Date(bookingUpdate.bookedTime);

        console.log("bookedTime (ISO):", bookingUpdate.bookedTime);
        console.log("parsed date:", date);

        // Format in user's local timezone
        const formatted = new Intl.DateTimeFormat("en-GB", {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            dateStyle: "full",
            timeStyle: "short"
        }).format(date);
 

        console.log(formatted);
        console.log("bookingUpdate called. A change has been made to your booking of practice " + bookingUpdate.practice + " at " + formatted +  " with " + bookingUpdate.initialBookerUser.username +  ". New status: " + bookingUpdate.status);
        console.log("bookingUpdate object: " + JSON.stringify(bookingUpdate));
        console.log("myBookingsRef before update: " + JSON.stringify(myBookingsRef.current));

        setMyBookings(prev => { // TODO kolla igenom denna logik från chatgpt noggrannare och särskilt mappningen av booking, det borde inte vara så fult utan objectet man får borde matcha bättre
            // Normalize IDs to strings in case Mongo ObjectId is nested or serialized
            const updatedId =
            typeof bookingUpdate.id === "object"
                ? bookingUpdate.id.toString?.() ?? bookingUpdate.id.timestamp?.toString()
                : bookingUpdate.id;

            const updatedBooking = {
            id: bookingUpdate.id,
            userName: bookingUpdate.initialBookerUser?.username,
            status: bookingUpdate.status,
            dateTime: new Date(bookingUpdate.bookedTime), // ISO → Date
            practice: bookingUpdate.practice,
            responses:
                bookingUpdate.bookingResponses?.map(r => ({
                responder: r.responder,
                accepted: r.responseStatus === "ACCEPTED",
                responseStatus: r.responseStatus,
                })) ?? [],
            };

            // Replace booking if ID matches, else keep the old one
            const exists = prev.some(b => {
            const existingId =
                typeof b.id === "object"
                ? b.id.toString?.() ?? b.id.timestamp?.toString()
                : b.id;
            return existingId === updatedId;
            });

            if (exists) {
            return prev.map(b => {
                const existingId =
                typeof b.id === "object"
                    ? b.id.toString?.() ?? b.id.timestamp?.toString()
                    : b.id;
                return existingId === updatedId ? updatedBooking : b;
            });
            } else {
            return [...prev, updatedBooking];
            }
        });
    })
    console.log("clientSocketForServerUpdatesListeners initialized. socket.connected: " + socket.connected);
}

export default clientSocketForServerUpdatesListeners