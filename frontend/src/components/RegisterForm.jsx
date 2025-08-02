import { useState } from 'react';
import { useRegister } from '../hooks/useAuthMutations.js';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const registerMutation = useRegister();

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
      const result = await registerMutation.mutateAsync(formData);
      if (result.success && onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name (optional):</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={registerMutation.isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={registerMutation.isPending}
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
            disabled={registerMutation.isPending}
          />
        </div>

        {registerMutation.isError && (
          <div className="error-message">
            {registerMutation.error?.message || 'Registration failed. Please try again.'}
          </div>
        )}

        <button 
          type="submit" 
          disabled={registerMutation.isPending}
          className="submit-button"
        >
          {registerMutation.isPending ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      <div className="form-footer">
        <p>
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={onSwitchToLogin}
            className="link-button"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
