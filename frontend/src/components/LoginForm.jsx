import { useState } from 'react';
import { useLogin } from '../hooks/useAuthMutations.js';

const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const loginMutation = useLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await loginMutation.mutateAsync(formData);
      if (result.success && onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loginMutation.isPending}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loginMutation.isPending}
          />
        </div>

        {loginMutation.isError && (
          <div className="error-message">
            {loginMutation.error?.message || 'Login failed. Please try again.'}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loginMutation.isPending}
          className="submit-button"
        >
          {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="form-footer">
        <p>
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={onSwitchToRegister}
            className="link-button"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
