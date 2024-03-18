import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';
import axios from 'axios';
dotenv.config();

const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from eYuM AI (This AI is now official and will be running for however long it will run for :D)',
  })
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await axios.post(
      openaiEndpoint,
      {
        model: 'gpt-3.5-turbo',
        messaages: [
          { role: 'user', content: prompt},
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

      res.status(200).send({
        bot: response.data.choices[0].message.content;
      })
  } catch (error) {
    console.log(error);
    
    res.status(500).send({ error });
  }
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));