import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import Home from "./pages/Home";
import UploadNotes from "./pages/UploadNotes";
import MyNotes from "./pages/MyNotes";
import SavedNotes from "./pages/SavedNotes";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* PROTECTED ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadNotes />} />
          <Route path="/my-notes" element={<MyNotes />} />
          <Route path="/saved-notes" element={<SavedNotes />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;