import React from 'react';

interface StarRatingProps {
  score: number;
}

const StarRating: React.FC<StarRatingProps> = ({ score }) => {
  const totalStars = 5;
  const filledStars = Math.floor(score); 
  const hasHalfStar = score % 1 >= 0.5; 
  const stars = [];

  const starContainerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
  };

  const starStyle = {
    fontSize: '24px',
    color: 'gold',
    margin: '0 2px',
    position: 'relative' as 'relative',
  };

  const emptyStarStyle = {
    ...starStyle,
    color: 'lightgray',
  };

  const halfStarStyle = {
    ...starStyle,
    background: 'linear-gradient(90deg, gold 50%, lightgray 50%)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  };

  for (let i = 1; i <= filledStars; i++) {
    stars.push(<span key={i} style={starStyle}>&#9733;</span>); 
  }

  if (hasHalfStar) {
    stars.push(<span key="half" style={halfStarStyle}>&#9733;</span>); 
  }

  while (stars.length < totalStars) {
    stars.push(<span key={stars.length + 1} style={emptyStarStyle}>&#9734;</span>); 
  }

  return <div style={starContainerStyle}>{stars}</div>;
};

export default StarRating;
