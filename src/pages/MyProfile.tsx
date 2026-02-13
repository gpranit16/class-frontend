import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Home, Award, User, LogOut, Save, Eye, EyeOff, Lock, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { studentService } from '../services/studentService';
import { Student } from '../types';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import { getInitials, formatDate } from '../utils/helpers';

const MyProfile: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await studentService.getProfile();
      setProfile(res.student);
      setEditForm({ contactNumber: res.student?.contactNumber || '', address: res.student?.address || '' });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true);
      await studentService.updateProfile(editForm);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
      fetchProfile();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally { setSaveLoading(false); }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' }); return;
    }
    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' }); return;
    }
    try {
      setSaveLoading(true);
      await studentService.changePassword(passwords.currentPassword, passwords.newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally { setSaveLoading(false); }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Award, label: 'My Results', path: '/student/results' },
    { icon: User, label: 'My Profile', path: '/student/profile', active: true },
  ];

  if (loading) return <Loader fullScreen />;

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
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"><Menu className="w-5 h-5 text-gray-600" /></button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Profile</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">View and manage your profile information</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Message */}
          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {message.text}
              <button onClick={() => setMessage({ type: '', text: '' })} className="float-right font-bold">×</button>
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl sm:text-2xl font-bold shrink-0">
                {getInitials(profile?.name || '')}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{profile?.name}</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">ID: {profile?.studentId} | Class {profile?.class}{profile?.section ? ` - ${profile.section}` : ''}</p>
                <p className="text-xs text-gray-400 mt-1">Member since {formatDate(profile?.admissionDate || profile?.createdAt || '')}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1">
            <button onClick={() => { setTab('profile'); setMessage({ type: '', text: '' }); }} className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${tab === 'profile' ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>Profile Details</button>
            <button onClick={() => { setTab('password'); setMessage({ type: '', text: '' }); }} className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${tab === 'password' ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>Change Password</button>
          </div>

          {tab === 'profile' ? (
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { label: 'Full Name', value: profile?.name },
                  { label: 'Email', value: profile?.email },
                  { label: 'Student ID', value: profile?.studentId },
                  { label: 'Roll Number', value: profile?.rollNo },
                  { label: 'Class', value: profile?.class },
                  { label: 'Section', value: profile?.section || 'N/A' },
                  { label: 'Gender', value: profile?.gender || 'N/A' },
                  { label: 'Date of Birth', value: profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : 'N/A' },
                  { label: 'Parent Name', value: profile?.parentName || 'N/A' },
                  { label: 'Parent Contact', value: profile?.parentContact || 'N/A' },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                    <p className="text-sm font-medium text-gray-900">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Editable Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Contact Number" value={editForm.contactNumber || ''} onChange={(e) => { setEditForm((p: any) => ({ ...p, contactNumber: e.target.value })); setEditing(true); }} />
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea value={editForm.address || ''} onChange={(e) => { setEditForm((p: any) => ({ ...p, address: e.target.value })); setEditing(true); }} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none min-h-[80px]" />
                  </div>
                </div>
                {editing && (
                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    <Button variant="secondary" onClick={() => { setEditing(false); setEditForm({ contactNumber: profile?.contactNumber || '', address: profile?.address || '' }); }} className="w-full sm:w-auto">Cancel</Button>
                    <Button onClick={handleSaveProfile} loading={saveLoading} className="gap-2 w-full sm:w-auto"><Save className="w-4 h-4" /> Save Changes</Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 max-w-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center"><Lock className="w-5 h-5 text-primary-600" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
                  <p className="text-xs text-gray-500">Update your account password</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Input label="Current Password" type={showPwd.current ? 'text' : 'password'} value={passwords.currentPassword} onChange={(e) => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} />
                  <button type="button" onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))} className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                    {showPwd.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Input label="New Password" type={showPwd.new ? 'text' : 'password'} value={passwords.newPassword} onChange={(e) => setPasswords(p => ({ ...p, newPassword: e.target.value }))} />
                  <button type="button" onClick={() => setShowPwd(p => ({ ...p, new: !p.new }))} className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                    {showPwd.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Input label="Confirm Password" type={showPwd.confirm ? 'text' : 'password'} value={passwords.confirmPassword} onChange={(e) => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} />
                  <button type="button" onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                    {showPwd.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button onClick={handleChangePassword} loading={saveLoading} className="w-full mt-2">Update Password</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyProfile;
