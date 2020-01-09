require("dotenv").config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL);
var Schema = mongoose.Schema;

var sevenupSchema = new Schema({
        email: String,
        timestamp: { type: Date, default: Date.now },
        status: String
});

var Sevenup = mongoose.model('Sevenup', sevenupSchema)

module.exports = Sevenup