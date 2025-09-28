import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled form container with liquid glass effect
const FormContainer = styled(motion.div)`
  background: var(--glass-background);
  backdrop-filter: blur(12px);
  border: var(--glass-border);
  box-shadow: var(--glass-glow);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 50% 0%, 
      rgba(75, 207, 234, 0.1) 0%, 
      rgba(10, 14, 24, 0) 70%
    );
    pointer-events: none;
    z-index: 0;
  }
`;

// Form title with glow effect
const FormTitle = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(75, 207, 234, 0.3);
`;

// Form group for input + label
const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

// Label with floating animation
const InputLabel = styled.label`
  position: absolute;
  left: 1rem;
  color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
  transition: all 0.3s ease;
  font-size: ${props => props.floating ? '0.8rem' : '1rem'};
  top: ${props => props.floating ? '-0.5rem' : '50%'};
  transform: ${props => props.floating ? 'translateY(0)' : 'translateY(-50%)'};
  background: ${props => props.floating ? 'var(--color-background)' : 'transparent'};
  padding: ${props => props.floating ? '0 0.5rem' : '0'};
  z-index: 1;
`;

// Input field with liquid glass styling
const Input = styled.input`
  width: 100%;
  background: var(--glass-background-accent);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(75, 207, 234, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 0;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 15px rgba(75, 207, 234, 0.4);
  }
  
  &::placeholder {
    color: transparent;
  }
  
  &:focus + ${InputLabel}, &:not(:placeholder-shown) + ${InputLabel} {
    top: -0.5rem;
    font-size: 0.8rem;
    transform: translateY(0);
    background: var(--color-background);
    padding: 0 0.5rem;
  }
`;

// Error message with animation
const ErrorMessage = styled(motion.div)`
  color: var(--color-error);
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    min-width: 16px;
  }
`;

// Checkbox container with custom styling
const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
`;

// Custom checkbox with liquid glass styling
const CustomCheckbox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-background-accent);
  border: 2px solid rgba(75, 207, 234, 0.3);
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.checked && `
    border-color: var(--color-accent);
    box-shadow: 0 0 10px rgba(75, 207, 234, 0.4);
  `}
  
  svg {
    opacity: ${props => props.checked ? 1 : 0};
    transform: ${props => props.checked ? 'scale(1)' : 'scale(0.5)'};
    transition: all 0.2s ease;
  }
`;

// Checkbox label
const CheckboxLabel = styled.label`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  cursor: pointer;
  
  a {
    color: var(--color-accent);
    text-decoration: none;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      bottom: -2px;
      left: 0;
      background-color: var(--color-accent);
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.3s ease;
    }
    
    &:hover:after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
`;

// Form button with liquid glass styling
const StyledFormButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.secondary 
    ? 'transparent' 
    : 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-rich) 100%)'};
  color: ${props => props.secondary ? 'var(--color-accent)' : 'var(--color-background)'};
  border: ${props => props.secondary ? '2px solid var(--color-accent)' : 'none'};
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.secondary 
    ? 'none' 
    : '0 0 15px rgba(75, 207, 234, 0.4)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.secondary 
      ? '0 0 15px rgba(75, 207, 234, 0.3)' 
      : '0 0 20px rgba(75, 207, 234, 0.6)'};
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: translateY(0);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

// Divider with text
const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  
  span {
    padding: 0 1rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }
`;

// Social login button
const SocialButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: var(--glass-background-accent);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(75, 207, 234, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  svg {
    margin-right: 0.75rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(75, 207, 234, 0.4);
    box-shadow: 0 0 15px rgba(75, 207, 234, 0.3);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

// Form footer
const FormFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  
  a {
    color: var(--color-accent);
    text-decoration: none;
    margin-left: 0.5rem;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      bottom: -2px;
      left: 0;
      background-color: var(--color-accent);
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.3s ease;
    }
    
    &:hover:after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
`;

// Form Input Component
export const FormInput = ({ 
  id, 
  type = 'text', 
  label, 
  value, 
  onChange, 
  error, 
  required = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <FormGroup>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={label}
        required={required}
        {...props}
      />
      <InputLabel 
        htmlFor={id} 
        floating={isFocused || value}
      >
        {label}{required && '*'}
      </InputLabel>
      
      {error && (
        <ErrorMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="#FF4C4C"/>
          </svg>
          {error}
        </ErrorMessage>
      )}
    </FormGroup>
  );
};

// Checkbox Component
export const FormCheckbox = ({ 
  id, 
  label, 
  checked, 
  onChange, 
  children 
}) => {
  return (
    <CheckboxContainer onClick={() => onChange(!checked)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={() => {}}
        style={{ display: 'none' }}
      />
      <CustomCheckbox checked={checked}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12L10 17L19 8" stroke="#4BCFEA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </CustomCheckbox>
      <CheckboxLabel htmlFor={id}>
        {children || label}
      </CheckboxLabel>
    </CheckboxContainer>
  );
};

// Button Component
export const FormButton = ({ 
  children, 
  secondary = false, 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <StyledFormButton
      type={type}
      secondary={secondary}
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </StyledFormButton>
  );
};

// Social Login Button
export const SocialLoginButton = ({ 
  icon, 
  children, 
  onClick 
}) => {
  return (
    <SocialButton
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      {children}
    </SocialButton>
  );
};

// Export all components
export {
  FormContainer,
  FormTitle,
  FormGroup,
  Divider,
  FormFooter
};

// Default export for convenience
export default {
  FormContainer,
  FormTitle,
  FormInput,
  FormCheckbox,
  FormButton,
  Divider,
  SocialLoginButton,
  FormFooter
};