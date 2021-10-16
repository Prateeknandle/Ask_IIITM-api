const dotenv = require("dotenv")
const mongoose = require('mongoose')
const express = require('express')
const app = express()
dotenv.config({path : './config.env'})
require('./db/connection')
app.use(express.json())
const User = require('./models/UserSchema')
app.use(require('./routes/auth'))



const PORT = process.env.PORT;



app.listen(PORT, ()=>{
    console.log(`Connected to PORT : ${PORT}`)
});