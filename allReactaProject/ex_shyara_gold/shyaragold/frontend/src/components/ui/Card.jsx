import React from 'react';

const Card = ({ children, className }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

const CardContent = ({ children, className }) => {
  return <div className={`card-content ${className}`}>{children}</div>;
}

export { Card, CardContent };
