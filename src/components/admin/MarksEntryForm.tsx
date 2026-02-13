import React, { useState, useEffect } from 'react';
import { CLASSES, EXAM_TYPES, SUBJECTS } from '../../utils/constants';
import { adminService } from '../../services/adminService';
import Button from '../common/Button';
import Input from '../common/Input';

interface Props {
  onSubmit: (data: any) => void;
  loading?: boolean;
  initialData?: any;
}

const MarksEntryForm: React.FC<Props> = ({ onSubmit, loading, initialData }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [form, setForm] = useState({
    studentId: initialData?.studentId?._id || initialData?.studentId || '',
    studentName: initialData?.studentName || '',
    class: initialData?.class || '',
    examType: initialData?.examType || '',
    examName: initialData?.examName || '',
    examDate: initialData?.examDate ? initialData.examDate.slice(0, 10) : '',
    subject: initialData?.subject || '',
    marksObtained: initialData?.marksObtained ?? '',
    totalMarks: initialData?.totalMarks ?? 100,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await adminService.getStudents({ limit: 1000 });
        setStudents(res.students || []);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  const update = (field: string, value: any) => {
    setForm((p) => {
      const newForm = { ...p, [field]: value };
      // Auto-fill student details when student is selected
      if (field === 'studentId' && value) {
        const student = students.find(s => s._id === value);
        if (student) {
          newForm.studentName = student.name;
          newForm.class = student.class;
        }
      }
      return newForm;
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.class || !form.examType || !form.examName || !form.subject || form.marksObtained === '' || !form.totalMarks || !form.examDate) {
      setError('Please fill all required fields');
      return;
    }
    if (Number(form.marksObtained) > Number(form.totalMarks)) {
      setError('Marks obtained cannot exceed total marks');
      return;
    }
    onSubmit({
      ...form,
      marksObtained: Number(form.marksObtained),
      totalMarks: Number(form.totalMarks),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Student *</label>
          <select 
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" 
            value={form.studentId} 
            onChange={(e) => update('studentId', e.target.value)}
            disabled={loadingStudents || !!initialData}
          >
            <option value="">{loadingStudents ? 'Loading students...' : 'Select Student'}</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.studentId} - {s.name} ({s.class}-{s.section})
              </option>
            ))}
          </select>
        </div>
        <Input label="Student Name" value={form.studentName} onChange={(e) => update('studentName', e.target.value)} placeholder="Auto-filled" disabled />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={form.class} onChange={(e) => update('class', e.target.value)}>
            <option value="">Select Class</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={form.examType} onChange={(e) => update('examType', e.target.value)}>
            <option value="">Select Type</option>
            {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Input label="Exam Name *" value={form.examName} onChange={(e) => update('examName', e.target.value)} placeholder="e.g. Mid-Term 2024" />
        <Input label="Exam Date *" type="date" value={form.examDate} onChange={(e) => update('examDate', e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={form.subject} onChange={(e) => update('subject', e.target.value)}>
            <option value="">Select Subject</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Marks Obtained *" type="number" min="0" value={form.marksObtained} onChange={(e) => update('marksObtained', e.target.value)} />
          <Input label="Total Marks *" type="number" min="1" value={form.totalMarks} onChange={(e) => update('totalMarks', e.target.value)} />
        </div>
      </div>
      {form.marksObtained !== '' && form.totalMarks && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Percentage:</span>
          <span className="font-semibold text-primary-700">{((Number(form.marksObtained) / Number(form.totalMarks)) * 100).toFixed(1)}%</span>
        </div>
      )}
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>{initialData ? 'Update Marks' : 'Add Marks'}</Button>
      </div>
    </form>
  );
};

export default MarksEntryForm;
