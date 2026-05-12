import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import MatrixPage from './pages/MatrixPage';
import FormulaireFilesPage from './pages/FormulaireFilesPage';
import ImagesPage from './pages/ImagesPage';
import QuizPage from './pages/QuizPage';
import StatsPage from './pages/StatsPage';
import GeolocPage from './pages/GeolocPage';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute><AuthPage /></PublicRoute>
      } />
      <Route path="/" element={
        <PrivateRoute><Layout /></PrivateRoute>
      }>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/matrix" element={<MatrixPage />} />
        <Route path="projects/formulaire" element={<FormulaireFilesPage />} />
        <Route path="projects/images" element={<ImagesPage />} />
        <Route path="projects/quiz" element={<QuizPage />} />
        <Route path="projects/stats" element={<StatsPage />} />
        <Route path="projects/geoloc" element={<GeolocPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}