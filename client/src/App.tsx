import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* // Layout
import { Navbar } from "./components/layout/Navbar.tsx"; */

// Pages
import HomePage from "./pages/HomePage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import { BookingPage } from "./pages/BookingPage.tsx";
import { RoomPage } from "./pages/RoomPage.tsx";
import { SettingsPage } from "./pages/SettingsPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import { UserPage } from "./pages/UserPage.tsx";

// Auth
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 🔥 GLOBAL NAVBAR (alltid synlig) */}
        {/*   <Navbar /> */}

        <div>
          <Routes>
            {/* 🏠 Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* 🔒 Protected */}
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rooms"
              element={
                <ProtectedRoute>
                  <RoomPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UserPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* 👑 Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* 🚫 fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
