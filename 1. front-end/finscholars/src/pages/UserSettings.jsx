import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';

// Styled components for User Settings page
const SettingsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  color: #ffffff;
`;

const SettingsHeader = styled.div`
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;
`;

const SettingsTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #00BFFF;
  margin-bottom: 10px;
`;

const SettingsDescription = styled.p`
  font-size: 1rem;
  opacity: 0.8;
`;

const SettingsLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsNav = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  height: fit-content;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavItem = styled.div`
  padding: 12px 15px;
  margin-bottom: 5px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? 'rgba(0, 191, 255, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#00BFFF' : '#ffffff'};
  
  &:hover {
    background: ${props => props.active ? 'rgba(0, 191, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const SettingsContent = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #00BFFF;
`;

const InterestsContainer = styled.div`
  margin-top: 20px;
`;

const InterestTagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
`;

const InterestTag = styled.div`
  background: ${props => props.selected ? 'rgba(0, 191, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.selected ? 'rgba(0, 191, 255, 0.7)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: ${props => props.selected ? '0 0 15px rgba(0, 191, 255, 0.3)' : 'none'};
  
  &:hover {
    background: ${props => props.selected ? 'rgba(0, 191, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-2px);
  }
`;

const SaveButton = styled(motion.button)`
  background: linear-gradient(to right, #00BFFF, #87CEFA);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 191, 255, 0.3);
  
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 191, 255, 0.5);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const StatusMessage = styled.div`
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  background: ${props => props.type === 'success' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
  color: ${props => props.type === 'success' ? '#00ff00' : '#ff5555'};
  display: ${props => props.visible ? 'block' : 'none'};
`;

// Available interest categories
const interestCategories = [
  "Budgeting",
  "Investing",
  "Retirement",
  "Taxes",
  "Credit Cards",
  "Loans",
  "Mortgages",
  "Insurance",
  "Saving",
  "Debt Management",
  "Stock Market",
  "Real Estate",
  "Cryptocurrency",
  "Financial Planning",
  "Banking",
  "Personal Finance"
];

const UserSettings = () => {
  // State for active section
  const [activeSection, setActiveSection] = useState('interests');
  
  // State for user interests
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [originalInterests, setOriginalInterests] = useState([]);
  
  // State for status message
  const [statusMessage, setStatusMessage] = useState({
    visible: false,
    type: 'success',
    message: ''
  });
  
  // State for loading
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch user interests on component mount
  useEffect(() => {
    fetchUserInterests();
  }, []);
  
  // Function to fetch user interests
  const fetchUserInterests = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      const mockResponse = {
        data: {
          interests: ["Budgeting", "Investing", "Saving", "Stock Market"]
        }
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSelectedInterests(mockResponse.data.interests);
      setOriginalInterests(mockResponse.data.interests);
    } catch (error) {
      console.error('Error fetching user interests:', error);
      setStatusMessage({
        visible: true,
        type: 'error',
        message: 'Failed to load your interests. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to toggle interest selection
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  // Function to save user interests
  const saveInterests = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be a PUT request to the backend API
      // For demo purposes, we'll simulate the API call
      // const response = await axios.put('/api/user/interests', { interests: selectedInterests });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update original interests to reflect saved state
      setOriginalInterests([...selectedInterests]);
      
      // Show success message
      setStatusMessage({
        visible: true,
        type: 'success',
        message: 'Your interests have been updated successfully!'
      });
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setStatusMessage(prev => ({ ...prev, visible: false }));
      }, 3000);
    } catch (error) {
      console.error('Error saving user interests:', error);
      setStatusMessage({
        visible: true,
        type: 'error',
        message: 'Failed to update your interests. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if changes have been made
  const hasChanges = () => {
    if (selectedInterests.length !== originalInterests.length) return true;
    return !selectedInterests.every(interest => originalInterests.includes(interest));
  };
  
  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>User Settings</SettingsTitle>
        <SettingsDescription>Manage your account preferences and personal information</SettingsDescription>
      </SettingsHeader>
      
      <SettingsLayout>
        <SettingsNav>
          <NavItem 
            active={activeSection === 'profile'} 
            onClick={() => setActiveSection('profile')}
          >
            Profile
          </NavItem>
          <NavItem 
            active={activeSection === 'interests'} 
            onClick={() => setActiveSection('interests')}
          >
            My Interests
          </NavItem>
          <NavItem 
            active={activeSection === 'notifications'} 
            onClick={() => setActiveSection('notifications')}
          >
            Notifications
          </NavItem>
          <NavItem 
            active={activeSection === 'privacy'} 
            onClick={() => setActiveSection('privacy')}
          >
            Privacy
          </NavItem>
          <NavItem 
            active={activeSection === 'appearance'} 
            onClick={() => setActiveSection('appearance')}
          >
            Appearance
          </NavItem>
        </SettingsNav>
        
        <SettingsContent>
          {activeSection === 'interests' && (
            <>
              <SectionTitle>My Interests</SectionTitle>
              <p>Select the financial topics you're interested in learning about. This helps us personalize your learning experience.</p>
              
              <InterestsContainer>
                <InterestTagsGrid>
                  {interestCategories.map(interest => (
                    <InterestTag 
                      key={interest}
                      selected={selectedInterests.includes(interest)}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </InterestTag>
                  ))}
                </InterestTagsGrid>
                
                <SaveButton 
                  onClick={saveInterests}
                  disabled={isLoading || !hasChanges()}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </SaveButton>
                
                <StatusMessage 
                  visible={statusMessage.visible}
                  type={statusMessage.type}
                >
                  {statusMessage.message}
                </StatusMessage>
              </InterestsContainer>
            </>
          )}
          
          {activeSection === 'profile' && (
            <SectionTitle>Profile Settings</SectionTitle>
            // Profile settings would go here
          )}
          
          {activeSection === 'notifications' && (
            <SectionTitle>Notification Preferences</SectionTitle>
            // Notification settings would go here
          )}
          
          {activeSection === 'privacy' && (
            <SectionTitle>Privacy Settings</SectionTitle>
            // Privacy settings would go here
          )}
          
          {activeSection === 'appearance' && (
            <SectionTitle>Appearance Settings</SectionTitle>
            // Appearance settings would go here
          )}
        </SettingsContent>
      </SettingsLayout>
    </SettingsContainer>
  );
};

export default UserSettings;