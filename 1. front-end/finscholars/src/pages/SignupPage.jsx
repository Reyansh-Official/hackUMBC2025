import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FormContainer, 
  FormTitle, 
  FormInput, 
  FormCheckbox, 
  Divider, 
  FormFooter
} from '../components/FormComponents';

// Styled components for the signup page
const SignupPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const SignupForm = styled(FormContainer)`
  max-width: 500px;
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const StrengthBar = styled.div`
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const StrengthIndicator = styled(motion.div)`
  height: 100%;
  background: ${props => {
    if (props.strength === 'weak') return 'var(--color-error)';
    if (props.strength === 'medium') return '#FFC107';
    if (props.strength === 'strong') return '#4CAF50';
    return 'transparent';
  }};
  border-radius: 2px;
`;

const StrengthText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  
  span {
    color: ${props => {
      if (props.strength === 'weak') return 'var(--color-error)';
      if (props.strength === 'medium') return '#FFC107';
      if (props.strength === 'strong') return '#4CAF50';
      return 'rgba(255, 255, 255, 0.6)';
    }};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

// Step indicator component
const StepIndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const StepDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.2)'};
  margin: 0 6px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 0 10px var(--color-accent)' : 'none'};
`;

const StepLine = styled.div`
  height: 2px;
  width: 30px;
  background: ${props => props.active ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.2)'};
  margin: auto 0;
