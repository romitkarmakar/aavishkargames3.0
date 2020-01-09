require("dotenv").config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL);
var Schema = mongoose.Schema;

var configSchema = new Schema({
        type: String,
        value: Number
});

var Config = mongoose.model('Config', configSchema)

module.exports = Config