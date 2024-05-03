const mongoose = require('mongoose');

const config =  require('./config.js');


async function connectDB() {
    try {
        await mongoose.connect(config.MONGOOSE_URI);
        console.log("DB connected successfully!");
    }
    catch(err) {
        console.log(err.message);
        process.exit(1);
    }
}


module.exports = connectDB;