const express = require("express")
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path')

const {
    PORT = 8000,
    NODE_ENV = 'development'

} = process.env


app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.use(bodyParser.json()) //parse json data


//Import javascript files
const {getHomePage} = require('./routes/index.js')

//defines requests by url
app.get('/', getHomePage)


app.listen(PORT, () => console.log("Server running on port " + PORT))