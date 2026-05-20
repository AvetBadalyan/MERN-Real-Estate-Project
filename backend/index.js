import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/auth-route.js';
import userRouter from './routes/user-route.js';
import listingRouter from './routes/listing-route.js';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { verifyToken } from './utils/verifyToken.js';
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
const imagesDir = path.join(__dirname, 'images');
const maxImageSizeMb = 5;
const port = process.env.PORT || 3000;
fs.mkdirSync(imagesDir, { recursive: true });

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    cb(null, `${Date.now()}_${safeName}`);
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: maxImageSizeMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/images', express.static(imagesDir));

app.post(
  '/api/upload',
  verifyToken,
  (req, res, next) => {
    uploadImage.single('image')(req, res, (error) => {
      if (error) {
        const message =
          error.code === 'LIMIT_FILE_SIZE'
            ? `Image must be less than ${maxImageSizeMb} MB`
            : error.message;
        return res.status(400).json({ success: false, message });
      }
      next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No image uploaded' });
    }

    return res.status(201).json({ imageUrl: `/images/${req.file.filename}` });
  },
);

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
