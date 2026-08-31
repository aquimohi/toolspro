import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, CheckCircle2, AlertCircle, ArrowRight, Phone, Github } from 'lucide-react';
import { UserProfile, SubscriptionTier } from '../types';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup' | 'forgot' | 'phone';
}

export function AuthModal({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'phone'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Setup Recaptcha
  useEffect(() => {
    if (isOpen && auth && !(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fetchOrCreateUserProfile = async (user: any, nameOverride?: string) => {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      const newProfile: UserProfile = {
        id: user.uid,
        name: nameOverride || user.displayName || user.email?.split('@')[0] || user.phoneNumber || 'User',
        email: user.email || '',
        avatarUrl: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.uid)}`,
        tier: 'free',
        dailyOperationsCount: 0,
        dailyOperationsLimit: 30,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        invoices: []
      };
      await setDoc(doc(db, 'users', user.uid), newProfile);
      return newProfile;
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      setErrorMsg('Firebase is not configured. Please check your .env file.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userProfile = await fetchOrCreateUserProfile(result.user);
      onLoginSuccess(userProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setErrorMsg('Firebase is not configured.');
      return;
    }
    if (!phoneNumber.startsWith('+')) {
      setErrorMsg('Please include country code (e.g., +91)');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      setSuccessMsg('OTP sent successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !confirmationResult) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await confirmationResult.confirm(otpCode);
      const userProfile = await fetchOrCreateUserProfile(result.user);
      onLoginSuccess(userProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      setIsLoading(true);
      try {
        if (!auth) throw new Error('Firebase is not configured.');
        await sendPasswordResetEmail(auth, email.trim());
        setSuccessMsg(`Password reset instructions sent to ${email}`);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to send reset email.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    try {
      if (!auth) throw new Error('Firebase is not configured.');
      let userCredential;
      if (mode === 'signup') {
        userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const userProfile = await fetchOrCreateUserProfile(userCredential.user, name.trim());
        onLoginSuccess(userProfile);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const userProfile = await fetchOrCreateUserProfile(userCredential.user);
        onLoginSuccess(userProfile);
      }
      onClose();
    } catch (err: any) {
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') msg = 'Email is already registered.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') msg = 'Invalid email or password.';
      setErrorMsg(msg || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create Your Account'}
                {mode === 'forgot' && 'Reset Password'}
                {mode === 'phone' && 'Phone Login'}
              </h3>
              <p className="text-xs text-slate-500">
                Sign in to access your tools & quota
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-slate-200 p-1.5 bg-slate-100/70 text-xs font-bold">
            <button onClick={() => { setMode('login'); setErrorMsg(''); }} className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${mode === 'login' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
              Email
            </button>
            <button onClick={() => { setMode('phone'); setErrorMsg(''); setShowOtpInput(false); }} className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${mode === 'phone' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
              Phone
            </button>
            <button onClick={() => { setMode('signup'); setErrorMsg(''); }} className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${mode === 'signup' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
              Sign Up
            </button>
          </div>
        )}

        <div className="p-6">
          {errorMsg && (
            <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'phone' ? (
            <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              {!showOtpInput ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Phone Number (with country code)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 9999999999"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                  <div id="recaptcha-container"></div>
                  <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md flex justify-center cursor-pointer">
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Enter OTP</label>
                    <input
                      type="text"
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium text-center tracking-[0.5em]"
                      required
                    />
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md flex justify-center cursor-pointer">
                    {isLoading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                </>
              )}
            </form>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium" />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium" />
                </div>
              </div>
              {mode !== 'forgot' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex justify-between">
                    <span>Password</span>
                    {mode === 'login' && <span onClick={() => setMode('forgot')} className="text-indigo-600 hover:underline cursor-pointer">Forgot?</span>}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium" />
                  </div>
                </div>
              )}
              <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md flex justify-center cursor-pointer">
                {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {mode !== 'forgot' && (
            <div className="mt-6">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="shrink-0 mx-4 text-slate-400 text-xs">Or continue with</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
              <button 
                onClick={handleGoogleLogin} 
                disabled={isLoading}
                className="w-full mt-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm py-3 rounded-xl transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Sign in with Google
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
