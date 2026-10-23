const fs = require('fs');

function updateCareers(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Replace fetchJobs in Careers.tsx
  const newFetchJobs = `  const fetchJobs = async () => {
    setLoading(true);
    try {
      let remoteJobs: any[] = [];
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          remoteJobs = data;
        }
      }

      const localJobs = getLocalJobs();
      // Combine remote and local jobs, deduplicating by id
      const map = new Map();
      [...remoteJobs, ...localJobs].forEach(j => {
        if (j && j.id && !map.has(j.id)) {
          // Check if active
          const isOpen = j.status === 'OPEN' || j.is_active === true || (!j.status && j.is_active !== false);
          if (isOpen) map.set(j.id, j);
        }
      });

      setJobs(Array.from(map.values()));
    } catch (err) {
      console.warn("Error loading jobs:", err);
      const localJobs = getLocalJobs().filter((j: any) => j.status === 'OPEN' || j.is_active === true || (!j.status && j.is_active !== false));
      setJobs(localJobs);
    } finally {
      setLoading(false);
    }
  };`;

  code = code.replace(/const fetchJobs = async \(\) => \{[\s\S]*?finally \{[\s\S]*?setLoading\(false\);[\s\S]*?\}[\s\S]*?\};/, newFetchJobs);

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Updated Careers:', filePath);
}

function updateJobsManager(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Replace fetchJobs in JobsManager
  const newFetchJobs = `  const fetchJobs = async () => {
    setLoading(true);
    try {
      let remoteJobs: any[] = [];
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          remoteJobs = data;
        }
      }

      const localJobs = getLocalJobs();
      const map = new Map();
      [...remoteJobs, ...localJobs].forEach(j => {
        if (j && j.id && !map.has(j.id)) {
          map.set(j.id, j);
        }
      });

      setJobs(Array.from(map.values()));
    } catch (err) {
      console.warn("Error fetching jobs in portal:", err);
      setJobs(getLocalJobs());
    } finally {
      setLoading(false);
    }
  };`;

  code = code.replace(/const fetchJobs = async \(\) => \{[\s\S]*?finally \{[\s\S]*?setLoading\(false\);[\s\S]*?\}[\s\S]*?\};/, newFetchJobs);

  // Replace handlePublish in JobsManager
  const newHandlePublish = `  const handlePublish = async () => {
    if (!formData.title || !formData.description) return alert("Title and Description are required.");
    setSaving(true);
    
    const newJob = {
      id: crypto.randomUUID(),
      title: formData.title,
      department: formData.department,
      type: formData.type,
      experience: formData.experience,
      location: formData.location,
      description: formData.description,
      requirements: [],
      status: 'OPEN',
      is_active: true,
      created_at: new Date().toISOString()
    };

    // Always save to local storage as instant backup
    const localJobs = getLocalJobs();
    const updatedLocal = [newJob, ...localJobs.filter((j: any) => j.id !== newJob.id)];
    localStorage.setItem('hm_mock_jobs', JSON.stringify(updatedLocal));

    try {
      const { error } = await supabase
        .from('jobs')
        .insert([newJob]);
        
      if (error) {
        console.warn("Supabase insert notice:", error);
      }
    } catch (err) {
      console.warn("Supabase insert failed, using local storage:", err);
    } finally {
      setJobs(prev => [newJob, ...prev.filter(j => j.id !== newJob.id)]);
      setSaving(false);
      setIsEditorOpen(false);
      setFormData({
        title: '',
        department: 'Audit & Assurance',
        type: 'Full-Time',
        experience: '0-2 Years',
        location: 'Rajkot, Gujarat',
        description: ''
      });
    }
  };`;

  code = code.replace(/const handlePublish = async \(\) => \{[\s\S]*?description: ''[\s\S]*?\}\);[\s\S]*?\}[\s\S]*?\};/, newHandlePublish);

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Updated JobsManager:', filePath);
}

updateCareers('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-portfolio/src/pages/Careers.tsx');
updateCareers('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-preview/src/pages/Careers.tsx');

updateJobsManager('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-portfolio/src/pages/portal/Jobs.tsx');
updateJobsManager('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-preview/src/pages/portal/Jobs.tsx');
