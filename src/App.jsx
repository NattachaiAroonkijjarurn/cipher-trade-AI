import { Route, Routes } from "react-router-dom";
import RootLayout from "./client/layouts/RootLayout";


// Pages
import Home from "./client/pages/Home"
import AITradingBot from "./client/pages/AITradingBot";
import Wallets from "./client/pages/Wallets";
import Statements from "./client/pages/Statements";
import Overall from "./client/pages/Overall";
import Support from "./client/pages/Support";
import Profile from "./client/pages/Profile";

const App = () => {
  return (
    <RootLayout>
      <Routes>
        <Route path="/home" element={<Home />} /> 
        <Route path="/aiTradingBot" element={<AITradingBot />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/statements" element={<Statements />} />
        <Route path="/overall" element={<Overall />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </RootLayout>
  );
};

export default App;
