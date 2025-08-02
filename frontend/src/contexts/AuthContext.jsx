import { createContext, useReducer, useEffect } from 'react';
import { api } from '../lib/api.js';

// Auth state interface
const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Auth action types
const AUTH_ACTIONS = {
  LOADING: 'LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load token from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          // Parse stored user data
          const userData = JSON.parse(storedUser);

          // Verify token is still valid by fetching user data
          try {
            const response = await api.get('/users/me', {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });

            if (response.success) {
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                  user: response.data,
                  token: storedToken,
                },
              });
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');
              dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            // Token verification failed, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    loadStoredAuth();

    // Listen for logout events from API layer
    const handleLogoutEvent = () => {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    window.addEventListener('auth-logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING });

      const response = await api.post('/auth/signin', credentials);

      if (response.success) {
        const { user, access_token } = response.data;

        // Store in localStorage
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('auth_user', JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token: access_token },
        });

        return { success: true, data: response.data };
      } else {
        const errorMessage = response.message || 'Login failed';
        dispatch({
          type: AUTH_ACTIONS.LOGIN_ERROR,
          payload: errorMessage,
        });
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING });

      const response = await api.post('/auth/signup', userData);

      if (response.success) {
        const { user, access_token } = response.data;

        // Store in localStorage
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('auth_user', JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token: access_token },
        });

        return { success: true, data: response.data };
      } else {
        const errorMessage = response.message || 'Registration failed';
        dispatch({
          type: AUTH_ACTIONS.LOGIN_ERROR,
          payload: errorMessage,
        });
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Get auth header for API requests
  const getAuthHeader = () => {
    if (state.token) {
      return { Authorization: `Bearer ${state.token}` };
    }
    return {};
  };

  const value = {
    // State
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    clearError,
    getAuthHeader,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
