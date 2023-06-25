const express = require("express");
const router = express.Router();
const Sensor = require("../models/sensor");
const fs = require('fs');
const { MongoClient } = require('mongodb');

const filePath = './routes/sensors.json';
const mongoURI = 'mongodb://mongodb:27017/alertas';
const collectionName = 'sensors';


// Ruta para obtener todos los sensores
router.get("/", async (req, res) => {
    try {
        const sensores = await Sensor.find();
        res.json(sensores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los sensores" });
    }
});

// Ruta para crear un nuevo sensor
router.post("/", async (req, res) => {
    const { sensorId } = req.body;
    const codigo = generarCodigoAleatorio();

    try {
        const nuevoSensor = new Sensor({ sensorId, codigo });
        await nuevoSensor.save();
        res.json(nuevoSensor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el sensor" });
    }
});

const { ObjectId } = require('mongodb');

async function insertDocuments() {
    try {
        await Sensor.deleteMany({});

        const fileData = fs.readFileSync(filePath, 'utf8');
        const documents = JSON.parse(fileData);

        const client = new MongoClient(mongoURI, { useUnifiedTopology: true });
        await client.connect();
        const db = client.db();

        for (const document of documents) {
            document._id = ObjectId(document._id);
            await db.collection(collectionName).insertOne(document);
        }

        await client.close();
        console.log('Documents successfully inserted.');
    } catch (error) {
        console.error('Error inserting documents:', error);
    }
}

insertDocuments();
module.exports = router;
