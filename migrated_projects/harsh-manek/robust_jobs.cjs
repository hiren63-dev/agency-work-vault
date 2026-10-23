const fs = require('fs');

function fixCareers(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Ensure useState initializes with local jobs
  content = content.replace(
    /const \[jobs, setJobs\] = useState<any\[\]>\(\[\]\);/,
    `const [jobs, setJobs] = useState<any[]>(() => {
    try {
      const local = JSON.parse(localStorage.getItem('hm_mock_jobs') || '[]');
      return local.filter((j: any) => j.status === 'OPEN' || j.is_active === true || (!j.status && j.is_active !== false));
    } catch {
      return [];
    }
  });`
  );

  // Robust fetchJobs
  const fetchJobsCode = `  const fetchJobs = async () => {
    try {
      let remoteJobs: any[] = [];
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        remoteJobs = data;
      }

      const local = getLocalJobs();
      const map = new Map();

      // First add remote, then local
      [...remoteJobs, ...local].forEach((j: any) => {
        if (j && j.id && !map.has(j.id)) {
          const isOpen = j.status === 'OPEN' || j.is_active === true || (!j.status && j.is_active !== false);
          if (isOpen) {
            map.set(j.id, j);
          }
        }
      });

      setJobs(Array.from(map.values()));
    } catch (err) {
      console.warn("Fetch jobs fallback:", err);
      const local = getLocalJobs().filter((j: any) => j.status === 'OPEN' || j.is_active === true || (!j.status && j.is_active !== false));
      setJobs(local);
    } finally {
      setLoading(false);
    }
  };`;

  content = content.replace(/const fetchJobs = async \(\) => \{[\s\S]*?finally \{[\s\S]*?setLoading\(false\);[\s\S]*?\}[\s\S]*?\};/, fetchJobsCode);

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed Careers:', file);
}

function fixJobs(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Ensure useState initializes with local jobs
  content = content.replace(
    /const \[jobs, setJobs\] = useState<any\[\]>\(\[\]\);/,
    `const [jobs, setJobs] = useState<any[]>(() => getLocalJobs());`
  );

  // Robust fetchJobs in Jobs.tsx
  const fetchJobsCode = `  const fetchJobs = async () => {
    try {
      let remoteJobs: any[] = [];
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        remoteJobs = data;
      }

      const local = getLocalJobs();
      const map = new Map();

      [...remoteJobs, ...local].forEach((j: any) => {
        if (j && j.id && !map.has(j.id)) {
          map.set(j.id, j);
        }
      });

      setJobs(Array.from(map.values()));
    } catch (err) {
      console.warn("Portal fetch jobs fallback:", err);
      setJobs(getLocalJobs());
    } finally {
      setLoading(false);
    }
  };`;

  content = content.replace(/const fetchJobs = async \(\) => \{[\s\S]*?finally \{[\s\S]*?setLoading\(false\);[\s\S]*?\}[\s\S]*?\};/, fetchJobsCode);

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed Jobs:', file);
}

fixCareers('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-portfolio/src/pages/Careers.tsx');
fixCareers('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-preview/src/pages/Careers.tsx');

fixJobs('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-portfolio/src/pages/portal/Jobs.tsx');
fixJobs('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-preview/src/pages/portal/Jobs.tsx');
