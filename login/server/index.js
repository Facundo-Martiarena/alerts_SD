require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const sensorRoutes = require("./routes/sensorRoutes");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const authenticate = require("./routes/auth_sensor");



const mongoose = require("mongoose")

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://mongodb:27017/alertas")

    .then(async () => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log('failed');
    })

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sensores", sensorRoutes);
app.use("/api/authenticate/sensor", authenticate);



const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
