const {documentsById, connectToDB} = require('./functions')

module.exports = {
    getHomePage: (req, res) => {
        username = ""
        isAdmin = false
        if(req.session.user){
            isAdmin = req.session.user.admin
            if(isAdmin) {
                username = " " + req.session.user.name
            }
        }
        res.render('index', {name: username, isAdmin: isAdmin})
    },

    loginPage: (req, res) => {
        res.render('login')
    },

    getViewFilePage: (req, res) => {
        if(req.params.id.length == 24) {
            documentsById("files", req.params.id, (files) => {
                if(files.length > 0) {

                    eventId = files[0].eventID

                    documentsById("events", eventId, (events) => {
                        if(events.length > 0) {

                            strEvent = events[0].title

                            d = new Date(files[0].date)
                            strDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()

                            res.render('viewFile', {
                                file: files[0], 
                                fileDir: global.VIEWFILEDIR,
                                strDate: strDate,
                                strEvent: strEvent,
                                eventId: eventId
                            })
                        } else {
                            res.redirect('/')
                        }
                    })

                } else {
                    res.redirect('/')
                }
            })
        } else {
            res.redirect('/')
        }
    },

    getViewEventPage: (req, res) => {
        documentsById("events", req.params.id, (events) => {
            if(events.length > 0) {

                d = new Date(events[0].date)
                strDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()

                res.render('viewEvent', {
                    event: events[0], 
                    fileDir: global.VIEWFILEDIR,
                    strDate: strDate
                })
            } else {
                res.redirect('/')
            }
        })
    },

    testViewAllEvents: (req, res) => {
        connectToDB((dbo, db) => {
            dbo.collection("events").find().toArray((err, result) => {
                if(err) {
                    db.close()
                    console.log(err)
                    res.redirect('/')
                } else {
                    db.close()
                    result.forEach(event => {
                        event.strId = event._id.valueOf()
                    });

                    message = req.session.errMessage ? req.session.errMessage : ""

                    req.session.errMessage = ""

                    res.render('testViewEvents', {
                        events : result, 
                        admin : req.session.user ? req.session.user.admin : false,
                        message : message
                    }) 
                }

            })
        })
    },

    viewEventsPage: (req, res) => {
        res.redirect('/testViewEvents')
    }
}