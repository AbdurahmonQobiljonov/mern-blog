import { body } from 'express-validator';

export const signUpValidator = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Min length password shoul be 6').isLength({ min: 6 }),
  body('fullName', 'Invalid fullName').isLength({ min: 2 }),
  body('avatarUrl', 'Invalid url addres').optional().isURL(),
];
