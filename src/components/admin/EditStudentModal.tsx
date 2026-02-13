import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { CLASSES, SECTIONS, GENDERS, BLOOD_GROUPS } from '../../utils/constants';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  student: Student | null;
  loading?: boolean;
}

const EditStudentModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, student, loading }) => {
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || '', email: student.email || '', class: student.class || '',
        section: student.section || '', rollNo: student.rollNo || '', contactNumber: student.contactNumber || '',
        parentName: student.parentName || '', parentContact: student.parentContact || '',
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : '',
        gender: student.gender || '', bloodGroup: student.bloodGroup || '',
        address: student.address || '', isActive: student.isActive,
      });
    }
  }, [student]);

  const update = (field: string, value: any) => { setForm((p: any) => ({ ...p, [field]: value })); setError(''); };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.class || !form.rollNo || !form.contactNumber) {
      setError('Please fill all required fields'); return;
    }
    onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Student Details" subtitle="Update student information" maxWidth="max-w-3xl">
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name *" value={form.name || ''} onChange={(e) => update('name', e.target.value)} />
        <Input label="Email *" type="email" value={form.email || ''} onChange={(e) => update('email', e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={form.class || ''} onChange={(e) => update('class', e.target.value)}>
            <option value="">Select Class</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={form.section || ''} onChange={(e) => update('section', e.target.value)}>
            <option value="">Select</option>
            {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Input label="Roll Number *" value={form.rollNo || ''} onChange={(e) => update('rollNo', e.target.value)} />
        <Input label="Contact Number *" value={form.contactNumber || ''} onChange={(e) => update('contactNumber', e.target.value)} />
        <Input label="Parent Name" value={form.parentName || ''} onChange={(e) => update('parentName', e.target.value)} />
        <Input label="Parent Contact" value={form.parentContact || ''} onChange={(e) => update('parentContact', e.target.value)} />
        <div className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" id="isActive" checked={form.isActive ?? true} onChange={(e) => update('isActive', e.target.checked)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          <label htmlFor="isActive" className="text-sm text-gray-700">Active Student</label>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} loading={loading}>Update Student</Button>
      </div>
    </Modal>
  );
};

export default EditStudentModal;
