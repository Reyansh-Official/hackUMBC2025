import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  FormContainer, 
  FormTitle, 
  FormInput, 
  FormCheckbox, 
  Divider, 
  FormFooter 
} from '../components/FormComponents';

// Styled components for the login page
const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const LoginForm = styled(FormContainer)`
  max-width: 450px;
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: -1rem;
  margin-bottom: 1.5rem;
  
  a {
    color: var(--color-accent);
    font-size: 0.85rem;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      text-shadow: 0 0 8px rgba(75, 207, 234, 0.5);
    }
  }
`;

const LoginButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-rich) 100%);
  color: var(--color-background);
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(75, 207, 234, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(75, 207, 234, 0.6);
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Auth context and navigation
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle input change for email
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  // Handle input change for password
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  // Handle checkbox change
  const handleRememberMeChange = (checked) => {
    setRememberMe(checked);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Simple validation
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      
      const result = await login(email, password);
      
      if (result.success) {
        if (result.isNewUser) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Failed to log in');
      }
    } catch (err) {
      setError('Failed to log in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginPageContainer>
      <LoginForm
        as={motion.form}
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <FormTitle>Welcome Back</FormTitle>
        
        <FormInput
          id="email"
          type="email"
          label="Email Address"
          value={email}
          onChange={handleEmailChange}
          error={error && !email ? 'Email is required' : ''}
          required
        />
        
        <FormInput
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={handlePasswordChange}
          error={error && !password ? 'Password is required' : ''}
          required
        />
        
        <ForgotPassword>
          <Link to="/forgot-password">Forgot password?</Link>
        </ForgotPassword>
        
        <FormCheckbox
          id="remember-me"
          checked={rememberMe}
          onChange={handleRememberMeChange}
        >
          Remember me
        </FormCheckbox>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <LoginButton
          type="submit"
          disabled={loading}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </LoginButton>
        
        <Divider>
          <span>OR</span>
        </Divider>
        
        <SocialButton
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => console.log('Google login')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
            <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z" fill="#FF3D00"/>
            <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill="#4CAF50"/>
            <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
          </svg>
          Continue with Google
        </SocialButton>
        
        <FormFooter>
          Don't have an account?
          <Link to="/signup">Sign up</Link>
        </FormFooter>
      </LoginForm>
    </LoginPageContainer>
  );
};

export default LoginPage;