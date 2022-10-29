import { MongoClient, ServerApiVersion } from 'mongodb';

let db;

async function connectToDb(cb) {
  const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@fullstack-react.feefdqb.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1
    });

    db = client.db('my-blog');
    cb();
}

export { db, connectToDb };
