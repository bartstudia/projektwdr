const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upewnij się że folder uploads/lakes istnieje
const uploadDir = path.join(__dirname, '..', 'uploads', 'lakes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfiguracja storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unikalna nazwa: lake-timestamp-losowa_liczba.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'lake-' + uniqueSuffix + ext);
  }
});

// File filter - tylko obrazy
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Tylko pliki obrazów są dozwolone (jpg, jpeg, png, gif, webp)'));
  }
};

// Konfiguracja multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB maksymalnie
  },
  fileFilter: fileFilter
});

module.exports = upload;
