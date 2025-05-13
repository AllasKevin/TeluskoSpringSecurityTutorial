# RegisterPage Component

A fully styled registration page component that handles user registration with form validation and error handling.

## Features

- Custom styled UI with animated background shapes
- Form validation using Zod schema
- Integration with authentication system
- Responsive design
- Error handling and display
- Navigation to login page

## Usage

```tsx
import { RegisterPage } from "./scenes/RegisterPage";

// In your router
<Route path="/register" element={<RegisterPage />} />;
```

## Component Structure

The component is organized into several files:

- `RegisterPage.tsx`: Main component implementation
- `RegisterPage.css`: Styles for the component
- `index.ts`: Barrel file for clean exports
- `RegisterService.ts`: API integration service

## Form Validation

The component uses Zod for form validation with the following rules:

- Username: 3-50 characters
- Email: Valid email format
- Password:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

## Styling

The component uses custom CSS classes for styling with:

- Responsive design
- Custom input styling
- Animated background shapes
- Error state handling
- Hover effects

## Dependencies

- react-hook-form
- zod
- @hookform/resolvers/zod
- react-router-dom

## Error Handling

The component handles and displays errors for:

- Form validation errors
- API registration errors
- Network errors

## Navigation

After successful registration, the user is redirected to the login page.
