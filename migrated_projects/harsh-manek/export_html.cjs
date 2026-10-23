const fs = require("fs");
const path = require("path");

const rawPath = "C:\\Users\\zediz\\.gemini\\antigravity\\brain\\f24ce421-e7e6-420f-8204-e95498fa886c\\.system_generated\\steps\\1254\\output.txt";
const renderedRaw = fs.readFileSync(rawPath, "utf8");

let html = "";
const fenceMatch = renderedRaw.match(/```json\s*([\s\S]*?)\s*```/);
if (fenceMatch) {
  try {
    html = JSON.parse(fenceMatch[1]);
  } catch (e) {
    console.error("Failed to JSON.parse fence content:", e.message);
  }
}

if (!html) {
  const htmlMatch = renderedRaw.match(/<html[\s\S]*<\/html>/i);
  if (htmlMatch) {
    html = htmlMatch[0];
  } else {
    html = renderedRaw;
  }
}

html = html.trim();

// Strip Vite dev-only scripts
html = html.replace(/<script type="module">[\s\S]*?injectIntoGlobalHook[\s\S]*?<\/script>/gi, "");
html = html.replace(/<script type="module" src="\/@vite\/client"><\/script>/gi, "");
html = html.replace(/<script type="module" src="\/src\/main\.tsx[^"]*"><\/script>/gi, "");

// Find built production CSS
const distAssets = fs.existsSync("dist/assets") ? fs.readdirSync("dist/assets") : [];
const cssFile = distAssets.find(f => f.endsWith(".css"));
let cssContent = "";
if (cssFile) {
  cssContent = fs.readFileSync(path.join("dist/assets", cssFile), "utf8");
}

// Inject production CSS if available
if (cssContent && !html.includes("/* PRODUCTION TAILWIND INLINE */")) {
  html = html.replace("</head>", `<style type="text/css">/* PRODUCTION TAILWIND INLINE */\n${cssContent}\n</style>\n</head>`);
}

// Convert local public image URLs to base64 so HTML is 100% self-contained offline
const imagesToEmbed = [
  { url: "/harsh_hero_2k.jpeg", file: "public/harsh_hero_2k.jpeg", mime: "image/jpeg" },
  { url: "/nilammanek.jpg", file: "public/nilammanek.jpg", mime: "image/jpeg" },
  { url: "/harshmanek.jpg", file: "public/harshmanek.jpg", mime: "image/jpeg" },
  { url: "/harsh_avatar.png", file: "public/harsh_avatar.png", mime: "image/png" },
  { url: "/harsh_nobg.png", file: "public/harsh_nobg.png", mime: "image/png" },
  { url: "/favicon.svg", file: "public/favicon.svg", mime: "image/svg+xml" },
];

for (const img of imagesToEmbed) {
  if (fs.existsSync(img.file)) {
    const b64 = fs.readFileSync(img.file).toString("base64");
    const dataUri = `data:${img.mime};base64,${b64}`;
    html = html.split(`src="${img.url}"`).join(`src="${dataUri}"`);
    html = html.split(`href="${img.url}"`).join(`href="${dataUri}"`);
    html = html.split(`content="${img.url}"`).join(`content="${dataUri}"`);
  }
}

// Ensure <!DOCTYPE html> is at the very beginning
if (!html.startsWith("<!DOCTYPE html>")) {
  html = "<!DOCTYPE html>\n" + html;
}

// Write to Downloads folder
const outPath = "C:\\Users\\zediz\\Downloads\\harshmanek_portfolio.html";
fs.writeFileSync(outPath, html, "utf8");
console.log("Successfully exported complete self-contained HTML to:", outPath);
console.log("File size:", (fs.statSync(outPath).size / 1024 / 1024).toFixed(2), "MB");

// Also export the clean build template to Downloads
const templatePath = "C:\\Users\\zediz\\Downloads\\harshmanek_template.html";
fs.copyFileSync("index.html", templatePath);
console.log("Exported clean template to:", templatePath);
