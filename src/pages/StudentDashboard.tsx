import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Home, Award, User, LogOut, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { studentService } from '../services/studentService';
import { Student, MarksEntry, Announcement, ResultsSummary } from '../types';
import PerformanceChart from '../components/student/PerformanceChart';
import ResultsCard from '../components/student/ResultsCard';
import AnnouncementList from '../components/student/AnnouncementList';
import Loader from '../components/common/Loader';

const StudentDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Student | null>(null);
  const [recentMarks, setRecentMarks] = useState<MarksEntry[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [summary, setSummary] = useState<ResultsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, marksRes, annRes, summaryRes] = await Promise.all([
        studentService.getProfile(),
        studentService.getMarks({}),
        studentService.getAnnouncements(),
        studentService.getResultsSummary(),
      ]);
      setProfile(profileRes.student);
      setRecentMarks(marksRes.marks?.slice(0, 5) || []);
      setAnnouncements(annRes.announcements?.slice(0, 5) || []);
      setSummary(summaryRes); // Backend returns all fields at top level
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/student/dashboard', active: true },
    { icon: Award, label: 'My Results', path: '/student/results' },
    { icon: User, label: 'My Profile', path: '/student/profile' },
  ];

  if (loading) return <Loader fullScreen />;

  const overallAvg = summary?.overallPercentage?.toFixed(1) || '0';

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
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-sm font-bold text-gray-900">SuccessPath</h1><p className="text-xs text-gray-500">Student Portal</p></div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button key={item.label} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${item.active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <item.icon className="w-5 h-5 flex-shrink-0" /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto w-full">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg mr-2"
            >
              <BookOpen className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Welcome, {profile?.name || 'Student'} 👋</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">Class {profile?.class}{profile?.section ? ` - Section ${profile.section}` : ''} | ID: {profile?.studentId}</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: BarChart3, label: 'Average Score', value: `${overallAvg}%`, color: 'bg-primary-50 text-primary-600' },
              { icon: Award, label: 'Total Exams', value: summary?.examWisePerformance?.length || 0, color: 'bg-accent-50 text-accent-600' },
              { icon: TrendingUp, label: 'Subjects', value: summary?.subjectWiseAverage?.length || 0, color: 'bg-green-50 text-green-600' },
              { icon: Calendar, label: 'Rank', value: summary?.rank || 'N/A', color: 'bg-purple-50 text-purple-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-center sm:gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2 sm:mb-0`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Performance Trend</h3>
              <PerformanceChart data={(summary?.examWisePerformance || []).map((e: any) => ({ name: e._id || e.examType, percentage: e.avgPercentage || 0 }))} />
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Recent Results</h3>
                <button onClick={() => navigate('/student/results')} className="text-xs text-primary-600 hover:text-primary-700 font-medium">View All</button>
              </div>
              <ResultsCard results={recentMarks} />
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">📢 Announcements</h3>
            <AnnouncementList announcements={announcements} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
