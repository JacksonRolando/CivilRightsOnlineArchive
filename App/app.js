const express = require("express")
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path')
const MongoClient = require("mongodb").MongoClient
const multer = require('multer')

const FILE_DIR = "./public/data/uploads/"
global.FILE_DIR = FILE_DIR
const upload = multer({dest: FILE_DIR})

const {
    PORT = 8001,
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
const {adminLoginPage, adminLoginSubmit} = require('./routes/accounts')
const {inputFormPage, submitInputFile, chooseEventPage} = require('./routes/admin')

//defines requests by url
app.get('/', getHomePage)

app.get('/inputFile', inputFormPage)
//app.post('/inputFile', submitInputFile)

app.post('/chooseEvent', upload.single("fileImport"), chooseEventPage)


/*
app.get('/adminLogin', adminLoginPage)
app.post('/adminLogin', adminLoginSubmit)
*/


//Test Section
const {initialDbSetup} = require('./routes/testSetup.js')

//First time run on new server
app.get('/setup', initialDbSetup)

app.listen(PORT, () => console.log("Server running on port " + PORT))