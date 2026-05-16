import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import CitizenDashboard from './pages/citizen/Dashboard';
import ReportForm from './pages/citizen/ReportForm';
import MyReports from './pages/citizen/MyReports';
import MunicipalDashboard from './pages/municipal/Dashboard';
import IssueList from './pages/municipal/IssueList';
import BidManager from './pages/municipal/BidManager';
import ContractorBoard from './pages/municipal/ContractorBoard';
import ContractorDashboard from './pages/contractor/Dashboard';
import MyTasks from './pages/contractor/MyTasks';
import AdminDashboard from './pages/admin/Dashboard';
import UserManager from './pages/admin/UserManager';
import Leaderboard from './pages/Leaderboard';
import ReportDetail from './pages/ReportDetail';

const App: React.FC = () => {
  const { theme } = useUIStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/report/:id" element={<ReportDetail />} />
            
            {/* Role-based Routes */}
            {user?.role === 'citizen' && (
              <>
                <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
                <Route path="/citizen/report" element={<ReportForm />} />
                <Route path="/citizen/my-reports" element={<MyReports />} />
                <Route path="*" element={<Navigate to="/citizen/dashboard" />} />
              </>
            )}
            
            {user?.role === 'municipal' && (
              <>
                <Route path="/municipal/dashboard" element={<MunicipalDashboard />} />
                <Route path="/municipal/issues" element={<IssueList />} />
                <Route path="/municipal/bids" element={<BidManager />} />
                <Route path="/municipal/contractors" element={<ContractorBoard />} />
                <Route path="*" element={<Navigate to="/municipal/dashboard" />} />
              </>
            )}
            
            {user?.role === 'contractor' && (
              <>
                <Route path="/contractor/dashboard" element={<ContractorDashboard />} />
                <Route path="/contractor/tasks" element={<MyTasks />} />
                <Route path="*" element={<Navigate to="/contractor/dashboard" />} />
              </>
            )}
            
            {user?.role === 'admin' && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManager />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" />} />
              </>
            )}

            {!user && <Route path="*" element={<Navigate to="/login" />} />}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
