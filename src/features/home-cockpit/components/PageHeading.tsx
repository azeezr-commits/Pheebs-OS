import React, { useState, useEffect } from 'react';

export const PageHeading: React.FC = () => {
  const [greeting, setGreeting] = useState('Good morning.');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning.');
    else if (hour < 18) setGreeting('Good afternoon.');
    else setGreeting('Good evening.');
  }, []);

  return (
    <header className="launch-header">
      <p className="launch-greeting">{greeting}</p>
      <div className="launch-title-container">
        <h1 className="launch-title">Launch</h1>
      </div>
      <p className="launch-subtitle">Your day begins here.</p>
    </header>
  );
};

export default PageHeading;
