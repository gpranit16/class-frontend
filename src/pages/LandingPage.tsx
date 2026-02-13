import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, Shield, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-blue-950">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Success<span className="text-accent-400">Path</span>Classes
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Student Management System
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-12 leading-relaxed">
              Manage academic records, track performance, and access results seamlessly.
            </p>

            {/* Portal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
              {/* Student Portal */}
              <div 
                onClick={() => navigate('/student/login')}
                className="group cursor-pointer bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-accent-400 transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Student Portal</h2>
                <p className="text-blue-200 mb-6 text-sm">
                  Access your results, marks, and announcements
                </p>
                <button className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:gap-3">
                  Login as Student
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Admin Portal */}
              <div 
                onClick={() => navigate('/admin/login')}
                className="group cursor-pointer bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-accent-400 transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Admin Portal</h2>
                <p className="text-blue-200 mb-6 text-sm">
                  Manage students, marks, and announcements
                </p>
                <button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:gap-3 border border-white/30">
                  Login as Admin
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center text-blue-200 text-sm">
              <p>Secure • Fast • Reliable</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
