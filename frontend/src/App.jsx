import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageProfile from "./pages/ManageProfile";
import ManageEducation from "./pages/ManageEducation";
import ManageSkills from "./pages/ManageSkills";
import ManageProjects from "./pages/ManageProjects";
import ManageAchievements from "./pages/ManageAchievements";
import ManageContactInfo from "./pages/ManageContactInfo";
import ContactMessages from "./pages/ContactMessages";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Portfolio Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Secure Admin Gate */}
        <Route path="/login" element={<Login />} />

        {/* Protected Control Dashboard Home */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Profile Editor Page */}
        <Route 
          path="/admin/profile" 
          element={
            <ProtectedRoute>
              <ManageProfile />
            </ProtectedRoute>
          } 
        />

        {/* Protected Education Editor Page */}
        <Route 
          path="/admin/education" 
          element={
            <ProtectedRoute>
              <ManageEducation />
            </ProtectedRoute>
          } 
        />

        {/* Protected Skills Editor Page */}
        <Route 
          path="/admin/skills" 
          element={
            <ProtectedRoute>
              <ManageSkills />
            </ProtectedRoute>
          } 
        />

        {/* Protected Projects Editor Page */}
        <Route 
          path="/admin/projects" 
          element={
            <ProtectedRoute>
              <ManageProjects />
            </ProtectedRoute>
          } 
        />

        {/* Protected Achievements Editor Page */}
        <Route 
          path="/admin/achievements" 
          element={
            <ProtectedRoute>
              <ManageAchievements />
            </ProtectedRoute>
          } 
        />

        {/* Protected Contact Information Editor Page */}
        <Route 
          path="/admin/contact-info" 
          element={
            <ProtectedRoute>
              <ManageContactInfo />
            </ProtectedRoute>
          } 
        />

        {/* Protected Messages Inbox Page */}
        <Route 
          path="/admin/messages" 
          element={
            <ProtectedRoute>
              <ContactMessages />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;