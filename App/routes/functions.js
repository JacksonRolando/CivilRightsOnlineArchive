const { MongoClient, ObjectId } = require("mongodb")
const fs = require('fs')

module.exports = {
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
            } else {
                dbo = db.db('onlineArchive')
                nextStep(dbo, db);
            }
        })
    },

    eventsByDate: (req, res) => {
        req.body = req.query
        dateObj = module.exports.parseReqDate(req)

        module.exports.connectToDB((dbo, db) => {
            dbo.collection("events").find({date: dateObj.getTime()}).toArray((err, result) => {
                if(err) {
                    console.log(err)
                    db.close()
                } else {
                    events = result
                    db.close()
                    res.send(events)
                }
            })
        })
    },

    documentsById: (collection, id, nextStep) => {
        module.exports.connectToDB((dbo, db) => {
            dbo.collection(collection).find({_id: ObjectId(id)}).toArray((err, result) => {
                if(err) {
                    console.log(err)
                    db.close()
                } else {
                    db.close()
                    nextStep(result)
                }
            })
        })
    },

    filesByEvent: (req, res) => {
        eventId = req.query.eventId.valueOf()
        module.exports.connectToDB((dbo, db) => {
            dbo.collection("files").find({eventID: eventId}).toArray((err, result) => {
                if(err) {
                    console.log(err)
                    db.close()
                } else {
                    db.close()
                    result.forEach(file => {
                        file.strId = file._id.valueOf()
                    })
                    filesObj = {
                        fileDir: global.VIEWFILEDIR,
                        files: result
                    }
                    res.send(filesObj)
                    res.end()
                }
            })
        })
    },

    checkEvent: (req, res, next) => {
        if(req.body.event != 'newEvent') {
            next()
        } else {
            try {
                fs.unlinkSync(global.UPLOADS + req.file.filename)
            } catch(err) {
                console.log(err);
            }
            res.send("Nothing Happened")
        }
    }
    
}