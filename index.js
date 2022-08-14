import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';

import { register, login, getUser } from './controllers/UserController.js';
import {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
  editPost,
} from './controllers/PostController.js';

mongoose
  .connect('mongodb+srv://admin:888888@cluster0.hjgau.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => console.log('MongoDB Error', err));

const app = express();
app.use(cors()); // избавляемся от ошибок CORS

// получаем изображение
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload/', checkAuth, upload.single('image'), (request, resp) => {
  resp.json({
    url: `/uploads/${request.file.originalname}`,
  });
});

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// регистрация и создание пользователя в MongoDB
app.post('/auth/register', registerValidation, register);

// авторизация
app.post('/auth/login', loginValidation, login);

//получаем пользователя
app.get('/auth/me', checkAuth, getUser);

// получаем все статьи
app.get('/posts', getAllPosts);

//получаем статью по id
app.get('/posts/:id', getPost);

// создаем статью
app.post('/posts', checkAuth, postCreateValidation, createPost);

// удаляем статью
app.delete('/posts/:id', checkAuth, deletePost);

// редактируем статью
app.patch('/posts/:id', checkAuth, editPost);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server is Working!');
});
