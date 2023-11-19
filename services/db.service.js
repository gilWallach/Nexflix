const MongoClient = require('mongodb').MongoClient

var dbConn = null
const dbName = `nexflix`

module.exports = {
    getCollection
}

async function connect () {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(`mongodb://localhost:27017/${dbName}`)
        const db = client.db()
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}

async function getCollection(collectionName) {
    try{
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        console.log('Failed to get Mongo collection', err)
        throw err
    }
}