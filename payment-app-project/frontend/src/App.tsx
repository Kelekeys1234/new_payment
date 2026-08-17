import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import PaymentPage from "./pages/PaymentPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import MyPaymentsPage from "./pages/MyPaymentsPage";
import UsersPage from "./pages/UsersPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import UserRegistrationPage from "./pages/UserRegistrationPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminGrantPage from "./pages/AdminGrantPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/give" element={<PaymentPage />} />
            <Route path="/register" element={<UserRegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/my-payments"
              element={
                <RequireAuth require="auth">
                  <MyPaymentsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/payments"
              element={
                <RequireAuth require="admin">
                  <PaymentHistoryPage />
                </RequireAuth>
              }
            />
            <Route
              path="/users"
              element={
                <RequireAuth require="admin">
                  <UsersPage />
                </RequireAuth>
              }
            />
            <Route
              path="/users/:id"
              element={
                <RequireAuth require="admin">
                  <UserDetailsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/grant-admin"
              element={
                <RequireAuth require="superAdmin">
                  <AdminGrantPage />
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
