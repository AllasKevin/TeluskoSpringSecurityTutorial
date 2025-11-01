// Booking service for managing bookings
import { Booking } from '../types/booking';
import apiClient from './api-client';

export class BookingService {
  // Get all bookings (current user's bookings)
  static async getAllBookings(): Promise<Booking[]> {
    try {
      const response = await apiClient.get('/bookings');
      const backendBookings = response.data;
      const frontendBookings: Booking[] = backendBookings.map((backendBooking: any) => ({
        id: backendBooking.id || Date.now().toString(),
        userName: backendBooking.initialBookerUser?.username || 'Unknown User',
        status: backendBooking.status || 'PENDING',
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || 'Unknown Practice',
        responses: (backendBooking.bookingResponses || []).map((response: any) => ({
          responder: response.responder || { username: 'Unknown' },
          accepted: response.accepted || false,
          responseStatus: response.responseStatus || 'NOT_ANSWERED'
        }))
      }));
      
      return frontendBookings;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  }

  // Get all free bookings (available for response)
  static async getAllFreeBookings(): Promise<Booking[]> {
    try {
      const response = await apiClient.get('/allfreebookings');
      const backendBookings = response.data;
      const frontendBookings: Booking[] = backendBookings.map((backendBooking: any) => ({
        id: backendBooking.id || Date.now().toString(),
        userName: backendBooking.initialBookerUser?.username || 'Unknown User',
        status: backendBooking.status || 'PENDING',
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || 'Unknown Practice',
        responses: (backendBooking.bookingResponses || []).map((response: any) => ({
          responder: response.responder || { username: 'Unknown' },
          accepted: response.accepted || false,
          responseStatus: response.responseStatus || 'NOT_ANSWERED'
        }))
      }));
      
      return frontendBookings;
    } catch (error) {
      console.error('Error fetching all free bookings:', error);
      throw error;
    }
  }

  // Get bookings for a specific date/time
  static async getBookingsForDateTime(dateTime: Date): Promise<Booking[]> {
    try {
      // Use a 10-minute window around the selected time to get bookings for that specific time slot
      const startTime = new Date(dateTime.getTime() - 5 * 60 * 1000); // 5 minutes before
      const endTime = new Date(dateTime.getTime() + 5 * 60 * 1000);   // 5 minutes after
      
      const response = await apiClient.get('/freebookingsbetween', {
        params: {
          starttime: startTime.toISOString(),
          endtime: endTime.toISOString()
        }
      });
      
      const backendBookings = response.data;
      const frontendBookings: Booking[] = backendBookings.map((backendBooking: any) => ({
        id: backendBooking.id || Date.now().toString(),
        userName: backendBooking.initialBookerUser?.username || 'Unknown User',
        status: backendBooking.status || 'PENDING',
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || 'Unknown Practice',
        responses: (backendBooking.bookingResponses || []).map((response: any) => ({
          responder: response.responder || { username: 'Unknown' },
          accepted: response.accepted || false,
          responseStatus: response.responseStatus || 'NOT_ANSWERED'
        }))
      }));
      
      return frontendBookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  // Respond to a booking
  static async updateBookingStatus(bookingId: string, status: string, bookingData?: Booking): Promise<Booking> {
    try {
      if (!bookingData) {
        throw new Error('Booking data is required');
      }

      const bookingForApi = {
        initialBookerUser: {
          username: bookingData.userName
        },
        bookedTime: bookingData.dateTime.toISOString(),
        practice: bookingData.practice,
        status: "PENDING"
      };
      
      const response = await apiClient.post('/respondtobooking', bookingForApi);
      
      const backendBooking = response.data;
      const frontendBooking: Booking = {
        id: backendBooking.id || bookingId,
        userName: backendBooking.initialBookerUser?.username || bookingData.userName,
        status: backendBooking.status || 'PENDING',
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || bookingData.practice,
        responses: (backendBooking.bookingResponses || []).map((response: any) => ({
          responder: response.responder || { username: 'Unknown' },
          accepted: response.accepted || false,
          responseStatus: response.responseStatus || 'ACCEPTED'
        }))
      };
      
      return frontendBooking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Create a new booking
  static async createBooking(bookingData: {
    userName: string;
    dateTime: Date;
    practice: string;
  }): Promise<Booking> {
    try {
      const response = await apiClient.post('/bookcall', null, {
        params: {
          bookedtime: bookingData.dateTime.toISOString(),
          practice: bookingData.practice
        }
      });
      
      const backendBooking = response.data;
      const frontendBooking: Booking = {
        id: backendBooking.id || Date.now().toString(),
        userName: backendBooking.initialBookerUser?.username || bookingData.userName,
        status: backendBooking.status || 'PENDING',
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || bookingData.practice,
        responses: (backendBooking.bookingResponses || []).map((response: any) => ({
          responder: response.responder || { username: 'Unknown' },
          accepted: response.accepted || false,
          responseStatus: response.responseStatus || 'NOT_ANSWERED'
        }))
      };
      
      return frontendBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Accept a booking response
  static async acceptBookingResponse(bookingId: string, acceptedResponderUsername: string, bookingData?: Booking): Promise<Booking> {
    try {
      if (!bookingData) {
        throw new Error('Booking data is required');
      }
      
      const bookingForApi = {
        initialBookerUser: {
          username: bookingData.userName
        },
        bookedTime: bookingData.dateTime.toISOString(),
        practice: bookingData.practice,
        status: "PENDING"
      };
      
      const response = await apiClient.post('/acceptbookingresponse', bookingForApi, {
        params: {
          acceptedresponderusername: acceptedResponderUsername
        }
      });
      
      const backendBooking = response.data;
      const frontendBooking: Booking = {
        id: backendBooking.id?.toString() || bookingId,
        userName: backendBooking.initialBookerUser?.username || bookingData.userName,
        status: backendBooking.status || 'CONFIRMED',
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || bookingData.practice,
        responses: (backendBooking.bookingResponses && backendBooking.bookingResponses.length > 0) 
          ? backendBooking.bookingResponses.map((response: any) => ({
              responder: response.responder || { username: 'Unknown' },
              accepted: response.accepted || false,
              responseStatus: response.responseStatus || 'NOT_ANSWERED'
            }))
          : bookingData.responses?.map(response => ({
              ...response,
              responseStatus: response.responder.username === acceptedResponderUsername ? 'ACCEPTED' as const : response.responseStatus
            })) || []
      };
      
      return frontendBooking;
    } catch (error) {
      console.error('Error accepting booking response:', error);
      throw error;
    }
  }

  // Delete booking
  static async deleteBooking(bookingId: string, bookingData?: Booking): Promise<void> {
    try {
      if (!bookingData) {
        throw new Error('Booking data is required');
      }
      
      const bookingForApi = {
        initialBookerUser: {
          username: bookingData.userName
        },
        bookedTime: bookingData.dateTime.toISOString(),
        practice: bookingData.practice,
        status: bookingData.status
      };
      
      await apiClient.post('/deletebooking', bookingForApi);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // Withdraw response to booking
  static async withdrawBookingResponse(bookingId: string, bookingData: Booking): Promise<Booking> {
    console.log('=== WITHDRAW BOOKING RESPONSE DEBUG START ===');
    console.log('Function called with bookingId:', bookingId);
    console.log('Booking data received:', bookingData);
    
    try {
      const bookingForApi = {
        id: null,
        initialBookerUser: {
          username: bookingData.userName
        },
        bookedTime: bookingData.dateTime.toISOString(),
        practice: bookingData.practice,
        status: bookingData.status,
        bookingResponses: bookingData.responses || []
      };
      
      console.log('=== WITHDRAW BOOKING RESPONSE REQUEST DATA ===');
      console.log('Full request object:', bookingForApi);
      console.log('Request JSON:', JSON.stringify(bookingForApi, null, 2));
      console.log('=== MAKING API CALL TO /withdrawbookingresponse ===');
      
      const response = await apiClient.post('/withdrawbookingresponse', bookingForApi);
      
      const backendBooking = response.data;
      const frontendBooking: Booking = {
        id: backendBooking.id || bookingId,
        userName: backendBooking.initialBookerUser?.username || bookingData.userName,
        status: backendBooking.status || 'PENDING',
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || bookingData.practice,
        responses: (backendBooking.bookingResponses || []).map((response: any) => ({
          responder: response.responder || { username: 'Unknown' },
          accepted: response.accepted || false,
          responseStatus: response.responseStatus || 'NOT_ANSWERED'
        }))
      };
      
      return frontendBooking;
    } catch (error) {
      console.error('Error withdrawing booking response:', error);
      throw error;
    }
  }

  // Decline a booking response
  static async declineBookingResponse(bookingId: string, declinedResponderUsername: string, bookingData: Booking): Promise<Booking> {
    try {
      const bookingForApi = {
        initialBookerUser: {
          username: bookingData.userName
        },
        bookedTime: bookingData.dateTime.toISOString(),
        practice: bookingData.practice,
        status: "PENDING"
      };
      
      const response = await apiClient.post(`/declinebookingresponse?declinedresponderusername=${encodeURIComponent(declinedResponderUsername)}`, bookingForApi);
      
      const backendBooking = response.data;
      const frontendBooking: Booking = {
        id: backendBooking.id || bookingId,
        userName: backendBooking.initialBookerUser?.username || bookingData.userName,
        status: backendBooking.status || 'PENDING',
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || bookingData.practice,
        responses: (backendBooking.bookingResponses || []).map((response: any) => ({
          responder: response.responder || { username: 'Unknown' },
          accepted: response.accepted || false,
          responseStatus: response.responseStatus || 'NOT_ANSWERED'
        }))
      };
      
      return frontendBooking;
    } catch (error) {
      console.error('Error declining booking response:', error);
      throw error;
    }
  }

  // Withdraw acceptance (for initial booker to withdraw their acceptance of a response)
  static async withdrawAcceptance(bookingId: string, bookingData: Booking): Promise<Booking> {
    console.log('=== WITHDRAW ACCEPTANCE DEBUG START ===');
    console.log('Function called with bookingId:', bookingId);
    console.log('Booking data received:', bookingData);
    
    try {
      // Get the responder username from the accepted response
      const acceptedResponse = bookingData.responses?.find(response => response.responseStatus === 'ACCEPTED');
      const responderUsername = acceptedResponse?.responder?.username;
      
      console.log('Accepted response:', acceptedResponse);
      console.log('Responder username:', responderUsername);
      
      if (!responderUsername) {
        throw new Error('No accepted response found to withdraw');
      }
      
      const bookingForApi = {
        id: null,
        initialBookerUser: {
          username: bookingData.userName
        },
        bookedTime: bookingData.dateTime.toISOString(),
        practice: bookingData.practice,
        status: bookingData.status,
        bookingResponses: bookingData.responses || []
      };
      
      console.log('=== REQUEST DATA BEING SENT ===');
      console.log('Full request object:', bookingForApi);
      console.log('Request JSON:', JSON.stringify(bookingForApi, null, 2));
      console.log('Responses array:', bookingData.responses);
      console.log('Responses length:', bookingData.responses?.length || 0);
      console.log('=== MAKING API CALL TO /withdrawacceptbooking ===');
      
      const response = await apiClient.post(`/withdrawacceptbooking?responderusername=${encodeURIComponent(responderUsername)}`, bookingForApi);
      
      const backendBooking = response.data;
      const frontendBooking: Booking = {
        id: backendBooking.id || bookingId,
        userName: backendBooking.initialBookerUser?.username || bookingData.userName,
        status: backendBooking.status || 'PENDING',
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || bookingData.practice,
        responses: (backendBooking.bookingResponses || []).map((response: any) => {
          // When withdrawing acceptance, set all responses back to NOT_ANSWERED
          return {
            responder: response.responder || { username: 'Unknown' },
            accepted: response.accepted || false,
            responseStatus: 'NOT_ANSWERED' as const
          };
        })
      };
      
      return frontendBooking;
    } catch (error) {
      console.error('Error withdrawing acceptance:', error);
      throw error;
    }
  }
}