import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Plus, LogOut, Home, ClipboardList, Megaphone, ChevronRight, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/adminService';
import { DashboardStats as DashboardStatsType, Announcement } from '../types';
import DashboardStats from '../components/admin/DashboardStats';
import Loader from '../components/common/Loader';
import { formatDate } from '../utils/helpers';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, annRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAnnouncements(),
      ]);
      setStats(statsRes);
      setAnnouncements(annRes.announcements?.slice(0, 5) || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard', active: true },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: ClipboardList, label: 'Marks', path: '/admin/marks' },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Add Student', color: 'bg-primary-500', path: '/admin/students' },
    { icon: ClipboardList, label: 'Enter Marks', color: 'bg-accent-500', path: '/admin/marks' },
    { icon: Megaphone, label: 'New Announcement', color: 'bg-green-500', path: '/admin/announcements' },
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 transition-transform duration-300 flex flex-col lg:flex`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div><h1 className="text-sm font-bold text-gray-900">SuccessPath</h1><p className="text-xs text-gray-500">Admin Panel</p></div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button key={item.label} onClick={() => { navigate(item.path); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${item.active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Welcome back, {user?.fullName || 'Admin'} 👋</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Stats */}
          <DashboardStats
            totalStudents={stats?.totalStudents || 0}
            activeStudents={stats?.activeStudents || 0}
            totalExams={stats?.totalExams || 0}
            averagePerformance={stats?.averagePerformance || 0}
          />

          {/* Quick Actions + Recent Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button key={action.label} onClick={() => { navigate(action.path); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-all group">
                    <div className={`w-9 h-9 ${action.color} rounded-lg flex items-center justify-center shrink-0`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 flex-1 text-left">{action.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Recent Announcements</h3>
                <button onClick={() => { navigate('/admin/announcements'); setSidebarOpen(false); }} className="text-xs text-primary-600 hover:text-primary-700 font-medium">View All</button>
              </div>
              {announcements.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No announcements yet</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${ann.priority === 'High' ? 'bg-red-500' : ann.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{ann.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ann.content}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(ann.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
