import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PaymentPage from "./pages/PaymentPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import UsersPage from "./pages/UsersPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import UserRegistrationPage from "./pages/UserRegistrationPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<PaymentPage />} />
            <Route path="/payments" element={<PaymentHistoryPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetailsPage />} />
            <Route path="/register" element={<UserRegistrationPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
