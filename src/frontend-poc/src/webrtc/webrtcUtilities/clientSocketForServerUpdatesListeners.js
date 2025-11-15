const clientSocketForServerUpdatesListeners = (socket, bookingReminderRef, myBookingsRef, myBookings, setMyBookings, allBookings, setAllBookings)=>{

    socket.on('updateMyBookingsTab',bookingUpdate=>{
        console.log("updateMyBookingsTab. allBookings before bookingUpdate: " + JSON.stringify(allBookings));
        //console.log("bookingReminderRef: " + bookingReminderRef);
        //console.log("bookingReminderRef?.current: " + bookingReminderRef?.current);
        //console.log("bookingReminderRef?.current?.checkForUpcomingBookings: " + bookingReminderRef?.current?.checkForUpcomingBookings);
        bookingReminderRef?.current?.checkForUpcomingBookings();

        //console.log("bookedTime (ISO):", bookingUpdate.bookedTime);
        //console.log("parsed date:", date);

        //const formatted = formatDate(date);

        //console.log(formatted);
        //console.log("bookingUpdate called. A change has been made to your booking of practice " + bookingUpdate.practice + " at " + formatted +  " with " + bookingUpdate?.initialBookerUser?.username +  ". New status: " + bookingUpdate.status);
        //console.log("bookingUpdate object: " + JSON.stringify(bookingUpdate));
        //console.log("myBookingsRef before update: " + JSON.stringify(myBookingsRef.current));

        setBookingsWrapper(setMyBookings, bookingUpdate);

        //console.log("myBookingsRef after update: " + JSON.stringify(myBookingsRef.current));
    })

    socket.on('updateAvailableBookingsTab',bookingUpdate=>{
        console.log("updateAvailableBookingsTab. allBookings before bookingUpdate: " + JSON.stringify(allBookings));
        console.log("updateAvailableBookingsTab. bookingUpdate : " + JSON.stringify(bookingUpdate));
        //console.log("myBookingsRef before update: " + JSON.stringify(myBookingsRef.current));

        setBookingsWrapper(setAllBookings, bookingUpdate);

        //console.log("myBookingsRef after update: " + JSON.stringify(myBookingsRef.current));
    })
    console.log("clientSocketForServerUpdatesListeners initialized. socket.connected: " + socket.connected);
}

function setBookingsWrapper(setMyBookings, bookingUpdate) {
    setMyBookings(prev => { 
        const updatedId = normalizeId(bookingUpdate.id);
        const updatedBooking = mapBooking(bookingUpdate);

        if (bookingAlreadyExists(updatedId, prev)) 
        {
            return replaceBookingInArray(prev, updatedBooking);
        } 
        else 
        {
            return [...prev, updatedBooking];
        }
    });
}

function replaceBookingInArray(bookingArray, updatedBooking) {
    return bookingArray.map(b => {
        const currentId = typeof b.id === "object"
                ? b.id.toString?.() ?? b.id.timestamp?.toString()
                : b.id;
                console.log("replaceBookingInArray(). Comparing currentId: " + currentId + " with updatedBooking.id: " + updatedBooking.id);
                console.log(updatedBooking);
        return currentId === updatedBooking.id ? updatedBooking : b;
    });
}

function bookingAlreadyExists(bookingId, prev) {
    const exists = prev.some(b => {
    const existingId =
        typeof b.id === "object"
        ? b.id.toString?.() ?? b.id.timestamp?.toString()
        : b.id;
    return existingId === bookingId;
    });
    return exists;
}

function mapBooking(booking) {
    // TODO kolla igenom denna logik från chatgpt noggrannare och särskilt mappningen av booking, det borde inte vara så fult utan objectet man får borde matcha bättre
        const updatedBooking = {
        id: booking.id,
        userName: booking.initialBookerUser?.username,
        status: booking.status,
        dateTime: new Date(booking.bookedTime), // ISO → Date
        practice: booking.practice,
        responses:
            booking.bookingResponses?.map(r => ({
            responder: r.responder,
            accepted: r.responseStatus === "ACCEPTED",
            responseStatus: r.responseStatus,
            })) ?? [],
        };
        return updatedBooking;
}   

// Normalize IDs to strings in case Mongo ObjectId is nested or serialized
function normalizeId(id) {
    const updatedId =
        typeof id === "object"
            ? id.toString?.() ?? id.timestamp?.toString()
            : id;
    return updatedId;
}

function formatDate(date) {
    // Format in user's local timezone
    const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateStyle: "full",
        timeStyle: "short"
    }).format(date);
    return formatted;
}

export default clientSocketForServerUpdatesListeners