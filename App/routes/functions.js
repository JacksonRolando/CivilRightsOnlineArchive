const { query } = require("express")
const { MongoClient, ObjectID } = require("mongodb")

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
            }
            else{
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
    }
}