import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: var(--glass-background);
  backdrop-filter: blur(12px);
  border: var(--glass-border);
  box-shadow: var(--glass-glow);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: var(--color-accent);
  }
`;

const QuizTitle = styled.h2`
  font-size: 1.8rem;
  color: white;
  margin-bottom: 2rem;
`;

const QuizQuestion = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1.5rem;
`;

const ProgressText = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const OptionButton = styled(motion.button)`
  background: var(--glass-background-accent);
  backdrop-filter: blur(8px);
  border: 2px solid ${props => 
    props.selected 
      ? props.isCorrect 
        ? 'var(--color-success)' 
        : 'var(--color-error)' 
      : 'rgba(75, 207, 234, 0.3)'};
  box-shadow: ${props => 
    props.selected 
      ? props.isCorrect 
        ? '0 0 15px rgba(0, 230, 118, 0.5)' 
        : '0 0 15px rgba(255, 76, 76, 0.5)' 
      : '0 0 10px rgba(75, 207, 234, 0.2)'};
  border-radius: 8px;
  padding: 1rem 1.5rem;
  width: 100%;
  text-align: left;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => 
      props.selected 
        ? props.isCorrect 
          ? 'rgba(0, 230, 118, 0.1)' 
          : 'rgba(255, 76, 76, 0.1)' 
        : 'transparent'};
    z-index: -1;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(75, 207, 234, 0.4);
    border-color: rgba(75, 207, 234, 0.6);
  }
  
  &:disabled {
    cursor: default;
    opacity: ${props => props.selected ? 1 : 0.7};
  }
`;

const FeedbackMessage = styled(motion.div)`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.isCorrect ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 76, 76, 0.1)'};
  border: 1px solid ${props => props.isCorrect ? 'var(--color-success)' : 'var(--color-error)'};
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const ResultCard = styled.div`
  text-align: center;
`;

const ResultTitle = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 1rem;
`;

const ResultScore = styled.div`
  font-size: 4rem;
  color: var(--color-accent);
  margin: 2rem 0;
  text-shadow: 0 0 10px rgba(75, 207, 234, 0.5);
`;

