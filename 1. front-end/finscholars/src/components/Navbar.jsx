import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from './Button';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition: all 0.3s ease;
  opacity: ${props => props.visible ? 1 : 0};
  transform: translateY(${props => props.visible ? 0 : -20}px);
`;

const GlassNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(10, 14, 24, 0.3);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(75, 207, 234, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(to right, #fff, var(--color-accent));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--color-accent);
    transition: width 0.3s ease;
    box-shadow: 0 0 8px rgba(75, 207, 234, 0.6);
  }
  
  &:hover {
    color: var(--color-accent);
    
    &:after {
      width: 100%;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling down 100px
      if (window.scrollY > 100) {
        setVisible(true);
      } else {
        // On homepage, hide navbar when at the top
        const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
        if (isHomePage) {
          setVisible(false);
        }
      }
    };
    
    // Always show navbar on pages other than homepage
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
    if (!isHomePage) {
      setVisible(true);
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <NavContainer visible={visible}>
      <GlassNav>
        <Logo>FinScholars</Logo>
        
        <NavLinks>
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/modules">Modules</NavLink>
          <NavLink href="/about">About</NavLink>
        </NavLinks>
        
        <ButtonGroup>
          <Button>Login</Button>
          <Button primary>Sign Up</Button>
        </ButtonGroup>
      </GlassNav>
    </NavContainer>
  );
};

export default Navbar;