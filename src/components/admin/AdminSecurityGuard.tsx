import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  ShieldAlert,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { trackingService } from '../../services/trackingService';

interface Props {
  children: React.ReactNode;
}

export const AdminSecurityGuard: React.FC<Props> = ({ children }) => {
  const { role, setRole, currentUser } = useApp();
  const navigate = useNavigate();

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    // Check if admin is currently active or session token exists
    const sessionAuth = sessionStorage.getItem('smartdeal_admin_authenticated');
    const isOwnerRole = role === 'ADMIN' && currentUser?.role === 'ADMIN';
    return sessionAuth === 'true' || isOwnerRole;
  });

  const [loginMethod, setLoginMethod] = useState<'pin' | 'credentials'>('pin');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('admin@smartdeal.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // If already unlocked and verified, render protected children directly
  if (isUnlocked) {
    return <>{children}</>;
  }

  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsAuthenticating(true);

    setTimeout(() => {
      // Owner Master PIN: 7217 or 7217514087 (matches verified owner phone)
      if (pin.trim() === '7217' || pin.trim() === '7217514087') {
        const adminUser = trackingService.getUsers().find(u => u.role === 'ADMIN') || {
          id: 'U10001',
          name: 'Super Admin (Owner)',
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
        setIsUnlocked(true);
      } else {
        setErrorMsg('Invalid Owner PIN. Unauthorized access is restricted.');
      }
      setIsAuthenticating(false);
    }, 400);
  };

  const handleCredentialsUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsAuthenticating(true);

    const res = await trackingService.authenticateUser(email, password);
    if (res.success && res.user && res.user.role === 'ADMIN') {
      setRole('ADMIN');
      sessionStorage.setItem('smartdeal_admin_authenticated', 'true');
      setIsUnlocked(true);
    } else {
      setErrorMsg('Invalid admin credentials. Only the verified store owner has access.');
    }
    setIsAuthenticating(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon & Title */}
        <div className="relative text-center space-y-3 mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/10">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-white">Owner & Admin Verification</h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Personal customer data, order analytics, guest logs, and database metrics are strictly confidential.
            Only the verified website owner is permitted to access this portal.
          </p>
        </div>

        {/* Method Toggle */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl mb-5 border border-slate-700/60">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('pin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              loginMethod === 'pin'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Owner Master PIN
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod('credentials');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              loginMethod === 'credentials'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin Credentials
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* PIN Form */}
        {loginMethod === 'pin' ? (
          <form onSubmit={handlePinUnlock} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Owner Master PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="Enter 4-digit PIN (e.g. 7217)"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  maxLength={10}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-center tracking-widest text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 text-center">
                Owner verification linked to phone ending in <strong>4087</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating || !pin.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
            >
              <span>{isAuthenticating ? 'Verifying...' : 'Unlock Admin Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Credentials Form */
          <form onSubmit={handleCredentialsUnlock} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@smartdeal.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating || !password}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
            >
              <span>{isAuthenticating ? 'Signing In...' : 'Verify Admin Access'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Back to Home Button for Regular Shoppers */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to SmartDeals Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};
