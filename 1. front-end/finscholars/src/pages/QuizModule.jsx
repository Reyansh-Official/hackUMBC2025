import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import BackgroundAnimation from '../components/BackgroundAnimation';
import Button from '../components/Button';

const QuizContainer = styled.div`
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const QuizCard = styled(motion.div)`
  background: var(--glass-background);
  backdrop-filter: blur(12px);
  border: var(--glass-border);
  box-shadow: var(--glass-glow);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
`;

const QuizHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const QuizTitle = styled.h2`
  font-size: 1.8rem;
  color: white;
  margin: 0;
`;

const ProgressText = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`;

const QuizQuestion = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 2rem;
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

const ListenButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: var(--glass-background-accent);
  border: var(--glass-border);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    width: 24px;
    height: 24px;
    fill: var(--color-accent);
    filter: drop-shadow(0 0 3px rgba(75, 207, 234, 0.5));
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(75, 207, 234, 0.5);
  }
  
  &.active {
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(75, 207, 234, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(75, 207, 234, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(75, 207, 234, 0);
    }
  }
`;

const ResultCard = styled(motion.div)`
  background: var(--glass-background);
  backdrop-filter: blur(12px);
  border: var(--glass-border);
  box-shadow: var(--glass-glow);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
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

// Mock quiz data
const quizData = {
  title: "Investment Basics",
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
};

const QuizModule = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
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
  
  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setQuizCompleted(false);
  };
  
  const toggleTextToSpeech = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // In a real implementation, this would use the Web Speech API
      // For now, we'll just simulate the behavior
      const textToRead = quizData.questions[currentQuestion].text;
      console.log("Reading text:", textToRead);
      
      // Simulate speech ending after 3 seconds
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };
  
  const getResultMessage = () => {
    const percentage = (score / quizData.questions.length) * 100;
    
    if (percentage >= 80) {
      return "Excellent! You have a strong understanding of investment basics.";
    } else if (percentage >= 60) {
      return "Good job! You have a solid foundation, but there's room to improve.";
    } else {
      return "Keep learning! Review the material and try again to strengthen your knowledge.";
    }
  };
  
  return (
    <>
      <Navbar />
      <BackgroundAnimation />
      <QuizContainer>
        <AnimatePresence mode="wait">
          {!quizCompleted ? (
            <QuizCard
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <QuizHeader>
                <QuizTitle>{quizData.title}</QuizTitle>
                <ProgressText>
                  Question {currentQuestion + 1} of {quizData.questions.length}
                </ProgressText>
              </QuizHeader>
              
              <ListenButton 
                onClick={toggleTextToSpeech}
                className={isListening ? 'active' : ''}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M14.5,12A2.5,2.5,0,0,0,12,9.5v5A2.5,2.5,0,0,0,14.5,12ZM12,6.5v0A5.5,5.5,0,0,1,17.5,12h0A5.5,5.5,0,0,1,12,17.5v0h0V6.5ZM3,12H6a6,6,0,0,0,12,0h3a9,9,0,0,1-18,0Z"/>
                </svg>
              </ListenButton>
              
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
            </QuizCard>
          ) : (
            <ResultCard
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ResultTitle>Quiz Completed!</ResultTitle>
              <ResultScore>
                {score}/{quizData.questions.length}
              </ResultScore>
              <ResultMessage>
                {getResultMessage()}
              </ResultMessage>
              <Button primary onClick={handleRestart}>
                Retake Quiz
              </Button>
            </ResultCard>
          )}
        </AnimatePresence>
      </QuizContainer>
    </>
  );
};

export default QuizModule;