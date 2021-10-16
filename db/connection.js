const mongoose = require('mongoose');
const DB = process.env.DATABASE;


mongoose.connect(DB,
    err => {
        if(err) throw err;
        console.log('connected to MongoDB')
    });