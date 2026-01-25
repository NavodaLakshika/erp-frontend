import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuCard from "../components/MenuCard";
import ViewStock from "./ViewStock";

function MainMenu() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showViewStock, setShowViewStock] = useState(false);

  // ✅ NEW STATE
  const [activeCard, setActiveCard] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    const loginSuccess = localStorage.getItem("loginSuccess");
    if (loginSuccess === "true") {
      setShowSuccess(true);
      localStorage.removeItem("loginSuccess");
      setTimeout(() => setShowSuccess(false), 4000);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("loginSuccess");
    navigate("/");
  };

  if (showViewStock) return <ViewStock goBack={() => setShowViewStock(false)} />;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="bg-black rounded-lg p-8">

          <div className="flex justify-center mb-6">
            {showSuccess && (
              <div className="w-100 bg-green-700 text-white px-8 py-2.5 rounded-full text-[18px] font-medium text-center mb-4 mx-auto">
                Login Successful!
              </div>
            )}
          </div>

          {username && (
            <h2 className="text-white text-2xl sm:text-3xl font-bold text-center mb-10">
              Hello {username}!
            </h2>
          )}

          {/* FIRST ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-100 justify-items-center">
           <MenuCard
  title="Report Time"
  bgColor={
    activeCard === "report-time"
      ? "bg-gradient-to-b from-[#8BA6FF] via-[#002FCA] to-[#002394]"
      : "bg-white"
  }
  onClick={() => setActiveCard("report-time")}
  icon={
    <img
      src="/report-time.png"
      alt="Report Time"
      className="h-65 object-contain mx-auto"
    />
  }
/>

           <MenuCard
  title="Apply Leave"
  bgColor={activeCard === "apply-leave" ? "bg-gradient-to-b from-[#8BA6FF] via-[#002FCA] to-[#002394]"
    : "bg-white"
  }
  onClick={() => setActiveCard("apply-leave")}
  icon={
    <img
      src="/leave.png"
      alt="Apply Leave"
      className="h-65 object-contain mx-auto"
    />
  }
/>
          </div>

          {/* SECOND ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-100 justify-items-center mt-15">
            <MenuCard
              title="Point Of Sales"
              onClick={() => {
                setActiveCard("pos");
                navigate("/pos");
              }}
              bgColor="bg-white"
              icon={
                <img
                  src="/cashier.png"
                  alt="Point Of Sales"
                  className="h-65 object-contain mx-auto"
                />
              }
            />

            <MenuCard
              title="View Stock"
              onClick={() => {
                setActiveCard("stock");
                setShowViewStock(true);
              }}
              bgColor="bg-white"
              icon={
                <img
                  src="/inventory.png"
                  alt="View Stock"
                  className="h-65 object-contain mx-auto"
                />
              }
            />
          </div>

          <button
            onClick={handleLogout}
            className="w-80 bg-red-700 text-white px-4 py-8 rounded-[40px] text-[25px] items-center mt-8 hover:bg-red-800 transition-colors justify-center flex mx-auto font-bold"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}

export default MainMenu;
