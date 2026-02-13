import React from 'react';
import { Announcement } from '../../types';
import { formatDate } from '../../utils/helpers';
import { PRIORITY_COLORS } from '../../utils/constants';
import { Bell } from 'lucide-react';

interface Props { announcements: Announcement[]; }

const AnnouncementList: React.FC<Props> = ({ announcements }) => {
  if (!announcements || announcements.length === 0) {
    return <div className="text-center py-8 text-gray-400"><Bell className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No announcements</p></div>;
  }
  return (
    <div className="space-y-3">
      {announcements.map((a) => (
        <div key={a._id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500 hover:bg-gray-100 transition">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${PRIORITY_COLORS[a.priority]}`}>{a.priority}</span>
            <span className="text-xs text-gray-400">{formatDate(a.createdAt)}</span>
          </div>
          <h4 className="text-sm font-semibold text-gray-800">{a.title}</h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{a.content}</p>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementList;
