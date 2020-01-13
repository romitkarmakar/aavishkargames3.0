require("dotenv").config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL);
var Schema = mongoose.Schema;

var gameSchema = new Schema({
        email: String,
        timestamp: { type: Date, default: Date.now },
        status: String,
        amount: Number,
        type: String
});

var Game = mongoose.model('Game', gameSchema)

module.exports = Game