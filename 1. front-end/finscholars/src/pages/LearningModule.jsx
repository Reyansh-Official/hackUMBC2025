import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import BackgroundAnimation from '../components/BackgroundAnimation';
import Button from '../components/Button';
import QuizModal from '../components/QuizModal';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserModules } from '../services/moduleService';

// Styled Components with Liquid Glass Design
const ModuleContainer = styled.div`
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModuleHeader = styled.div`
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
`;

const ModuleTitle = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(75, 207, 234, 0.5);
`;

const ModuleDescription = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`;

const LevelButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 1000px;
`;

const LevelButton = styled(motion.button)`
  background: var(--glass-background);
  backdrop-filter: blur(12px);
  border: ${props => props.active ? '2px solid var(--color-accent)' : 'var(--glass-border)'};
  box-shadow: ${props => props.active ? '0 0 15px rgba(75, 207, 234, 0.5)' : 'var(--glass-glow)'};
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(75, 207, 234, 0.4);
  }
`;

const ContentSection = styled(motion.div)`
  background: var(--glass-background);
  backdrop-filter: blur(12px);
  border: var(--glass-border);
  box-shadow: var(--glass-glow);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  color: white;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: white;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(75, 207, 234, 0.3);
  padding-bottom: 0.5rem;
`;

const SectionContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  
  p {
    margin-bottom: 1rem;
  }
  
  ul, ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1rem 0;
  }
`;

const QuizButton = styled(Button)`
  margin-top: 1rem;
