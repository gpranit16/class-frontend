import React from 'react';
import { Student } from '../../types';
import { getInitials } from '../../utils/helpers';
import { Mail, Phone, Calendar, MapPin } from 'lucide-react';

interface Props { student: Student; }

const ProfileCard: React.FC<Props> = ({ student }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-800 text-2xl font-bold">
        {getInitials(student.name)}
      </div>
      <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
      <p className="text-sm text-gray-500">{student.studentId}</p>
      <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
        {student.class} {student.section && `- ${student.section}`}
      </span>
      <span className={`inline-block ml-2 mt-2 px-3 py-1 rounded-full text-sm font-medium ${student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {student.isActive ? 'Active' : 'Inactive'}
      </span>
      <div className="mt-6 space-y-3 text-left text-sm">
        <div className="flex items-center gap-3 text-gray-600"><Mail className="w-4 h-4" /><span>{student.email}</span></div>
        <div className="flex items-center gap-3 text-gray-600"><Phone className="w-4 h-4" /><span>{student.contactNumber}</span></div>
        {student.dateOfBirth && <div className="flex items-center gap-3 text-gray-600"><Calendar className="w-4 h-4" /><span>{new Date(student.dateOfBirth).toLocaleDateString('en-IN')}</span></div>}
        {student.address && <div className="flex items-center gap-3 text-gray-600"><MapPin className="w-4 h-4" /><span>{student.address}</span></div>}
      </div>
      {student.parentName && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-left text-sm">
          <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Parent/Guardian</p>
          <p className="text-gray-700 font-medium">{student.parentName}</p>
          {student.parentContact && <p className="text-gray-600">{student.parentContact}</p>}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
