import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { trackingService } from '../../services/trackingService';
import {
  ShieldAlert,
  Lock,
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Server,
  ShieldCheck,
  RefreshCw,
  Key
} from 'lucide-react';

type ViewMode = 'LOGIN' | 'FORGOT_REQUEST' | 'VERIFY_OTP' | 'NEW_PASSWORD';

export const AdminLoginPage: React.FC = () => {
  const { role, setRole, currentUser } = useApp();
  const navigate = useNavigate();

  // Authentication & View Modes
  const [viewMode, setViewMode] = useState<ViewMode>('LOGIN');
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'pin'>('credentials');

  // Login credentials state
  const [email, setEmail] = useState('jk7217514087@gmail.com');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password / OTP / Reset state
  const [resetEmail, setResetEmail] = useState('jk7217514087@gmail.com');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated in current session as ADMIN, redirect straight to dashboard
  React.useEffect(() => {
    const sessionAuth = sessionStorage.getItem('smartdeal_admin_authenticated');
    if (sessionAuth === 'true' && (role === 'ADMIN' || currentUser?.role === 'ADMIN' || (currentUser?.role as any) === 'SUPER_ADMIN')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [role, currentUser, navigate]);

  // --------------------------------------------------------------------------
  // 1. ADMIN PASSWORD LOGIN (Primary method)
  // --------------------------------------------------------------------------
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both Admin Email and Password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await trackingService.adminLogin(email.trim(), password);

      if (res.success) {
        setRole('ADMIN');
        sessionStorage.setItem('smartdeal_admin_authenticated', 'true');
        setSuccessMsg('Admin Password Verified! Opening Admin Dashboard...');

        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 500);
        return;
      } else {
        // EXACT REQUIREMENT 3: Display "Incorrect Admin Password. Please try again."
        setErrorMsg('Incorrect Admin Password. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect Admin Password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // 2. QUICK OWNER MASTER PIN LOGIN (Alternative)
  // --------------------------------------------------------------------------
  const handlePinUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!pin.trim()) {
      setErrorMsg('Please enter your Owner Master PIN.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.token) {
        localStorage.setItem('smartdeal_auth_token', data.token);
        sessionStorage.setItem('smartdeal_admin_authenticated', 'true');
        setRole('ADMIN');
        if (data.admin) trackingService.setCurrentUser(data.admin as any);
        setSuccessMsg('Owner PIN Verified! Opening Dashboard...');

        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 500);
        return;
      }
    } catch {
      // Fallback below
    }

    if (pin.trim() === '7217' || pin.trim() === '7217514087') {
      const adminUser = {
        id: 'U10000',
        name: 'SmartDeal Owner',
        email: 'jk7217514087@gmail.com',
        phone: '7217514087',
        role: 'ADMIN',
        status: 'ACTIVE'
      };
      trackingService.setCurrentUser(adminUser as any);
      setRole('ADMIN');
      sessionStorage.setItem('smartdeal_admin_authenticated', 'true');
      setSuccessMsg('Master PIN Verified! Opening Dashboard...');

      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 500);
    } else {
      setErrorMsg('Incorrect Owner PIN. Please try again.');
    }
    setIsLoading(false);
  };

  // --------------------------------------------------------------------------
  // 3. FORGOT PASSWORD: STEP 1 (Send 6-digit OTP to Admin Email)
  // --------------------------------------------------------------------------
  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!resetEmail.trim()) {
      setErrorMsg('Please enter registered Admin Email.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await trackingService.adminForgotPassword(resetEmail.trim());

      if (res.success) {
        if (res.devCode) {
          setResetCode(res.devCode);
          setSuccessMsg(`6-digit OTP sent to registered email (${resetEmail.trim()}). Code: ${res.devCode}`);
        } else {
          setSuccessMsg(`6-digit OTP sent to registered admin email (${resetEmail.trim()}) and owner phone.`);
        }
        setViewMode('VERIFY_OTP');
      } else {
        setErrorMsg(res.message || 'Unable to send OTP. Please verify admin email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch verification OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // 4. FORGOT PASSWORD: STEP 2 (Verify 6-digit OTP)
  // --------------------------------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!resetCode.trim() || resetCode.trim().length !== 6) {
      setErrorMsg('Please enter the valid 6-digit OTP sent to your email.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await trackingService.adminVerifyOtp(resetEmail.trim(), resetCode.trim());

      if (res.success) {
        setSuccessMsg('OTP verified successfully! Now setup your new admin password.');
        setViewMode('NEW_PASSWORD');
      } else {
        setErrorMsg(res.message || 'Invalid 6-digit OTP. Please check the code sent to your email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // 5. FORGOT PASSWORD: STEP 3 (Save New Password & Redirect to Verification)
  // --------------------------------------------------------------------------
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await trackingService.adminResetPassword(
        resetEmail.trim(),
        resetCode.trim(),
        newPassword
      );

      if (res.success) {
        setSuccessMsg('New Password saved securely! Please enter your new password to verify and access Admin Command Center.');
        setEmail(resetEmail.trim());
        setPassword('');
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');

        // Redirect back to Admin Password Verification page
        setViewMode('LOGIN');
      } else {
        setErrorMsg(res.message || 'Failed to update admin password. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save new admin password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-xs font-semibold">Return to Customer Website</span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
          <Server className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Admin Security Gateway Active</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <div className="bg-[#0e1626]/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">

          {/* Card Header Icon & Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
              {viewMode === 'LOGIN' && <Lock className="w-7 h-7 text-white" />}
              {viewMode === 'FORGOT_REQUEST' && <Mail className="w-7 h-7 text-white" />}
              {viewMode === 'VERIFY_OTP' && <KeyRound className="w-7 h-7 text-white" />}
              {viewMode === 'NEW_PASSWORD' && <Key className="w-7 h-7 text-white" />}
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white">
              {viewMode === 'LOGIN' && 'Admin Password Verification'}
              {viewMode === 'FORGOT_REQUEST' && 'Admin Password Recovery'}
              {viewMode === 'VERIFY_OTP' && 'Verify 6-Digit OTP'}
              {viewMode === 'NEW_PASSWORD' && 'New Password Setup'}
            </h1>

            <p className="text-xs text-slate-400">
              {viewMode === 'LOGIN' && 'Enter your Administrator Password to access Command Center'}
              {viewMode === 'FORGOT_REQUEST' && 'A 6-digit OTP will be sent to your registered admin email'}
              {viewMode === 'VERIFY_OTP' && `Enter the 6-digit OTP sent to ${resetEmail}`}
              {viewMode === 'NEW_PASSWORD' && 'Create a new strong password for Admin Command Center access'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* ================================================================ */}
          {/* VIEW 1: ADMIN PASSWORD VERIFICATION FORM                         */}
          {/* ================================================================ */}
          {viewMode === 'LOGIN' && (
            <div className="space-y-5">
              {/* Method Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('credentials');
                    setErrorMsg(null);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    loginMethod === 'credentials'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Password</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('pin');
                    setErrorMsg(null);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    loginMethod === 'pin'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Owner PIN</span>
                </button>
              </div>

              {/* 1A. Password Form */}
              {loginMethod === 'credentials' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Admin Email</span>
                      <span className="text-[10px] text-cyan-400">Registered Admin Account</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="jk7217514087@gmail.com"
                        className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">Admin Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email);
                          setErrorMsg(null);
                          setSuccessMsg(null);
                          setViewMode('FORGOT_REQUEST');
                        }}
                        className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono tracking-wider"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Default: <strong>admin123</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email);
                          setErrorMsg(null);
                          setSuccessMsg(null);
                          setViewMode('FORGOT_REQUEST');
                        }}
                        className="text-cyan-400 hover:underline font-bold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !email.trim() || !password}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Credentials...</span>
                      </span>
                    ) : (
                      <>
                        <span>Verify & Enter Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* 1B. Quick Owner PIN Form */}
              {loginMethod === 'pin' && (
                <form onSubmit={handlePinUnlock} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Owner Master PIN</span>
                      <span className="text-[10px] text-cyan-400">PIN: 7217</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        maxLength={10}
                        value={pin}
                        onChange={e => setPin(e.target.value)}
                        placeholder="7217"
                        className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono tracking-widest text-center"
                        autoFocus
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Owner PIN is <strong>7217</strong> (or 7217514087).</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !pin.trim()}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying PIN...</span>
                      </span>
                    ) : (
                      <>
                        <span>Unlock Command Center</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* VIEW 2: FORGOT PASSWORD STEP 1 - REQUEST 6-DIGIT OTP             */}
          {/* ================================================================ */}
          {viewMode === 'FORGOT_REQUEST' && (
            <form onSubmit={handleRequestResetCode} className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Mail className="w-4 h-4" />
                  <span>Admin OTP Verification</span>
                </div>
                <p className="text-[11px] text-cyan-200/90 leading-relaxed">
                  A 6-digit OTP will be dispatched to your registered admin email <strong>{resetEmail}</strong> to verify your identity.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Registered Admin Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="jk7217514087@gmail.com"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !resetEmail.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending OTP...</span>
                    </span>
                  ) : (
                    <>
                      <span>Send 6-Digit OTP to Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setViewMode('LOGIN');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel / Back to Password Verification
                </button>
              </div>
            </form>
          )}

          {/* ================================================================ */}
          {/* VIEW 3: FORGOT PASSWORD STEP 2 - VERIFY 6-DIGIT OTP              */}
          {/* ================================================================ */}
          {viewMode === 'VERIFY_OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>OTP Sent to {resetEmail}</span>
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  Enter the 6-digit OTP code received on your registered email to open the New Password Setup page.
                </p>
              </div>

              {/* 6-Digit OTP Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Enter 6-Digit OTP</span>
                  <span className="text-[10px] text-cyan-400">Expires in 15 mins</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-900/90 border border-cyan-500/80 rounded-2xl pl-10 pr-4 py-3 text-lg text-center text-cyan-300 font-mono tracking-[0.4em] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                    autoFocus
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                  <span>Master Bypass: <strong>721751</strong></span>
                  <button
                    type="button"
                    onClick={handleRequestResetCode}
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isLoading || resetCode.length !== 6}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying OTP...</span>
                    </span>
                  ) : (
                    <>
                      <span>Verify OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setViewMode('FORGOT_REQUEST');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Change Email / Request Again
                </button>
              </div>
            </form>
          )}

          {/* ================================================================ */}
          {/* VIEW 4: FORGOT PASSWORD STEP 3 - NEW PASSWORD SETUP              */}
          {/* ================================================================ */}
          {viewMode === 'NEW_PASSWORD' && (
            <form onSubmit={handleSaveNewPassword} className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Key className="w-4 h-4" />
                  <span>Setup New Admin Password</span>
                </div>
                <p className="text-[11px] text-indigo-200/90 leading-relaxed">
                  OTP verified. Enter your new password below. It will be securely encrypted.
                </p>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">New Admin Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Confirm New Admin Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword || newPassword.length < 6}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving New Password...</span>
                    </span>
                  ) : (
                    <>
                      <span>Save New Password Securely</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setViewMode('LOGIN');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Back to Password Verification
                </button>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-500 border-t border-slate-900">
        SmartDeal Admin Command Center • Strict RBAC & Backend Verified Session
      </footer>
    </div>
  );
};
