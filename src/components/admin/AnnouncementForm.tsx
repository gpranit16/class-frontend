import React, { useState, useEffect } from 'react';
import { Announcement } from '../../types';
import { CLASSES, SECTIONS } from '../../utils/constants';
import Button from '../common/Button';
import Input from '../common/Input';

interface Props {
  onSubmit: (data: any) => void;
  loading?: boolean;
  initialData?: Announcement | null;
  onCancel: () => void;
}

const AnnouncementForm: React.FC<Props> = ({ onSubmit, loading, initialData, onCancel }) => {
  const [form, setForm] = useState({
    title: '', content: '', priority: 'Medium' as string, targetClass: '' as string,
    targetSection: '' as string, expiryDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '', content: initialData.content || '',
        priority: initialData.priority || 'Medium',
        targetClass: initialData.targetClass || '', targetSection: initialData.targetSection || '',
        expiryDate: initialData.expiryDate ? initialData.expiryDate.slice(0, 10) : '',
      });
    }
  }, [initialData]);

  const update = (field: string, value: string) => { setForm((p) => ({ ...p, [field]: value })); setError(''); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) { setError('Title and content are required'); return; }
    onSubmit(form);
  };

  const priorityColors: Record<string, string> = { High: 'bg-red-100 text-red-700 border-red-300', Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300', Low: 'bg-green-100 text-green-700 border-green-300' };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <Input label="Title *" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Announcement title" />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
        <textarea className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none min-h-[120px] resize-y" value={form.content} onChange={(e) => update('content', e.target.value)} placeholder="Write announcement content..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <div className="flex gap-2">
            {['High', 'Medium', 'Low'].map((p) => (
              <button key={p} type="button" onClick={() => update('priority', p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.priority === p ? priorityColors[p] : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}>{p}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Class</label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={form.targetClass} onChange={(e) => update('targetClass', e.target.value)}>
            <option value="">All Classes</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Input label="Expiry Date" type="date" value={form.expiryDate} onChange={(e) => update('expiryDate', e.target.value)} />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit" loading={loading}>{initialData ? 'Update' : 'Create'} Announcement</Button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
