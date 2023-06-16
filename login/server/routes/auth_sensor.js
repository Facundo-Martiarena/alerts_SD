const express = require("express");
const router = express.Router();
const Sensor = require("../models/sensor");

const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// Ruta para autenticar a los sensores
router.post("/", async (req, res) => {
    const { sensorId, codigo } = req.body;

    try {
        // Verifica si el sensor existe en la base de datos
        const sensor = await Sensor.findOne({ sensorId, codigo });

        if (!sensor) {
            return res.status(401).json({ message: "Sensor no autorizado" });
        }


        const token = sensor.generateAuthToken();
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al autenticar el sensor" });
    }
});

module.exports = router;