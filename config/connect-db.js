const mongoose = require("mongoose");
const colors = require("colors");
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB database connected '.bgGreen.white+mongoose.connection.host.bgGreen.white);
    } catch (err) {
        console.log('Connection error'.bgRed.white);
    }
};

module.exports = connectDB;