import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Loader from '../components/Loader';
import api from "../api/axios";

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRedirectLoader, setShowRedirectLoader] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      setError(true);
      return;
    }

    setError(false);
    setSuccessMsg(false);
    setLoading(true);
    ``
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("username", username);
      localStorage.setItem("loginSuccess", "true");

      setSuccessMsg(true);
      setLoading(false);
      setShowRedirectLoader(true);

      setTimeout(() => {
        navigate("/main-menu");
      }, 1000);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center ml-[-50px] ">
      {showRedirectLoader && <Loader fullScreen={true} />}

      <div className="w-full max-w-md">
        {error && (
          <div className="w-80 bg-red-500 text-white px-4 py-2.5 rounded-full text-[18px] font-medium text-center  mt-4 ml-24">
            Incorrect Username or Password
          </div>
        )}
        {successMsg && (
          <div className="w-80 bg-green-700 text-white px-4 py-2.5 rounded-full text-[18px] font-medium text-center ml-24">
            Login Successful!
          </div>
        )}

        <div className="bg-black rounded-lg  sm:p-12">
          <div className="mb-[-100px]">
            <Logo />
          </div>

          {/* ✅ Single form wrapping all inputs */}
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-white mb-1 ml-2 text-[20px] font-medium">
                User Name *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(false); }}
                disabled={loading || showRedirectLoader}
                className={`w-[400px] px-6 py-3 rounded-full text-black focus:outline-none ${error ? "bg-red-100 border-2 border-red-500" : "bg-white"
                  } ${loading || showRedirectLoader ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="mb-15">
              <label className="block text-white text-[20px] mb-1 ml-2 text-xs font-medium">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                disabled={loading || showRedirectLoader}
                className={`w-[400px] px-6 py-3 rounded-full text-black focus:outline-none ${error ? "bg-red-100 border-2 border-red-500" : "bg-white"
                  } ${loading || showRedirectLoader ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>

            <button
              type="submit" // ✅ Enter key works with submit button
              disabled={loading || showRedirectLoader}
              className={`w-40 bg-blue-500 text-white font-medium py-3 rounded-full transition-colors text-[20px] mb-4 ml-29 flex items-center justify-center ${loading || showRedirectLoader ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
            >
              {loading ? (
                <>
                  <Loader size="small" color="white" />
                  <span className="ml-2">Loading...</span>
                </>
              ) : 'Login'}
            </button>

            <div className="flex items-center justify-center ml-7">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading || showRedirectLoader}
                className="mr-2"
              />
              <label htmlFor="remember" className="text-white text-[18px] font-medium">
                Remember me
              </label>
            </div>
          </form>

          {error && (
            <div className="flex items-start gap-0.5 font-semibold mt-0.5 text-white text-[15px] ml-6">
              <img src="/error.png" alt="info" className="w-2 h-8" />
              <p className="text-white text-[15px] font-semibold text-center">
                If you forget your <span className="font-semibold">USERNAME</span> or{" "}
                <span className="font-semibold">PASSWORD</span> please contact your <br />
                <span className="text-center">admin..</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
