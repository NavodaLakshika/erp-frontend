import Logo from "../components/Logo";

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
  handleLogin 
}: LoginPageProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full  max-w-md">
        <div className="bg-black rounded-lg p-8 sm:p-12">
          <div className="mb-[-70px]"> {/* reduced gap here */}
  <Logo />
</div>

          <div>
            <div className="mb-6">
              <label className="block text-white text-sm mb-1 ml-2">User Name *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5  py-1 rounded-full bg-white text-black focus:outline-none "
              />
            </div>

            <div className="mb-6">
              <label className="block text-white text-sm mb-1 ml-2">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-1 rounded-full bg-white text-black focus:outline-none"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-30 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-full transition-colors mb-4 ml-29"
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
              <label htmlFor="remember" className="text-white text-sm">Remember me</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;