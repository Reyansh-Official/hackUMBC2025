import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BackgroundAnimation from '../components/BackgroundAnimation';
import Button from '../components/Button';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const TitleContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  z-index: 2;
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 700;
  text-align: center;
  background: linear-gradient(to right, #fff, var(--color-accent), #fff);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(75, 207, 234, 0.1);
    filter: blur(40px);
    z-index: -1;
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.5rem);
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto 3rem;
`;

const IconsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
`;

const FinancialIcon = styled(motion.div)`
  position: absolute;
  width: ${props => props.size || '60px'};
  height: ${props => props.size || '60px'};
  opacity: 0.4;
  
  svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 8px rgba(75, 207, 234, 0.6));
  }
`;

const HomePage = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentage of screen
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;
      
      // Apply parallax effect to title
      const title = document.querySelector('#title');
      if (title) {
        title.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <HomeContainer ref={containerRef}>
      <BackgroundAnimation />
      
      <IconsContainer>
        {/* Bar Chart Icon */}
        <FinancialIcon 
          size="80px"
          style={{ top: '30%', left: '15%' }}
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17V7M8 17V11M13 17V13M18 17V15M21 21H3" stroke="#4BCFEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </FinancialIcon>
        
        {/* Coin Icon */}
        <FinancialIcon 
          size="70px"
          style={{ top: '60%', right: '20%' }}
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="#4BCFEA" strokeWidth="2"/>
            <path d="M12 7V17M15 10H9M15 14H9" stroke="#4BCFEA" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </FinancialIcon>
        
        {/* Line Graph Icon */}
        <FinancialIcon 
          size="90px"
          style={{ bottom: '25%', left: '25%' }}
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17L9 11L13 15L21 7M21 7H16M21 7V12" stroke="#4BCFEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </FinancialIcon>
      </IconsContainer>
      
      <TitleContainer>
        <Title 
          id="title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          FinScholars
        </Title>
        <Subtitle>
          Elevate your financial knowledge with our immersive learning platform
        </Subtitle>
      </TitleContainer>
      
      <Button 
        primary
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        About Us
      </Button>
    </HomeContainer>
  );
};

export default HomePage;