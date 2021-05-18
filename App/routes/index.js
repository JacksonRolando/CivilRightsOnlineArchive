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
        //TODO: do we need to protect against someone manually going to login, even when they're logged in?
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
                    event: (events.length > 0) ? events[0] : null,
                    fileDir: global.VIEWFILEDIR,
                    strDate: strDate
                })
            } else {
                //TODO: we should probably have a pop up informing the user instead of quietly eating the error
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
    },

    viewAdminPanel: (req, res) => {
        if(req.session.user.admin) {
            res.render('adminPanel')
        } else {
            res.redirect('/');
        }
    }
}