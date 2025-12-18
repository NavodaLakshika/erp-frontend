import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(1);

  const handleLogin = async (username: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demonstration: Always fail on first attempt, succeed on third
    if (attemptCount < 3) {
      setAttemptCount(prev => prev + 1);
    } else {
      // On successful login
      alert(`Login successful!\nUsername: ${username}\nRemember me: ${rememberMe}`);
      // In real app, you would redirect to dashboard
      // navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const showError = attemptCount === 2; // Show error after first failed attempt

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <LoginForm 
        onSubmit={handleLogin}
        isSubmitting={isLoading}
        showError={showError}
        attemptNumber={attemptCount}
      />
    </div>
  );
};