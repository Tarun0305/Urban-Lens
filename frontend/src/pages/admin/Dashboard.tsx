import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, AlertTriangle, UserCheck, Shield, ChevronRight, Activity } from 'lucide-react';
import client from '../../api/client';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
        const usersRes = await client.get('/users');
        const reportsRes = await client.get('/reports');
        setStats({
            users: usersRes.data.length,
            reports: reportsRes.data.length,
            pending: reportsRes.data.filter((r: any) => r.status === 'pending').length,
            contractors: usersRes.data.filter((u: any) => u.role === 'contractor').length
        });
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black flex items-center text-red-600 dark:text-red-500"><Shield className="mr-3" /> System Admin</h1>
        <p className="text-gray-500">Global system health, user management and security oversight.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active Reports", value: stats.reports, icon: FileText, color: "text-primary", bg: "bg-blue-50" },
          { label: "AI Flagged", value: stats.pending, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
          { label: "Contractors", value: stats.contractors, icon: UserCheck, color: "text-green-500", bg: "bg-green-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-slate-700 flex items-center justify-center ${stat.color} mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black">{stat.value}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold flex items-center"><Activity className="mr-2 text-red-500" size={24} /> System Health</h2>
            <div className="space-y-4">
               {[
                 { label: "Database Connection", status: "Healthy", color: "text-green-500" },
                 { label: "AI Pipeline (OpenAI)", status: "Active", color: "text-green-500" },
                 { label: "Media Storage", status: "92% Full", color: "text-orange-500" },
                 { label: "API Latency", status: "42ms", color: "text-green-500" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-50 dark:border-slate-700">
                    <span className="font-bold text-sm">{item.label}</span>
                    <span className={`text-sm font-black ${item.color}`}>{item.status}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm space-y-8 flex flex-col justify-center text-center">
            <div className="space-y-2">
               <h3 className="text-2xl font-black">User Access Control</h3>
               <p className="text-gray-500 text-sm">Manage roles and permissions for municipal staff.</p>
            </div>
            <Link to="/admin/users" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center">
               Open User Manager <ChevronRight className="ml-2" />
            </Link>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
