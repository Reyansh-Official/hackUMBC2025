import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { registerLoadingCallback } from '../services/api';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.05);
  z-index: 1000;
  pointer-events: none;
  opacity: ${props => props.isLoading ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const LoadingBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4bcfea, #7b68ee);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const LoadingIndicator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Register with the API service to receive loading state updates
    const unregister = registerLoadingCallback(setIsLoading);
    
    // Cleanup on unmount
    return unregister;
  }, []);
  
  useEffect(() => {
    let interval;
    
    if (isLoading) {
      // Reset progress when loading starts
      setProgress(0);
      
      // Animate progress
      interval = setInterval(() => {
        setProgress(prev => {
          // Slow down as it approaches 90%
          if (prev < 90) {
            return prev + (90 - prev) / 10;
          }
          return prev;
        });
      }, 100);
    } else if (progress > 0) {
      // Complete the progress bar when loading finishes
      setProgress(100);
      
      // Reset after animation completes
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, progress]);
  
  return (
    <LoadingOverlay isLoading={isLoading || progress > 0}>
      <LoadingBar progress={progress} />
    </LoadingOverlay>
  );
};

export default LoadingIndicator;