const { query } = require("express")
const { MongoClient, ObjectID } = require("mongodb")

module.exports = {
    inputFormPage : (req, res) => {
        res.render("inputFile")
    },
    chooseEventPage : (req, res) => {
        //takes in date from inputFile form and puts it into a Date object
        fileDate = module.exports.parseReqDate(req)

        
        dbclient = new MongoClient(global.dburl, { useUnifiedTopology: true})
        dbclient.connect((err, db) => {
            if(err){
                console.log(err)
                db.close()
            } 
            else{
                var dbo = db.db("onlineArchive")

                //console.log("filename: " + req.file.filename)
                
                fileObj = {
                    title: req.body.title,
                    creator: req.body.creator,
                    fileType: req.body.fileType,
                    description: req.body.description,
                    date: fileDate,
                    filePath: global.FILE_DIR + req.file.filename
                }

                dbo.collection("files").insertOne(fileObj, (err, result) => {
                    if(err) {
                        console.log(err)
                        db.close()
                    }
                    else{
                        //console.log("1 row inserted into files collection")

                        req.session.fileId = result.insertedId
                        

                        dbo.collection("events").find({date: fileDate}).toArray((err, result) => {
                            if(err) {
                                console.log(err)
                                db.close()
                            }
                            else{
                                events = result
                                db.close()
                                res.render("chooseEvent", {year: year, month: month, day: day, events: events})
                            }
                        })
                    }
                })
                    
            }
        })
    },
    submitInputFile: (req, res) => {
        if(req.body.eventType == 'newEvent'){
            dbclient = new MongoClient(global.dburl, {useUnifiedTopology: true})
            dbclient.connect((err, db) => {
                if(err) {
                    console.log(err)
                    db.close()
                }
                else{
                    dbo = db.db('onlineArchive')

                    dateObj = module.exports.parseReqDate(req)

                    eventObj = {
                        title: req.body.eventTitle,
                        description: req.body.eventDescription,
                        date: dateObj,
                        location: req.body.location
                    }

                    dbo.collection("events").insertOne(eventObj, (err, result) => {
                        if(err) {
                            console.log(err)
                            db.close()
                        }
                        else {
                            eventId = result.insertedId

                            const ObjectId = require('mongodb').ObjectId

                            myQuery = {_id: new ObjectId(req.session.fileId)}
                            values = {$set: {eventId: new ObjectId(eventId), date: dateObj}}

                            dbo.collection("files").updateOne(myQuery, values, (err, result) => {
                                if(err) {
                                    console.log(err)
                                    db.close()
                                }
                                else{
                                    db.close()
                                    res.redirect("/")
                                }
                            })

                        }
                    })
                }
            })
        }
        if(req.body.eventType == 'existing'){
            eventId = req.body.event
            
            dbclient = new MongoClient(global.dburl, {useUnifiedTopology: true})
            dbclient.connect((err, db) => {
                if(err) {
                    console.log(err)
                    db.close()
                }
                else{
                    dbo = db.db('onlineArchive')

                    const ObjectId = require('mongodb').ObjectId

                    myQuery = {_id: new ObjectId(req.session.fileId)}
                    values = {$set: {eventId: new ObjectId(eventId)}}

                    dbo.collection('files').updateOne(myQuery, values, (err, result) => {
                        if(err) {
                            console.log(err)
                            db.close()
                        }
                        else{
                            db.close()
                            res.redirect("/")
                        }
                    })
                }
            })
        }
    },
    parseReqDate: (req) => {
        year = parseInt(req.body.year)
        month = parseInt(("0" + req.body.month).slice(-2))
        day = parseInt(("0" + req.body.day).slice(-2))
        dateObj = new Date(year, month - 1, day)
        return dateObj
    }
}