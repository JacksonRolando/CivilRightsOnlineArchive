const { query } = require("express")
const { MongoClient, ObjectID } = require("mongodb")
const {parseReqDate, connectToDB} = require("./functions")

module.exports = {
    inputFilePage: (req, res) => {
        fileInProgress = {
            title: "",
            fileType: "",
            description: "",
            creator: "",
            month: "",
            day: "",
            year: "",
            event: ""
        }
        if(typeof req.session.fileInProgress != 'undefined') {
            fileInProgress = req.session.fileInProgress
        }
        
        res.render("inputFile", fileInProgress)
    },

    newEventPage: (req, res) => {
        
        if(typeof req.session.fileInProgress != 'undefined') {

            month = req.session.fileInProgress.month
            day = req.session.fileInProgress.day
            year = req.session.fileInProgress.year

            res.render("newEvent", {year: year, month: month, day: day})
        } else {
            res.render("newEvent", {year: "", month: "", day: ""})
        }
    },

    submitNewEvent: (req, res) => {
        dateObj = parseReqDate(req)
        eventObj = {
            title: req.body.eventTitle,
            description: req.body.eventDescription,
            date: dateObj.getTime(),
            location: req.body.location
        }
        module.exports.insertEvent(req, res, eventObj, (result) => {
            destination = '/'
        
            if(typeof req.session.fileInProgress != 'undefined') {
                req.session.fileInProgress.event = result.ops[0]
                destination = '/inputFile'
            }

            res.redirect(destination)
        })
    },

    fullSubmitFile: (req, res) => {
        fileDate = parseReqDate(req)
        

        fileObj = {
            title: req.body.title,
            creator: req.body.creator,
            fileType: req.body.fileType,
            description: req.body.description,
            date: fileDate.getTime(),
            filename: req.file.filename,
            eventID: req.body.event,
            filepath: global.UPLOADS + req.file.filename
        }
        

        req.session.fileInProgress = undefined
        delete(req.session.fileInProgress)

        module.exports.inputFile(req, res, fileObj, (result) => {
            res.redirect('/')
        })
    },

    insertEvent: (req, res, eventObj, nextStep) => {
        connectToDB((dbo, db) => {
            dbo.collection("events").insertOne(eventObj, (err, result) => {
                if(err) {
                    console.log(err)
                    db.close()
                }
                else {
                    db.close()
                    nextStep(result)
                }
            })
        })
    },
    
    inputFile: (req, res, dbFileObject, nextStep) => {
        connectToDB((dbo, db) => {
            dbo.collection("files").insertOne(dbFileObject, (err, result) => {
                if(err) {
                    console.log(err)
                    db.close()
                }
                else {
                    db.close()
                    nextStep(result)
                }
            })
        })
    },

    saveFileInProgress: (req, res) => {
        req.session.fileInProgress = undefined
        delete(req.session.fileInProgress)
        inFile = req.body
        req.session.fileInProgress = {
            title: inFile.title,
            fileType: inFile.fileType,
            description: inFile.description,
            creator: inFile.creator,
            month: inFile.month,
            day: inFile.day,
            year: inFile.year,
            date: parseReqDate(req).getTime(),
            event: ""
        }
        res.send("yay")
    }

    /*
    submitInputFile: (req, res) => {
        
        fileDate = parseReqDate(req)
        
        fileObj = {
            title: req.body.title,
            creator: req.body.creator,
            fileType: req.body.fileType,
            description: req.body.description,
            date: fileDate.getTime(),
            filename: req.file.filename
        }

        req.session.fileInProgress = fileObj

        res.redirect('/chooseEvent')        
    },

    chooseEventPage: (req, res) => {
        if(typeof req.session.fileInProgress != 'undefined') {
            module.exports.connectToDB((dbo, db) => {
                dbo.collection("events").find({date: req.session.fileInProgress.date}).toArray((err, result) => {
                    if(err) {
                        console.log(err)
                        db.close()
                    }
                    else{
                        events = result
                        db.close()
                        freshEvent = typeof req.session.freshEvent != 'undefined' ? req.session.freshEvent : null
                        res.render("chooseEvent", {events: events, freshEvent: freshEvent})
                        req.session.freshEvent = 'undefined'
                    }
                })
            })
        } else {
            res.redirect('/')
        }
    },
    */
}

