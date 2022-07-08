import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  body('userName').isLength({ min: 3 }),
  body('avatar').optional().isURL(),
];

export const loginValidation = [body('email').isEmail(), body('password').isLength({ min: 5 })];

export const postCreateValidation = [
  body('title').isLength({ min: 3 }).isString(),
  body('text').isLength({ min: 5 }).isString(),
  body('tags').optional().isString(),
  body('image').optional().isString(),
];
