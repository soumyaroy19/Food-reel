const mongoose = require('mongoose');

function connectDB() {
    const url = process.env.MONGO_URI;
    mongoose.connect(url)
        .then(() => {
            console.log('Connected to database')
        })
        .catch((err) => {
            console.log('Error connecting to database', err)
        })
}

module.exports = connectDB;

