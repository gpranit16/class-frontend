import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Home, ClipboardList, Megaphone, LogOut, Plus, Trash2, Edit2, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/adminService';
import { Announcement } from '../types';
import AnnouncementForm from '../components/admin/AnnouncementForm';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import { formatDate } from '../utils/helpers';

const AnnouncementsManagement: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Announcement | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [sidebarOpen] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getAnnouncements();
      setAnnouncements(res.announcements || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const handleCreate = async (data: any) => {
    try {
      setActionLoading(true);
      await adminService.createAnnouncement(data);
      alert('✅ Announcement created successfully!');
      setShowForm(false);
      fetchAnnouncements();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create announcement';
      alert('❌ Error: ' + errorMsg);
    } finally { setActionLoading(false); }
  };

  const handleUpdate = async (data: any) => {
    if (!editItem) return;
    try {
      setActionLoading(true);
      await adminService.updateAnnouncement(editItem._id, data);
      alert('✅ Announcement updated successfully!');
      setEditItem(null);
      fetchAnnouncements();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update announcement';
      alert('❌ Error: ' + errorMsg);
    } finally { setActionLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await adminService.deleteAnnouncement(id);
      alert('✅ Announcement deleted successfully!');
      fetchAnnouncements();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete announcement';
      alert('❌ Error: ' + errorMsg);
    }
  };

  const priorityStyles: Record<string, string> = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: ClipboardList, label: 'Marks', path: '/admin/marks' },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements', active: true },
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
              <h1 className="text-xl font-bold text-gray-900">Announcements</h1>
              <p className="text-sm text-gray-500 mt-0.5">{announcements.length} announcements</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="w-4 h-4" /> New Announcement</Button>
          </div>
        </header>

        <div className="p-6">
          {loading ? <Loader /> : announcements.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements</h3>
              <p className="text-gray-500 mb-6">Create your first announcement</p>
              <Button onClick={() => setShowForm(true)}>Create Announcement</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {announcements.map((ann) => (
                <div key={ann._id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityStyles[ann.priority] || priorityStyles.Medium}`}>{ann.priority}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditItem(ann)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(ann._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">{ann.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{ann.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                    <span>{ann.targetClass ? `Class ${ann.targetClass}` : 'All Classes'}</span>
                    <span>{formatDate(ann.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create Announcement" maxWidth="max-w-2xl">
        <AnnouncementForm onSubmit={handleCreate} loading={actionLoading} onCancel={() => setShowForm(false)} />
      </Modal>

      {/* Edit */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Announcement" maxWidth="max-w-2xl">
        <AnnouncementForm onSubmit={handleUpdate} loading={actionLoading} initialData={editItem} onCancel={() => setEditItem(null)} />
      </Modal>
    </div>
  );
};

export default AnnouncementsManagement;
