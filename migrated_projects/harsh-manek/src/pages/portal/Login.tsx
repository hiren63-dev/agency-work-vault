import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Incorrect email or password. Please try again.');
        setLoading(false);
      } else {
        navigate('/portal');
      }
    } catch (_) {
      setError('Unable to connect. Please check your internet connection and try again.');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/portal/account`,
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset link sent! Check your inbox to update your password.');
      }
    } catch (_) {
      setError('Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">Harsh Manek & Co.</span>
        </div>
        <h2 className="text-3xl font-['Poppins'] font-extrabold text-white mb-2 text-center">
          {resetMode ? 'Reset Password' : 'Private Client Portal'}
        </h2>
        <p className="text-white/40 text-center text-sm font-sans mb-8">
          {resetMode ? 'Enter your registered email for a reset link' : 'Secure admin access only'}
        </p>
        
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-xl text-xs mb-6 leading-relaxed">{error}</div>}
        {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs mb-6 leading-relaxed">{message}</div>}
        
        {!resetMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-widest text-white/40 mb-2">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition-colors text-sm" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-mono text-[11px] uppercase tracking-widest text-white/40">Password</label>
                <button type="button" onClick={() => { setResetMode(true); setError(''); setMessage(''); }} className="text-xs text-white/40 hover:text-white transition-colors">Forgot Password?</button>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition-colors text-sm" />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors text-sm">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-widest text-white/40 mb-2">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition-colors text-sm" />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors text-sm">
              {loading ? 'Sending...' : 'Send Password Reset Link'}
            </button>
            <div className="text-center pt-2">
              <button type="button" onClick={() => { setResetMode(false); setError(''); setMessage(''); }} className="text-xs text-white/40 hover:text-white transition-colors">
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-white/20 text-xs mt-6 font-mono">This portal is for authorised use only.</p>
      </div>
    </div>
  );
}
