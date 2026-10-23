const { execSync } = require('child_process');

const token = "vcp_4g9DvLHE3LrKbfTD06gqCfA1uvpnJ7ILLvU55Scoz2cnJxoW6D1TYRyq";
const url = "https://doinjkpakrzumzchhffp.supabase.co";
const anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvaW5qa3Bha3J6dW16Y2hoZmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NDU1MDksImV4cCI6MjEwNTEyMTUwOX0.IZHUwp_O1AXtFGhq71QR7hDdbaoOY3chG8NgwUUkUF8";

function addEnv(name, value) {
  try {
    console.log(`Adding ${name}...`);
    execSync(`vercel env rm ${name} production --token ${token} --yes`, { stdio: 'ignore' });
  } catch (e) {}
  
  try {
    execSync(`vercel env add ${name} production --token ${token}`, {
      input: value,
      stdio: ['pipe', 'inherit', 'inherit']
    });
  } catch(e) {
    console.error(e.message);
  }
}

addEnv("VITE_SUPABASE_URL", url);
addEnv("VITE_SUPABASE_ANON_KEY", anon);
