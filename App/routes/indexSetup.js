const { connectToDB } = require("./functions");

module.exports.indexSetup = () => {
    connectToDB((dbo, db) => {
        dbo.collection("events").createIndex({
            title: "text",
            description: "text",
            location: "text"
        }, {weights: {
            title: 7,
            description: 1,
            location: 5
        }, name: "eventsIndex" }, (err, result) => {
            db.close()
        })
    })
}