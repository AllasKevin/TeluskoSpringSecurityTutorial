// Booking service for managing bookings
// This service can be easily replaced with actual API calls

import { Booking } from '../types/booking';
import apiClient from './api-client';

// Mock data - replace with actual API calls
const mockBookings: Booking[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    status: 'PENDING',
    dateTime: new Date('2024-01-15T14:30:00'),
    practice: 'Mindfulness'
  },
  {
    id: '2',
    userName: 'Mike Chen',
    status: 'CONFIRMED',
    dateTime: new Date('2024-01-15T14:30:00'),
    practice: 'Meditation'
  },
  {
    id: '3',
    userName: 'Emma Wilson',
    status: 'PENDING',
    dateTime: new Date('2024-01-15T16:00:00'),
    practice: 'Breathing'
  }
];

export class BookingService {
  // Get all bookings (current user's bookings)
  static async getAllBookings(): Promise<Booking[]> {
    try {
      // Call the backend API
      const response = await apiClient.get('/bookings');
      
      // Transform the response to match our frontend Booking type
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
      // Fallback to mock implementation if API call fails
      return Promise.resolve(mockBookings);
    }
  }

  // Get all free bookings (all pending bookings from other users)
  static async getAllFreeBookings(): Promise<Booking[]> {
    try {
      // Call the backend API
      const response = await apiClient.get('/allfreebookings');
      
      // Transform the response to match our frontend Booking type
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
      // Fallback to mock implementation if API call fails
      return Promise.resolve(mockBookings);
    }
  }

  // Get bookings for a specific date and time
  static async getBookingsForDateTime(dateTime: Date): Promise<Booking[]> {
    try {
      // Create a time range (15 minutes before and after the selected time)
      const startTime = new Date(dateTime.getTime() - 15 * 60 * 1000); // 15 minutes before
      const endTime = new Date(dateTime.getTime() + 15 * 60 * 1000); // 15 minutes after
      
      // Call the backend API
      const response = await apiClient.get('/freebookingsbetween', {
        params: {
          starttime: startTime.toISOString(),
          endtime: endTime.toISOString()
        }
      });
      
      // Transform the response to match our frontend Booking type
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
      // Fallback to mock implementation if API call fails
      return Promise.resolve(
        mockBookings.filter(booking => {
          const bookingDate = new Date(booking.dateTime);
          return bookingDate.getFullYear() === dateTime.getFullYear() &&
                 bookingDate.getMonth() === dateTime.getMonth() &&
                 bookingDate.getDate() === dateTime.getDate() &&
                 bookingDate.getHours() === dateTime.getHours() &&
                 bookingDate.getMinutes() === dateTime.getMinutes();
        })
      );
    }
  }

  // Update booking status
  static async updateBookingStatus(bookingId: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED', bookingData?: Booking): Promise<Booking> {
    try {
      // Use provided booking data or try to find in mock data as fallback
      let booking = bookingData;
      if (!booking) {
        booking = mockBookings.find(b => b.id === bookingId);
        if (!booking) throw new Error('Booking not found');
      }
      
      // Create a booking object for the API call
      const bookingForApi = {
        initialBookerUser: {
          username: booking.userName
        },
        bookedTime: booking.dateTime.toISOString(),
        practice: booking.practice,
        status: "PENDING"
      };
      
      // Call the backend API
      const response = await apiClient.post('/respondtobooking', bookingForApi);
      
      // Transform the response to match our frontend Booking type
      const backendBooking = response.data;
      const frontendBooking: Booking = {
        id: backendBooking.id?.toString() || bookingId,
        userName: backendBooking.initialBookerUser?.username || booking.userName,
        status: backendBooking.status?.toLowerCase() || status,
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || booking.practice,
        responses: (backendBooking.bookingResponses || []).map((response: any) => ({
          responder: response.responder || { username: 'Unknown' },
          accepted: response.accepted || false,
          responseStatus: response.responseStatus || 'NOT_ANSWERED'
        }))
      };
      
      // Update local mock data if it exists
      const mockBooking = mockBookings.find(b => b.id === bookingId);
      if (mockBooking) {
        mockBooking.status = status;
        // Add current user's response to mock data
        const currentUsername = sessionStorage.getItem('username') || 'Current User';
        if (!mockBooking.responses) {
          mockBooking.responses = [];
        }
        // Check if user already responded
        const existingResponse = mockBooking.responses.find(r => r.responder.username === currentUsername);
        if (!existingResponse) {
          mockBooking.responses.push({
            responder: { username: currentUsername },
            accepted: false
          });
        }
      }
      
      return frontendBooking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      // Fallback to mock implementation if API call fails
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');
      
      booking.status = status;
      // Add current user's response to mock data
      const currentUsername = sessionStorage.getItem('username') || 'Current User';
      if (!booking.responses) {
        booking.responses = [];
      }
      // Check if user already responded
      const existingResponse = booking.responses.find(r => r.responder.username === currentUsername);
      if (!existingResponse) {
        booking.responses.push({
          responder: { username: currentUsername },
          accepted: false
        });
      }
      return Promise.resolve(booking);
    }
  }

