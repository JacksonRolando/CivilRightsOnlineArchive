const express = require("express")
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path')
const MongoClient = require("mongodb").MongoClient

const {
    PORT = 8000,
    NODE_ENV = 'development'

} = process.env


app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.use(bodyParser.json()) //parse json data


//set database variables
global.dburl = "mongodb://localhost:27017/onlineArchive"
global.dbclient = new MongoClient(dburl, { useUnifiedTopology: true})


//Import javascript files
const {getHomePage} = require('./routes/index.js')

//defines requests by url
app.get('/', getHomePage)


//Test Section
const {adminDbSetup} = require('./routes/testSetup.js')

//First time run on new server
app.get('/setup', adminDbSetup)

app.listen(PORT, () => console.log("Server running on port " + PORT))