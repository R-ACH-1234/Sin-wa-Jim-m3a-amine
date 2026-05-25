import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useQuizStore } from './store/useQuizStore';

// Layout shell
import MoroccanLayout from './components/MoroccanLayout';

// App Logo component
import AppLogo from './components/AppLogo';

// Modular pages
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const { user, initApp } = useQuizStore();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    initApp();
    // Simulate startup delay (exactly 2 seconds) for premium game feel and logo screen transition
    const t = setTimeout(() => {
      setHasLoaded(true);
    }, 2000);
    return () => clearTimeout(t);
  }, [initApp]);

  if (!hasLoaded) {
    // Show static loading screen with official AppLogo before database boots
    return (
      <div className="min-h-screen bg-[#030d1a] flex flex-col items-center justify-center text-center p-6 text-slate-100 select-none">
        <div className="space-y-6 flex flex-col items-center">
          <div className="animate-pulse duration-1000 transform scale-100 hover:scale-105 transition-transform">
            <AppLogo size="xl" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-amber-500 tracking-wide">سين وجيم مع أمين</h2>
            <p className="text-[10px] opacity-60 tracking-widest uppercase mt-1">تطبيق مسابقات مغربي تفاعلي ممتع...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not signed up yet (first run), force show Splash registration card
  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<SplashPage onComplete={() => window.location.reload()} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* HOMEPAGE ROUTE */}
        <Route 
          path="/" 
          element={
            <MoroccanLayout title="سين وجيم مع أمين">
              <HomePage />
            </MoroccanLayout>
          } 
        />

        {/* CATEGORIES ROUTE */}
        <Route 
          path="/categories" 
          element={
            <MoroccanLayout showBackButton backTo="/" title="أقسام المعرفة والمراحل">
              <CategoriesPage />
            </MoroccanLayout>
          } 
        />

        {/* QUIZ PORTAL ROUTE */}
        <Route 
          path="/quiz" 
          element={
            <MoroccanLayout showBackButton backTo="/categories" title="تحدي المسابقة">
              <QuizPage />
            </MoroccanLayout>
          } 
        />

        {/* RESULT SCORE SUMMARY ROUTE */}
        <Route 
          path="/result" 
          element={
            <MoroccanLayout title="نتيجة المسابقة">
              <ResultPage />
            </MoroccanLayout>
          } 
        />

        {/* LEADERBOARD HIGH SCORES ROUTE */}
        <Route 
          path="/leaderboard" 
          element={
            <MoroccanLayout showBackButton backTo="/" title="أذكياء الصدارة">
              <LeaderboardPage />
            </MoroccanLayout>
          } 
        />

        {/* PERSONAL PROFILE VIEW */}
        <Route 
          path="/profile" 
          element={
            <MoroccanLayout showBackButton backTo="/" title="الملف الشخصي الشخصي">
              <ProfilePage />
            </MoroccanLayout>
          } 
        />

        {/* SETTINGS CARD OPTIONS */}
        <Route 
          path="/settings" 
          element={
            <MoroccanLayout showBackButton backTo="/" title="إعدادات اللعبة العامة">
              <SettingsPage />
            </MoroccanLayout>
          } 
        />

        {/* ADMIN DASHBOARD CRUD CONTROL */}
        <Route 
          path="/admin" 
          element={
            <MoroccanLayout showBackButton backTo="/" title="لوحة التحكم الإدارية">
              <AdminPage />
            </MoroccanLayout>
          } 
        />

        {/* DEFAULT WILDCARD REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
