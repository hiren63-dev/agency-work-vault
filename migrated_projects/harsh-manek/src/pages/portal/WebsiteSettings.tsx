import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle2, Save, Loader2, AlertCircle } from 'lucide-react';

interface Settings {
  phone: string;
  whatsapp: string;
  email: string;
  office_address: string;
}

const DEFAULTS: Settings = {
  phone: '+91-9033440008',
  whatsapp: '+91-8200638808',
  email: 'Harsh.manek@hotmail.com',
  office_address: '7, A Square Complex, Shilaj Circle, Near Kaveri Sangam, S P Ring Road, Ahmedabad, Gujarat - 380058',
};

export default function WebsiteSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    supabase
      .from('website_settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setSettings({
            phone: data.phone ?? DEFAULTS.phone,
            whatsapp: data.whatsapp ?? DEFAULTS.whatsapp,
            email: data.email ?? DEFAULTS.email,
            office_address: data.office_address ?? DEFAULTS.office_address,
          });
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaved(false);

    const { error } = await supabase
      .from('website_settings')
      .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });

    setSaving(false);
    if (error) {
      setSaveError('Save failed: ' + error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    }
  };

  const field = (label: string, key: keyof Settings, type = 'text') => (
    <div>
      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/40 mb-2">{label}</label>
      <input
        type={type}
        value={settings[key]}
        onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors"
      />
    </div>
  );

  if (loading) return (
    <div className="flex items-center gap-3 text-white/40 font-mono text-sm pt-10">
      <Loader2 className="w-4 h-4 animate-spin" /> Loading settings from database...
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-['Poppins'] font-bold text-white">Website Settings</h1>
        <p className="text-white/40 text-sm mt-1">Changes save to Supabase and reflect live on the website instantly.</p>
      </div>

      {saved && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Saved to database! Live visitors will see updated contact info immediately.</span>
        </div>
      )}

      {saveError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field('Direct Phone', 'phone', 'tel')}
            {field('WhatsApp Number', 'whatsapp', 'tel')}
          </div>

          <div>
            {field('Official Email', 'email', 'email')}
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-white/40 mb-2">Office Physical Address</label>
            <textarea
              rows={3}
              value={settings.office_address}
              onChange={(e) => setSettings(prev => ({ ...prev, office_address: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="bg-white text-black font-bold px-7 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <span className="text-xs font-mono text-white/30">Syncs live without redeploying</span>
          </div>
        </form>
      </div>
    </div>
  );
}
