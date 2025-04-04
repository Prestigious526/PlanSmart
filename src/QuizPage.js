import React, { useState, useEffect } from "react";
import "./QuizPage.css";

const QuizPage = () => {
  // Quiz configuration
  const QUESTION_COUNT = 5;
  const TIME_PER_QUESTION = 30; // seconds

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [previousScores, setPreviousScores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [quizStarted, setQuizStarted] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  // Question bank with explanations
  const questionBank = [
    {
      question: "What is the primary purpose of a budget?",
      options: [
        "To track income and expenses",
        "To invest in the stock market",
        "To save for retirement",
        "To pay off debt",
      ],
      correctAnswer: "To track income and expenses",
      explanation: "A budget helps you understand where your money comes from and where it goes, enabling better financial decisions."
    },
    {
      question: "What is compound interest?",
      options: [
        "Interest earned only on the principal amount",
        "Interest earned on both the principal and accumulated interest",
        "A type of loan interest",
        "Interest paid monthly",
      ],
      correctAnswer: "Interest earned on both the principal and accumulated interest",
      explanation: "Compound interest is 'interest on interest' and allows money to grow exponentially over time."
    },
    {
      question: "What is an emergency fund?",
      options: [
        "Money saved for vacations",
        "Money saved for unexpected expenses",
        "Money invested in stocks",
        "Money used for daily expenses",
      ],
      correctAnswer: "Money saved for unexpected expenses",
      explanation: "An emergency fund is typically 3-6 months of living expenses set aside for financial emergencies."
    },
    {
      question: "What does ROI stand for?",
      options: [
        "Return on Investment",
        "Rate of Interest",
        "Risk of Inflation",
        "Revenue on Income",
      ],
      correctAnswer: "Return on Investment",
      explanation: "ROI measures the gain or loss generated on an investment relative to the amount of money invested."
    },
    {
      question: "What is diversification in investing?",
      options: [
        "Putting all your money in one stock",
        "Spreading investments across different assets",
        "Investing only in bonds",
        "Avoiding the stock market completely",
      ],
      correctAnswer: "Spreading investments across different assets",
      explanation: "Diversification reduces risk by allocating investments among various financial instruments."
    },
    {
      question: "What is a 401(k)?",
      options: [
        "A type of savings account",
        "A retirement savings plan sponsored by an employer",
        "A government bond",
        "A type of insurance",
      ],
      correctAnswer: "A retirement savings plan sponsored by an employer",
      explanation: "A 401(k) allows employees to save and invest a portion of their paycheck before taxes are taken out."
    },
    {
      question: "What is the rule of 72?",
      options: [
        "A budgeting rule for spending",
        "A method to calculate how long it takes to double your money",
        "A stock market prediction formula",
        "A retirement savings guideline",
      ],
      correctAnswer: "A method to calculate how long it takes to double your money",
      explanation: "Divide 72 by your annual interest rate to estimate how many years it takes to double your investment."
    },
    {
      question: "What is a credit score used for?",
      options: [
        "Determining your age",
        "Assessing your creditworthiness",
        "Calculating your taxes",
        "Measuring your income",
      ],
      correctAnswer: "Assessing your creditworthiness",
      explanation: "Lenders use credit scores to evaluate the likelihood you'll repay borrowed money."
    }
  ];

  // Initialize quiz
  const startQuiz = () => {
    const shuffledQuestions = [...questionBank]
      .sort(() => Math.random() - 0.5)
      .slice(0, QUESTION_COUNT);
    setQuestions(shuffledQuestions);
    setQuizStarted(true);
    setTimeLeft(TIME_PER_QUESTION);
  };

  // Timer effect
  useEffect(() => {
    if (!quizStarted || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return TIME_PER_QUESTION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, showResult, currentQuestion]);

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowExplanation(false);
  };

  // Handle next question or show result
  const handleNextQuestion = () => {
    // Check if answer is correct
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Show explanation if available
    if (questions[currentQuestion].explanation) {
      setExplanation(questions[currentQuestion].explanation);
      setShowExplanation(true);
      return;
    }

    proceedToNextQuestion();
  };

  const proceedToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setTimeLeft(TIME_PER_QUESTION);
      setShowExplanation(false);
    } else {
      endQuiz();
    }
  };

  // End the quiz
  const endQuiz = () => {
    setShowResult(true);
    setPreviousScores([...previousScores, { score, total: questions.length, date: new Date().toLocaleDateString() }]);
  };

  // Restart the quiz
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setShowResult(false);
    setQuizStarted(false);
    setShowExplanation(false);
  };

  // Calculate progress
  const progress = quizStarted ? ((currentQuestion + (showExplanation ? 0 : 1)) / questions.length) * 100 : 0;

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <h1>Financial Literacy Quiz</h1>
        <p>Test your knowledge of personal finance concepts</p>
      </header>

      {!quizStarted ? (
        <div className="start-screen">
          <div className="quiz-info">
            <h2>About This Quiz</h2>
            <ul>
              <li>{QUESTION_COUNT} randomly selected questions</li>
              <li>{TIME_PER_QUESTION} seconds per question</li>
              <li>Detailed explanations for each answer</li>
              <li>Track your progress over time</li>
            </ul>
          </div>
          <button className="start-button" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      ) : showResult ? (
        <div className="result-section">
          <div className={`result-card ${score === questions.length ? 'perfect' : score >= questions.length / 2 ? 'good' : 'poor'}`}>
            <h2>Quiz Completed!</h2>
            <div className="score-circle">
              <span>{score}</span>
              <small>/{questions.length}</small>
            </div>
            <p className="result-message">
              {score === questions.length
                ? "Perfect! You're a financial expert!"
                : score >= questions.length / 2
                ? "Good job! You have solid financial knowledge."
                : "Keep learning! Review the explanations to improve."}
            </p>
          </div>

          <div className="quiz-actions">
            <button className="restart-button" onClick={restartQuiz}>
              Take Quiz Again
            </button>
          </div>

          {previousScores.length > 0 && (
            <div className="score-history">
              <h3>Your Quiz History</h3>
              <div className="history-grid">
                {previousScores.map((attempt, index) => (
                  <div key={index} className="history-card">
                    <div className="attempt-date">{attempt.date}</div>
                    <div className="attempt-score">
                      {attempt.score}/{attempt.total}
                    </div>
                    <div className="attempt-percentage">
                      {Math.round((attempt.score / attempt.total) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : showExplanation ? (
        <div className="explanation-section">
          <div className="explanation-card">
            <h3>Explanation</h3>
            <p>{explanation}</p>
            <button className="continue-button" onClick={proceedToNextQuestion}>
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-section">
          <div className="quiz-progress">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <div className="progress-text">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="timer">
              <span>⏱️</span> {timeLeft}s
            </div>
          </div>

          <div className="question-card">
            <h2>{questions[currentQuestion].question}</h2>
            <div className="options-grid">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedAnswer === option ? "selected" : ""}`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button
              className="next-button"
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
            >
              {currentQuestion === questions.length - 1 ? "Submit Quiz" : "Next Question"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;