const path = require('path');
const fs = require('fs');

async function run() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    try {
      puppeteer = require('puppeteer-core');
    } catch (e2) {
      console.error("Neither puppeteer nor puppeteer-core found.");
      process.exit(1);
    }
  }

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const launchOptions = {
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  };

  if (fs.existsSync(chromePath)) {
    launchOptions.executablePath = chromePath;
  }

  console.log("Launching browser with options:", launchOptions.executablePath || "bundled chromium");
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  
  const htmlPath = path.resolve(__dirname, 'invoice_kadivar.html');
  console.log("Loading HTML from:", htmlPath);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  const pdfPath = path.resolve(__dirname, 'Invoice_Kadivar_Associates.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  console.log("SUCCESS: PDF created at", pdfPath);
  await browser.close();
}

run().catch(err => {
  console.error("Error generating PDF:", err);
  process.exit(1);
});
