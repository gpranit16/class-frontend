import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Home, ClipboardList, Megaphone, LogOut, Plus, Search, ChevronLeft, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/adminService';
import { MarksEntry } from '../types';
import { CLASSES, EXAM_TYPES, SUBJECTS } from '../utils/constants';
import MarksEntryForm from '../components/admin/MarksEntryForm';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import { formatDate } from '../utils/helpers';

const MarksManagement: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [marks, setMarks] = useState<MarksEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [searchId, setSearchId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editItem, setEditItem] = useState<MarksEntry | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [sidebarOpen] = useState(true);

  const fetchMarks = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 15 };
      if (classFilter) params.class = classFilter;
      if (examTypeFilter) params.examType = examTypeFilter;
      if (subjectFilter) params.subject = subjectFilter;
      if (searchId) params.studentId = searchId;
      const res = await adminService.getMarks(params);
      setMarks(res.marks || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [page, classFilter, examTypeFilter, subjectFilter, searchId]);

  useEffect(() => { fetchMarks(); }, [fetchMarks]);

  const handleAdd = async (data: any) => {
    try {
      setActionLoading(true);
      await adminService.addMarks(data);
      alert('✅ Marks added successfully!');
      setShowAddForm(false);
      fetchMarks();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add marks';
      alert('❌ Error: ' + errorMsg);
    } finally { setActionLoading(false); }
  };

  const handleUpdate = async (data: any) => {
    if (!editItem) return;
    try {
      setActionLoading(true);
      await adminService.updateMarks(editItem._id, data);
      alert('✅ Marks updated successfully!');
      setEditItem(null);
      fetchMarks();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update marks';
      alert('❌ Error: ' + errorMsg);
    } finally { setActionLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this marks entry?')) return;
    try {
      await adminService.deleteMarks(id);
      alert('✅ Marks deleted successfully!');
      fetchMarks();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete marks';
      alert('❌ Error: ' + errorMsg);
    }
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = { 'A+': 'bg-green-100 text-green-700', A: 'bg-green-50 text-green-600', 'B+': 'bg-blue-100 text-blue-700', B: 'bg-blue-50 text-blue-600', 'C+': 'bg-yellow-100 text-yellow-700', C: 'bg-yellow-50 text-yellow-600', D: 'bg-orange-100 text-orange-700', F: 'bg-red-100 text-red-700' };
    return colors[grade] || 'bg-gray-100 text-gray-600';
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: ClipboardList, label: 'Marks', path: '/admin/marks', active: true },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-100 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-white" /></div>
            {sidebarOpen && <div><h1 className="text-sm font-bold text-gray-900">SuccessPath</h1><p className="text-xs text-gray-500">Admin Panel</p></div>}
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button key={item.label} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${item.active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <item.icon className="w-5 h-5 flex-shrink-0" />{sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" />{sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Marks Management</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage student examination marks</p>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Marks</Button>
          </div>
        </header>

        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[180px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search by Student ID..." value={searchId} onChange={(e) => { setSearchId(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" />
                </div>
              </div>
              <select value={classFilter} onChange={(e) => { setClassFilter(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none">
                <option value="">All Classes</option>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={examTypeFilter} onChange={(e) => { setExamTypeFilter(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none">
                <option value="">All Exam Types</option>
                {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={subjectFilter} onChange={(e) => { setSubjectFilter(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none">
                <option value="">All Subjects</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Table - Desktop / Cards - Mobile */}
          {loading ? <Loader /> : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {['Student', 'Class', 'Exam', 'Subject', 'Marks', 'Grade', 'Date', 'Actions'].map((h) => (
                          <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {marks.length === 0 ? (
                        <tr><td colSpan={8} className="text-center py-12 text-gray-500">No marks records found</td></tr>
                      ) : marks.map((m) => (
                        <tr key={m._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="text-sm font-medium text-gray-900">{m.studentName || '-'}</div>
                            <div className="text-xs text-gray-500 font-mono">{typeof m.studentId === 'string' ? m.studentId : m.studentId?.studentId || ''}</div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{m.class}</td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-900">{m.examName}</div>
                            <div className="text-xs text-gray-500">{m.examType}</div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">{m.subject}</td>
                          <td className="py-3 px-4">
                            <span className="text-sm font-semibold text-gray-900">{m.marksObtained}/{m.totalMarks}</span>
                            <span className="text-xs text-gray-500 ml-1">({m.percentage?.toFixed(1)}%)</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getGradeColor(m.grade || '')}`}>{m.grade}</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">{formatDate(m.examDate)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setEditItem(m)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(m._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {marks.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">No marks records found</div>
                ) : marks.map((m) => (
                  <div key={m._id} className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{m.studentName || '-'}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{typeof m.studentId === 'string' ? m.studentId : m.studentId?.studentId || ''}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getGradeColor(m.grade || '')}`}>{m.grade}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-gray-500">Class:</span> <span className="text-gray-900 font-medium">{m.class}</span></div>
                      <div><span className="text-gray-500">Subject:</span> <span className="text-gray-900 font-medium">{m.subject}</span></div>
                      <div><span className="text-gray-500">Exam:</span> <span className="text-gray-900 font-medium">{m.examType}</span></div>
                      <div><span className="text-gray-500">Date:</span> <span className="text-gray-900 font-medium">{formatDate(m.examDate)}</span></div>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-semibold text-gray-900">{m.marksObtained}/{m.totalMarks}</span>
                        <span className="text-gray-500 ml-1">({m.percentage?.toFixed(1)}%)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditItem(m)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(m._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add Marks Entry" maxWidth="max-w-2xl">
        <MarksEntryForm onSubmit={handleAdd} loading={actionLoading} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Marks Entry" maxWidth="max-w-2xl">
        <MarksEntryForm onSubmit={handleUpdate} loading={actionLoading} initialData={editItem} />
      </Modal>
    </div>
  );
};

export default MarksManagement;
