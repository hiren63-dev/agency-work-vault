import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Lock, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Account() {
  const { user } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Check if user just arrived from a password recovery email link
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setMessage('Please enter your new password below.');
      // Clean up the URL so it looks nice
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setUpdating(true);
    setError('');
    setMessage('');
    
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    setUpdating(false);
    
    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Password updated successfully!');
      setNewPassword('');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-['Poppins'] font-bold mb-2">Account Settings</h1>
      <p className="text-white/40 text-sm mb-8">Manage your portal access and security credentials.</p>
      
      <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-8">
        <div>
          <h3 className="text-sm font-mono uppercase tracking-widest text-white/40 mb-3">Admin Profile</h3>
          <div className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-2xl p-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-sans font-medium text-white">{user?.email}</p>
              <p className="text-xs text-white/40 font-mono mt-0.5">Role: Administrator</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <h3 className="text-sm font-mono uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Change Password
          </h3>
          
          {message && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}
          
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-sans text-white/50 mb-2">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 6 characters"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
            
            <button
              type="submit"
              disabled={updating || !newPassword}
              className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{updating ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
