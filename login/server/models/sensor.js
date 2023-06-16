const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const sensorSchema = new mongoose.Schema({
    sensorId: {
        type: Number,
    },
    codigo: {
        type: String,
    },
});

sensorSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};
const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;
