// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import MainMenu from "./pages/MainMenu";
// import PosMainMenu from "./pages/PosMainMenu";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/main-menu" element={<MainMenu />} />
//         <Route path="/pos" element={<PosMainMenu />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


//Use this code with a backend. To test without one, use the commented code above
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainMenu from "./pages/MainMenu";
import PosMainMenu from "./pages/PosMainMenu";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Protected Routes - require authentication */}
        <Route 
          path="/main-menu" 
          element={
            <ProtectedRoute>
              <MainMenu />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/pos" 
          element={
            <ProtectedRoute>
              <PosMainMenu />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



