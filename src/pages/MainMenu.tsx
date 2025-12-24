import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuCard from "../components/MenuCard";
import ViewStock from "./ViewStock";



function MainMenu() {
  const [username, setUsername] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [showViewStock, setShowViewStock] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // If no username, redirect back to login
      navigate("/login");
    }


    const loginSuccess = localStorage.getItem("loginSuccess");
    if (loginSuccess === "true") {
      setShowSuccess(true);
      localStorage.removeItem("loginSuccess"); // clear the flag

      // hide after 3 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [navigate]);



  if (showViewStock) {
    return <ViewStock goBack={() => setShowViewStock(false)} />;
  }


  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="bg-black rounded-lg p-8 ">
          <div className="flex justify-center mb-6">
            {showSuccess && (
              <div className="w-80 bg-green-700 text-white px-4 py-2.5 rounded-full text-[18px] font-medium text-center mb-4 mx-auto">
                Login Successful!
              </div>
            )}
          </div>
          {username && (
            <h2 className="text-white text-2xl sm:text-3xl font-bold text-center mb-10">
              Hello {username}!
            </h2>
          )}




          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-50 justify-items-center">

            <MenuCard
              title="Report Time"
              bgColor="bg-gradient-to-b from-[#8BA6FF] via-[#002FCA] to-[#002394]"
              icon={
                <img
                  src="/report-time.png"
                  alt="Report Time"
                  className=" h-35 object-contain mx-auto"
                />
              }

            />



            <MenuCard
              title="Apply Leave"
              bgColor="bg-white"
              icon={
                <img
                  src="/leave.png"
                  alt="Apply Leave"
                  className=" h-35 object-contain mx-auto"
                />
              }

            />
          </div>



          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-50 justify-items-center mt-15">
            <MenuCard
              title="Point Of Sales"
              bgColor="bg-white"
              onClick={() => navigate("/pos")}
              icon={
                <img
                  src="/cashier.png"
                  alt="Point Of Sales"
                  className=" h-35 object-contain mx-auto"
                  onClick={() => navigate("/pos")}

                />
              }

            />

            <MenuCard
              onClick={() => setShowViewStock(true)}
              title="View Stock"
              bgColor="bg-white"
              icon={
                <img
                  src="/inventory.png"
                  alt="View Stock"
                  className=" h-35 object-contain mx-auto"
                />
              }

            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default MainMenu;