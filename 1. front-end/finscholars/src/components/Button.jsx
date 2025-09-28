import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(75, 207, 234, 0.4);
  }
  50% {
    box-shadow: 0 0 15px rgba(75, 207, 234, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(75, 207, 234, 0.4);
  }
`;

const ButtonBase = styled.button`
  font-family: var(--font-primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  outline: none;
  letter-spacing: 0.5px;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(75, 207, 234, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:hover:before {
    opacity: 1;
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: var(--color-accent-rich);
  color: white;
  border: none;
  box-shadow: 0 0 10px rgba(75, 207, 234, 0.4);
  
  &:hover {
    box-shadow: 0 0 15px rgba(75, 207, 234, 0.6);
    animation: ${pulseGlow} 2s infinite;
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background-color: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  box-shadow: 0 0 5px rgba(75, 207, 234, 0.2);
  
  &:hover {
    background-color: rgba(75, 207, 234, 0.1);
    box-shadow: 0 0 10px rgba(75, 207, 234, 0.4);
  }
`;

const Button = ({ primary, children, ...props }) => {
  return primary ? (
    <PrimaryButton {...props}>{children}</PrimaryButton>
  ) : (
    <SecondaryButton {...props}>{children}</SecondaryButton>
  );
};

export default Button;