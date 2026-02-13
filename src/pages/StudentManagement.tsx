import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, BookOpen, Home, ClipboardList, Megaphone, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/adminService';
import { Student } from '../types';
import { CLASSES, SECTIONS } from '../utils/constants';
import StudentTable from '../components/admin/StudentTable';
import AddStudentModal from '../components/admin/AddStudentModal';
import EditStudentModal from '../components/admin/EditStudentModal';
import Button from '../components/common/Button';

const StudentManagement: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [sidebarOpen] = useState(true);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 10 };
      if (search) params.search = search;
      if (classFilter) params.class = classFilter;
      if (sectionFilter) params.section = sectionFilter;
      const res = await adminService.getStudents(params);
      setStudents(res.students || []);
      setTotalPages(res.totalPages || 1);
      setTotalStudents(res.total || 0);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [page, search, classFilter, sectionFilter]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleAdd = async (data: any) => {
    try {
      setActionLoading(true);
      await adminService.addStudent(data);
      setShowAdd(false);
      fetchStudents();
      alert('✅ Student added successfully!');
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add student';
      alert('❌ Error: ' + errorMsg);
    } finally { setActionLoading(false); }
  };

  const handleEdit = async (data: any) => {
    if (!selectedStudent) return;
    try {
      setActionLoading(true);
      await adminService.updateStudent(selectedStudent._id, data);
      setShowEdit(false);
      setSelectedStudent(null);
      fetchStudents();
      alert('✅ Student updated successfully!');
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update student';
      alert('❌ Error: ' + errorMsg);
    } finally { setActionLoading(false); }
  };

  const handleDelete = async (student: Student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.name}?`)) return;
    try {
      await adminService.deleteStudent(student._id);
      alert('✅ Student deleted successfully!');
      fetchStudents();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete student';
      alert('❌ Error: ' + errorMsg);
    }
  };

  const openEdit = (student: Student) => { setSelectedStudent(student); setShowEdit(true); };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students', path: '/admin/students', active: true },
    { icon: ClipboardList, label: 'Marks', path: '/admin/marks' },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
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

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Student Management</h1>
              <p className="text-sm text-gray-500 mt-0.5">{totalStudents} total students</p>
            </div>
            <Button onClick={() => setShowAdd(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Student</Button>
          </div>
        </header>

        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search by name, email, or ID..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" />
                </div>
              </div>
              <select value={classFilter} onChange={(e) => { setClassFilter(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none">
                <option value="">All Classes</option>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={sectionFilter} onChange={(e) => { setSectionFilter(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none">
                <option value="">All Sections</option>
                {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <StudentTable students={students} onEdit={openEdit} onDelete={handleDelete} loading={loading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <AddStudentModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSubmit={handleAdd} loading={actionLoading} />
      <EditStudentModal isOpen={showEdit} onClose={() => { setShowEdit(false); setSelectedStudent(null); }} onSubmit={handleEdit} student={selectedStudent} loading={actionLoading} />
    </div>
  );
};

export default StudentManagement;
