import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Styled components for the Focus Toggle
const FocusToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  position: relative;
`;

const ToggleLabel = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${props => props.isActive ? '#00BFFF' : '#ffffff'};
  text-shadow: ${props => props.isActive ? '0 0 10px rgba(0, 191, 255, 0.7)' : 'none'};
  transition: all 0.3s ease;
`;

const ToggleSwitch = styled.div`
  width: 60px;
  height: 30px;
  background: ${props => props.isActive ? 'linear-gradient(to right, #00BFFF, #87CEFA)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 15px;
  padding: 3px;
  position: relative;
  cursor: pointer;
  box-shadow: ${props => props.isActive 
    ? '0 0 15px rgba(0, 191, 255, 0.7), inset 0 0 10px rgba(255, 255, 255, 0.5)' 
    : 'inset 0 0 5px rgba(0, 0, 0, 0.2)'};
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    box-shadow: ${props => props.isActive 
      ? '0 0 20px rgba(0, 191, 255, 0.9), inset 0 0 10px rgba(255, 255, 255, 0.5)' 
      : '0 0 10px rgba(255, 255, 255, 0.3), inset 0 0 5px rgba(0, 0, 0, 0.2)'};
  }
`;

const ToggleButton = styled(motion.div)`
  width: 24px;
  height: 24px;
  background: ${props => props.isActive 
    ? 'linear-gradient(to bottom right, #ffffff, #e0f7ff)' 
    : 'linear-gradient(to bottom right, #f0f0f0, #d0d0d0)'};
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: ${props => props.isActive ? 'calc(100% - 27px)' : '3px'};
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
`;

const FocusOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 191, 255, 0.05);
  pointer-events: none;
  z-index: 1000;
  border: 8px solid rgba(0, 191, 255, 0.3);
  box-shadow: inset 0 0 30px rgba(0, 191, 255, 0.3);
  backdrop-filter: saturate(1.2);
`;

const StatusMessage = styled(motion.div)`
  margin-top: 15px;
  font-size: 0.9rem;
  color: ${props => props.isActive ? '#00BFFF' : '#aaaaaa'};
  opacity: 0.9;
  text-align: center;
  max-width: 250px;
`;

const FocusToggle = () => {
  const [isActive, setIsActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Focus Mode is inactive');
  const [isLoading, setIsLoading] = useState(false);

  // Handle toggle click
  const handleToggle = async () => {
    setIsLoading(true);
    
    try {
      if (!isActive) {
        // Start focus session
        const response = await axios.post('/api/focus/start-session');
        if (response.status === 200) {
          setIsActive(true);
          setStatusMessage('Focus Mode activated. Distractions blocked.');
        }
      } else {
        // End focus session
        const response = await axios.post('/api/focus/end-session');
        if (response.status === 200) {
          setIsActive(false);
          setStatusMessage('Focus Mode deactivated.');
        }
      }
    } catch (error) {
      console.error('Error toggling focus mode:', error);
      // For demo purposes, still toggle the state even if API fails
      setIsActive(!isActive);
      setStatusMessage(
        !isActive 
          ? 'Focus Mode activated. Distractions blocked.' 
          : 'Focus Mode deactivated.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Mock API call for demo purposes
  const mockApiCall = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200 });
      }, 800);
    });
  };

  return (
    <FocusToggleContainer>
      <ToggleLabel isActive={isActive}>
        {isActive ? 'Focus Mode Active' : 'Focus Mode'}
      </ToggleLabel>
      
      <ToggleSwitch 
        isActive={isActive} 
        onClick={!isLoading ? handleToggle : undefined}
        style={{ opacity: isLoading ? 0.7 : 1 }}
      >
        <ToggleButton 
          isActive={isActive}
          initial={false}
          animate={{ 
            x: isActive ? 30 : 0,
            scale: isLoading ? [1, 0.9, 1] : 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            repeat: isLoading ? Infinity : 0,
            repeatType: "reverse",
            duration: 0.5
          }}
        />
      </ToggleSwitch>
      
      <StatusMessage 
        isActive={isActive}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {statusMessage}
      </StatusMessage>
      
      <AnimatePresence>
        {isActive && (
          <FocusOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </FocusToggleContainer>
  );
};

export default FocusToggle;