  // Create new booking
  static async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    try {
      // Convert Date to Instant (ISO string format)
      const bookedTime = booking.dateTime.toISOString();
      
      // Call the backend API
      const response = await apiClient.post('/bookcall', null, {
        params: {
          bookedtime: bookedTime,
          practice: booking.practice
        }
      });
      
      // Transform the response to match our frontend Booking type
      const backendBooking = response.data;
      const frontendBooking: Booking = {
        id: backendBooking.id?.toString() || Date.now().toString(),
        userName: backendBooking.initialBookerUser?.username || 'Unknown User',
        status: backendBooking.status || 'PENDING',
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || booking.practice
      };
      
      return frontendBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      // Fallback to mock implementation if API call fails
      const newBooking: Booking = {
        ...booking,
        id: Date.now().toString() // Simple ID generation for mock
      };
      
      mockBookings.push(newBooking);
      return Promise.resolve(newBooking);
    }
  }

  // Accept booking response (for initial booker)
  static async acceptBookingResponse(bookingId: string, acceptedResponderUsername: string, bookingData?: Booking): Promise<Booking> {
    try {
      // Use provided booking data or try to find in mock data as fallback
      let booking = bookingData;
      if (!booking) {
        booking = mockBookings.find(b => b.id === bookingId);
        if (!booking) throw new Error('Booking not found');
      }
      
      // Create a booking object for the API call
      const bookingForApi = {
        initialBookerUser: {
          username: booking.userName
        },
        bookedTime: booking.dateTime.toISOString(),
        practice: booking.practice,
        status: "PENDING"
      };
      
      // Call the backend API
      const response = await apiClient.post('/acceptbookingresponse', bookingForApi, {
        params: {
          acceptedresponderusername: acceptedResponderUsername
        }
      });
      
      // Transform the response to match our frontend Booking type
      const backendBooking = response.data;
      const frontendBooking: Booking = {
        id: backendBooking.id?.toString() || bookingId,
        userName: backendBooking.initialBookerUser?.username || booking.userName,
        status: backendBooking.status || 'CONFIRMED',
        dateTime: new Date(backendBooking.bookedTime),
        practice: backendBooking.practice || booking.practice,
        responses: (backendBooking.bookingResponses && backendBooking.bookingResponses.length > 0) 
          ? backendBooking.bookingResponses.map((response: any) => ({
              responder: response.responder || { username: 'Unknown' },
              accepted: response.accepted || false,
              responseStatus: response.responseStatus || 'NOT_ANSWERED'
            }))
          : booking.responses?.map(response => ({
              ...response,
              responseStatus: response.responder.username === acceptedResponderUsername ? 'ACCEPTED' as const : response.responseStatus
            })) || []
      };
      
      // Update local mock data if it exists
      const mockBooking = mockBookings.find(b => b.id === bookingId);
      if (mockBooking) {
        mockBooking.status = 'CONFIRMED';
        // Update the response status for the accepted responder
        if (mockBooking.responses) {
          mockBooking.responses = mockBooking.responses.map(response => {
            if (response.responder.username === acceptedResponderUsername) {
              return { ...response, responseStatus: 'ACCEPTED' as const };
            }
            return response;
          });
        }
      }
      
      return frontendBooking;
    } catch (error) {
      console.error('Error accepting booking response:', error);
      // Fallback to mock implementation if API call fails
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');
      
      booking.status = 'CONFIRMED';
      // Update the response status for the accepted responder
      if (booking.responses) {
        booking.responses = booking.responses.map(response => {
          if (response.responder.username === acceptedResponderUsername) {
            return { ...response, responseStatus: 'ACCEPTED' as const };
          }
          return response;
        });
      }
      
      // Return the updated booking with preserved responses
      return Promise.resolve({
        ...booking,
        status: 'CONFIRMED',
        responses: booking.responses?.map(response => ({
          ...response,
          responseStatus: response.responder.username === acceptedResponderUsername ? 'ACCEPTED' as const : response.responseStatus
        })) || []
      });
    }
  }

  // Delete booking
  static async deleteBooking(bookingId: string, bookingData?: Booking): Promise<void> {
    try {
      let booking = bookingData;
      if (!booking) {
        // Fallback to mock data if no booking data provided
        booking = mockBookings.find(b => b.id === bookingId);
        if (!booking) throw new Error('Booking not found');
      }
      
      // Create a booking object for the API call
      const bookingForApi = {
        id: bookingId,
        initialBookerUser: {
          username: booking.userName
        },
        bookedTime: booking.dateTime.toISOString(),
        practice: booking.practice,
        status: booking.status.toUpperCase()
      };
      
      // Call the backend API
      await apiClient.delete('/deletebooking', {
        data: bookingForApi
      });
      
      // Remove from local mock data
      const index = mockBookings.findIndex(b => b.id === bookingId);
      if (index > -1) {
        mockBookings.splice(index, 1);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting booking:', error);
      // Fallback to mock implementation if API call fails
      const index = mockBookings.findIndex(b => b.id === bookingId);
      if (index > -1) {
        mockBookings.splice(index, 1);
      }
      return Promise.resolve();
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
        responses: backendBooking.responses || []
      };
      
      // Update mock data
      const mockBooking = mockBookings.find(b => b.id === bookingId);
      if (mockBooking) {
        // Remove the current user's response from the responses array
        mockBooking.responses = mockBooking.responses?.filter(
          response => response.responder.username !== 'Current User' // TODO: Get actual current username
        ) || [];
      }
      
      return frontendBooking;
    } catch (error) {
      console.error('Error withdrawing booking response:', error);
      // Fallback to mock implementation
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');
      
      // Remove the current user's response from mock data
      booking.responses = booking.responses?.filter(
        response => response.responder.username !== 'Current User' // TODO: Get actual current username
      ) || [];
      
      return Promise.resolve(booking);
    }
  }

  // Decline booking response
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
      
      // Update mock data
      const mockBooking = mockBookings.find(b => b.id === bookingId);
      if (mockBooking) {
        // Update the response status to DECLINED instead of removing
        mockBooking.responses = mockBooking.responses?.map(response => 
          response.responder.username === declinedResponderUsername 
            ? { ...response, responseStatus: 'DECLINED' as const }
            : response
        ) || [];
      }
      
      return frontendBooking;
    } catch (error) {
      console.error('Error declining booking response:', error);
      // Fallback to mock implementation
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');
      
      // Update the response status to DECLINED instead of removing
      booking.responses = booking.responses?.map(response => 
        response.responder.username === declinedResponderUsername 
          ? { ...response, responseStatus: 'DECLINED' as const }
          : response
      ) || [];
      
      return Promise.resolve(booking);
    }
  }

  // Withdraw acceptance (for initial booker to withdraw their acceptance of a response)
  static async withdrawAcceptance(bookingId: string, bookingData: Booking): Promise<Booking> {
    console.log('=== WITHDRAW ACCEPTANCE DEBUG START ===');
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
      
      console.log('=== REQUEST DATA BEING SENT ===');
      console.log('Full request object:', bookingForApi);
      console.log('Request JSON:', JSON.stringify(bookingForApi, null, 2));
      console.log('Responses array:', bookingData.responses);
      console.log('Responses length:', bookingData.responses?.length || 0);
      
      // Get the responder username from the accepted response
      const acceptedResponse = bookingData.responses?.find(response => response.responseStatus === 'ACCEPTED');
      const responderUsername = acceptedResponse?.responder?.username;
      console.log('Accepted response:', acceptedResponse);
      console.log('Responder username:', responderUsername);
      console.log('=== MAKING API CALL TO /withdrawacceptbooking ===');
      
      const response = await apiClient.post(`/withdrawacceptbooking?responderusername=${encodeURIComponent(responderUsername || '')}`, bookingForApi);
      
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
      
      // Update mock data
      const mockBooking = mockBookings.find(b => b.id === bookingId);
      if (mockBooking) {
        // Reset status to PENDING and reset response statuses to NOT_ANSWERED
        mockBooking.status = 'PENDING';
        mockBooking.responses = mockBooking.responses?.map(response => ({
          ...response,
          responseStatus: 'NOT_ANSWERED' as const
        })) || [];
      }
      
      return frontendBooking;
    } catch (error) {
      console.error('Error withdrawing acceptance:', error);
      // Fallback to mock implementation
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');
      
      // Reset status to PENDING and reset response statuses
      booking.status = 'PENDING';
      booking.responses = booking.responses?.map(response => ({
        ...response,
        responseStatus: 'NOT_ANSWERED' as const
      })) || [];
      
      return Promise.resolve(booking);
    }
  }
}
