import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';
import API from '../api';
import { useToast } from '../components/Toast';

const AdminSignin = ({ onAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Check if email was saved for "Remember Me"
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberAdminEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/admin/signin', {
        email: email.trim(),
        password
      });

      const token = res.data.token;

      if (rememberMe) {
        localStorage.setItem('rememberAdminEmail', email.trim());
      } else {
        localStorage.removeItem('rememberAdminEmail');
      }

      onAdminLogin(token);
      showToast('Creator session authorized. Welcome back!', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Invalid email or password.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('instructor@coursify.com');
    setPassword('AdminSecret123!');
    showToast('Demo instructor credentials filled!', 'info');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 sm:px-6 py-10 relative overflow-hidden bg-[#0f1117]">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00cec9]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6c5ce7]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Role Switcher Tabs */}
        <div className="flex rounded-2xl bg-slate-950/80 p-1.5 border border-slate-800/80 mb-6">
          <Link
            to="/signin"
            className="flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all flex items-center justify-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4" />
            Student Sign In
          </Link>
          <button
            type="button"
            className="flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-[#00cec9] to-[#0984e3] text-white shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Instructor Portal
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00cec9] to-[#0984e3] flex items-center justify-center text-white text-xl mx-auto shadow-lg shadow-teal-500/20 mb-3">
            🔐
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Instructor Portal</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">Sign in to manage courses, students, and revenue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Instructor Email
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="instructor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 hover:border-slate-600 focus:border-[#00cec9] focus:ring-2 focus:ring-[#00cec9]/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => showToast('Enter your registered instructor password.', 'info')}
                className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 hover:border-slate-600 focus:border-[#00cec9] focus:ring-2 focus:ring-[#00cec9]/20 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder:text-slate-500 outline-none transition-all"
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

          {/* Remember & Fill Demo */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-[#00cec9] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-slate-400">Remember instructor</span>
            </label>

            <button
              type="button"
              onClick={fillDemoAdmin}
              className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-teal-400" />
              Fill Sample
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-[#00cec9] to-[#0984e3] hover:opacity-95 text-white py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-teal-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Authorizing...</span>
              </>
            ) : (
              <>
                <span>Sign In as Instructor</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs sm:text-sm text-slate-400 border-t border-slate-800/80 pt-5">
          Want to become an instructor?{' '}
          <Link to="/admin/signup" className="font-semibold text-teal-400 hover:text-teal-300 transition-colors ml-1">
            Apply / Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSignin;
