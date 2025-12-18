import { useState } from 'react';
import LoginPage from './pages/LoginPage';

import MainMenu from './pages/MainMenu';

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'error' | 'main'>('login');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleLogin = (): void => {
    if (username === 'User 01' && password === '123456') {
      setCurrentPage('main');
    } else {
      setCurrentPage('error');
    }
  };

  return (
    <div>
      {currentPage === 'login' && (
        <LoginPage
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          handleLogin={handleLogin}
        />
      )}
     
      {currentPage === 'main' && <MainMenu />}
      
    
    </div>
  );
}

export default App;