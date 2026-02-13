import React, { useState } from 'react';
import { CLASSES, SECTIONS, GENDERS, BLOOD_GROUPS } from '../../utils/constants';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

const AddStudentModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', class: '', section: '', rollNo: '', contactNumber: '', parentName: '', parentContact: '', dateOfBirth: '', gender: '', bloodGroup: '', address: '' });
  const [error, setError] = useState('');

  const update = (field: string, value: string) => { setForm((p) => ({ ...p, [field]: value })); setError(''); };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.class || !form.rollNo || !form.contactNumber) {
      setError('Please fill all required fields');
      return;
    }
    if (!/^[0-9]{10}$/.test(form.contactNumber)) {
      setError('Contact Number must be exactly 10 digits');
      return;
    }
    if (form.parentContact && !/^[0-9]{10}$/.test(form.parentContact)) {
      setError('Parent Contact must be exactly 10 digits');
      return;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }
    // Build clean data object with only filled fields
    const cleanData: any = {
      name: form.name,
      email: form.email,
      class: form.class,
      rollNo: form.rollNo,
      contactNumber: form.contactNumber,
      password: form.password || 'spc123456'
    };
    if (form.section) cleanData.section = form.section;
    if (form.gender) cleanData.gender = form.gender;
    if (form.bloodGroup) cleanData.bloodGroup = form.bloodGroup;
    if (form.dateOfBirth) cleanData.dateOfBirth = form.dateOfBirth;
    if (form.parentName) cleanData.parentName = form.parentName;
    if (form.parentContact) cleanData.parentContact = form.parentContact;
    if (form.address) cleanData.address = form.address;
    onSubmit(cleanData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Student" subtitle="Fill in the student information" maxWidth="max-w-3xl">
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name *" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Student name" />
        <Input label="Email *" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="email@example.com" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={form.class} onChange={(e) => update('class', e.target.value)}>
            <option value="">Select Class</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={form.section} onChange={(e) => update('section', e.target.value)}>
            <option value="">Select</option>
            {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Input label="Roll Number *" value={form.rollNo} onChange={(e) => update('rollNo', e.target.value)} placeholder="Roll number" />
        <Input label="Contact Number *" value={form.contactNumber} onChange={(e) => update('contactNumber', e.target.value)} placeholder="10-digit number" />
        <Input label="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Default: spc123456" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input type="date" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
            <option value="">Select</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={form.bloodGroup} onChange={(e) => update('bloodGroup', e.target.value)}>
            <option value="">Select</option>
            {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>
        <Input label="Parent Name" value={form.parentName} onChange={(e) => update('parentName', e.target.value)} placeholder="Parent/Guardian name" />
        <Input label="Parent Contact" value={form.parentContact} onChange={(e) => update('parentContact', e.target.value)} placeholder="10-digit number" />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" rows={2} value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Full address" />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} loading={loading}>Save Student</Button>
      </div>
    </Modal>
  );
};

export default AddStudentModal;
