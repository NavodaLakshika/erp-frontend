import { useState } from "react";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock check
    if (username && password) {
      console.log("Login:", { username, password, rememberMe });
      alert("Login successful!");
    } else {
      setError(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
<div className="mb-10 flex justify-center">
  <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
     <img
    src="/2.PNG"
    alt="Logo"
    className="w-full h-full object-contain" // fill the circle
  /> 
  </div>
</div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 bg-red-900/50 rounded-xl">
            <p className="text-red-300 text-center">Incorrect username or password</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="text-white text-base block mb-1 ">User Name *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-100 p-2 rounded-3xl bg-white "
          
            />
          </div>

          <div>
            <label className="text-white text-base block mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-100 p-2 rounded-3xl bg-white text-white "
      
            />
          </div>

          

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-35 ml-33 mt-8 h-10 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 ml-33"
            />
            <label className="text-white ml-2">Remember me</label>
          </div>

        </div>
      </div>
    </div>
  );
};