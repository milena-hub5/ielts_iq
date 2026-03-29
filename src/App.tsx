import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import Topics from "./pages/Topics";
import Practice from "./pages/Practice";
import Profile from "./pages/Profile";
import SavedWords from "./pages/SavedWords";
import StudyPlan from "./pages/StudyPlan";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/vocabulary" element={<Navigate to="/topics" replace />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/library" element={<Navigate to="/" replace />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/study-plan" element={<StudyPlan />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved" element={<SavedWords />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}
