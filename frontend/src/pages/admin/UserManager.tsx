import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tab, setTab] = useState('citizen');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await client.get('/users');
    setUsers(res.data);
  };

  const filteredUsers = users.filter((u: any) => u.role === tab);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <h1 className="text-4xl font-black">User Management</h1>
         <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-blue-500/20">
            <UserPlus size={18} className="mr-2" /> Add System User
         </button>
      </div>

      <div className="flex space-x-2 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
        {['citizen', 'municipal', 'contractor', 'admin'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${tab === t ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t}s
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
              <th className="px-8 py-5 text-xs font-black uppercase text-gray-400">Identity</th>
              <th className="px-8 py-5 text-xs font-black uppercase text-gray-400">Contact</th>
              <th className="px-8 py-5 text-xs font-black uppercase text-gray-400">Status</th>
              {tab === 'contractor' && <th className="px-8 py-5 text-xs font-black uppercase text-gray-400">Specializations</th>}
              <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
            {filteredUsers.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-8 py-6">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-slate-700 rounded-xl flex items-center justify-center font-bold text-primary">
                        {user?.full_name ? user.full_name[0] : 'U'}
                      </div>
                      <div>
                        <p className="font-bold">{user.full_name}</p>
                        <p className="text-[10px] bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded uppercase font-black tracking-widest text-gray-400">ID: {user.id}</p>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <p className="text-sm font-medium flex items-center text-gray-600 dark:text-gray-400 mb-1"><Mail size={12} className="mr-2" /> {user.email}</p>
                   <p className="text-xs text-gray-400">{user.phone}</p>
                </td>
                <td className="px-8 py-6">
                   <span className="flex items-center text-green-500 font-bold text-xs uppercase tracking-widest">
                     <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                     Active
                   </span>
                </td>
                {tab === 'contractor' && (
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {user.specializations?.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 bg-blue-50 dark:bg-slate-700 text-primary rounded-md text-[10px] font-bold uppercase">{s}</span>
                      ))}
                    </div>
                  </td>
                )}
                <td className="px-8 py-6 text-right">
                  <button className="text-sm font-bold text-primary hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center text-gray-400 font-bold">No {tab}s found.</div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
