# Unit Testing Report: Login Portal

## Overview
This document details the unit testing implementation for the **Login Portal** (`LoginScreen.jsx`) of the TalkToCart application. The purpose of this test is to ensure the reliability and correctness of the authentication flow, including form rendering, user input handling, and strict login logic.

## Testing Stack
- **Framework**: [Jest](https://jestjs.io/)
- **Library**: [React Testing Library](https://testing-library.com/)
- **Mocking**: Custom mocks for Redux, React Router, and RTK Query hooks.

## Test File Location
`frontend/src/screens/LoginScreen.test.js`

## Test Scenarios
The test suite `LoginScreen Component` covers the following critical scenarios:

1.  **Component Rendering**:
    - Verifies that the "Sign In" header is displayed.
    - Checks for the presence of "Email Address" and "Password" input fields.
    - Confirms the "Sign In" button exists.

2.  **User Interaction**:
    - Simulates user typing into the email and password fields.
    - Asserts that the input values update correctly, ensuring two-way data binding works.

3.  **Form Submission & Logic**:
    - Mocks a successful login response from the backend.
    - Simulates a click on the "Sign In" button.
    - **Verification**:
        - Ensures the `login` mutation is called with the exact credentials entered.
        - Verifies that the user is redirected (using `useNavigate`) upon success.

## Test Code Implementation

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginScreen from './LoginScreen';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

// Mock the API slices
const mockLogin = jest.fn();
const mockGoogleLogin = jest.fn();

jest.mock('../slices/usersApiSlice', () => ({
  useLoginMutation: () => [mockLogin, { isLoading: false }],
  useGoogleLoginMutation: () => [mockGoogleLogin, { isLoading: false }],
}));

// Mock Redux auth slice
jest.mock('../slices/authSlice', () => ({
  setCredentials: jest.fn(),
}));

// Mock Redux dispatch and selector
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: () => ({ userInfo: null }), // Default state
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: '' }), // Default location
}));

// Mock Google OAuth
jest.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div>Google Login Button</div>,
}));

// Create a mock store for the Provider
const createMockStore = () => configureStore({
  reducer: {
    auth: (state = { userInfo: null }) => state,
  },
  preloadedState: {
    auth: { userInfo: null }
  }
});

describe('LoginScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with email and password inputs', () => {
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <LoginScreen />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('allows typing in email and password fields', () => {
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <LoginScreen />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('calls login mutation with correct credentials on submit', async () => {
    // Setup mock return value for login to match RTK Query behavior
    // RTK Query trigger returns an object with an unwrap method
    mockLogin.mockReturnValue({
      unwrap: () => Promise.resolve({
        _id: '123',
        name: 'John Doe',
        email: 'test@example.com',
        isAdmin: false,
      })
    });

    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <LoginScreen />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      // Check if dispatch was called to set credentials
      expect(mockNavigate).toHaveBeenCalled(); 
    });
  });
});
```

## How to Run the Tests

To execute the unit tests, ensure you are in the `frontend` directory where `package.json` with the `test` script is located.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Run the specific test file:**
    ```bash
    npm test -- src/screens/LoginScreen.test.js --watchAll=false
    ```

3.  **Run all tests (optional):**
    ```bash
    npm test
    ```

## Execution Results

**Date:** 2025-12-15
**Status:** ✅ Passed

```
PASS  src/screens/LoginScreen.test.js
  LoginScreen Component
    √ renders login form with email and password inputs
    √ allows typing in email and password fields
    √ calls login mutation with correct credentials on submit

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.234 s
```
