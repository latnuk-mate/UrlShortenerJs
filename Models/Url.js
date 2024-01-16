const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    urlId: String,
    secretkey: String,
    shortUrl: String,
    longUrl: String,
    click: {type: Number, default : 0},
    date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('NewUrl', UrlSchema);