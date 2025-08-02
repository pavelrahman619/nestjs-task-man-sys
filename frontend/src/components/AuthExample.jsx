import React from 'react';
import { useAuthStatus, useAuthForm, validateLoginForm } from '../hooks/index.js';

/**
 * Example component demonstrating the enhanced auth hooks
 */
const AuthExample = () => {
  const { 
    isAuthenticated, 
    isGuest, 
    getUserDisplayName, 
    canAccess 
  } = useAuthStatus();

  const {
    values,
    errors,
    getFieldProps,
    getFieldError,
    handleSubmit,
    isSubmitting
  } = useAuthForm(
    { email: '', password: '' },
    validateLoginForm
  );

  const onLogin = async (formData) => {
    console.log('Login with:', formData);
    // Your login logic here
  };

  if (isAuthenticated) {
    return (
      <div className="auth-example">
        <h3>Welcome back, {getUserDisplayName()}!</h3>
        <p>You are authenticated</p>
        <p>Can access admin: {canAccess('admin') ? 'Yes' : 'No'}</p>
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="auth-example">
        <h3>Enhanced Login Form Example</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onLogin);
        }}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              {...getFieldProps('email')}
              disabled={isSubmitting}
            />
            {getFieldError('email') && (
              <span className="error">{getFieldError('email')}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              {...getFieldProps('password')}
              disabled={isSubmitting}
            />
            {getFieldError('password') && (
              <span className="error">{getFieldError('password')}</span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default AuthExample;
