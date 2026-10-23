const fs = require('fs');
const lines = fs.readFileSync('C:/Users/zediz/.gemini/antigravity/brain/0ea04ff5-678c-4f51-96c5-a50b073c0cdb/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');
for (const line of lines) {
  if (line.includes('write_to_file')) {
    const p = JSON.parse(line);
    if (p.tool_calls) {
      console.log(JSON.stringify(p.tool_calls[0], null, 2));
      break;
    }
  }
}
