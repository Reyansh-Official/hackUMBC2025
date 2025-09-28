import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FormContainer, FormTitle, FormInput, FormCheckbox } from '../components/FormComponents';
import { useUser } from '../contexts/UserContext';
import { api } from '../services/api';

// Styled components for the onboarding page
const OnboardingPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const OnboardingForm = styled(FormContainer)`
  max-width: 600px;
  overflow: visible;
`;

const WelcomeContainer = styled(motion.div)`
  text-align: center;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-rich) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const WelcomeText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--color-text);
  line-height: 1.6;
`;

const InterestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const InterestItem = styled.div`
  background: ${props => props.selected ? 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-rich) 100%)' : 'var(--glass-background-accent)'};
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? 'var(--color-accent-rich)' : 'transparent'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const SyllabusUploadContainer = styled.div`
  margin: 2rem 0;
  padding: 2rem;
  border: 2px dashed var(--color-accent);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--glass-background-accent);
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.5rem;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-rich) 100%)' 
    : 'var(--glass-background-accent)'};
  border: 2px solid ${props => props.completed || props.active 
    ? 'var(--color-accent)' 
    : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.active 
    ? 'var(--color-background)' 
    : props.completed 
      ? 'var(--color-accent)' 
      : 'rgba(255, 255, 255, 0.6)'};
  font-weight: bold;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active 
    ? '0 0 15px rgba(75, 207, 234, 0.4)' 
    : 'none'};
  
  &::after {
    content: '';
    position: absolute;
    height: 2px;
    width: 100%;
    background: ${props => props.completed 
      ? 'var(--color-accent)' 
      : 'rgba(255, 255, 255, 0.2)'};
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
  }
  
  &:last-child::after {
    display: none;
  }
