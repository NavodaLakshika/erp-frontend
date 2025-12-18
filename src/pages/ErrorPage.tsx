import Logo from "../components/Logo";

interface ErrorPageProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  handleLogin: () => void;
}

function ErrorPage({ 
  username, 
  setUsername, 
  password, 
  setPassword, 
  rememberMe, 
  setRememberMe, 
  handleLogin 
}: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black rounded-lg p-8 sm:p-12">
          <div className="flex justify-center mb-6">
            <div className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium">
              Incorrect Username or Password !
            </div>
          </div>

          <Logo />

          <div>
            <div className="mb-6">
              <label className="block text-white text-sm mb-2">User Name*</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-gray-200 text-gray-900 border-2 border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white text-sm mb-2">Password*</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-gray-200 text-gray-900 border-2 border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-full transition-colors mb-4"
            >
              Login
            </button>

            <div className="flex items-center justify-center mb-4">
              <input
                type="checkbox"
                id="remember-error"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="remember-error" className="text-white text-sm">Remember me</label>
            </div>

            <div className="text-center">
              <p className="text-white text-xs">
                <span className="text-red-500">!</span> If you forget your <span className="font-semibold">USERNAME</span> or<br />
                <span className="font-semibold">PASSWORD</span> please contact your admin...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;