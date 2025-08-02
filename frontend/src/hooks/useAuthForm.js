import { useState, useCallback } from 'react';

/**
 * Hook for managing form state with validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validationFn - Validation function
 * @returns {Object} Form state and handlers
 */
export const useAuthForm = (initialValues = {}, validationFn = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur if validation function provided
    if (validationFn && touched[name]) {
      const fieldErrors = validationFn(values);
      if (fieldErrors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldErrors[name]
        }));
      }
    }
  }, [validationFn, values, touched]);

  const validate = useCallback(() => {
    if (!validationFn) return {};
    
    const newErrors = validationFn(values);
    setErrors(newErrors);
    return newErrors;
  }, [validationFn, values]);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate
    const validationErrors = validate();
    const hasErrors = Object.keys(validationErrors).length > 0;

    if (!hasErrors) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }

    setIsSubmitting(false);
    return !hasErrors;
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    reset,
    setValue,
    
    // Helper methods
    getFieldProps: (name) => ({
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur,
    }),
    
    getFieldError: (name) => touched[name] && errors[name],
    
    hasErrors: Object.keys(errors).length > 0,
    
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Common validation functions for auth forms
 */
export const authValidators = {
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email';
    return '';
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  },

  confirmPassword: (value, password) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  },

  name: (value) => {
    if (value && value.length < 2) return 'Name must be at least 2 characters';
    return '';
  },
};

/**
 * Validation function for login form
 */
export const validateLoginForm = (values) => {
  const errors = {};
  
  const emailError = authValidators.email(values.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = authValidators.password(values.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

/**
 * Validation function for register form
 */
export const validateRegisterForm = (values) => {
  const errors = {};
  
  const emailError = authValidators.email(values.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = authValidators.password(values.password);
  if (passwordError) errors.password = passwordError;
  
  const nameError = authValidators.name(values.name);
  if (nameError) errors.name = nameError;
  
  if (values.confirmPassword !== undefined) {
    const confirmPasswordError = authValidators.confirmPassword(
      values.confirmPassword, 
      values.password
    );
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  }
  
  return errors;
};
