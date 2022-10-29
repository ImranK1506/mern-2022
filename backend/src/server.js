import express from 'express';
import 'dotenv/config';
import { db, connectToDb } from './db.js';
import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(
  fs.readFileSync('./credentials.json')
);

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// app.get(/^(?!\/api).+/, (req, res) => {
//   res.sendFile(path.join(__dirname, '../build/index.html'));
// });

// Express middleware
app.use(async (req, res, next) => {
  const { authtoken } = req.headers;

  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      return res.sendStatus(400);
    }
  }
  req.user = req.user || {};
  next();
});

// Get database from MongoDb
app.get('/articles/:name', async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const articleInfo = await db
    .collection('articles')
    .findOne({name})

  if (articleInfo) {
    const upvoteIds = articleInfo.upvoteIds || [];
    articleInfo.canUpvote = uid && !upvoteIds.includes(uid);
    res.json(articleInfo);
  } else {
    res.sendStatus(404);
  }
});

// Express middleware
app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
});

// Post updated upvotes
app.put('/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  // Initial article info
 const articleInfo =  await db
    .collection('articles')
    .findOne({name});

  if (articleInfo) {
    const upvoteIds = articleInfo.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if (canUpvote) {
      // Update votes
      await db
        .collection('articles')
        .updateOne({name}, {
          $inc: {upvotes: 1},
          $push: { upvoteIds: uid }
        });
    }
    // Get updated article info
    const updatedArticle = await db
      .collection('articles')
      .findOne({name});
    res.json(updatedArticle);
  } else {
    res.send(`Article does not exist`);
  }
});

// Update comments
app.post('/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email } = req.user;

  await db
    .collection('articles')
    .findOne({name})

  // Update comments
  await db
    .collection('articles')
    .updateOne({ name }, {
      $push: { comments: { userName: email, text }},
    });

  const article = await db
    .collection('articles')
    .findOne({name})

  if (article) {
    res.json(article);
  } else {
    res.send(`Article does not exist`);
  }
});

const PORT = process.env.PORT || 8000;

connectToDb(() => {
  console.log('Succesfully connected')
  app.listen(8000, () => {
    console.log('Listening to port', PORT);
  });
})
