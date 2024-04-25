const mongoose = require('mongoose');


const schoolSchema = new mongoose.Schema({
    school: {type: String, required: true},
    schoolCode: {type: String, required: true},
    schoolAddress: {type: String, required: true},
    schoolPhoneNumber: {type: Number, required: true}
})


module.exports = mongoose.model('School', schoolSchema);