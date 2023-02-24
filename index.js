import bcrypt from 'bcrypt';
import express from 'express';
import Jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import UserSchema from './models/user.js';
import { validationResult } from 'express-validator';
import { signUpValidator } from './lib/validation.js';

mongoose
  .connect(
    'mongodb+srv://admin:11072005Aa@cluster0.smdnxm8.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((error) => console.log('DB Error', error));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello');
});

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: 'Неверный логин или пароль',
      });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.password);

    if (!isValidPassword) {
      return res.status(403).json({
        message: 'Неверный логин или пароль',
      });
    }
    const token = Jwt.sign(
      {
        _id: user._id,
      },
      'abu2002',
      {
        expiresIn: '30d',
      },
    );

    const { password: passwordHash, ...userData } = user._doc;

    res.status(200).json({
      userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', errorMessage: 'Не удалось авторизоватся' });
  }
});

app.post('/auth/sign-up', signUpValidator, async (req, res) => {
  const { password, email, fullName, avatarUrl } = req.body;
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(404).json(error.array());
    }

    const bcryptSalt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, bcryptSalt);

    const doc = new UserSchema({
      email,
      fullName,
      avatarUrl,
      password: hash,
    });

    const user = await doc.save();

    const token = Jwt.sign(
      {
        _id: user._id,
      },
      'abu2002',
      {
        expiresIn: '30d',
      },
    );

    const { password: passwordHash, ...userData } = user._doc;

    res.status(201).json({
      userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message, errorMessage: 'Не удалось создать ползователя' });
  }
});

app.listen(7777, (error) => {
  if (error) {
    console.log(error.message);
  }

  console.log('Server OK!');
});
