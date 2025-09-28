import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// API service function to fetch user badges
const fetchUserBadges = async (userId) => {
  try {
    // In a real implementation, this would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('user_badges')
    //   .select('*')
    //   .eq('user_id', userId);
    
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    return [
      {
        id: 1,
        name: 'First Steps',
        description: 'Completed your first module',
        icon: 'graduation-cap',
        earned: true,
        earned_date: '2023-10-15',
        is_new: false
      },
      {
        id: 2,
        name: 'Quiz Master',
        description: 'Scored 100% on 3 quizzes',
        icon: 'award',
        earned: true,
        earned_date: '2023-10-20',
        is_new: true
      },
      {
        id: 3,
        name: 'Consistent Learner',
        description: 'Logged in for 7 consecutive days',
        icon: 'calendar-check',
        earned: true,
        earned_date: '2023-10-25',
        is_new: false
      },
      {
        id: 4,
        name: 'Investment Guru',
        description: 'Completed all investment modules',
        icon: 'trending-up',
        earned: false,
        earned_date: null,
        is_new: false
      },
      {
        id: 5,
        name: 'Budget Master',
        description: 'Completed all budgeting modules',
        icon: 'piggy-bank',
        earned: false,
        earned_date: null,
        is_new: false
      },
      {
        id: 6,
        name: 'Financial Planner',
        description: 'Created a comprehensive financial plan',
        icon: 'file-text',
        earned: false,
        earned_date: null,
        is_new: false
      }
    ];
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }
};

// Styled Components
const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const GalleryTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
`;

const GalleryDescription = styled.p`
  color: rgba(230, 241, 255, 0.8);
  margin-bottom: 1rem;
`;

const BadgesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(75, 207, 234, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(75, 207, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(75, 207, 234, 0);
  }
`;

const glow = keyframes`
  0% {
    filter: drop-shadow(0 0 5px rgba(75, 207, 234, 0.7));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(75, 207, 234, 0.9));
  }
  100% {
    filter: drop-shadow(0 0 5px rgba(75, 207, 234, 0.7));
  }
`;

const BadgeCard = styled(motion.div)`
  background: var(--glass-background);
  backdrop-filter: blur(12px);
  border: var(--glass-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  ${props => props.earned ? `
    box-shadow: var(--glass-glow);
    
    ${props.isNew && `
      animation: ${pulse} 2s infinite;
    `}
  ` : `
    opacity: 0.6;
    filter: grayscale(1);
  `}
  
  &:hover {
    transform: translateY(-5px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
    opacity: ${props => props.earned ? 0.7 : 0.3};
  }
`;

const BadgeIconContainer = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  
  ${props => props.earned && props.isNew && `
    animation: ${glow} 3s infinite;
  `}
`;

const BadgeName = styled.h3`
  font-size: 1.2rem;
  color: white;
  margin-bottom: 0.5rem;
`;

const BadgeDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(230, 241, 255, 0.7);
  margin-bottom: 0.5rem;
`;

const BadgeDate = styled.span`
  font-size: 0.8rem;
  color: var(--color-accent);
`;

const NewBadgeIndicator = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--color-accent);
  color: #0a192f;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  z-index: 1;
`;

// SVG Icons for badges
const BadgeIcon = ({ icon, earned, isNew }) => {
  // Define SVG icons for each badge type
  const icons = {
    'graduation-cap': (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
      </svg>
    ),
    'award': (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"></circle>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
      </svg>
    ),
    'calendar-check': (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <path d="M9 16l2 2 4-4"></path>
      </svg>
    ),
    'trending-up': (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    ),
    'piggy-bank': (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"></path>
        <path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
        <path d="M16 11h0"></path>
      </svg>
    ),
    'file-text': (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    )
  };

  const IconWrapper = styled.div`
    color: ${earned ? 'var(--color-accent)' : 'rgba(75, 207, 234, 0.4)'};
    transition: all 0.3s ease;
  `;

  return (
    <IconWrapper>
      {icons[icon] || (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      )}
    </IconWrapper>
  );
};

// Confetti animation for new badges
const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4bcfea', '#ffffff', '#0a192f']
  });
};

const BadgesGallery = ({ userId }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBadgeShown, setNewBadgeShown] = useState(false);

  useEffect(() => {
    const loadBadges = async () => {
      const userBadges = await fetchUserBadges(userId);
      setBadges(userBadges);
      setLoading(false);
      
      // Check if there are any new badges to trigger animation
      const hasNewBadges = userBadges.some(badge => badge.earned && badge.is_new);
      if (hasNewBadges && !newBadgeShown) {
        setTimeout(() => {
          triggerConfetti();
          setNewBadgeShown(true);
        }, 500);
      }
    };
    
    loadBadges();
  }, [userId, newBadgeShown]);

  if (loading) {
    return <div>Loading badges...</div>;
  }

  return (
    <GalleryContainer>
      <GalleryTitle>Your Achievements</GalleryTitle>
      <GalleryDescription>
        Collect badges as you progress through your financial learning journey.
      </GalleryDescription>
      
      <BadgesGrid>
        <AnimatePresence>
          {badges.map(badge => (
            <BadgeCard
              key={badge.id}
              earned={badge.earned}
              isNew={badge.earned && badge.is_new}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: badge.id * 0.1 }}
            >
              {badge.earned && badge.is_new && (
                <NewBadgeIndicator>NEW!</NewBadgeIndicator>
              )}
              
              <BadgeIconContainer earned={badge.earned} isNew={badge.earned && badge.is_new}>
                <BadgeIcon 
                  icon={badge.icon} 
                  earned={badge.earned}
                  isNew={badge.earned && badge.is_new}
                />
              </BadgeIconContainer>
              
              <BadgeName>{badge.name}</BadgeName>
              <BadgeDescription>{badge.description}</BadgeDescription>
              
              {badge.earned && (
                <BadgeDate>Earned: {new Date(badge.earned_date).toLocaleDateString()}</BadgeDate>
              )}
            </BadgeCard>
          ))}
        </AnimatePresence>
      </BadgesGrid>
    </GalleryContainer>
  );
};

export default BadgesGallery;