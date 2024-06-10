
const mongoose = require('mongoose');


const DataSchema = new mongoose.Schema({
    id:{ type: Number, required: true, unique: true},
    name: String,
    score: Number,
    age: Number,
    city: String,
    gender: String,
});

module.exports = mongoose.model('Data', DataSchema);





