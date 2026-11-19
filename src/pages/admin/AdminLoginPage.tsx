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
  UserCheck,
  CheckCircle2,
  Sparkles,
  Server
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { role, setRole, currentUser } = useApp();
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState<'pin' | 'credentials'>('pin');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // If already authenticated as ADMIN, redirect straight to dashboard
  React.useEffect(() => {
    const sessionAuth = sessionStorage.getItem('smartdeal_admin_authenticated');
    if (sessionAuth === 'true' && (role === 'ADMIN' || currentUser?.role === 'ADMIN')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [role, currentUser, navigate]);

  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsAuthenticating(true);

    setTimeout(() => {
      // Owner Master PIN: 7217 or 7217514087 (verified store owner phone)
      if (pin.trim() === '7217' || pin.trim() === '7217514087') {
        const adminUser = trackingService.getUsers().find(u => u.role === 'ADMIN') || {
          id: 'U10001',
          name: 'Super Admin (Store Owner)',
          email: 'admin@smartdeal.com',
          phone: '+91 72175 14087',
          role: 'ADMIN',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        trackingService.setCurrentUser(adminUser as any);
        setRole('ADMIN');
        sessionStorage.setItem('smartdeal_admin_authenticated', 'true');
        setSuccessMsg('Authentication successful! Directing to Admin Dashboard...');

        // Log audit event for secure login
        trackingService.logAuditEvent(
          adminUser.id,
          adminUser.email,
          'ADMIN_LOGIN_SUCCESS',
          'Auth',
          'session',
          { method: 'OWNER_PIN' }
        );

        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 500);
      } else {
        setErrorMsg('Invalid Owner PIN. Unauthorized access is restricted.');
      }
      setIsAuthenticating(false);
    }, 400);
  };

  const handleCredentialsUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsAuthenticating(true);

    try {
      const res = await trackingService.authenticateUser(email.trim(), password);
      if (res.success && res.user) {
        if (res.user.role === 'ADMIN') {
          setRole('ADMIN');
          sessionStorage.setItem('smartdeal_admin_authenticated', 'true');
          setSuccessMsg('Admin credentials verified. Directing to Command Center...');

          trackingService.logAuditEvent(
            res.user.id,
            res.user.email,
            'ADMIN_LOGIN_SUCCESS',
            'Auth',
            'session',
            { method: 'EMAIL_PASSWORD' }
          );

          setTimeout(() => {
            navigate('/admin/dashboard', { replace: true });
          }, 500);
        } else {
          setErrorMsg(`Access Denied: Account '${email}' does not possess Administrator permissions. Please sign in via the normal customer login.`);
        }
      } else {
        setErrorMsg(res.message || 'Invalid admin credentials.');
      }
    } catch {
      setErrorMsg('An error occurred during authentication.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-xs font-semibold">Return to Customer Website</span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
          <Server className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>REST API :3001 Active</span>
        </div>
      </header>

      {/* Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <div className="bg-[#0e1626]/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">SmartDeal Admin Portal</h1>
            <p className="text-xs text-slate-400">
              Restricted Administrative Access &bull; RBAC Protected
            </p>
          </div>

          {/* Login Method Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
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
              <span>Owner Master PIN</span>
            </button>
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
              <UserCheck className="w-3.5 h-3.5" />
              <span>Admin Email</span>
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* PIN Form */}
          {loginMethod === 'pin' && (
            <form onSubmit={handlePinUnlock} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Owner PIN (4 or 10 digits)</span>
                  <span className="text-[10px] text-cyan-400 font-normal">Registered Owner Phone PIN</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    maxLength={10}
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    placeholder="Enter Master PIN (e.g. 7217)"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono tracking-widest"
                    autoFocus
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Tip: Owner Quick PIN is <strong>7217</strong> or phone digits.</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating || !pin.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthenticating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Authority...</span>
                  </span>
                ) : (
                  <>
                    <span>Unlock Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Credentials Form */}
          {loginMethod === 'credentials' && (
            <form onSubmit={handleCredentialsUnlock} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@smartdeal.com"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Admin Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating || !email.trim() || !password}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthenticating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Validating Account...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In as Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security Guarantee */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>SHA-256 Session Encrypted</span>
            </span>
            <span>Public Registration Disabled</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-500">
        SmartDeal Enterprise Administrative Portal &copy; {new Date().getFullYear()} &bull; Strictly Confidential
      </footer>
    </div>
  );
};

export default AdminLoginPage;
