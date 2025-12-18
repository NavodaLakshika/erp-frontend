
import { useState } from "react";
import Logo from "../components/Logo";
import MainMenu from "./MainMenu";

interface LoginPageProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  handleLogin: () => void;
}

function LoginPage({ 
  username, 
  setUsername, 
  password, 
  setPassword, 
  rememberMe, 
  setRememberMe, 
 
}: LoginPageProps) {

   const [status, setStatus] = useState<"login" | "success">("login");
  const [error, setError] = useState(false);

  const DEMO_USERNAME = "demo";
  const DEMO_PASSWORD = "1234"; 

  const handleLogin = () => {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      setStatus("success"); // Go to MainMenu
    } else {
      setError(true); // Show error
    }
  };

  if (status === "success") {
    return <MainMenu />;
  }

  return (
    
    <div className="min-h-screen bg-black flex items-center justify-center p-4 ">
    
      <div className="w-full  max-w-md">
          {error && (
            <div className= "w-60 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-medium text-center mb-4 ml-27">
               Incorrect Username or Password
            </div>
          )}
        <div className="bg-black rounded-lg p-8 sm:p-12">
          <div className="mb-[-70px]"> {/* reduced gap here */}
  <Logo />
</div>

{/* Error message */}
        

          <div>
            <div className="mb-6">
              <label className="block text-white text-sm mb-1 ml-2 text-xs font-medium">User Name *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                   setError(false);
                }}
                
                 className={`w-full px-5 py-1.5 rounded-full text-black focus:outline-none ${
    error ? "bg-red-100 border-2 border-red-500" : "bg-white"
  }`}
/>
            </div>

            <div className="mb-15">
              <label className="block text-white text-sm mb-1 ml-2 text-xs font-medium">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value);
setError(false); 
                }}
                className={`w-full px-5 py-1.5 rounded-full text-black focus:outline-none ${
    error ? "bg-red-100 border-2 border-red-500" : "bg-white"
  }`}
  />
            </div>

            <button
              onClick={handleLogin}
              className="w-30 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-full transition-colors text-xs mb-4 ml-29 font-medium"
            >
              Login
            </button>

            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="remember" className="text-white text-sm text-xs font-medium">Remember me</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;