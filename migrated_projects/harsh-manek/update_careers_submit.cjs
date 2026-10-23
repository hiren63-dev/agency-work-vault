const fs = require('fs');

function updateCareersSubmit(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  const oldBlock = `      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filename);
        resumeUrl = urlData?.publicUrl ?? '';
      }`;

  const newBlock = `      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filename);
        resumeUrl = urlData?.publicUrl ?? '';
      }

      // Fail-safe backup: If storage upload returned empty or bucket not created, convert file to data URL
      if (!resumeUrl && resumeFile) {
        resumeUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(resumeFile);
        });
      }`;

  if (!code.includes('Fail-safe backup:')) {
    code = code.replace(oldBlock, newBlock);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Updated Careers submit in:', filePath);
  }
}

updateCareersSubmit('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-portfolio/src/pages/Careers.tsx');
updateCareersSubmit('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-preview/src/pages/Careers.tsx');
