// src/index.ts

import express from 'express';
import { UserForm } from './type';

const app = express();
const port = 5000;

app.get('/send_images', (req, res) => {
  res.send('Hello, this is your Express backend with TypeScript!');
});

app.post('/submit', (req, res) => {
  const userInput: UserForm = req.body.userInput;
  res.send(`You entered: ${userInput}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});