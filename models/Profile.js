require("dotenv").config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL);
var Schema = mongoose.Schema;

var profileSchema = new Schema({
        email: String,
        coins: Number
});

var Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile