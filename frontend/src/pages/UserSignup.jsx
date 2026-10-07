import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Check, X, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';
import API from '../api';
import { useToast } from '../components/Toast';

const UserSignup = ({ onUserLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Password validation indicators
  const isMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      showToast('Please enter both your first and last name', 'warning');
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/user/signup', {
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim()
      });

      const token = res.data.token;
      showToast('Account created successfully! Welcome to Coursify.', 'success');

      if (onUserLogin && token) {
        onUserLogin(token);
        navigate('/');
      } else {
        navigate('/signin');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Something went wrong during signup.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillSample = () => {
    setFirstName('Alex');
    setLastName('Morgan');
    setEmail(`student_${Math.floor(100 + Math.random() * 900)}@example.com`);
    setPassword('Pass1234');
    showToast('Sample registration details filled!', 'info');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 sm:px-6 py-10 relative overflow-hidden bg-[#0f1117]">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6c5ce7]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00cec9]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Role Switcher Tabs */}
        <div className="flex rounded-2xl bg-slate-950/80 p-1.5 border border-slate-800/80 mb-6">
          <button
            type="button"
            className="flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] text-white shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4" />
            Student Account
          </button>
          <Link
            to="/admin/signup"
            className="flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all flex items-center justify-center gap-1.5"
          >
            Instructor Account
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6c5ce7] to-[#81ecec] flex items-center justify-center text-white text-xl mx-auto shadow-lg shadow-indigo-500/20 mb-3">
            ✨
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Create Student Account</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">Join thousands of learners leveling up their tech careers</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                First Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full bg-slate-950/80 border border-slate-700/80 hover:border-slate-600 focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Last Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full bg-slate-950/80 border border-slate-700/80 hover:border-slate-600 focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 hover:border-slate-600 focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 hover:border-slate-600 focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/20 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder:text-slate-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick validation badge */}
          {password.length > 0 && (
            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs">
                {isMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
                <span className={isMinLength ? 'text-emerald-300' : 'text-slate-400'}>
                  At least 6 characters
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {hasNumber && hasLetter ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
                <span className={hasNumber && hasLetter ? 'text-emerald-300' : 'text-slate-400'}>
                  Contains letters and numbers
                </span>
              </div>
            </div>
          )}

          {/* Quick Fill Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={fillSample}
              className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              Auto-fill sample
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-1 bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] hover:from-[#5a4bd1] hover:to-[#4b3ec0] text-white py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs sm:text-sm text-slate-400 border-t border-slate-800/80 pt-5">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors ml-1">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default UserSignup;