`;

// Liquid Glass Card for interests
const InterestsCard = styled(motion.div)`
  background: rgba(75, 207, 234, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(75, 207, 234, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 20px rgba(75, 207, 234, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(75, 207, 234, 0.1) 0%,
      transparent 70%
    );
    transform: rotate(45deg);
    pointer-events: none;
    z-index: 0;
  }
`;

const InterestsTitle = styled.h3`
  font-size: 1.2rem;
  color: white;
  margin-bottom: 1rem;
  text-align: center;
`;

const InterestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const InterestTag = styled.div`
  background: ${props => props.selected ? 'rgba(75, 207, 234, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.selected ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  box-shadow: ${props => props.selected ? '0 0 10px rgba(75, 207, 234, 0.4)' : 'none'};
  
  &:hover {
    background: rgba(75, 207, 234, 0.2);
    border-color: rgba(75, 207, 234, 0.4);
  }
`;

const SignupButton = styled(motion.button)`
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

const SignupPage = () => {
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: []
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  
  // Available financial interests
  const availableInterests = [
    'Investing', 'Budgeting', 'Retirement', 'Stocks', 
    'Crypto', 'Real Estate', 'Taxes', 'Credit Score',
    'Debt Management', 'Financial Planning', 'Insurance', 'Savings'
  ];
  
  // Auth context and navigation
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  // Handle interest selection
  const toggleInterest = (interest) => {
    setFormData(prev => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...interests, interest] };
      }
    });
  };
  
  // Handle form navigation
  const nextStep = () => {
    if (currentStep === 1) {
      // Validate first step before proceeding
      const stepErrors = {};
      if (!formData.firstName) stepErrors.firstName = 'First name is required';
      if (!formData.lastName) stepErrors.lastName = 'Last name is required';
      if (!formData.email) stepErrors.email = 'Email is required';
      if (!formData.password) stepErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
    setErrors({});
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Check password strength
    if (id === 'password') {
      checkPasswordStrength(value);
    }
    
    // Check password match
    if (id === 'confirmPassword' || (id === 'password' && formData.confirmPassword)) {
      if (id === 'password' && value !== formData.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match'
        });
      } else if (id === 'confirmPassword' && value !== formData.password) {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match'
        });
      } else {
        setErrors({
          ...errors,
          confirmPassword: null
        });
      }
    }
    
    // Clear error when user types
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const strength = 
      (hasLowerCase ? 1 : 0) + 
      (hasUpperCase ? 1 : 0) + 
      (hasNumber ? 1 : 0) + 
      (hasSpecialChar ? 1 : 0) + 
      (isLongEnough ? 1 : 0);
    
    if (strength <= 2) {
      setPasswordStrength('weak');
    } else if (strength <= 4) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form based on current step
    const formErrors = {};
    
    if (currentStep === 2) {
      // Validate interests selection
      if (formData.interests.length === 0) {
        formErrors.interests = 'Please select at least one interest';
      }
    } else {
      // First step validation
      if (!formData.firstName) formErrors.firstName = 'First name is required';
      if (!formData.lastName) formErrors.lastName = 'Last name is required';
      if (!formData.email) formErrors.email = 'Email is required';
      if (!formData.password) formErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        formErrors.confirmPassword = 'Passwords do not match';
      }
      if (!agreeTerms) formErrors.terms = 'You must agree to the terms';
    }
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call signup function from auth context with both credentials and interests
      const result = await signup(
        formData.email, 
        formData.password, 
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          interests: formData.interests
        }
      );
      
      if (result.success) {
        // Redirect to onboarding for new users
        navigate('/onboarding');
      } else {
        setErrors({ form: result.error || 'Failed to create account. Please try again.' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        form: error.message || 'Failed to create account. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get strength width percentage
  const getStrengthWidth = () => {
    if (passwordStrength === 'weak') return '33.3%';
    if (passwordStrength === 'medium') return '66.6%';
    if (passwordStrength === 'strong') return '100%';
    return '0%';
  };

  return (
    <SignupPageContainer>
      <SignupForm
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <FormTitle>{currentStep === 1 ? 'Create Account' : 'Select Your Interests'}</FormTitle>
        
        {/* Step Indicator */}
        <StepIndicatorContainer>
          <StepDot active={currentStep >= 1} />
          <StepLine active={currentStep >= 2} />
          <StepDot active={currentStep >= 2} />
        </StepIndicatorContainer>
        
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <FormRow>
                  <FormInput
                    id="firstName"
                    type="text"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    required
                  />
                  
                  <FormInput
                    id="lastName"
                    type="text"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    required
                  />
                </FormRow>
                
                <FormInput
                  id="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                
                <FormInput
                  id="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                
                <AnimatePresence>
                  {formData.password && (
                    <PasswordStrength
                      as={motion.div}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StrengthBar>
                        <StrengthIndicator 
                          strength={passwordStrength}
                          initial={{ width: '0%' }}
                          animate={{ width: getStrengthWidth() }}
                          transition={{ duration: 0.5 }}
                        />
                      </StrengthBar>
                      <StrengthText strength={passwordStrength}>
                        <span>Password Strength: {passwordStrength || 'None'}</span>
                      </StrengthText>
                    </PasswordStrength>
                  )}
                </AnimatePresence>
                
                <FormInput
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
                
                <FormCheckbox
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={setAgreeTerms}
                  error={errors.agreeTerms}
                >
                  I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                </FormCheckbox>
                
                <SignupButton 
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue to Interests
                </SignupButton>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Liquid Glass Card for Interests */}
                <InterestsCard>
                  <InterestsTitle>Select your financial interests</InterestsTitle>
                  <InterestsGrid>
                    {availableInterests.map((interest) => (
                      <InterestTag
                        key={interest}
                        selected={formData.interests.includes(interest)}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </InterestTag>
                    ))}
                  </InterestsGrid>
                  {errors.interests && (
                    <motion.div 
                      className="error-message"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.interests}
                    </motion.div>
                  )}
                </InterestsCard>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <SignupButton 
                    type="button"
                    onClick={prevStep}
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      color: 'white',
                      boxShadow: 'none'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </SignupButton>
                  
                  <SignupButton 
                    type="submit"
                    disabled={isLoading}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </SignupButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {errors.form && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.form}
            </motion.div>
          )}
        </form>
        
        {currentStep === 1 && (
          <>
            <Divider>
              <span>OR</span>
            </Divider>
            
            <SocialButton
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => console.log('Google signup')}
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
              Already have an account?
              <Link to="/login">Login</Link>
            </FormFooter>
          </>
        )}
      </SignupForm>
    </SignupPageContainer>
  );
};

export default SignupPage;