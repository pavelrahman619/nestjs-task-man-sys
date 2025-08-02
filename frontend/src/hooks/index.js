// Main authentication hooks
export { useAuth } from './useAuth.js';
export { useLogin, useRegister, useLogout, useCurrentUser } from './useAuthMutations.js';

// Additional utility hooks
export { useAuthStatus } from './useAuthStatus.js';
export { useUserProfile } from './useUserProfile.js';
export { useAuthNavigation, useAuthUrlState } from './useAuthNavigation.js';
export { 
  useAuthForm, 
  authValidators, 
  validateLoginForm, 
  validateRegisterForm 
} from './useAuthForm.js';

// Re-export the context for direct access if needed
export { default as AuthContext } from '../contexts/AuthContext.jsx';
