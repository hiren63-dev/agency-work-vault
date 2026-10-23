import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  office_address: string;
}

const DEFAULTS: SiteSettings = {
  phone: '+91-9033440008',
  whatsapp: '+91-8200638808',
  email: 'Harsh.manek@hotmail.com',
  office_address: '7, A Square Complex, Shilaj Circle, Near Kaveri Sangam, S P Ring Road, Ahmedabad, Gujarat - 380058',
};

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);

  useEffect(() => {
    supabase
      .from('website_settings')
      .select('phone, whatsapp, email, office_address')
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
        // On error, silently fallback to defaults (no DB row yet)
      });
  }, []);

  return settings;
}

/** Returns a formatted WhatsApp deep-link from a whatsapp number */
export function waLink(whatsapp: string, text: string): string {
  const digits = whatsapp.replace(/[^0-9]/g, '');
  const number = digits.startsWith('91') ? digits : `91${digits}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
