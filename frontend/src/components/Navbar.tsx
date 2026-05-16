import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Bell, LogOut, Globe } from 'lucide-react';
import client from '../api/client';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme, language, setLanguage } = useUIStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      client.get('/notifications').then(res => {
        setUnreadCount(res.data.filter((n: any) => !n.is_read).length);
      });
    }
  }, [user]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">UL</div>
          <span className="text-xl font-bold text-primary dark:text-blue-400">UrbanLens</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {user?.role === 'citizen' && (
            <>
              <Link to="/citizen/dashboard" className="hover:text-primary">{t('home')}</Link>
              <Link to="/citizen/report" className="hover:text-primary">{t('report_issue')}</Link>
              <Link to="/citizen/my-reports" className="hover:text-primary">{t('my_reports')}</Link>
            </>
          )}
          {user?.role === 'municipal' && (
            <>
              <Link to="/municipal/dashboard" className="hover:text-primary">Dashboard</Link>
              <Link to="/municipal/issues" className="hover:text-primary">Issues</Link>
              <Link to="/municipal/bids" className="hover:text-primary">Bids</Link>
            </>
          )}
          {user?.role === 'contractor' && (
            <>
              <Link to="/contractor/dashboard" className="hover:text-primary">Dashboard</Link>
              <Link to="/contractor/tasks" className="hover:text-primary">My Tasks</Link>
            </>
          )}
          <Link to="/leaderboard" className="hover:text-primary">{t('leaderboard')}</Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full flex items-center">
              <Globe size={20} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg hidden group-hover:block">
              <button onClick={() => handleLanguageChange('en')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">English</button>
              <button onClick={() => handleLanguageChange('kn')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">ಕನ್ನಡ</button>
              <button onClick={() => handleLanguageChange('hi')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">हिन्दी</button>
            </div>
          </div>

          <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user && (
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {user ? (
            <div className="flex items-center space-x-3 ml-2 border-l pl-4 border-gray-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.full_name || 'Account'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700">{t('login')}</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
