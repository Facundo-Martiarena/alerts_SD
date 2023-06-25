const express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');

const app = express();
const port = 4000;
const host = '0.0.0.0';
const mongoUrl = 'mongodb://mongodb:27017';
const dbName = 'rabbitMQ';
const collectionName = 'all';
const path = require('path');


app.use(express.json());

app.listen(port, host, () => {
  console.log(`Server listening on port ${port}`);
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/data', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const data = await collection.aggregate([
      { $sort: { sensor_id: 1, date: -1 } },
      {
        $group: {
          _id: '$sensor_id',
          lastElement: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$lastElement' } },
      { $match: { status: 'alerted' } }
    ]).toArray();

    client.close();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(
        { sensor_id: String(id) },
        { $set: { status: 'fixed' } }
    );
    client.close();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;