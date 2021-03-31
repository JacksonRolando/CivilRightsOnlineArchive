const { query } = require("express")
const { MongoClient, ObjectID } = require("mongodb")

module.exports = {
    inputFilePage: (req, res) => {
        res.render("inputFile")
    },

    submitInputFile: (req, res) => {
        
        fileDate = module.exports.parseReqDate(req)
        
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

    newEventPage: (req, res) => {
        if(typeof req.session.fileInProgress != 'undefined') {

            dateObj = new Date(req.session.fileInProgress.date)

            year = dateObj.getFullYear()
            month = dateObj.getMonth() + 1
            day = dateObj.getDay()

            res.render("newEvent", {year: year, month: month, day: day})
        } else {
            res.render("newEvent", {year: "", month: "", day: ""})
        }
    },

    submitNewEvent: (req, res) => {
        dateObj = module.exports.parseReqDate(req)
        eventObj = {
            title: req.body.eventTitle,
            description: req.body.eventDescription,
            date: dateObj.getTime(),
            location: req.body.location
        }
        module.exports.inputEvent(req, res, eventObj, (result) => {
            req.session.freshEvent = result.ops[0]
            destination = typeof req.session.fileInProgress != null ? "/chooseEvent" : "/"
            res.redirect(destination)
        })
    },

    fullSubmitFile: (req, res) => {
        file = req.session.fileInProgress
        dbFileObject = {
            file: file,
            eventID: req.body.event,
            filepath: global.FINAL_FILE_DIR + file.filename
        }

        module.exports.inputFile(req, res, dbFileObject, (result) => {
            const fs = require('fs')
            fs.rename(global.MIDDLE_FILE_DIR + file.filename,
                global.FINAL_FILE_DIR + file.filename, (err) => {
                    if(err) {
                        console.log(err)
                    } else {
                        res.redirect("/")
                    }
                })
        })
        //TODO: get eventID from req.body, upload file to database with in in progress path,
        //move file to upload path using filename, update database name to upload path
    },

    inputEvent: (req, res, eventObj, nextStep) => {
        module.exports.connectToDB((dbo, db) => {
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
        module.exports.connectToDB((dbo, db) => {
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

    parseReqDate: (req) => {
        year = parseInt(req.body.year)
        month = parseInt(("0" + req.body.month).slice(-2))
        day = parseInt(("0" + req.body.day).slice(-2))
        dateObj = new Date(year, month - 1, day)
        return dateObj
    },

    connectToDB: (nextStep) => {
        dbclient = new MongoClient(global.dburl, {useUnifiedTopology: true})
        dbclient.connect((err, db) => {
            if(err) {
                console.log(err)
                db.close()
            }
            else{
                dbo = db.db('onlineArchive')
                nextStep(dbo, db);
            }
        })
    }
}

