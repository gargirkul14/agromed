import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import KnowledgeCenterPage from './pages/KnowledgeCenterPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import PPEGuidePage from './pages/PPEGuidePage';

// Farmer Pages
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerProfilePage from './pages/FarmerProfilePage';
import WorkProfilePage from './pages/WorkProfilePage';
import HealthAssessmentPage from './pages/HealthAssessmentPage';
import AssessmentResultPage from './pages/AssessmentResultPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ChatbotPage from './pages/ChatbotPage';
import HealthHistoryPage from './pages/HealthHistoryPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import FarmerManagement from './pages/admin/FarmerManagement';
import AssessmentMonitoring from './pages/admin/AssessmentMonitoring';
import ArticleManagement from './pages/admin/ArticleManagement';
import ChemicalSafetyManagement from './pages/admin/ChemicalSafetyManagement';

export default function App() {
  return (
    <Routes>
      {/* 1. Public Routes (MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/knowledge" element={<KnowledgeCenterPage />} />
        <Route path="/knowledge/:id" element={<ArticleDetailPage />} />
        <Route path="/ppe-guide" element={<PPEGuidePage />} />
      </Route>

      {/* 2. Farmer Protected Routes (DashboardLayout) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['FARMER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/profile" element={<FarmerProfilePage />} />
        <Route path="/work-profile" element={<WorkProfilePage />} />
        <Route path="/assessment" element={<HealthAssessmentPage />} />
        <Route path="/assessment/result/:id" element={<AssessmentResultPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/history" element={<HealthHistoryPage />} />
      </Route>

      {/* 3. Admin Protected Routes (AdminLayout) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="farmers" element={<FarmerManagement />} />
        <Route path="assessments" element={<AssessmentMonitoring />} />
        <Route path="articles" element={<ArticleManagement />} />
        <Route path="chemicals" element={<ChemicalSafetyManagement />} />
      </Route>

      {/* 4. Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
