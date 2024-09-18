const { MongoClient } = require ('mongodb')

let dbConnection

module.exports = {
    ConnectToDb: (url , cb)=>{
        MongoClient.connect(url)
        .then((client)=>{
            dbConnection = client.db()
            return cb()
        })
        .catch(err =>{
            console.log(err)
            return cb(err)
        })
    },
    getDb: ()=>{
        return dbConnection
    }
}