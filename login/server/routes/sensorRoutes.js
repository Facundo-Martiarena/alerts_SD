const express = require("express");
const router = express.Router();
const Sensor = require("../models/sensor");

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

// Función para generar un código aleatorio
const generarCodigoAleatorio = () => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codigo = "";

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres.charAt(randomIndex);
    }

    return codigo;
};

const llenarBaseDeDatos = async () => {
    try {
        // Eliminar todos los datos existentes en la colección de sensores
        await Sensor.deleteMany({});

        // Crear 50 datos aleatorios de sensores
        const datosSensores = [];
        for (let i = 0; i < 50; i++) {
            const sensorId = i + 1;
            const codigo = generarCodigoAleatorio();
            datosSensores.push({ sensorId, codigo });
        }

        // Insertar los datos aleatorios en la base de datos
        await Sensor.insertMany(datosSensores);

        console.log("Base de datos llenada exitosamente.");
    } catch (error) {
        console.error("Error al llenar la base de datos:", error);
    }
};




module.exports = llenarBaseDeDatos();
module.exports = router;
