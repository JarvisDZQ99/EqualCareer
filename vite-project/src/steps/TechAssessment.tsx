import React, { useState, useEffect } from 'react';
import '../styles/TechAssessment.css';

interface Question {
  industry: string;
  occupation: string;
  top_10_female: number | null;
  technology_tool: string;
  emerging_trending_flag: string;
  question: string;
}

interface TechAssessmentProps {
  industry: string;
  occupation: string;
  onPrevious: () => void;
  onAssessmentComplete?: () => void;
}

interface TechScore {
  [key: string]: {
    totalScore: number;
    totalQuestions: number;
  };
}

const TechAssessment: React.FC<TechAssessmentProps> = ({
  industry,
  occupation,
  onPrevious,
  onAssessmentComplete
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [techScores, setTechScores] = useState<TechScore>({});

  useEffect(() => {
    fetchQuestions();
  }, [industry, occupation]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/generalfunc6?industry=${encodeURIComponent(industry)}&occupation=${encodeURIComponent(occupation)}`);
      if (!response.ok) {
        throw new Error('Sorry, there is no tech assessment available for the current occupation.');
      }
      const data = await response.json();
      setQuestions(data);
      setUserAnswers(new Array(data.length).fill(0));
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Sorry, there is no tech assessment available for the current occupation.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (score: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = score;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (answers: number[]) => {
    const newTechScores: TechScore = {};

    questions.forEach((question, index) => {
      if (!newTechScores[question.technology_tool]) {
        newTechScores[question.technology_tool] = {
          totalScore: 0,
          totalQuestions: 0,
        };
      }

      newTechScores[question.technology_tool].totalScore += answers[index];
      newTechScores[question.technology_tool].totalQuestions += 1;
    });

    setTechScores(newTechScores);
    setShowResults(true);
    if (onAssessmentComplete) {
      onAssessmentComplete();
    }
  };

  const renderResults = () => {
    const overallScore = Object.values(techScores).reduce(
      (acc, tech) => acc + tech.totalScore,
      0
    ) / Object.values(techScores).reduce((acc, tech) => acc + tech.totalQuestions, 0) * 20;

    const techAnalysis = Object.entries(techScores)
      .map(([tech, data]) => ({
        tech,
        score: (data.totalScore / data.totalQuestions) * 20,
      }))
      .sort((a, b) => b.score - a.score);

    const proficientTech = techAnalysis.filter(t => t.score > 60);
    const improvementTech = techAnalysis.filter(t => t.score <= 60);

    return (
      <div className="results-container">
        <div className="results">
          <h2>Tech Assessment Results</h2>
          <p className="overall-score">Your overall tech proficiency: <span>{overallScore.toFixed(0)}%</span></p>
          <div className="tech-analysis">
            <div className="proficient-tech">
              <h3>Technologies You're Proficient In:</h3>
              <ul>
                {proficientTech.map(({ tech }) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
            <div className="improvement-tech">
              <h3>Technologies to Improve:</h3>
              <ul>
                {improvementTech.map(({ tech }) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
        <div className="loading-container">
        <div className="loading-spinner"></div>
        </div>
    );
  }   

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (showResults) {
    return (
      <>
        <div className="results-container">
          <div className="results">
            {renderResults()}
          </div>
        </div>
        <div className="tech-assessment">
          <button className="previous-button" onClick={onPrevious}>Back to Skill Assessment</button>
        </div>
      </>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="tech-assessment">
      <h1>Tech Assessment for {occupation} in {industry}</h1>
      <div className="question-card">
        <h2>{currentQuestion.technology_tool}</h2>
        <p className="question">{currentQuestion.question}</p>
        {currentQuestion.emerging_trending_flag && (
          <span className="trending">Emerging Technology</span>
        )}
        <div className="answer-options">
          {[1, 2, 3, 4, 5].map((score) => (
            <button key={score} onClick={() => handleAnswer(score)}>
              {score}
            </button>
          ))}
        </div>
        <div className="question-progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
};

export default TechAssessment;