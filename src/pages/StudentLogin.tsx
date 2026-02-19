import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, GraduationCap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const StudentLogin: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Auto-login if email is provided in query parameter
  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
      handleAutoLogin(emailFromQuery);
    }
  }, [searchParams]);

  const handleAutoLogin = async (emailAddress: string) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setError('Invalid email format in URL');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.studentLoginByEmail(emailAddress);
      if (data.success) {
        login(data.token, { ...data.student, role: 'student', id: data.student.id });
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Auto-login failed. Please try manual login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.studentLoginByEmail(email);
      if (data.success) {
        login(data.token, { ...data.student, role: 'student', id: data.student.id });
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary-800 via-primary-900 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>
        <div className="relative flex flex-col items-center justify-center p-12 text-center">
          <GraduationCap className="w-20 h-20 mb-6 text-accent-400" />
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Check your results and track your academic progress with SuccessPathClasses.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary-800 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              Success<span className="text-primary-800">Path</span>Classes
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Student Portal</h1>
              <p className="text-gray-500 text-sm mt-1">Login with your email address</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="student@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
              />

              <Button type="submit" className="w-full" loading={loading}>
                Login to Dashboard
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-400">OR</span>
                </div>
              </div>

              <Link to="/student/signup">
                <Button variant="outline" className="w-full">
                  New Student? Create Account
                </Button>
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-primary-600 hover:text-primary-800 transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
