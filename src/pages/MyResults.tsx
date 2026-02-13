import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Home, Award, User, LogOut, Search, Filter, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { studentService } from '../services/studentService';
import { MarksEntry, ResultsSummary } from '../types';
import { EXAM_TYPES, SUBJECTS } from '../utils/constants';
import Loader from '../components/common/Loader';
import { formatDate } from '../utils/helpers';

const MyResults: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [marks, setMarks] = useState<MarksEntry[]>([]);
  const [summary, setSummary] = useState<ResultsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [examTypeFilter, setExamTypeFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [examTypeFilter, subjectFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (examTypeFilter) params.examType = examTypeFilter;
      if (subjectFilter) params.subject = subjectFilter;
      const [marksRes, summaryRes] = await Promise.all([
        studentService.getMarks(params),
        studentService.getResultsSummary(),
      ]);
      setMarks(marksRes.marks || []);
      setSummary(summaryRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = { 'A+': 'bg-green-100 text-green-700', A: 'bg-green-50 text-green-600', 'B+': 'bg-blue-100 text-blue-700', B: 'bg-blue-50 text-blue-600', 'C+': 'bg-yellow-100 text-yellow-700', C: 'bg-yellow-50 text-yellow-600', D: 'bg-orange-100 text-orange-700', F: 'bg-red-100 text-red-700' };
    return colors[grade] || 'bg-gray-100 text-gray-600';
  };

  const getPercentageColor = (pct: number) => {
    if (pct >= 90) return 'text-green-600';
    if (pct >= 75) return 'text-blue-600';
    if (pct >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Award, label: 'My Results', path: '/student/results', active: true },
    { icon: User, label: 'My Profile', path: '/student/profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
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
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"><LogOut className="w-5 h-5" /><span>Logout</span></button>
        </div>
        <div className="p-3 border-t border-gray-100">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"><LogOut className="w-5 h-5" />{sidebarOpen && <span>Logout</span>}</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"><Menu className="w-5 h-5 text-gray-600" /></button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Results</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">View your examination results and performance</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Subject Summary Cards */}
          {summary?.subjectWiseAverage && summary.subjectWiseAverage.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {summary.subjectWiseAverage.map((s: any, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1 truncate">{s._id}</p>
                  <p className={`text-lg sm:text-xl font-bold ${getPercentageColor(s.avgPercentage || 0)}`}>{(s.avgPercentage || 0).toFixed(1)}%</p>
                  <p className="text-xs text-gray-400 mt-1">{s.totalExams} exams</p>
                </div>
              ))}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <select value={examTypeFilter} onChange={(e) => setExamTypeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none w-full sm:w-auto">
                <option value="">All Exam Types</option>
                {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none w-full sm:w-auto">
                <option value="">All Subjects</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {(examTypeFilter || subjectFilter) && (
                <button onClick={() => { setExamTypeFilter(''); setSubjectFilter(''); }} className="text-sm text-primary-600 hover:text-primary-700 font-medium text-center sm:text-left">Clear Filters</button>
              )}
            </div>
          </div>

          {/* Table */}
          {loading ? <Loader /> : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Exam', 'Subject', 'Marks', '%', 'Grade', 'Date'].map((h) => (
                        <th key={h} className="text-left py-3 px-3 sm:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {marks.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-gray-500">No results found</td></tr>
                    ) : marks.map((m) => (
                      <tr key={m._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-3 sm:px-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{m.examName}</div>
                          <div className="text-xs text-gray-500">{m.examType}</div>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-sm text-gray-700">{m.subject}</td>
                        <td className="py-3 px-3 sm:px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{m.marksObtained}/{m.totalMarks}</td>
                        <td className="py-3 px-3 sm:px-4">
                          <span className={`text-sm font-semibold ${getPercentageColor(m.percentage || 0)}`}>{(m.percentage || 0).toFixed(1)}%</span>
                        </td>
                        <td className="py-3 px-3 sm:px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getGradeColor(m.grade || '')}`}>{m.grade}</span>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(m.examDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyResults;
