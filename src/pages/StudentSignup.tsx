import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle, ChevronRight, ChevronLeft, GraduationCap } from 'lucide-react';
import { authService } from '../services/authService';
import { CLASSES, SECTIONS, GENDERS } from '../utils/constants';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const StudentSignup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdStudentId, setCreatedStudentId] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '', dateOfBirth: '', gender: '', bloodGroup: '',
    class: '', section: '', rollNo: '',
    email: '', contactNumber: '', parentName: '',
    parentContact: '', address: '',
    password: '', confirmPassword: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.class || !formData.rollNo) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.email || !formData.contactNumber) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
      setError('Contact number must be 10 digits');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError('');
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setLoading(true);
    setError('');

    try {
      const data = await authService.studentSignup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber,
        class: formData.class,
        section: formData.section,
        rollNo: formData.rollNo,
        parentName: formData.parentName,
        parentContact: formData.parentContact || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        bloodGroup: formData.bloodGroup || undefined,
        address: formData.address || undefined,
      });

      if (data.success) {
        setCreatedStudentId(data.studentId);
        setStep(4);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { label: '', color: '', width: '0%' };
    if (p.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (p.length < 10) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-800 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              Success<span className="text-primary-800">Path</span>Classes
            </span>
          </Link>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {step} of 3
              </span>
              <span className="text-sm text-gray-500">
                {step === 1 && 'Personal Info'}
                {step === 2 && 'Contact Details'}
                {step === 3 && 'Account Setup'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-800 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Personal Information</h2>
              <Input label="Full Name *" placeholder="Enter your full name" value={formData.name} onChange={(e) => updateField('name', e.target.value)} icon={<User className="w-4 h-4" />} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={formData.gender} onChange={(e) => updateField('gender', e.target.value)}>
                    <option value="">Select</option>
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                  <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={formData.class} onChange={(e) => updateField('class', e.target.value)}>
                    <option value="">Select Class</option>
                    {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" value={formData.section} onChange={(e) => updateField('section', e.target.value)}>
                    <option value="">Select</option>
                    {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <Input label="Roll Number *" placeholder="Enter roll number" value={formData.rollNo} onChange={(e) => updateField('rollNo', e.target.value)} />
              <div className="flex justify-end">
                <Button onClick={nextStep} icon={<ChevronRight className="w-4 h-4" />}>Next Step</Button>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Contact Details</h2>
              <Input label="Email Address *" type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} icon={<Mail className="w-4 h-4" />} />
              <Input label="Contact Number *" type="tel" placeholder="10-digit number" value={formData.contactNumber} onChange={(e) => updateField('contactNumber', e.target.value)} icon={<Phone className="w-4 h-4" />} />
              <Input label="Parent/Guardian Name" placeholder="Parent's name" value={formData.parentName} onChange={(e) => updateField('parentName', e.target.value)} />
              <Input label="Parent Contact Number" type="tel" placeholder="10-digit number" value={formData.parentContact} onChange={(e) => updateField('parentContact', e.target.value)} icon={<Phone className="w-4 h-4" />} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" rows={3} placeholder="Enter your address" value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
              </div>
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)} icon={<ChevronLeft className="w-4 h-4" />}>Back</Button>
                <Button onClick={nextStep} icon={<ChevronRight className="w-4 h-4" />}>Next Step</Button>
              </div>
            </div>
          )}

          {/* Step 3: Account Setup */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Account Setup</h2>
              <div className="relative">
                <Input label="Create Password *" type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={formData.password} onChange={(e) => updateField('password', e.target.value)} icon={<Lock className="w-4 h-4" />} />
                <button type="button" className="absolute right-3 top-9 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formData.password && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Password Strength</span>
                    <span className={`font-medium ${strength.color === 'bg-red-500' ? 'text-red-500' : strength.color === 'bg-yellow-500' ? 'text-yellow-500' : 'text-green-500'}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                </div>
              )}
              <Input label="Confirm Password *" type="password" placeholder="Re-enter password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} icon={<Lock className="w-4 h-4" />} />
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)} icon={<ChevronLeft className="w-4 h-4" />}>Back</Button>
                <Button variant="success" onClick={handleSubmit} loading={loading} icon={<CheckCircle className="w-4 h-4" />}>Create Account</Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created Successfully!</h2>
              <p className="text-gray-600 mb-6">Your student account has been created.</p>
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Your Student ID</p>
                <p className="text-3xl font-bold text-primary-800">{createdStudentId}</p>
                <p className="text-xs text-gray-500 mt-2">Please save this ID for future login</p>
              </div>
              <Button onClick={() => navigate('/student/login')}>Go to Login</Button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/student/login" className="text-sm text-primary-600 hover:text-primary-800">
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
