//TODO: dev constant, remove before v.1.0 release
const ENABLE_BOOTSTRAP = true

const express = require("express")
const session = require('express-session')
const path = require('path')
const MongoClient = require("mongodb").MongoClient
const multer = require('multer')
const fs = require('fs')

global.saltRounds = 10

if(ENABLE_BOOTSTRAP) {
    //magic smoke, don't let it out
    var jsdom = require("jsdom")
    const { JSDOM } = jsdom
    const { window } = new JSDOM()
    const { document } = (new JSDOM('')).window
    global.document = document
    var $ = jQuery = require('jquery')(window)
}

const UPLOADS = "./public/data/uploads/"
global.UPLOADS = UPLOADS

if(!fs.existsSync(UPLOADS)) {
    fs.mkdirSync(UPLOADS)
}

const viewFileDir = "/data/uploads/"
global.VIEWFILEDIR = viewFileDir

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS)
    },
    filename: (req, file, cb) => [
        cb(null, Date.now() + path.extname(file.originalname))
    ]
})
const upload = multer({storage: storage})

const TWO_HOURS = 1000 * 60 * 60 * 2
const {
    PORT = 8001,
    NODE_ENV = 'development',

    SESS_SECRET = "This is a secret key to encrypt the session", //TODO: change this and move to hidden .env file
                                                                //       NOT publicly in version control
    SESS_NAME = 'sid',
    SESS_LIFETIME = TWO_HOURS
} = process.env

global.name = SESS_NAME

const IN_PROD = NODE_ENV === 'production'

//set up app
app = express()
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.use(express.json()) //parse json data
app.use(express.static(__dirname+'/public'))

//set up bootstrap
if(ENABLE_BOOTSTRAP) {
    app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
    app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
}

//set up session
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}))

//set database variables
global.dburl = "mongodb://localhost:27017/onlineArchive"
global.dbclient = new MongoClient(dburl, { useUnifiedTopology: true})


//Import javascript files
const {getHomePage, getViewFilePage, getViewEventPage, testViewAllEvents, viewEventsPage, loginPage} = require('./routes/index.js')
const {inputFilePage, saveFileInProgress, newEventPage, submitNewEvent, fullSubmitFile, deleteEvent} = require('./routes/admin')
const {eventsByDate, filesByEvent, checkEvent} = require("./routes/functions")
const {login, saveTestAccount, redirectFromLogin, redirectHome, logout} = require("./routes/authentication.js")
const {searchEvents} = require("./routes/search")

//defines requests by url
app.get('/', getHomePage)

app.get('/inputFile', redirectHome, inputFilePage)

app.post('/fullSubmitFile', redirectHome, upload.single("file"), checkEvent, fullSubmitFile)

app.get('/newEvent', redirectHome, newEventPage)
app.post('/newEvent', redirectHome, submitNewEvent)

app.post('/saveFileInProgress', redirectHome, saveFileInProgress)

app.get('/eventsByDate', eventsByDate)
app.get('/filesByEvent', filesByEvent)

app.get('/viewFile/:id', getViewFilePage)

app.get('/viewEvent/:id', getViewEventPage)

app.get('/viewEvents', viewEventsPage)

app.get('/testViewEvents', testViewAllEvents)
app.get('/searchEvents', searchEvents)

app.get('/login', redirectFromLogin, loginPage)
app.post('/authenticate', redirectFromLogin, login)

app.get('/deleteEvent/:id', redirectHome, deleteEvent)

app.get('/logout', logout)

app.get('/setTestUser', saveTestAccount)



/*
app.get('/testPage', (req, res) => {
    res.render("test", {toBeChanged : "change this"})
})

app.get('/adminLogin', adminLoginPage)
app.post('/adminLogin', adminLoginSubmit)
*/


//Test Section
const {initialDbSetup} = require('./routes/testSetup.js')

//First time run on new server
//app.get('/setup', initialDbSetup)



//Test Section
const {adminDbSetup} = require('./routes/testSetup.js')
const { nextTick } = require("process")


//First time run on new server
app.get('/setupDb', adminDbSetup)
const {indexSetup} = require('./routes/indexSetup')
indexSetup()

app.listen(PORT, () => console.log("Server running on port " + PORT))

/**
 * TODO:
 * Create public/data folders if they don't exist
 * Make choosing event update when date is changed
 */
