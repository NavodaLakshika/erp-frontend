import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Loader from "../components/Loader";
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

  // Clear session on login page load
  useEffect(() => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id"); // Clear previous user ID
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!username || !password) {
      setError(true);
      return;
    }

    setError(false);
    setSuccessMsg(false);
    setLoading(true);

    localStorage.removeItem("token");
    localStorage.removeItem("user_id"); // Clear any old user ID

    try {
      const res = await api.post("/auth/login", {
        email: username,
        password: password,
      });

      console.log("Login API Response:", res.data); // Debug log

      // Save auth data
      sessionStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("username", username);
      
      // CRITICAL FIX: Save user ID from response
      // Check different possible response structures
      let userId = null;
      
      if (res.data.user_id) {
        userId = res.data.user_id;
      } else if (res.data.user?.id) {
        userId = res.data.user.id;
      } else if (res.data.id) {
        userId = res.data.id;
      }
      
      if (userId) {
        localStorage.setItem("user_id", userId.toString());
        console.log("Saved user_id to localStorage:", userId);
      } else {
        console.warn("No user ID found in login response!");
        // Try to get user from a separate endpoint if available
        try {
          // If your API has a /auth/me endpoint
          const userRes = await api.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${res.data.access_token}`
            }
          });
          if (userRes.data?.id) {
            localStorage.setItem("user_id", userRes.data.id.toString());
            console.log("Got user_id from /auth/me:", userRes.data.id);
          }
        } catch (userError) {
          console.error("Could not fetch user info:", userError);
          // If you can't get user ID, we'll need to handle this differently
        }
      }
      
      localStorage.setItem("loginSuccess", "true");

      setSuccessMsg(true);
      setLoading(false);
      setShowRedirectLoader(true);

      setTimeout(() => {
        navigate("/main-menu");
      }, 1000);
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      setError(true);
      setLoading(false);
      
      // Clear any partial auth data on error
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
    }
  };

  // Handle Enter key for password field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center ">
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

          {/* Single form wrapping all inputs */}
          <form onSubmit={handleLogin}>
            <div className="mb-4 ">
              <label className="block text-white mb-1 ml-2 text-[20px] font-medium">
                User Name *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                disabled={loading || showRedirectLoader}
                className={`w-[400px] px-6 py-3 rounded-full text-black focus:outline-none ${
                  error ? "bg-red-100 border-2 border-red-500" : "bg-white"
                } ${
                  loading || showRedirectLoader
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                placeholder="Enter email"
              />
            </div>

            <div className="mb-15">
              <label className="block text-white text-[20px] mb-1 ml-2 text-xs font-medium">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                onKeyPress={handleKeyPress}
                disabled={loading || showRedirectLoader}
                className={`w-[400px] px-6 py-3 rounded-full text-black focus:outline-none ${
                  error ? "bg-red-100 border-2 border-red-500" : "bg-white"
                } ${
                  loading || showRedirectLoader
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || showRedirectLoader}
              className={`w-40 bg-blue-500 text-white font-medium py-3 rounded-full transition-colors text-[20px] mb-4 ml-29 flex items-center justify-center ${
                loading || showRedirectLoader
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              {loading ? (
                <>
                  <Loader size="small" color="white" />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                "Login"
              )}
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
              <label
                htmlFor="remember"
                className="text-white text-[18px] font-medium"
              >
                Remember me
              </label>
            </div>
          </form>

          {error && (
            <div className="flex items-start gap-0.5 font-semibold mt-0.5 text-white text-[15px] ml-6">
              <img src="/error.png" alt="info" className="w-2 h-8" />
              <p className="text-white text-[15px] font-semibold text-center">
                If you forget your{" "}
                <span className="font-semibold">USERNAME</span> or{" "}
                <span className="font-semibold">PASSWORD</span> please contact
                your <br />
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