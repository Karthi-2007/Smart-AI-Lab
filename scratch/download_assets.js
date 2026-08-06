const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, '..', 'frontend', 'public', 'images', 'kce');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const assets = {
  'KCE-logo-color.png': 'https://kce.ac.in/images/kce/logo/KCE-logo-color.png',
  'b1.jpg': 'https://kce.ac.in/images/kce/home/banner/b1.jpg',
  'about-us1.webp': 'https://kce.ac.in/images/kce/home/about-us1.webp',
  'banner-img2.webp': 'https://kce.ac.in/images/kce/home/banner/banner-img2.webp',
  'banner-img3.webp': 'https://kce.ac.in/images/kce/home/banner/banner-img3.webp',
  'banner-img5.webp': 'https://kce.ac.in/images/kce/home/banner/banner-img5.webp'
};

function download(filename, url) {
  const file = fs.createWriteStream(path.join(dir, filename));
  https.get(url, { rejectUnauthorized: false }, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename} successfully (${fs.statSync(path.join(dir, filename)).size} bytes)`);
    });
  }).on('error', (err) => {
    fs.unlink(path.join(dir, filename), () => {});
    console.error(`Error downloading ${filename}:`, err.message);
  });
}

for (const [filename, url] of Object.entries(assets)) {
  download(filename, url);
}
