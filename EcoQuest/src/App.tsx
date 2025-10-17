import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Navigation from "./components/Navigation";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Classes from "./pages/Classes";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import TaskSubmission from "./pages/TaskSubmission";
import ReportHazard from "./pages/ReportHazard";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";
import ChapterQuizPage from "./pages/ChapterQuizPage";
import ChapterGamePage from "./pages/ChapterGamePage";
import OutdoorTaskPage from "./pages/OutdoorTaskPage";
import Resources from "./pages/Resources";
import ProfileSettings from "./pages/ProfileSettings";
import useScrollToTop from "./hooks/useScrollToTop";

const queryClient = new QueryClient();

const ScrollHandler = () => {
  useScrollToTop();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ecoquest-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <ScrollHandler />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:resourceId" element={<Resources />} />
              <Route path="/submit-task" element={<TaskSubmission />} />
              <Route path="/report-hazard" element={<ReportHazard />} />
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/quiz/:classId/:chapterId" element={<ChapterQuizPage />} />
              <Route path="/game/:classId/:chapterId" element={<ChapterGamePage />} />
              <Route path="/outdoor-task/:classId/:chapterId" element={<OutdoorTaskPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
