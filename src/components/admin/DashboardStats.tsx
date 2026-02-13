import React from 'react';
import { Users, UserCheck, FileText, TrendingUp, LucideIcon } from 'lucide-react';

interface StatCard {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: string;
  trendColor?: string;
  bgColor: string;
  iconColor: string;
}

interface Props {
  totalStudents: number;
  activeStudents: number;
  totalExams: number;
  averagePerformance: number;
}

const DashboardStats: React.FC<Props> = ({ totalStudents, activeStudents, totalExams, averagePerformance }) => {
  const stats: StatCard[] = [
    { icon: Users, value: totalStudents.toLocaleString(), label: 'Total Students', trend: 'All registered', trendColor: 'text-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: UserCheck, value: activeStudents.toLocaleString(), label: 'Active Students', trend: 'Currently active', trendColor: 'text-green-600', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
    { icon: FileText, value: totalExams, label: 'Total Exams', trend: 'Exams conducted', trendColor: 'text-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: TrendingUp, value: `${averagePerformance}%`, label: 'Avg Performance', trend: 'Overall average', trendColor: 'text-orange-600', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
          {stat.trend && <p className={`text-xs mt-1 ${stat.trendColor}`}>{stat.trend}</p>}
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
