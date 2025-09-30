# Mobile-Friendly Booking System

This document describes the refactored date & time picking flow that is optimized for mobile devices.

## Features

### Mobile-Friendly DatePicker

- Uses `react-datepicker` with `withPortal` option for fullscreen modal on mobile
- Responsive design that adapts to screen size
- Touch-friendly interface with proper sizing
- Prevents iOS zoom on input focus

### Booking Management

- **Date/Time Selection**: Users can select both date and time with 15-minute intervals
- **Booking Display**: Shows all bookings for the selected date/time
- **Status Management**: Accept/Decline buttons for pending bookings
- **Create Booking**: Button to create new bookings at selected time
- **Real-time Updates**: Local state updates immediately after actions

### Mobile Optimization

- **Touch Targets**: All buttons are minimum 44px height for easy tapping
- **Responsive Layout**: Adapts to different screen sizes
- **Portal Mode**: DatePicker opens as fullscreen modal on mobile
- **Proper Spacing**: Adequate padding and margins for mobile use
- **Flexible Layout**: Cards stack vertically on small screens

## File Structure

```
components/PracticesPage/components/
├── ScheduleCallSection.tsx     # Main component with booking UI
├── ScheduleCallSection.css     # Mobile-specific styles
└── README.md                   # This documentation

services/
└── bookingService.ts           # Service layer for API calls

types/
└── booking.ts                  # TypeScript interfaces
```

## Usage

The component automatically detects mobile devices and adjusts the UI accordingly:

```tsx
<ScheduleCallSection
  practice="Mindfulness"
  // ... other props
/>
```

## Backend Integration

The booking system is designed to be easily connected to a backend API. Simply replace the mock implementations in `bookingService.ts` with actual API calls:

```typescript
// Example API integration
static async getAllBookings(): Promise<Booking[]> {
  const response = await fetch('/api/bookings');
  return await response.json();
}
```

## Mobile Features

### DatePicker

- **Desktop**: Standard dropdown placement
- **Mobile**: Fullscreen portal mode
- **Touch-friendly**: Large touch targets
- **Accessibility**: Proper labels and focus management

### Booking Cards

- **Responsive**: Stacks vertically on mobile
- **Status Indicators**: Color-coded status badges
- **Action Buttons**: Full-width on mobile for easy tapping
- **Loading States**: Error handling with user feedback

### Styling

- **CSS Classes**: Modular styling with mobile-first approach
- **Media Queries**: Responsive breakpoints at 768px and 480px
- **Touch Optimization**: Proper button sizing and spacing
- **Visual Feedback**: Hover and active states for better UX

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live booking updates
2. **User Authentication**: Integration with auth context for user-specific bookings
3. **Calendar View**: Monthly/weekly calendar view option
4. **Notifications**: Push notifications for booking updates
5. **Offline Support**: PWA capabilities for offline booking management

## Testing

The component includes mock data for testing purposes. To test with real data:

1. Replace `BookingService` methods with actual API calls
2. Update the mock data structure if needed
3. Test on various mobile devices and screen sizes
4. Verify touch interactions work properly

## Browser Support

- **Mobile**: iOS Safari 12+, Chrome Mobile 70+
- **Desktop**: Chrome 70+, Firefox 65+, Safari 12+
- **Features**: Modern JavaScript features with fallbacks for older browsers
