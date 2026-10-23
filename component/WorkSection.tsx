'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface ProjectData {
  category: 'websites' | 'software';
  name: string;
  kind: string;
  url: string;
  domain: string;
  number: string;
  totalCount: string;
  badge?: string;
  note: string;
  openLabel: string;
  desktopPoster: string;
  phonePoster: string;
  annotations: { tag: string; desc: string }[];
}

export const AGENCY_PROJECTS: Record<string, ProjectData> = {
  bnps: {
    category: 'websites',
    name: 'BNPS',
    kind: 'Firm website',
    url: 'https://bnps.vercel.app/',
    domain: 'bnps.vercel.app',
    number: '01',
    totalCount: '03',
    badge: 'Enterprise Legal & Tax Infrastructure',
    note: 'Scroll inside the preview, or visit the full site.',
    openLabel: 'Visit live site',
    desktopPoster: '/assets/work/bnps-desktop.webp',
    phonePoster: '/assets/work/bnps-phone.webp',
    annotations: [
      { tag: 'Editorial Structure', desc: 'Clean legal & tax practice navigation with zero friction' },
      { tag: 'Responsive Layout', desc: 'Dynamic typographic scale tested from mobile to ultrawide' },
      { tag: 'Intake Architecture', desc: 'Direct corporate inquiry flows built for fast conversion' },
      { tag: 'Native Delivery', desc: 'Zero runtime bundle weight with sub-second page delivery' }
    ]
  },
  harsh: {
    category: 'websites',
    name: 'Harsh Manek',
    kind: 'Firm website & Portal',
    url: 'https://harshmanek.com/',
    domain: 'harshmanek.com',
    number: '02',
    totalCount: '03',
    badge: 'Full-Stack Lead Capture & Tax Calculators',
    note: 'Scroll inside the preview, or visit the full site.',
    openLabel: 'Visit live site',
    desktopPoster: '/assets/work/harsh-desktop.webp',
    phonePoster: '/assets/work/harsh-phone.webp',
    annotations: [
      { tag: 'Monochrome Tension', desc: 'High-contrast typography with deliberate architectural spacing' },
      { tag: 'Practice Divisions', desc: 'Structured practice divisions for clients and founders' },
      { tag: 'Consultation Flow', desc: 'Friction-free intake form with direct calendar booking' },
      { tag: 'Kinetic Motion', desc: 'Subtle scroll-anchored micro-interactions and reveals' }
    ]
  },
  kadivar: {
    category: 'websites',
    name: 'Kadivar',
    kind: 'Redesign & CFO Hub',
    url: 'https://kadivar-redesign.vercel.app/',
    domain: 'kadivar-redesign.vercel.app',
    number: '03',
    totalCount: '03',
    badge: 'Next.js 15 + Framer Motion Smooth Architecture',
    note: 'Scroll inside the preview, or visit the full site.',
    openLabel: 'Visit live site',
    desktopPoster: '/assets/work/kadivar-desktop.webp',
    phonePoster: '/assets/work/kadivar-phone.webp',
    annotations: [
      { tag: 'Brand Identity', desc: 'Modernized aesthetic balance for architectural engineering' },
      { tag: 'Project Showcase', desc: 'High-contrast portfolio grid with interactive previews' },
      { tag: 'Direct Inquiries', desc: 'One-click contact anchors with copyable email triggers' },
      { tag: 'Optimized Assets', desc: 'Lightweight responsive webp imagery with sub-second load' }
    ]
  },
  pulse: {
    category: 'software',
    name: 'Pulse Studio',
    kind: 'Gym Management · 6+ Gyms',
    url: '/demos/pulse/index.html',
    domain: 'pulse-gms.demo',
    number: '01',
    totalCount: '02',
    badge: 'In use by 6+ gyms in Gujarat, BLR & Pune',
    note: 'Interactive gym management dashboard with real-time operations data.',
    openLabel: 'Open full demo',
    desktopPoster: '',
    phonePoster: '',
    annotations: [
      { tag: 'Sidebar & Roles', desc: 'Owner dashboard, member rosters & front desk permissions' },
      { tag: 'Live Check-ins', desc: 'Real-time attendance logs & member flow tracking' },
      { tag: 'Revenue & Billing', desc: 'Monthly collections, fee plans & automated renewal alerts' },
      { tag: 'Multi-Gym Sync', desc: 'Active operations across Gujarat, Bengaluru & Pune' }
    ]
  },
  buddydesk: {
    category: 'software',
    name: 'BuddyDesk',
    kind: 'Startup CRM · 3 Startups',
    url: '/demos/buddydesk/index.html',
    domain: 'buddydesk.demo',
    number: '02',
    totalCount: '02',
    badge: 'In active use by 3 startups for daily operations',
    note: 'Interactive startup CRM dashboard with task boards & team directory.',
    openLabel: 'Open full demo',
    desktopPoster: '',
    phonePoster: '',
    annotations: [
      { tag: 'Workspace Hub', desc: 'Unified navigation for task boards, directory, chat & docs' },
      { tag: 'Sprint Kanban', desc: 'Interactive task cards, priority flags & delivery progress' },
      { tag: 'Team Directory', desc: 'Live presence tracking & cross-functional workspace roster' },
      { tag: 'Zero-Cost Stack', desc: 'Free-tier cloud architecture with Supabase, Vercel & AI' }
    ]
  }
};

