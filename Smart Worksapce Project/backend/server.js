import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Clerk Authentication Middleware
app.use(ClerkExpressWithAuth());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-workspace')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// OpenAI Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Models
const PageSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  userId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Page = mongoose.model('Page', PageSchema);

// Routes
app.post('/api/summarize', async (req, res) => {
  try {
    const { content } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes text into concise points.",
        },
        {
          role: "user",
          content: `Please summarize the following text:
${content}

Provide a concise summary in bullet points.
`,
        },
      ],
    });

    res.json({ summary: response.data.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

app.post('/api/generate-note', async (req, res) => {
  try {
    const { topic } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates structured notes.",
        },
        {
          role: "user",
          content: `Please create a structured note about:
${topic}

Format it with proper headings, subheadings, and bullet points.
`,
        },
      ],
    });

    res.json({ note: response.data.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to generate note' });
  }
});

app.post('/api/auto-tag', async (req, res) => {
  try {
    const { content } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates relevant tags for content.",
        },
        {
          role: "user",
          content: `Please generate relevant tags for this content:
${content}

Provide tags in an array format: ["tag1", "tag2", "tag3"]
`,
        },
      ],
    });

    const tags = JSON.parse(response.data.choices[0].message.content);
    res.json({ tags });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to generate tags' });
  }
});

app.post('/api/pages', async (req, res) => {
  try {
    const page = new Page(req.body);
    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/pages', async (req, res) => {
  try {
    const pages = await Page.find({ userId: req.auth.userId });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
