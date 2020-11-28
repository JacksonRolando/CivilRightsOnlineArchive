const { query } = require("express")

module.exports = {
    inputFormPage : (req, res) => {
        res.render("inputFile")
    },
    chooseEventPage : (req, res) => {
        //takes in date from inputFile form and puts it into a Date object
        year = parseInt(req.body.year)
        month = parseInt(("0" + req.body.month).slice(-2))
        day = parseInt(("0" + req.body.day).slice(-2))
        fileDate = new Date(year, month - 1, day)

        req.body.year = year
        req.body.month = month
        req.body.day = day

        dbclient = global.dbclient
        dbclient.connect((err, db) => {
            if(err){
                console.log(err)
                db.close()
            } 
            else{
                var dbo = db.db("onlineArchive")
                //query = {date: fileDate}

                fileObj = {
                    title: req.body.title,
                    creator: req.body.creator,
                    description: req.body.description,
                    date: fileDate,
                    filePath: global.FILE_DIR + req.file
                }

                dbo.collection("files").insertOne(fileObj, (err, result) => {
                    if(err) {
                        console.log(err)
                        db.close()
                    }
                    else{
                        console.log("1 row inserted:")
                        console.log(result)

                        db.close()
                        res.redirect('/')

                        //TODO: Make picture save as jpg?, Save correct file path to database

                        /*dbo.collection("events").find({date: fileDate}).toArray((err, result) => {
                            if(err) {
                                console.log(err)
                                db.close()
                            }
                            else{
                                console.log(result)
                                events = result
                                db.close()
                                console.log(req.body)
                                console.log(events)
                                res.render("chooseEvent", {file : req.body, events : events})
                            }
                        })*/
                    }
                })
                    
            }
        })
    }
}