export default function AgencyWorkSection() {
  const [activeCategory, setActiveCategory] = useState<'websites' | 'software'>('websites');
  const [selectedKey, setSelectedKey] = useState<string>('bnps');
  const [device, setDevice] = useState<'desktop' | 'phone'>('desktop');
  const [frameReady, setFrameReady] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const projectKeys = Object.keys(AGENCY_PROJECTS).filter(
    (k) => AGENCY_PROJECTS[k].category === activeCategory
  );

  const activeProject = AGENCY_PROJECTS[selectedKey] || AGENCY_PROJECTS.bnps;
  const isSoftware = activeProject.category === 'software';

  // Handle stage mouse spotlight
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
    stageRef.current.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
    stageRef.current.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
  };

  const handleCategoryChange = (cat: 'websites' | 'software') => {
    setActiveCategory(cat);
    const firstKey = Object.keys(AGENCY_PROJECTS).find((k) => AGENCY_PROJECTS[k].category === cat);
    if (firstKey) {
      setSelectedKey(firstKey);
      setFrameReady(false);
    }
  };

  const handleProjectChange = (k: string) => {
    setSelectedKey(k);
    setFrameReady(false);
  };

  return (
    <section className="work section-pad" id="work" aria-labelledby="work-title">
      <div className="section-marker">
        <span>04</span>
        <span>Selected Agency Work</span>
      </div>

      <div className="work-heading">
        <div className="work-heading-text">
          <h2 id="work-title">Engineered to scale.</h2>
          <div className="work-category-nav" role="tablist">
            <button
              className={`work-cat-btn ${activeCategory === 'websites' ? 'is-active' : ''}`}
              onClick={() => handleCategoryChange('websites')}
              type="button"
            >
              <span>Websites</span>
              <span className="work-cat-badge">03</span>
            </button>
            <button
              className={`work-cat-btn ${activeCategory === 'software' ? 'is-active' : ''}`}
              onClick={() => handleCategoryChange('software')}
              type="button"
            >
              <span>Software & Systems</span>
              <span className="work-cat-badge">02</span>
            </button>
          </div>
        </div>
        <p id="work-category-desc">
          {activeCategory === 'websites'
            ? 'Production client platforms engineered for authority, conversion, and performance.'
            : 'Operational systems and multi-tenant platforms powering active companies.'}
        </p>
      </div>

      <div className="work-layout">
        <div className="work-projects" role="group" data-category={activeCategory}>
          {projectKeys.map((k) => {
            const p = AGENCY_PROJECTS[k];
            const active = selectedKey === k;
            return (
              <button
                key={k}
                className={`work-project ${active ? 'is-active' : ''}`}
                onClick={() => handleProjectChange(k)}
                type="button"
              >
                <span className="work-project-no">{p.number}</span>
                <span className="work-project-name">{p.name}</span>
                <span className="work-project-kind">{p.kind}</span>
                <span className="work-project-arrow" aria-hidden="true">↗</span>
              </button>
            );
          })}
        </div>

        <div className="work-preview">
          <div className="work-preview-bar">
            <div className="work-preview-meta">
              <span className="work-preview-label">
                <span className="work-live-dot" aria-hidden="true"></span>
                <span>{activeProject.name}</span>
                <span className="work-preview-count">
                  {activeProject.number} / {activeProject.totalCount}
                </span>
              </span>
              {activeProject.badge && (
                <span className="work-metric-badge">{activeProject.badge}</span>
              )}
            </div>

            <div className="work-device-toggle" role="group">
              <button
                type="button"
                className={device === 'desktop' ? 'is-active' : ''}
                onClick={() => setDevice('desktop')}
              >
                Desktop
              </button>
              <button
                type="button"
                className={device === 'phone' ? 'is-active' : ''}
                onClick={() => setDevice('phone')}
              >
                Phone
              </button>
            </div>
          </div>

          <div
            className="work-stage"
            data-device={device}
            ref={stageRef}
            onPointerMove={handlePointerMove}
          >
            {/* Left Annotations */}
            <aside className="work-annotations is-left" aria-hidden="true">
              {activeProject.annotations.slice(0, 2).map((a, i) => (
                <div key={i} className="work-annotation-card">
                  <div className="work-anno-pill">
                    <span className="work-anno-dot"></span>
                    <span className="work-anno-tag">{a.tag}</span>
                  </div>
                  <p className="work-anno-desc">{a.desc}</p>
                  <div className="work-doodle-line to-right">
                    <svg viewBox="0 0 52 20" fill="none">
                      <path
                        d={i === 0 ? 'M4 14 Q 26 18, 46 4' : 'M4 6 Q 26 2, 46 16'}
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeDasharray="3 3"
                      />
                      <path
                        d={i === 0 ? 'M40 2 L 48 4 L 44 10' : 'M40 18 L 48 16 L 44 10'}
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </aside>

            {/* Laptop Mockup */}
            {device === 'desktop' && (
              <div className="work-laptop" aria-label="Desktop preview">
                <div className="work-laptop-lid">
                  <span className="work-camera" aria-hidden="true"></span>
                  <div className="work-laptop-screen work-screen">
                    <iframe
                      className="work-frame"
                      src={activeProject.url}
                      title={`${activeProject.name} Desktop`}
                      loading="lazy"
                      onLoad={() => setFrameReady(true)}
                      style={{ opacity: isSoftware || frameReady ? 1 : 0 }}
                    />
                    {!isSoftware && activeProject.desktopPoster && (
                      <img
                        className="work-still"
                        src={activeProject.desktopPoster}
                        alt={`${activeProject.name} Desktop Still`}
                        style={{ opacity: frameReady ? 0 : 1 }}
                      />
                    )}
                  </div>
                </div>
                <div className="work-laptop-base" aria-hidden="true">
                  <span></span>
                </div>
              </div>
            )}

            {/* Phone Mockup */}
            {device === 'phone' && (
              <div className="work-phone" aria-label="Phone preview">
                <div className="work-phone-shell">
                  <div className="work-phone-screen">
                    <div className="work-phone-status" aria-hidden="true">
                      <span>9:41</span>
                      <span className="work-phone-island"></span>
                      <span className="work-phone-signal">●●● ▰</span>
                    </div>
                    <div className="work-browser-chrome" aria-hidden="true">
                      <span className="work-browser-lock">⌁</span>
                      <span className="work-browser-domain">{activeProject.domain}</span>
                      <span className="work-browser-more">···</span>
                    </div>
                    <div className="work-phone-viewport work-screen">
                      <iframe
                        className="work-frame"
                        src={activeProject.url}
                        title={`${activeProject.name} Phone`}
                        loading="lazy"
                        onLoad={() => setFrameReady(true)}
                        style={{ opacity: isSoftware || frameReady ? 1 : 0 }}
                      />
                      {!isSoftware && activeProject.phonePoster && (
                        <img
                          className="work-still"
                          src={activeProject.phonePoster}
                          alt={`${activeProject.name} Phone Still`}
                          style={{ opacity: frameReady ? 0 : 1 }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Annotations */}
            <aside className="work-annotations is-right" aria-hidden="true">
              {activeProject.annotations.slice(2, 4).map((a, i) => (
                <div key={i} className="work-annotation-card">
                  <div className="work-anno-pill">
                    <span className="work-anno-dot"></span>
                    <span className="work-anno-tag">{a.tag}</span>
                  </div>
                  <p className="work-anno-desc">{a.desc}</p>
                  <div className="work-doodle-line to-left">
                    <svg viewBox="0 0 52 20" fill="none">
                      <path
                        d={i === 0 ? 'M48 14 Q 26 18, 6 4' : 'M48 6 Q 26 2, 6 16'}
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeDasharray="3 3"
                      />
                      <path
                        d={i === 0 ? 'M12 2 L 4 4 L 8 10' : 'M12 18 L 4 16 L 8 10'}
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </aside>
          </div>

          <div className="work-preview-footer">
            <span>{activeProject.note}</span>
            <a href={activeProject.url} target="_blank" rel="noopener noreferrer">
              {activeProject.openLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
