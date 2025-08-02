# Authentication System Documentation

## Overview

Your frontend already has a **complete, production-ready authentication system** built with React Context, TanStack Query, and JWT tokens.

## 📁 File Structure

```
src/
├── contexts/
│   └── AuthContext.jsx          # Main auth context with state management
├── hooks/
│   ├── useAuth.js              # Basic auth hook
│   ├── useAuthMutations.js     # TanStack Query auth mutations
│   ├── useAuthStatus.js        # Auth status utilities
│   ├── useUserProfile.js       # User profile operations
│   ├── useAuthNavigation.js    # Navigation & redirects
│   ├── useAuthForm.js          # Form validation utilities
│   └── index.js                # Export all hooks
├── components/
│   ├── AuthModal.jsx           # Modal container for auth forms
│   ├── LoginForm.jsx           # Login form component
│   ├── RegisterForm.jsx        # Registration form component
│   ├── UserProfile.jsx         # User profile display
│   ├── ProtectedRoute.jsx      # Route protection wrapper
│   └── AuthExample.jsx         # Usage examples
└── main.jsx                    # AuthProvider setup
```

## 🚀 Quick Start

### 1. Basic Authentication Check

```jsx
import { useAuth } from './hooks/useAuth.js';

function MyComponent() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  
  return <div>Welcome {user.name}!</div>;
}
```

### 2. Login/Register

```jsx
import { useLogin, useRegister } from './hooks/useAuthMutations.js';

function AuthForm() {
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleLogin = async () => {
    const result = await loginMutation.mutateAsync({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (result.success) {
      console.log('Logged in!', result.data);
    }
  };

  return (
    <button onClick={handleLogin} disabled={loginMutation.isPending}>
      {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
    </button>
  );
}
```

### 3. Protected Routes

```jsx
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <ProtectedRoute fallback={<div>Please sign in</div>}>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### 4. Auth Status Utilities

```jsx
import { useAuthStatus } from './hooks/useAuthStatus.js';

function UserInfo() {
  const { 
    isAuthenticated, 
    isGuest, 
    getUserDisplayName,
    canAccess,
    isCurrentUser 
  } = useAuthStatus();

  return (
    <div>
      <p>Status: {isGuest ? 'Guest' : 'Authenticated'}</p>
      <p>Name: {getUserDisplayName()}</p>
      <p>Can access admin: {canAccess('admin') ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

## 🔧 Available Hooks

### Core Hooks
- **`useAuth()`** - Basic auth state and actions
- **`useLogin()`** - Login mutation with TanStack Query
- **`useRegister()`** - Registration mutation
- **`useLogout()`** - Logout mutation

### Utility Hooks
- **`useAuthStatus()`** - Auth status helpers
- **`useUserProfile()`** - User profile operations
- **`useAuthNavigation()`** - Navigation and redirects
- **`useAuthForm()`** - Form validation utilities

## 🔐 Features

### ✅ Implemented
- JWT token management (localStorage)
- Token validation on app load
- Automatic token refresh detection
- Login/Register forms with validation
- Protected route components
- Loading states and error handling
- TanStack Query integration
- User profile management
- Auto-logout on invalid tokens

### 🎯 Key Components
- **AuthModal** - Complete modal with login/register forms
- **ProtectedRoute** - Wrapper for protected content
- **UserProfile** - User info display with logout
- **Login/RegisterForm** - Styled auth forms

## 🛠️ Customization

### Adding Form Validation
```jsx
import { useAuthForm, validateLoginForm } from './hooks/useAuthForm.js';

const {
  getFieldProps,
  getFieldError,
  handleSubmit,
  isSubmitting
} = useAuthForm(
  { email: '', password: '' },
  validateLoginForm
);
```

### Custom Validation Rules
```jsx
import { authValidators } from './hooks/useAuthForm.js';

const customValidation = (values) => {
  const errors = {};
  
  const emailError = authValidators.email(values.email);
  if (emailError) errors.email = emailError;
  
  // Add custom validation
  if (values.username && values.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  return errors;
};
```

## 🔄 State Management

The auth system uses React's `useReducer` for state management:

```javascript
const authState = {
  user: null,              // User object from API
  token: null,             // JWT token
  isLoading: true,         // Loading state
  isAuthenticated: false,  // Auth status
  error: null             // Error message
};
```

## 🚦 Integration with Backend

Your auth system is already configured to work with your NestJS backend:

- **Login**: `POST /auth/signin`
- **Register**: `POST /auth/signup`
- **Profile**: `GET /users/me`
- **Headers**: `Authorization: Bearer <token>`

## 💡 Usage Tips

1. **Always wrap your app with AuthProvider** (already done in `main.jsx`)
2. **Use ProtectedRoute for sensitive content**
3. **Check `isLoading` before rendering auth-dependent content**
4. **Use TanStack Query mutations for auth operations**
5. **Handle errors gracefully with the built-in error states**

## 🎨 Styling

Auth components use CSS classes that you can style:
- `.auth-modal-overlay`
- `.auth-modal-content`
- `.auth-form`
- `.form-group`
- `.error-message`
- `.loading-container`

Your auth system is ready to use! 🎉
