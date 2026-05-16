import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Clock, CheckCircle2, AlertCircle, ChevronRight, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import client from '../../api/client';
import IssueCard from '../../components/IssueCard';
import StatusBadge from '../../components/StatusBadge';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, done: 0 });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const reportsRes = await client.get('/reports');
      const myReports = reportsRes.data.filter((r: any) => r.citizen_id === user?.id);
      
      setStats({
        total: myReports.length,
        pending: myReports.filter((r: any) => r.status === 'pending' || r.status === 'bidding').length,
        in_progress: myReports.filter((r: any) => r.status === 'assigned' || r.status === 'in_progress').length,
        done: myReports.filter((r: any) => r.status === 'done').length
      });
      setRecentReports(myReports.slice(0, 3));

      const notifRes = await client.get('/notifications');
      setNotifications(notifRes.data.slice(0, 5));
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black">Namaskara, {user?.full_name || 'Citizen'}!</h1>
          <p className="text-gray-500">Track and report civic issues in your neighborhood.</p>
        </div>
        <Link 
          to="/citizen/report" 
          className="bg-primary text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} className="mr-2" /> Report New Issue
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Reports", value: stats.total, icon: AlertCircle, color: "bg-blue-50 text-blue-600" },
          { label: "Bidding / Pending", value: stats.pending, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
          { label: "In Progress", value: stats.in_progress, icon: CheckCircle2, color: "bg-orange-50 text-orange-600" },
          { label: "Resolved", value: stats.done, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-3xl font-black">{stat.value}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Recent Reports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Recent Reports</h2>
            <Link to="/citizen/my-reports" className="text-primary text-sm font-bold flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {recentReports.map((report: any) => (
              <IssueCard key={report.id} issue={report} />
            ))}
            {recentReports.length === 0 && (
              <div className="col-span-2 py-10 text-center bg-gray-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                <p className="text-gray-500 font-medium">No reports yet. Help improve your city by reporting issues.</p>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Updates</h2>
            <Bell size={20} className="text-gray-400" />
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
            {notifications.length > 0 ? (
              notifications.map((notif: any) => (
                <div key={notif.id} className="p-4 border-b border-gray-50 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <p className="text-sm font-bold truncate">{notif.title}</p>
                  <p className="text-xs text-gray-500 mb-1 line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-gray-400">{new Date(notif.created_at).toLocaleTimeString()}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">No new notifications</div>
            )}
            <button className="w-full p-4 text-xs font-bold text-primary border-t border-gray-50 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
