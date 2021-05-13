const { connectToDB } = require('./functions')

module.exports = {
    searchEvents : (req, res) => {
        connectToDB((dbo, db) => {
            dbo.collection("events").find({$text: {$search: req.query.q}})
            .toArray((err, result) => {
                db.close()
                if(err) {
                    console.log(err)
                    res.send()
                } else {
                    res.send(result)
                }
            })
        })
    }
}