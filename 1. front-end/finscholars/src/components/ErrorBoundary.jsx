import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff5252;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 350px;
  animation: slideIn 0.3s ease-out forwards;
  
  @keyframes slideIn {
    from { transform: translateY(100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 14px;
`;

// Global error state management
let setGlobalError = null;
let errorTimeout = null;

export const showError = (message, duration = 5000) => {
  if (setGlobalError) {
    // Clear any existing timeout
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
    
    // Set the error
    setGlobalError({ message, visible: true });
    
    // Auto-hide after duration
    if (duration > 0) {
      errorTimeout = setTimeout(() => {
        setGlobalError(prev => ({ ...prev, visible: false }));
      }, duration);
    }
  }
};

const ErrorBoundary = ({ children }) => {
  const [error, setError] = useState({ message: '', visible: false });
  
  // Store the setter in the module-level variable
  useEffect(() => {
    setGlobalError = setError;
    
    // Cleanup
    return () => {
      setGlobalError = null;
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };
  }, []);
  
  const handleClose = () => {
    setError(prev => ({ ...prev, visible: false }));
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
  };
  
  return (
    <>
      {children}
      
      {error.visible && (
        <ErrorContainer>
          <CloseButton onClick={handleClose}>×</CloseButton>
          <ErrorTitle>Error</ErrorTitle>
          <ErrorMessage>{error.message}</ErrorMessage>
        </ErrorContainer>
      )}
    </>
  );
};

export default ErrorBoundary;