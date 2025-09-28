import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import BackgroundAnimation from '../components/BackgroundAnimation';
import ProgressTracker from '../components/ProgressTracker';
import BadgesGallery from '../components/BadgesGallery';
import { fetchUserProgress, api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const GoalsSection = styled.div`
  background: var(--glass-background);
  backdrop-filter: blur(12px);
  border: var(--glass-border);
  box-shadow: var(--glass-glow);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin: 0 auto 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: white;
`;

const GoalsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const GoalItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
`;

const GoalCheckmark = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.completed ? 'var(--color-success)' : 'transparent'};
  border: 2px solid ${props => props.completed ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.3)'};
  box-shadow: ${props => props.completed ? '0 0 10px rgba(0, 230, 118, 0.5)' : 'none'};
  transition: all 0.3s ease;
  
  svg {
    opacity: ${props => props.completed ? 1 : 0};
    transition: opacity 0.3s ease;
  }
`;

const GoalText = styled.span`
  color: ${props => props.completed ? 'rgba(255, 255, 255, 0.7)' : 'white'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const Badge = styled.div`
  background: var(--glass-background-accent);
  backdrop-filter: blur(12px);
  border: var(--glass-border);
  box-shadow: var(--glass-glow);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  svg {
    width: 40px;
    height: 40px;
    filter: drop-shadow(0 0 5px rgba(75, 207, 234, 0.5));
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(75, 207, 234, 0.5);
  }
`;

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await api.get('/api/user/me');
        
        if (userData.success) {
          setModules(userData.user.modules || []);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Mock data for goals
  const goals = [
    { id: 1, text: 'Complete Introduction to Finance module', completed: true },
    { id: 2, text: 'Finish 3 quizzes with score above 80%', completed: true },
    { id: 3, text: 'Complete Budgeting Basics module', completed: false },
    { id: 4, text: 'Create your first personal budget', completed: false },
    { id: 5, text: 'Start Investment Strategies module', completed: true }
  ];
  
  return (
    <>
      <Navbar />
      <BackgroundAnimation />
      <DashboardContainer>
        <GoalsSection>
          <SectionTitle>Your Learning Goals</SectionTitle>
          <GoalsList>
            {goals.map(goal => (
              <GoalItem key={goal.id}>
                <GoalCheckmark completed={goal.completed}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </GoalCheckmark>
                <GoalText completed={goal.completed}>{goal.text}</GoalText>
              </GoalItem>
            ))}
          </GoalsList>
          
          <BadgesGallery userId="current-user" />
        </GoalsSection>
        
        <SectionTitle style={{ maxWidth: '1200px', margin: '0 auto 1.5rem' }}>Your Learning Modules</SectionTitle>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading your progress...</p>
          </div>
        ) : (
          <DashboardGrid>
            {modules && modules.length > 0 ? (
              <ProgressTracker modules={modules} />
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
                <p>No modules found. Get started by uploading a syllabus or selecting interests.</p>
                <Button onClick={() => navigate('/onboarding')} style={{ marginTop: '1rem' }}>
                  Get Started
                </Button>
              </div>
            )}
          </DashboardGrid>
        )}
      </DashboardContainer>
    </>
  );
};

export default Dashboard;