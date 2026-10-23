const work = document.querySelector('#work');

if (work) {
  const projects = {
    // Websites
    bnps: {
      category: 'websites',
      name: 'BNPS',
      url: 'https://bnps.vercel.app/',
      domain: 'bnps.vercel.app',
      number: '01',
      totalCount: '03',
      badge: '',
      note: 'Scroll inside the preview, or visit the full site.',
      openLabel: 'Visit live site'
    },
    harsh: {
      category: 'websites',
      name: 'Harsh Manek',
      url: 'https://harshmanek.com/',
      domain: 'harshmanek.com',
      number: '02',
      totalCount: '03',
      badge: '',
      note: 'Scroll inside the preview, or visit the full site.',
      openLabel: 'Visit live site'
    },
    kadivar: {
      category: 'websites',
      name: 'Kadivar',
      url: 'https://kadivar-redesign.vercel.app/',
      domain: 'kadivar-redesign.vercel.app',
      number: '03',
      totalCount: '03',
      badge: '',
      note: 'Scroll inside the preview, or visit the full site.',
      openLabel: 'Visit live site'
    },
    // Software & Systems
    pulse: {
      category: 'software',
      name: 'Pulse Studio',
      url: './demos/pulse/index.html',
      domain: 'pulse-gms.demo',
      number: '01',
      totalCount: '02',
      badge: 'In use by 6+ gyms in Gujarat, BLR & Pune',
      note: 'Interactive gym management dashboard with real-time operations data.',
      openLabel: 'Open full demo'
    },
    buddydesk: {
      category: 'software',
      name: 'BuddyDesk',
      url: './demos/buddydesk/index.html',
      domain: 'buddydesk.demo',
      number: '02',
      totalCount: '02',
      badge: 'In active use by 3 startups for daily operations',
      note: 'Interactive startup CRM dashboard with task boards & team directory.',
      openLabel: 'Open full demo'
    }
  };

  const annotations = {
    pulse: [
      { tag: 'Sidebar & Roles', desc: 'Owner dashboard, member rosters & front desk permissions' },
      { tag: 'Live Check-ins', desc: 'Real-time attendance logs & member flow tracking' },
      { tag: 'Revenue & Billing', desc: 'Monthly collections, fee plans & automated renewal alerts' },
      { tag: 'Multi-Gym Sync', desc: 'Active operations across Gujarat, Bengaluru & Pune' }
    ],
    buddydesk: [
      { tag: 'Workspace Hub', desc: 'Unified navigation for task boards, directory, chat & docs' },
      { tag: 'Sprint Kanban', desc: 'Interactive task cards, priority flags & delivery progress' },
      { tag: 'Team Directory', desc: 'Live presence tracking & cross-functional workspace roster' },
      { tag: 'Zero-Cost Stack', desc: 'Free-tier cloud architecture with Supabase, Vercel & AI' }
    ],
    bnps: [
      { tag: 'Editorial Structure', desc: 'Clean legal & tax practice navigation with zero friction' },
      { tag: 'Responsive Layout', desc: 'Dynamic typographic scale tested from mobile to ultrawide' },
      { tag: 'Intake Architecture', desc: 'Direct corporate inquiry flows built for fast conversion' },
      { tag: 'Native Delivery', desc: 'Zero runtime bundle weight with sub-second page delivery' }
    ],
    harsh: [
      { tag: 'Monochrome Tension', desc: 'High-contrast typography with deliberate architectural spacing' },
      { tag: 'Practice Divisions', desc: 'Structured practice divisions for clients and founders' },
      { tag: 'Consultation Flow', desc: 'Friction-free intake form with direct calendar booking' },
      { tag: 'Kinetic Motion', desc: 'Subtle scroll-anchored micro-interactions and reveals' }
    ],
    kadivar: [
      { tag: 'Brand Identity', desc: 'Modernized aesthetic balance for architectural engineering' },
      { tag: 'Project Showcase', desc: 'High-contrast portfolio grid with interactive previews' },
      { tag: 'Direct Inquiries', desc: 'One-click contact anchors with copyable email triggers' },
      { tag: 'Optimized Assets', desc: 'Lightweight responsive webp imagery with sub-second load' }
    ]
  };

  const categoryDescriptions = {
    websites: 'Three client websites, three different briefs. Explore the live pages at desktop or phone size.',
    software: 'Operational systems and startup management software. Fully interactive product demos with sample data.'
  };

  const catButtons = [...work.querySelectorAll('[data-work-category]')];
  const projectButtons = [...work.querySelectorAll('[data-work-project]')];
  const deviceButtons = [...work.querySelectorAll('[data-work-device]')];
  const stage = work.querySelector('.work-stage');
  const laptop = work.querySelector('.work-laptop');
  const phone = work.querySelector('.work-phone');
  const devices = { desktop: laptop, phone };
  const frames = { desktop: laptop.querySelector('iframe'), phone: phone.querySelector('iframe') };
  const screens = { desktop: laptop.querySelector('.work-screen'), phone: phone.querySelector('.work-screen') };

  let activeCategory = 'websites';
  let selectedProject = 'bnps';
  let selectedDevice = matchMedia('(max-width: 900px)').matches ? 'phone' : 'desktop';
  let deviceChosenByUser = false;

  // Interactive mouse spotlight on stage canvas
  if (stage) {
    stage.addEventListener('pointermove', event => {
      const r = stage.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((event.clientX - r.left) / r.width) * 100));
      const y = Math.max(0, Math.min(100, ((event.clientY - r.top) / r.height) * 100));
      stage.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
      stage.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
    });
  }

  const gutterProbe = document.createElement('div');
  gutterProbe.style.cssText = 'position:absolute;left:-9999px;width:100px;height:100px;overflow:scroll;visibility:hidden';
  document.body.append(gutterProbe);
  const scrollbarGutter = Math.max(16, gutterProbe.offsetWidth - gutterProbe.clientWidth);
  gutterProbe.remove();

  function posterPath(project, device) {
    const suffix = device === 'phone' ? 'phone' : 'desktop';
    return `./assets/work/${project}-${suffix}.webp`;
  }

  function revealLiveFrame(device, projectKey, delay = 0) {
    const frame = frames[device];
    if (frame.dataset.ready !== 'true') return;
    setTimeout(() => {
      if (selectedProject !== projectKey || selectedDevice !== device) return;
      frame.style.opacity = '1';
      const still = devices[device].querySelector('.work-still');
      if (still) still.style.opacity = '0';
    }, delay);
  }

  for (const [device, frame] of Object.entries(frames)) {
    frame.addEventListener('load', () => {
      frame.dataset.ready = 'true';
      revealLiveFrame(device, frame.dataset.project, 150);
    });
  }

  function fitFrames() {
    for (const [device, screen] of Object.entries(screens)) {
      const virtualWidth = device === 'phone' ? 390 : 1440;
      const scale = screen.clientWidth / virtualWidth;
      if (!scale) continue;
      screen.style.setProperty('--work-frame-scale', String(scale));
      screen.style.setProperty('--work-scrollbar-crop', `${scrollbarGutter * scale}px`);
      frames[device].style.width = `${virtualWidth + scrollbarGutter}px`;
      frames[device].style.height = `${Math.ceil(screen.clientHeight / scale)}px`;
    }
  }

  function showProject() {
    const project = projects[selectedProject];
    if (!project) return;

    projectButtons.forEach(button => {
      const active = button.dataset.workProject === selectedProject;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    const nameEl = work.querySelector('#work-preview-name');
    if (nameEl) nameEl.textContent = project.name;

    const countEl = work.querySelector('#work-preview-count');
    if (countEl) countEl.textContent = `${project.number} / ${project.totalCount}`;

    const domainEl = work.querySelector('#work-browser-domain');
    if (domainEl) domainEl.textContent = project.domain;

    const openSiteLink = work.querySelector('#work-open-site');
    if (openSiteLink) {
      openSiteLink.href = project.url;
      openSiteLink.setAttribute('aria-label', `${project.openLabel} for ${project.name}`);
      openSiteLink.innerHTML = `${project.openLabel} <span aria-hidden="true">↗</span>`;
    }

    const noteEl = work.querySelector('#work-preview-note');
    if (noteEl) noteEl.textContent = project.note;

    const metricBadge = work.querySelector('#work-metric-badge');
    if (metricBadge) {
      if (project.badge) {
        metricBadge.textContent = project.badge;
        metricBadge.hidden = false;
      } else {
        metricBadge.hidden = true;
      }
    }

    // Update doodle annotations
    const annoList = annotations[selectedProject] || annotations.pulse;
    for (let i = 0; i < 4; i++) {
      const tagEl = work.querySelector(`#work-anno-tag-${i + 1}`);
      const descEl = work.querySelector(`#work-anno-desc-${i + 1}`);
      if (tagEl && annoList[i]) tagEl.textContent = annoList[i].tag;
      if (descEl && annoList[i]) descEl.textContent = annoList[i].desc;
    }

    for (const [device, element] of Object.entries(devices)) {
      const frame = frames[device];
      const still = element.querySelector('.work-still');
      const isSoftware = project.category === 'software';

      if (isSoftware) {
        if (still) {
          still.hidden = true;
          still.style.opacity = '0';
        }
        frame.hidden = false;
        frame.title = `${project.name} ${device === 'phone' ? 'phone' : 'desktop'} interactive demo`;
        if (frame.dataset.project !== selectedProject) {
          frame.dataset.project = selectedProject;
          frame.dataset.ready = 'false';
          frame.src = project.url;
        } else {
          frame.style.opacity = '1';
        }
      } else {
        if (still) {
          still.hidden = false;
          still.src = posterPath(selectedProject, device);
          still.alt = `${project.name} ${device === 'phone' ? 'phone' : 'desktop'} preview`;
          still.style.opacity = '1';
          still.onerror = () => {
            still.hidden = true;
            frame.style.opacity = '1';
          };
        }
        frame.hidden = false;
        frame.style.opacity = '0';
        frame.title = `${project.name} ${device === 'phone' ? 'phone' : 'desktop'} preview`;
        if (device === selectedDevice) {
          if (frame.dataset.project !== selectedProject) {
            frame.dataset.project = selectedProject;
            frame.dataset.ready = 'false';
            frame.src = project.url;
          } else {
            revealLiveFrame(device, selectedProject);
          }
        }
      }
    }
    requestAnimationFrame(fitFrames);
  }

  function setupSlidingPill(container, getActiveBtn) {
    if (!container) return { update: () => {} };

    let indicator = container.querySelector('.work-pill-indicator');
    if (!indicator) {
      indicator = document.createElement('span');
      indicator.className = 'work-pill-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      container.prepend(indicator);
    }

    let initialized = false;

    function update(immediate = false) {
      const active = getActiveBtn();
      if (!active) {
        indicator.style.opacity = '0';
        return;
      }

      const cRect = container.getBoundingClientRect();
      const aRect = active.getBoundingClientRect();
      if (aRect.width === 0 || aRect.height === 0) return;

      const left = aRect.left - cRect.left - container.clientLeft;
      const top = aRect.top - cRect.top - container.clientTop;
      const width = aRect.width;
      const height = aRect.height;

      if (immediate || !initialized) {
        indicator.style.transition = 'none';
        indicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        indicator.style.width = `${width}px`;
        indicator.style.height = `${height}px`;
        container.classList.add('is-ready');
        indicator.offsetHeight;
        indicator.style.transition = '';
        initialized = true;
      } else {
        container.classList.add('is-ready');
        indicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        indicator.style.width = `${width}px`;
        indicator.style.height = `${height}px`;
      }
    }

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(() => update(true)).observe(container);
    }
    window.addEventListener('resize', () => update(true), { passive: true });
    if (document.fonts) document.fonts.ready.then(() => update(true));
    requestAnimationFrame(() => update(true));

    return { update };
  }

  const categoryNav = work.querySelector('.work-category-nav');
  const catPill = setupSlidingPill(categoryNav, () => work.querySelector('.work-cat-btn.is-active'));

  const deviceToggle = work.querySelector('.work-device-toggle');
  const devicePill = setupSlidingPill(deviceToggle, () => work.querySelector('.work-device-toggle button[aria-pressed="true"]'));

  function setCategory(category) {
    activeCategory = category;
    catButtons.forEach(btn => {
      const active = btn.dataset.workCategory === category;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    catPill.update();

    const descEl = work.querySelector('#work-category-desc');
    if (descEl && categoryDescriptions[category]) {
      descEl.textContent = categoryDescriptions[category];
    }

    const projectsContainer = work.querySelector('.work-projects');
    if (projectsContainer) {
      projectsContainer.dataset.category = category;
    }

    projectButtons.forEach(btn => {
      const match = btn.dataset.category === category;
      btn.hidden = !match;
    });

    const firstProject = Object.keys(projects).find(key => projects[key].category === category);
    if (firstProject) {
      selectedProject = firstProject;
      showProject();
    }
  }

  function showDevice(device, userChoice = true) {
    selectedDevice = device;
    if (userChoice) deviceChosenByUser = true;
    stage.dataset.device = device;
    for (const [name, element] of Object.entries(devices)) element.hidden = name !== device;
    deviceButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.workDevice === device)));
    devicePill.update();
    showProject();
  }

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => setCategory(btn.dataset.workCategory));
  });

  projectButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedProject = button.dataset.workProject;
      showProject();
    });
    button.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const visibleButtons = projectButtons.filter(b => !b.hidden);
      const curIndex = visibleButtons.indexOf(button);
      const nextIndex = (curIndex + (event.key === 'ArrowRight' ? 1 : -1) + visibleButtons.length) % visibleButtons.length;
      visibleButtons[nextIndex].focus();
    });
  });

  deviceButtons.forEach(button => button.addEventListener('click', () => showDevice(button.dataset.workDevice)));
  new ResizeObserver(fitFrames).observe(stage);
  addEventListener('resize', () => {
    if (!deviceChosenByUser) {
      const preferred = innerWidth <= 900 ? 'phone' : 'desktop';
      if (preferred !== selectedDevice) showDevice(preferred, false);
    }
    fitFrames();
  }, { passive: true });

  setCategory('websites');
  showDevice(selectedDevice, false);
}
