// src/index.ts

import express from 'express';
import { UserForm } from './type';
import { chatCompletion, vision } from './openai'

const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const multer = require('multer'); // Middleware for handling `multipart/form-data`

// Set up multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.json());
const port = 5000;

app.get('/send_images', (req, res) => {
  res.send('Hello, this is your Express backend with TypeScript!');
});

// Handle the image upload
app.post('/upload', async (req, res) => {
  try {
    const files = await new Promise<Express.Multer.File[]>((resolve, reject) => {
      upload.array('images')(req, res, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(req.files as Express.Multer.File[]);
        }
      });
    });

    if (!files || files.length === 0) {
      return res.status(400).send('No files uploaded.');
    }

    type resultType={
      name: string,
      base64: string
    }
    // Convert each file to base64
    const base64Strings: resultType[] = files.map((file) => {
      console.log(file)
      return {"name":file.originalname, "base64":file.buffer.toString('base64')};
    });

    const resultPromises = base64Strings.map(async (item: resultType) => {
      return {"name":item.name, "text":await vision(item.base64)};
    });

    // Wait for all async operations to complete
    const results = await Promise.all(resultPromises);

    // Handle the results or do something with them
    console.log('Results:', results);

    // Send the response once all async operations are complete
    res.status(200).json({
      message: 'Images uploaded successfully.',
      results: results,
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/submit', (req, res) => {
  console.log(req.body)
  const imageList = req.body["image_list"]
  //const result = imageList.map((base64Img: string) => vision(base64Img))
  console.log(imageList)

  res.json(imageList);

});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});