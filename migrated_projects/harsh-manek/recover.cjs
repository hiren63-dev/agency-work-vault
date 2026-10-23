const fs = require('fs');

try {
  const lines = fs.readFileSync('C:/Users/zediz/.gemini/antigravity/brain/0ea04ff5-678c-4f51-96c5-a50b073c0cdb/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');
  
  let recovered = false;
  
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (line.includes('write_to_file') && line.includes('App.tsx') && line.includes('CodeContent')) {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          if ((tc.name === 'default_api:write_to_file' || tc.name === 'write_to_file') && tc.args.TargetFile && tc.args.TargetFile.includes('App.tsx')) {
            fs.writeFileSync('src/App.tsx', tc.args.CodeContent);
            console.log('Successfully recovered App.tsx from transcript!');
            recovered = true;
            break;
          }
        }
      }
    }
    if (recovered) break;
  }
  
  if (!recovered) {
    console.log('Could not find write_to_file for App.tsx in transcript.');
  }
} catch (e) {
  console.error(e);
}
