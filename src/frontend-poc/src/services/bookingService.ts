// Booking service for managing bookings
// This service can be easily replaced with actual API calls

import { Booking } from '../types/booking';

// Mock data - replace with actual API calls
const mockBookings: Booking[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    status: 'pending',
    dateTime: new Date('2024-01-15T14:30:00'),
    practice: 'Mindfulness'
  },
  {
    id: '2',
    userName: 'Mike Chen',
    status: 'accepted',
    dateTime: new Date('2024-01-15T14:30:00'),
    practice: 'Meditation'
  },
  {
    id: '3',
    userName: 'Emma Wilson',
    status: 'pending',
    dateTime: new Date('2024-01-15T16:00:00'),
    practice: 'Breathing'
  }
];

export class BookingService {
  // Get all bookings
  static async getAllBookings(): Promise<Booking[]> {
    // TODO: Replace with actual API call
    // return await fetch('/api/bookings').then(res => res.json());
    return Promise.resolve(mockBookings);
  }

  // Get bookings for a specific date and time
  static async getBookingsForDateTime(dateTime: Date): Promise<Booking[]> {
    // TODO: Replace with actual API call
    // return await fetch(`/api/bookings?dateTime=${dateTime.toISOString()}`).then(res => res.json());
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

  // Update booking status
  static async updateBookingStatus(bookingId: string, status: 'accepted' | 'declined'): Promise<Booking> {
    // TODO: Replace with actual API call
    // return await fetch(`/api/bookings/${bookingId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status })
    // }).then(res => res.json());
    
    const booking = mockBookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    
    booking.status = status;
    return Promise.resolve(booking);
  }

  // Create new booking
  static async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    // TODO: Replace with actual API call
    // return await fetch('/api/bookings', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(booking)
    // }).then(res => res.json());
    
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString() // Simple ID generation for mock
    };
    
    mockBookings.push(newBooking);
    return Promise.resolve(newBooking);
  }

  // Delete booking
  static async deleteBooking(bookingId: string): Promise<void> {
    // TODO: Replace with actual API call
    // return await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
    
    const index = mockBookings.findIndex(b => b.id === bookingId);
    if (index > -1) {
      mockBookings.splice(index, 1);
    }
    return Promise.resolve();
  }
}