const ResultMessage = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`;

// Mock quiz data based on module and level
const getQuizData = (moduleId, level) => {
  // In a real implementation, this would fetch from an API
  // For now, we'll use mock data
  
  const quizzes = {
    'investment-basics': {
      basic: {
        title: "Investment Basics - Basic Level Quiz",
        questions: [
          {
            id: 1,
            text: "What is the primary difference between stocks and bonds?",
            options: [
              { id: 'a', text: "Stocks represent ownership, bonds represent debt" },
              { id: 'b', text: "Stocks are always riskier than bonds" },
              { id: 'c', text: "Bonds always provide higher returns than stocks" },
              { id: 'd', text: "Stocks are issued by governments, bonds by companies" }
            ],
            correctAnswer: 'a',
            explanation: "Stocks represent partial ownership in a company, while bonds are essentially loans that investors make to companies or governments."
          },
          {
            id: 2,
            text: "What is diversification in investing?",
            options: [
              { id: 'a', text: "Investing all your money in one promising stock" },
              { id: 'b', text: "Spreading investments across various assets to reduce risk" },
              { id: 'c', text: "Investing only in foreign markets" },
              { id: 'd', text: "Changing your investment strategy frequently" }
            ],
            correctAnswer: 'b',
            explanation: "Diversification involves spreading investments across different asset classes, sectors, or regions to reduce overall risk in a portfolio."
          },
          {
            id: 3,
            text: "What is compound interest?",
            options: [
              { id: 'a', text: "Interest paid only on the principal amount" },
              { id: 'b', text: "Interest that decreases over time" },
              { id: 'c', text: "Interest earned on both principal and accumulated interest" },
              { id: 'd', text: "A fixed interest rate that never changes" }
            ],
            correctAnswer: 'c',
            explanation: "Compound interest is interest calculated on the initial principal and also on the accumulated interest from previous periods, creating a snowball effect."
          },
          {
            id: 4,
            text: "Which of the following is generally considered the safest investment?",
            options: [
              { id: 'a', text: "Cryptocurrency" },
              { id: 'b', text: "Individual stocks" },
              { id: 'c', text: "Real estate in developing markets" },
              { id: 'd', text: "U.S. Treasury bonds" }
            ],
            correctAnswer: 'd',
            explanation: "U.S. Treasury bonds are backed by the full faith and credit of the U.S. government and are considered among the safest investments available."
          },
          {
            id: 5,
            text: "What is a mutual fund?",
            options: [
              { id: 'a', text: "A type of bank account with high interest rates" },
              { id: 'b', text: "A pool of money from many investors used to purchase a diversified portfolio" },
              { id: 'c', text: "A government program to help people save for retirement" },
              { id: 'd', text: "A loan given to multiple borrowers simultaneously" }
            ],
            correctAnswer: 'b',
            explanation: "A mutual fund is a professionally managed investment vehicle that pools money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities."
          }
        ]
      },
      moderate: {
        title: "Investment Basics - Moderate Level Quiz",
        questions: [
          {
            id: 1,
            text: "What is the difference between systematic and unsystematic risk?",
            options: [
              { id: 'a', text: "Systematic risk affects specific companies, unsystematic risk affects the entire market" },
              { id: 'b', text: "Systematic risk affects the entire market, unsystematic risk affects specific companies" },
              { id: 'c', text: "Systematic risk can be eliminated through diversification, unsystematic risk cannot" },
              { id: 'd', text: "Systematic risk is only relevant to bonds, unsystematic risk only to stocks" }
            ],
            correctAnswer: 'b',
            explanation: "Systematic risk (market risk) affects the entire market and cannot be eliminated through diversification. Unsystematic risk is specific to individual companies or sectors and can be reduced through diversification."
          },
          {
            id: 2,
            text: "What is the primary purpose of asset allocation?",
            options: [
              { id: 'a', text: "To maximize returns regardless of risk" },
              { id: 'b', text: "To minimize taxes on investments" },
              { id: 'c', text: "To balance risk and reward according to an investor's goals and risk tolerance" },
              { id: 'd', text: "To ensure all investments are in a single industry" }
            ],
            correctAnswer: 'c',
            explanation: "Asset allocation aims to balance risk and reward by apportioning a portfolio's assets according to an individual's goals, risk tolerance, and investment horizon."
          },
          {
            id: 3,
            text: "What is the efficient frontier in Modern Portfolio Theory?",
            options: [
              { id: 'a', text: "The point where a portfolio has zero risk" },
              { id: 'b', text: "The set of optimal portfolios that offer the highest expected return for a defined level of risk" },
              { id: 'c', text: "The maximum amount of money an investor should allocate to stocks" },
              { id: 'd', text: "The point at which diversification no longer reduces risk" }
            ],
            correctAnswer: 'b',
            explanation: "The efficient frontier represents the set of optimal portfolios that offer the highest expected return for a defined level of risk or the lowest risk for a given level of expected return."
          },
          {
            id: 4,
            text: "What is the primary difference between active and passive investing?",
            options: [
              { id: 'a', text: "Active investing requires daily trading, passive investing requires monthly trading" },
              { id: 'b', text: "Active investing aims to outperform a benchmark index, passive investing aims to match it" },
              { id: 'c', text: "Active investing is only for institutional investors, passive investing is only for individual investors" },
              { id: 'd', text: "Active investing focuses on bonds, passive investing focuses on stocks" }
            ],
            correctAnswer: 'b',
            explanation: "Active investing attempts to outperform a benchmark index through research, analysis, and market timing. Passive investing aims to match the performance of a specific index by replicating its holdings."
          },
          {
            id: 5,
            text: "What is the concept of 'rebalancing' in portfolio management?",
            options: [
              { id: 'a', text: "Selling all investments and starting over" },
              { id: 'b', text: "Adjusting portfolio allocations to maintain desired asset allocation percentages" },
              { id: 'c', text: "Changing investment strategies every quarter" },
              { id: 'd', text: "Moving all investments from stocks to bonds" }
            ],
            correctAnswer: 'b',
            explanation: "Rebalancing involves periodically buying or selling assets to maintain the original or desired asset allocation. This helps manage risk and can enhance long-term returns."
          }
        ]
      },
      advanced: {
        title: "Investment Basics - Advanced Level Quiz",
        questions: [
          {
            id: 1,
            text: "What is the Capital Asset Pricing Model (CAPM) used for?",
            options: [
              { id: 'a', text: "To calculate the exact future return of a stock" },
              { id: 'b', text: "To determine the appropriate discount rate for a company's dividends" },
              { id: 'c', text: "To calculate the expected return of an asset based on its risk relative to the market" },
              { id: 'd', text: "To determine the optimal number of stocks in a portfolio" }
            ],
            correctAnswer: 'c',
            explanation: "The Capital Asset Pricing Model (CAPM) is used to calculate the expected return of an asset based on its beta (systematic risk) relative to the market."
          },
          {
            id: 2,
            text: "What is the Sharpe ratio measuring?",
            options: [
              { id: 'a', text: "The total return of a portfolio" },
              { id: 'b', text: "Risk-adjusted return, or excess return per unit of risk" },
              { id: 'c', text: "The volatility of a portfolio compared to the market" },
              { id: 'd', text: "The percentage of a portfolio allocated to equities" }
            ],
            correctAnswer: 'b',
            explanation: "The Sharpe ratio measures risk-adjusted return by dividing a portfolio's excess return (over the risk-free rate) by its standard deviation. It helps investors understand the return of an investment compared to its risk."
          },
          {
            id: 3,
            text: "What is a derivative in finance?",
            options: [
              { id: 'a', text: "A type of mutual fund that invests in multiple asset classes" },
              { id: 'b', text: "A financial security with a value that is dependent upon or derived from an underlying asset or group of assets" },
              { id: 'c', text: "A mathematical calculation used to determine a stock's intrinsic value" },
              { id: 'd', text: "A type of bond issued by corporations" }
            ],
            correctAnswer: 'b',
            explanation: "A derivative is a financial security whose value is derived from an underlying asset or benchmark. Common derivatives include options, futures, forwards, and swaps."
          },
          {
            id: 4,
            text: "What is factor investing?",
            options: [
              { id: 'a', text: "Investing based on macroeconomic factors like GDP and inflation" },
              { id: 'b', text: "Investing in companies with the highest dividend yields" },
              { id: 'c', text: "Targeting specific factors (like value, size, momentum) that drive returns across asset classes" },
              { id: 'd', text: "Investing only in a single industry sector" }
            ],
            correctAnswer: 'c',
            explanation: "Factor investing involves targeting specific attributes or 'factors' that have been shown to provide risk premiums over time. Common factors include value, size, momentum, quality, and low volatility."
          },
          {
            id: 5,
            text: "What is the efficient market hypothesis?",
            options: [
              { id: 'a', text: "The theory that markets always rise over the long term" },
              { id: 'b', text: "The idea that asset prices reflect all available information, making it difficult to consistently outperform the market" },
              { id: 'c', text: "The concept that market efficiency increases as more investors participate" },
              { id: 'd', text: "The principle that market prices are determined solely by supply and demand" }
            ],
            correctAnswer: 'b',
            explanation: "The efficient market hypothesis (EMH) suggests that asset prices reflect all available information, making it difficult for investors to consistently achieve above-average returns without taking on above-average risk."
          }
        ]
      }
    }
  };
  
  return quizzes[moduleId]?.[level] || {
    title: `${moduleId} - ${level} Level Quiz`,
    questions: [
      {
        id: 1,
        text: "Sample question (No quiz data available for this module/level)",
        options: [
          { id: 'a', text: "Option A" },
          { id: 'b', text: "Option B" },
          { id: 'c', text: "Option C" },
          { id: 'd', text: "Option D" }
        ],
        correctAnswer: 'a',
        explanation: "This is a sample explanation."
      }
    ]
  };
};

const QuizModal = ({ moduleId, level, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const quizData = getQuizData(moduleId, level);
  
  const handleOptionSelect = (optionId) => {
    if (selectedOption) return;
    
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    if (optionId === quizData.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };
  
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };
  
  const getResultMessage = () => {
    const percentage = (score / quizData.questions.length) * 100;
    
    if (percentage >= 80) {
      return "Excellent! You've mastered this level and unlocked the next one.";
    } else if (percentage >= 60) {
      return "Good job! You have a solid foundation, but you need to score at least 80% to unlock the next level.";
    } else {
      return "Keep learning! Review the material and try again to strengthen your knowledge.";
    }
  };
  
  const handleComplete = () => {
    const percentage = (score / quizData.questions.length) * 100;
    onComplete(percentage);
  };
  
  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        
        {!quizCompleted ? (
          <>
            <QuizTitle>{quizData.title}</QuizTitle>
            <ProgressText>
              Question {currentQuestion + 1} of {quizData.questions.length}
            </ProgressText>
            
            <QuizQuestion>
              {quizData.questions[currentQuestion].text}
            </QuizQuestion>
            
            <OptionsContainer>
              {quizData.questions[currentQuestion].options.map((option) => (
                <OptionButton
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  selected={selectedOption === option.id}
                  isCorrect={selectedOption === option.id && option.id === quizData.questions[currentQuestion].correctAnswer}
                  disabled={selectedOption !== null}
                  whileHover={{ scale: selectedOption ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.text}
                </OptionButton>
              ))}
            </OptionsContainer>
            
            <AnimatePresence>
              {showFeedback && (
                <FeedbackMessage
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  isCorrect={selectedOption === quizData.questions[currentQuestion].correctAnswer}
                >
                  {selectedOption === quizData.questions[currentQuestion].correctAnswer 
                    ? "Correct! " 
                    : "Incorrect. "}
                  {quizData.questions[currentQuestion].explanation}
                </FeedbackMessage>
              )}
            </AnimatePresence>
            
            <ButtonContainer>
              <Button 
                onClick={handlePrevQuestion} 
                disabled={currentQuestion === 0 || !selectedOption}
              >
                Previous
              </Button>
              
              {selectedOption && (
                <Button 
                  primary 
                  onClick={handleNextQuestion}
                >
                  {currentQuestion < quizData.questions.length - 1 ? "Next" : "See Results"}
                </Button>
              )}
            </ButtonContainer>
          </>
        ) : (
          <ResultCard>
            <ResultTitle>Quiz Completed!</ResultTitle>
            <ResultScore>
              {Math.round((score / quizData.questions.length) * 100)}%
            </ResultScore>
            <ResultMessage>
              {getResultMessage()}
            </ResultMessage>
            <Button primary onClick={handleComplete}>
              Continue Learning
            </Button>
          </ResultCard>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default QuizModal;