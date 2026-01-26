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
      const res = await api.post("https://jayanthatradersprdbackend-dev.up.railway.app/api/auth/login", {
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
          <div className="w-110 bg-red-500 text-white  py-7 rounded-full text-[25px] font-medium text-center  mt-4 ml-5">
            Incorrect Username or Password
          </div>
        )}
        {successMsg && (
          <div className="w-90 bg-green-700 text-white px-4 py-7 rounded-full text-[25px] font-medium text-center ml-20">
            Login Successful!
          </div>
        )}

        <div className="bg-black rounded-lg  ">
          <div className="mb-[-10px]">
            <Logo />
          </div>

          {/* Single form wrapping all inputs */}
          <form onSubmit={handleLogin}>
            <div className="mb-4 ">
              <label className="block text-white ml-[-30px] mt-[-100px] mb-1 ml-2 text-[40px] font-medium">
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
                className={`w-[550px] ml-[-45px]  px-6 py-9 rounded-full text-black focus:outline-none text-[25px] ${
                  error ? "bg-red-100 border-2 border-red-500" : "bg-white"
                } ${
                  loading || showRedirectLoader
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                
              />
            </div>

            <div className="mb-15">
              <label className="block text-white ml-[-30px] text-[40px] mb-1 ml-2  ">
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
                className={`w-[550px] ml-[-45px] px-6 py-9 rounded-full text-black focus:outline-none text-[25px] ${
                  error ? "bg-red-100 border-2 border-red-500" : "bg-white"
                } ${
                  loading || showRedirectLoader
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                
              />
            </div>

            <button
              type="submit"
              disabled={loading || showRedirectLoader}
              className={`w-50 bg-blue-500 text-white font-medium py-3 rounded-full transition-colors text-[30px] mb-4 ml-31 flex items-center justify-center ${
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

            <div className="flex items-center justify-center ">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading || showRedirectLoader}
                className="mr-2 w-6 h-6"
              />
              <label
                htmlFor="remember"
                className="text-white text-[30px] font-medium"
              >
                Remember me
              </label>
            </div>
          </form>

          {error && (
            <div className="flex items-start gap-0.5 font-semibold mt-0.5 text-white ml-">
              <img src="/error.png" alt="info" className="w-8 h-15" />
              <p className="text-white text-[28px] font-semibold text-center">
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