`;

// Mock module content data
const moduleData = {
  id: 'investment-basics',
  title: 'Investment Basics',
  description: 'Learn the fundamentals of investing and build a strong foundation for your financial future.',
  levels: [
    {
      id: 'basic',
      title: 'Basic',
      sections: [
        {
          id: 'section-1',
          title: 'What is Investing?',
          content: `
            <p>Investing is the act of allocating resources, usually money, with the expectation of generating income or profit over time. Unlike saving, investing involves putting your money to work for you and accepting some level of risk in pursuit of potential returns.</p>
            <p>The main types of investments include:</p>
            <ul>
              <li><strong>Stocks:</strong> Represent ownership in a company</li>
              <li><strong>Bonds:</strong> Essentially loans to companies or governments</li>
              <li><strong>Mutual Funds:</strong> Pooled investments managed by professionals</li>
              <li><strong>Real Estate:</strong> Property and land investments</li>
              <li><strong>Cash Equivalents:</strong> Low-risk, highly liquid investments</li>
            </ul>
          `
        },
        {
          id: 'section-2',
          title: 'Why Should You Invest?',
          content: `
            <p>Investing is one of the most effective ways to build wealth and achieve financial goals. Here are some key reasons to invest:</p>
            <ul>
              <li><strong>Beat Inflation:</strong> The purchasing power of money decreases over time due to inflation. Investing helps your money grow faster than inflation.</li>
              <li><strong>Build Wealth:</strong> Over time, investments can generate significant returns through compound growth.</li>
              <li><strong>Achieve Financial Goals:</strong> Whether it's retirement, buying a home, or funding education, investing can help you reach important milestones.</li>
              <li><strong>Generate Passive Income:</strong> Many investments can provide regular income without requiring active work.</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'moderate',
      title: 'Moderate',
      sections: [
        {
          id: 'section-1',
          title: 'Understanding Risk and Return',
          content: `
            <p>Risk and return are fundamental concepts in investing that are closely related. Generally, investments with higher potential returns come with higher risks.</p>
            <p>Key risk factors include:</p>
            <ul>
              <li><strong>Market Risk:</strong> The possibility that investments will lose value due to market factors</li>
              <li><strong>Inflation Risk:</strong> The risk that returns won't keep pace with inflation</li>
              <li><strong>Liquidity Risk:</strong> The risk of not being able to sell an investment quickly without loss</li>
              <li><strong>Concentration Risk:</strong> The danger of having too much invested in one area</li>
            </ul>
            <p>Investors should assess their risk tolerance based on factors like time horizon, financial goals, and personal comfort with volatility.</p>
          `
        },
        {
          id: 'section-2',
          title: 'Asset Allocation Strategies',
          content: `
            <p>Asset allocation is the process of dividing investments among different asset categories to balance risk and reward according to goals, risk tolerance, and investment timeline.</p>
            <p>Common asset allocation approaches include:</p>
            <ul>
              <li><strong>Strategic Asset Allocation:</strong> Setting target allocations for various asset classes and rebalancing periodically</li>
              <li><strong>Tactical Asset Allocation:</strong> Making short-term adjustments to take advantage of market conditions</li>
              <li><strong>Dynamic Asset Allocation:</strong> Continuously adjusting portfolio allocations based on market trends</li>
              <li><strong>Age-Based Allocation:</strong> Adjusting risk exposure based on age (e.g., 100 minus your age for stock percentage)</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced',
      sections: [
        {
          id: 'section-1',
          title: 'Advanced Investment Vehicles',
          content: `
            <p>Beyond basic investments, advanced investors often utilize more complex vehicles:</p>
            <ul>
              <li><strong>Options and Derivatives:</strong> Contracts that derive value from underlying assets, used for hedging or speculation</li>
              <li><strong>Alternative Investments:</strong> Including private equity, hedge funds, and venture capital</li>
              <li><strong>Exchange-Traded Funds (ETFs):</strong> Baskets of securities that trade like stocks but offer diversification benefits</li>
              <li><strong>Real Estate Investment Trusts (REITs):</strong> Companies that own, operate, or finance income-producing real estate</li>
              <li><strong>Structured Products:</strong> Pre-packaged investments that include multiple financial instruments</li>
            </ul>
          `
        },
        {
          id: 'section-2',
          title: 'Portfolio Optimization Techniques',
          content: `
            <p>Advanced investors employ sophisticated techniques to optimize their portfolios:</p>
            <ul>
              <li><strong>Modern Portfolio Theory:</strong> A mathematical framework for assembling a portfolio of assets to maximize expected return for a given level of risk</li>
              <li><strong>Factor Investing:</strong> Targeting specific factors (value, size, momentum, quality) that drive returns</li>
              <li><strong>Tax-Loss Harvesting:</strong> Selling securities at a loss to offset capital gains tax liability</li>
              <li><strong>Dollar-Cost Averaging:</strong> Investing fixed amounts at regular intervals regardless of price</li>
              <li><strong>Rebalancing Strategies:</strong> Systematic approaches to maintaining target allocations over time</li>
            </ul>
          `
        }
      ]
    }
  ]
};

// Mock quiz scores data
const initialQuizScores = {
  'investment-basics': {
    basic: 85,
    moderate: 0,
    advanced: 0
  }
};

const LearningModule = () => {
  const [currentLevel, setCurrentLevel] = useState('basic');
  const [quizScores, setQuizScores] = useState(initialQuizScores);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [moduleContent, setModuleContent] = useState(null);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  
  // Fetch module content from API (simulated)
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll use the mock data
    setModuleContent(moduleData);
    
    // If user is logged in, fetch their module progress
    if (currentUser) {
      fetchUserModules(currentUser.uid)
        .then(modules => {
          // Update module content with user progress
          console.log('User modules:', modules);
        })
        .catch(error => {
          console.error('Error fetching user modules:', error);
        });
    }
  }, [currentUser]);
  
  // Function to fetch personalized module
  const fetchPersonalizedModule = async () => {
    setIsLoading(true);
    try {
      // Mock user ID and preferences
      const userId = currentUser?.uid || 'guest';
      const topic = 'investment strategies'; // This could come from user preferences
      
      // Call the API to generate personalized module
      const response = await fetch('http://localhost:8080/api/generate-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          topic: topic,
          level: currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Transform the API response to match our module structure
        const personalizedModule = {
          ...moduleContent,
          title: data.module.title || moduleContent.title,
          description: data.module.description || moduleContent.description,
          levels: moduleContent.levels.map(level => {
            if (level.id === currentLevel) {
              return {
                ...level,
                sections: data.module.sections || level.sections
              };
            }
            return level;
          })
        };
        
        setModuleContent(personalizedModule);
        setIsPersonalized(true);
      }
    } catch (error) {
      console.error('Error fetching personalized module:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if a level is unlocked based on quiz scores
  const isLevelUnlocked = (levelId) => {
    if (levelId === 'basic') return true;
    
    const levels = ['basic', 'moderate', 'advanced'];
    const levelIndex = levels.indexOf(levelId);
    const previousLevel = levels[levelIndex - 1];
    
    return quizScores[moduleContent.id][previousLevel] >= 80;
  };
  
  // Handle level change
  const handleLevelChange = (levelId) => {
    if (isLevelUnlocked(levelId)) {
      setCurrentLevel(levelId);
      setIsPersonalized(false); // Reset personalization when changing levels
    }
  };
  
  // Handle quiz completion
  const handleQuizComplete = (score) => {
    setQuizScores(prev => ({
      ...prev,
      [moduleContent.id]: {
        ...prev[moduleContent.id],
        [currentLevel]: score
      }
    }));
    setShowQuizModal(false);
  };
  
  if (!moduleContent) {
    return (
      <>
        <Navbar />
        <BackgroundAnimation />
        <ModuleContainer>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading module content...</p>
          </div>
        </ModuleContainer>
      </>
    );
  }
  
  const currentLevelData = moduleContent.levels.find(level => level.id === currentLevel);
  
  return (
    <>
      <Navbar />
      <BackgroundAnimation />
      <ModuleContainer>
        <ModuleHeader>
          <ModuleTitle>{moduleContent.title}</ModuleTitle>
          <ModuleDescription>{moduleContent.description}</ModuleDescription>
          
          {!isPersonalized && (
            <Button 
              onClick={fetchPersonalizedModule} 
              disabled={isLoading}
              style={{ marginBottom: '20px' }}
            >
              {isLoading ? 'Generating...' : 'Generate Personalized Module'}
            </Button>
          )}
        </ModuleHeader>
        
        <LevelButtonsContainer>
          {moduleContent.levels.map(level => (
            <LevelButton
              key={level.id}
              active={currentLevel === level.id}
              disabled={!isLevelUnlocked(level.id)}
              onClick={() => handleLevelChange(level.id)}
              whileHover={isLevelUnlocked(level.id) ? { scale: 1.05 } : {}}
              whileTap={isLevelUnlocked(level.id) ? { scale: 0.95 } : {}}
            >
              {level.title}
            </LevelButton>
          ))}
        </LevelButtonsContainer>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLevel + (isPersonalized ? '-personalized' : '')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: '1000px' }}
          >
            {currentLevelData.sections.map(section => (
              <ContentSection key={section.id}>
                <SectionTitle>{section.title}</SectionTitle>
                <SectionContent dangerouslySetInnerHTML={{ __html: section.content }} />
              </ContentSection>
            ))}
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <QuizButton primary onClick={() => setShowQuizModal(true)}>
                Take {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level Quiz
              </QuizButton>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {showQuizModal && (
          <QuizModal
            level={currentLevel}
            moduleId={moduleContent.id}
            onClose={() => setShowQuizModal(false)}
            onComplete={handleQuizComplete}
            personalized={isPersonalized}
          />
        )}
      </ModuleContainer>
    </>
  );
};

export default LearningModule;