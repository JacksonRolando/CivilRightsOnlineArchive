const {connectToDB} = require('./functions')
const bcrypt = require('bcrypt')

module.exports = {
    login : (req, res) => {
        sendData = {
            userAuthed: false,
        }
        connectToDB((dbo, db) => {
            dbo.collection("users").find({email: req.body.email}).toArray((err, result) => {
                db.close()
                if(err) {
                    console.log(err)
                    res.redirect('/')
                } else {
                    if(result.length == 0) {
                        sendData.message = 'No user with that email'
                        res.send(sendData)
                    } else {
                        bcrypt.compare(req.body.password, result[0].password, (err, match) => {
                            if(match) {
                                sendData.userAuthed = true
                                req.session.user = {
                                    name: result[0].name,
                                    id: result[0]._id,
                                    isValid: true,
                                    admin: result[0].isAdmin
                                }
                            } else {
                                sendData.message = "Invalid Password"
                            }
                            res.send(sendData)
                        })
                    }
                }
            })
        })
    },

    saveTestAccount: (req, res) => {
        connectToDB((dbo, db) => {
            bcrypt.hash('test12345', global.saltRounds, (err, hashedPass) => {
                accountObj = {
                    name: "admin",
                    email: "test@gmail.com",
                    password: hashedPass,
                    isAdmin: true
                }
    
                dbo.collection("users").insertOne(accountObj, (err, result) => {
                    db.close()
                    if(err) {
                        console.log(err)
                    }
                    res.redirect('/login')
                })
            })
        })
    },

    redirectHome: (req, res, next) => {
        if(req.session.user) {
            if(req.session.user.admin) {
                next()
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/')
        }
    },

    redirectFromLogin: (req, res, next) => {
        if(!req.session.user) {
            next()
        } else {
            res.redirect('/')
        }
    },

    logout: (req, res) => {
        req.session.destroy(err => {
            if(err) console.log(err)
            res.redirect('/')
        })
    }

}