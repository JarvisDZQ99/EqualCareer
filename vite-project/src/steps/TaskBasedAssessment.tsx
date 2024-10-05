import React, { useState, useEffect } from 'react';
import '../styles/TaskBasedAssessment.css';

interface Question {
  industry: string;
  occupation: string;
  top_10_female: number | null;
  specialist_task: string;
  percent_time_spent_on_task: number;
  emerging_trending_flag: string;
  specialist_cluster: string;
  percent_time_spent_on_cluster: number;
  skills_statement: string;
  question: string;
}

interface TaskBasedAssessmentProps {
    industry: string;
    occupation: string;
    onPrevious: () => void;
    onAssessmentComplete?: () => void; 
}

interface ClusterScore {
  [key: string]: {
    totalScore: number;
    totalWeight: number;
    questions: number;
  };
}

const TaskBasedAssessment: React.FC<TaskBasedAssessmentProps> = ({ 
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
  const [clusterScores, setClusterScores] = useState<ClusterScore>({});

  useEffect(() => {
    fetchQuestions();
  }, [industry, occupation]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(`https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/generalfunc5?industry=${encodeURIComponent(industry)}&occupation=${encodeURIComponent(occupation)}`);
        if (!response.ok) {
        throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
        setUserAnswers(new Array(data.length).fill(0));
    } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Failed to load questions. Please try again.');
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
    let totalScore = 0;
    let totalWeight = 0;
    const newClusterScores: ClusterScore = {};

    questions.forEach((question, index) => {
      const weight = question.percent_time_spent_on_task / 100;
      const weightedScore = answers[index] * weight;

      totalScore += weightedScore;
      totalWeight += weight;

      if (!newClusterScores[question.specialist_cluster]) {
        newClusterScores[question.specialist_cluster] = {
          totalScore: 0,
          totalWeight: 0,
          questions: 0,
        };
      }

      newClusterScores[question.specialist_cluster].totalScore += weightedScore;
      newClusterScores[question.specialist_cluster].totalWeight += weight;
      newClusterScores[question.specialist_cluster].questions += 1;
    });

    setClusterScores(newClusterScores);
    setShowResults(true);
    if (onAssessmentComplete) {
        onAssessmentComplete();
      }
  };

  const renderResults = () => {
    const overallScore = Object.values(clusterScores).reduce(
      (acc, cluster) => acc + cluster.totalScore,
      0
    ) / Object.values(clusterScores).reduce((acc, cluster) => acc + cluster.totalWeight, 0) * 20;

    const clusterAnalysis = Object.entries(clusterScores)
      .map(([cluster, data]) => ({
        cluster,
        score: (data.totalScore / data.totalWeight) * 20, 
      }))
      .sort((a, b) => b.score - a.score);

    const goodClusters = clusterAnalysis.filter(c => c.score > 50);
    const improvementClusters = clusterAnalysis.filter(c => c.score <= 50);

    return (
        <div className="results-container">
            <div className="results">
                <h2>Assessment Results</h2>
                <p className="overall-score">Your overall performance: <span>{overallScore.toFixed(0)}%</span></p>
                <div className="cluster-analysis">
                    <div className="good-clusters">
                    <h3>Areas You Excelled In:</h3>
                    <ul>
                        {goodClusters.map(({ cluster }) => (
                        <li key={cluster}>{cluster}</li>
                        ))}
                    </ul>
                    </div>
                    <div className="improvement-clusters">
                    <h3>Areas for Improvement:</h3>
                    <ul>
                        {improvementClusters.map(({ cluster }) => (
                        <li key={cluster}>{cluster}</li>
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
        <div className="task-based-assessment">
          <button className="previous-button" onClick={onPrevious}>Back to Skill Assessment</button>
        </div>
      </>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="task-based-assessment">
      <h1>Task-based Assessment for {occupation} in {industry}</h1>
      <div className="question-card">
        <h2>{currentQuestion.specialist_task}</h2>
        {/* <p className="skills-statement">{currentQuestion.skills_statement}</p> */}
        <p className="question">{currentQuestion.question}</p>
        {currentQuestion.emerging_trending_flag && (
          <span className="trending">Trending Task</span>
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

export default TaskBasedAssessment;