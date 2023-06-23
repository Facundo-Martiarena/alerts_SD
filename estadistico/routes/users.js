const express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');

const app = express();
const port = 4000;
const mongoUrl = 'mongodb://mongodb:27017';
const dbName = 'rabbitMQ';
const collectionName = 'Montevideo_alerta_presion';
const path = require('path');


app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/data', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find({ estado: 'alertado' }).toArray();

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
      { _id: String(id) },
      { $set: { estado: 'done' } }
    );
    client.close();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;