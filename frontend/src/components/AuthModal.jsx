import { useState } from 'react';
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';

const AuthModal = ({ isVisible, onClose, onAuthSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleAuthSuccess = (result) => {
    if (onAuthSuccess) {
      onAuthSuccess(result);
    }
    if (onClose) {
      onClose();
    }
  };

  const switchToRegister = () => setIsLoginMode(false);
  const switchToLogin = () => setIsLoginMode(true);

  if (!isVisible) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          ×
        </button>
        
        {isLoginMode ? (
          <LoginForm 
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={switchToRegister}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
