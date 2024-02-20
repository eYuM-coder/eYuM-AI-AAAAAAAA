import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import mongoose from 'mongoose';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});


const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://nathaniel2007w:m0CcXJFziAnMmT5m@cluster0.lrfmdpq.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const messageSchema = new mongoose.Schema({
  messages: [
    {
      sender: String,
      timestamp: Date,
      content: String,
    }
  ]
});

const Message = mongoose.model('Message', messageSchema);

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from eYuM AI (This AI is now official and will be running for however long it will run for :D)',
  })
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-gpt3",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0
    });

    const newMessage = new Message({
      messages: [
        { sender: 'user', timestamp: new Date(), content: prompt },
        { sender: 'ai', timestamp: new Date(), content: response.data.choices[0].text },
      ],
    });

    await newMessage.save();

      res.status(200).send({
        bot: response.data.choices[0].text
      })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));

app.get('/loadMessages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({ error });
  }
});