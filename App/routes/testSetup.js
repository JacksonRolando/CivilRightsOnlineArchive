module.exports = {
    adminDbSetup : (req, res) => {
        dbclient = global.dbclient
        dbclient.connect((err, db) => {
            if (err) throw err
            var dbo = db.db("onlineArchive")
            
            //creates admin collection
            dbo.createCollection("admins", (err, res) => {
                if (err) console.log(err)
                else {
                    console.log("Admin collection created")
                    adminObj = {username : "admin", password : "temp12345"}
                
                    //inserts initial admin
                    dbo.collection("admins").insertOne(adminObj, (err, res) => {
                        if (err) throw err
                        console.log("1 row inserted")
                    })
                }
                db.close
            })
        })
        res.redirect('/')
    }
}