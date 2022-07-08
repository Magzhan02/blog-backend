import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import UserSchema from '../models/User.js';

// регистрация и создание пользователя в MongoDB
export const register = async (request, resp) => {
  try {
    // если не пройдет валидацию
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return resp.status(400).json(errors.array());
    }

    // шифруем пароль
    const pass = request.body.password;
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(pass, salt);

    // создаем пользователя
    const doc = new UserSchema({
      email: request.body.email,
      passwordHash: passHash,
      userName: request.body.userName,
      avatar: request.body.avatar,
    });

    // сохраняем пользователя
    const user = await doc.save();

    // создаем jwt токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'jwtKey',
      {
        expiresIn: '30d',
      },
    );

    //возвращаем пользователя
    const { passwordHash, ...userData } = user._doc;
    resp.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: 'failed to register',
    });
  }
};

// авторизация
export const login = async (request, resp) => {
  try {
    //проверка email
    const user = await UserSchema.findOne({ email: request.body.email });

    if (!user) {
      return request.status(400).json({
        message: 'invalid login',
      });
    }

    //проверка password
    const validPass = await bcrypt.compare(request.body.password, user._doc.passwordHash);

    if (!validPass) {
      return request.status(400).json({
        message: 'invalid login or password',
      });
    }

    // создаем jwt токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'jwtKey',
      {
        expiresIn: '30d',
      },
    );

    //возвращаем пользователя
    const { passwordHash, ...userData } = user._doc;
    resp.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: 'failed authorization',
    });
  }
};

//получаем пользователя
export const getUser = async (request, resp) => {
  try {
    const user = await UserSchema.findById(request.userId);

    if (!user) {
      return resp.status(403).json({
        message: 'User is not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;
    resp.json(userData);
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: 'No access',
    });
  }
};