`;

const StepContent = styled(motion.div)`
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled(motion.button)`
  background: ${props => props.secondary 
    ? 'transparent' 
    : 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-rich) 100%)'};
  color: ${props => props.secondary ? 'var(--color-accent)' : 'var(--color-background)'};
  border: ${props => props.secondary ? '2px solid var(--color-accent)' : 'none'};
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
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

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const OptionCard = styled.div`
  background: var(--glass-background-accent);
  border: 2px solid ${props => props.selected 
    ? 'var(--color-accent)' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: ${props => props.selected 
    ? '0 0 15px rgba(75, 207, 234, 0.4)' 
    : 'none'};
  
  &:hover {
    border-color: var(--color-accent);
    transform: translateY(-2px);
  }
  
  svg {
    width: 40px;
    height: 40px;
    margin-bottom: 1rem;
    color: ${props => props.selected 
      ? 'var(--color-accent)' 
      : 'rgba(255, 255, 255, 0.7)'};
    transition: all 0.3s ease;
  }
  
  h4 {
    margin: 0;
    color: white;
    font-size: 1rem;
  }
`;

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  exit: { 
    opacity: 0, 
    x: -100,
    transition: { 
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // Start with welcome step
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    goals: [],
    experience: '',
    interests: [],
    notifications: true
  });
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [syllabusFile, setSyllabusFile] = useState(null);
  
  // Available interests for selection
  const availableInterests = [
    'Personal Finance', 'Investing', 'Budgeting', 'Retirement Planning',
    'Debt Management', 'Tax Planning', 'Real Estate', 'Insurance',
    'Cryptocurrency', 'Stock Market', 'Financial Independence', 'Credit Building'
  ];
  
  // Check if user is new (has no interests or modules)
  useEffect(() => {
    if (user && (user.interests.length > 0 || user.modules.length > 0)) {
      // User already has data, skip to dashboard
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const totalSteps = 4;
  
  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (id, checked) => {
    setFormData({
      ...formData,
      [id]: checked
    });
  };
  
  // Handle option selection
  const handleOptionSelect = (field, option) => {
    if (field === 'goals' || field === 'interests') {
      // Toggle selection for multi-select fields
      if (formData[field].includes(option)) {
        setFormData({
          ...formData,
          [field]: formData[field].filter(item => item !== option)
        });
      } else {
        setFormData({
          ...formData,
          [field]: [...formData[field], option]
        });
      }
    } else {
      // Single selection for other fields
      setFormData({
        ...formData,
        [field]: option
      });
    }
  };
  
  // Handle next step
  const handleNext = async () => {
    if (currentStep === 0 && (selectedInterests.length > 0 || syllabusFile)) {
      try {
        // Update user interests
        if (selectedInterests.length > 0) {
          await updateUser({ interests: selectedInterests });
        }
        
        // Handle syllabus upload if selected
        if (syllabusFile) {
          const formData = new FormData();
          formData.append('syllabus', syllabusFile);
          
          try {
            // Use our API service for file upload
            await api.upload('/api/user/upload-syllabus', formData);
          } catch (error) {
            console.error('Syllabus upload error:', error);
            throw new Error('Failed to upload syllabus');
          }
        }
      } catch (error) {
        console.error('Error during onboarding:', error);
        // Show error to user
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      console.log('Onboarding completed:', formData);
      navigate('/dashboard');
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle skip
  const handleSkip = () => {
    navigate('/dashboard');
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome step for new users
        return (
          <StepContent
            key="welcome"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <WelcomeContainer>
              <WelcomeTitle>Welcome to FinScholars!</WelcomeTitle>
              <WelcomeText>
                We're excited to have you join our community of financial learners. 
                Let's personalize your experience to help you achieve your financial goals.
              </WelcomeText>
            </WelcomeContainer>
            
            <FormTitle>Select Your Financial Interests</FormTitle>
            <p>Choose topics you're interested in learning about:</p>
            
            <InterestGrid>
              {availableInterests.map((interest, index) => (
                <InterestItem 
                  key={index}
                  selected={selectedInterests.includes(interest)}
                  onClick={() => {
                    if (selectedInterests.includes(interest)) {
                      setSelectedInterests(selectedInterests.filter(i => i !== interest));
                    } else {
                      setSelectedInterests([...selectedInterests, interest]);
                    }
                  }}
                >
                  {interest}
                </InterestItem>
              ))}
            </InterestGrid>
            
            <FormTitle>Or Upload Your Syllabus</FormTitle>
            <SyllabusUploadContainer onClick={() => document.getElementById('syllabus-upload').click()}>
              <p>{syllabusFile ? `Selected: ${syllabusFile.name}` : 'Click to upload a syllabus'}</p>
              <input 
                id="syllabus-upload" 
                type="file" 
                accept=".pdf,.doc,.docx" 
                style={{ display: 'none' }}
                onChange={(e) => setSyllabusFile(e.target.files[0])}
              />
            </SyllabusUploadContainer>
          </StepContent>
        );
      case 1:
        return (
          <StepContent
            key="step1"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FormTitle>What are your financial goals?</FormTitle>
            <p>Select all that apply to you</p>
            
            <OptionGrid>
              {[
                { id: 'save', label: 'Save Money' },
                { id: 'invest', label: 'Start Investing' },
                { id: 'debt', label: 'Pay Off Debt' },
                { id: 'budget', label: 'Create a Budget' },
                { id: 'retirement', label: 'Plan for Retirement' },
                { id: 'education', label: 'Education Funding' }
              ].map(option => (
                <OptionCard
                  key={option.id}
                  selected={formData.goals.includes(option.id)}
                  onClick={() => handleOptionSelect('goals', option.id)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" />
                  </svg>
                  <h4>{option.label}</h4>
                </OptionCard>
              ))}
            </OptionGrid>
          </StepContent>
        );
        
      case 2:
        return (
          <StepContent
            key="step2"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FormTitle>What's your financial experience level?</FormTitle>
            <p>This helps us personalize your learning journey</p>
            
            <OptionGrid>
              {[
                { id: 'beginner', label: 'Beginner' },
                { id: 'intermediate', label: 'Intermediate' },
                { id: 'advanced', label: 'Advanced' }
              ].map(option => (
                <OptionCard
                  key={option.id}
                  selected={formData.experience === option.id}
                  onClick={() => handleOptionSelect('experience', option.id)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" />
                  </svg>
                  <h4>{option.label}</h4>
                </OptionCard>
              ))}
            </OptionGrid>
          </StepContent>
        );
        
      case 3:
        return (
          <StepContent
            key="step3"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FormTitle>What financial topics interest you?</FormTitle>
            <p>Select all that apply to you</p>
            
            <OptionGrid>
              {[
                { id: 'stocks', label: 'Stocks & Bonds' },
                { id: 'crypto', label: 'Cryptocurrency' },
                { id: 'realestate', label: 'Real Estate' },
                { id: 'retirement', label: 'Retirement' },
                { id: 'taxes', label: 'Taxes' },
                { id: 'credit', label: 'Credit & Loans' }
              ].map(option => (
                <OptionCard
                  key={option.id}
                  selected={formData.interests.includes(option.id)}
                  onClick={() => handleOptionSelect('interests', option.id)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" />
                  </svg>
                  <h4>{option.label}</h4>
                </OptionCard>
              ))}
            </OptionGrid>
          </StepContent>
        );
        
      case 4:
        return (
          <StepContent
            key="step4"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FormTitle>Almost Done!</FormTitle>
            <p>Just a few more settings to personalize your experience</p>
            
            <FormCheckbox
              id="notifications"
              checked={formData.notifications}
              onChange={(checked) => handleCheckboxChange('notifications', checked)}
            >
              Enable notifications for learning reminders
            </FormCheckbox>
            
            <FormInput
              id="referralCode"
              type="text"
              label="Referral Code (Optional)"
              value={formData.referralCode || ''}
              onChange={handleChange}
            />
          </StepContent>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <OnboardingPageContainer>
      <OnboardingForm onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}>
        {currentStep > 0 && (
          <StepIndicator>
            {[...Array(totalSteps)].map((_, index) => (
              <Step 
                key={index} 
                active={currentStep === index + 1}
                completed={currentStep > index + 1}
              >
                {index + 1}
              </Step>
            ))}
          </StepIndicator>
        )}
        
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
        
        <ButtonGroup>
          {currentStep > 0 && currentStep > 1 && (
            <Button 
              type="button" 
              secondary
              onClick={handlePrevious}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back
            </Button>
          )}
          
          {currentStep === 0 ? (
            <Button 
              type="button"
              onClick={handleNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={selectedInterests.length === 0 && !syllabusFile}
            >
              Get Started
            </Button>
          ) : currentStep < totalSteps ? (
            <Button 
              type="button"
              onClick={handleNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
            </Button>
          ) : (
            <Button 
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Complete
            </Button>
          )}
        </ButtonGroup>
      </OnboardingForm>
    </OnboardingPageContainer>
  );
};

export default OnboardingPage;