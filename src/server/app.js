/**
 * @author Olga Kiseleva 2017136
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const address = process.env.IP || "0.0.0.0";

const DB = "playlist";
const COLLECTION = "playlist";

app.use(express.static('dist'));
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = process.env.MONGODB_IWA_URL;

/**
 * Connection to the MongoDB using MongoDB client instead of mongoose
 */
let client = null;
MongoClient.connect(uri, { 
    useNewUrlParser: true, 
}).then((db) => {
    client = db;
    app.listen(port, address, function() {
        console.log("Server listening at", address + ":" + port);
    });
}).catch((err) => {
    console.error(err);
});

/**
 * CREATE OR UPDATE
 * if _id found in DB this function will update information on exisiting entry
 * if the _id does not match with anything in MONGO DB it will insert new entry
 */
app.post('/api/playlist', (req, res) => {
    const {
        _id,
        channel,
        published_date,
        title,
        url
    } = req.body;

    const collection = client.db(DB).collection(COLLECTION);
    if (_id) { //chech the id -> update entry
        collection.updateOne(
            {_id: new ObjectID(_id)}, 
            { $set: {
                channel,
                published_date,
                title,
                url
            }},
            { upsert: true })
        .then((writeResult) => {
            res.send(writeResult);
        }).catch((err) => {
            console.error(err);
        });
    } else { // insert new entry
        collection.insertOne({
            channel,
            published_date,
            title,
            url
        }, { ordered: true }).then((writeResult) => {
            res.send(writeResult);
        }).catch((err) => {
            console.error(err);
        });
    }
});



/**
 * READ
 * Connect to DB -> retrive all data and parse it to ARRAY 
 */
app.get('/api/playlist', (_, res) => {
    const collection = client.db(DB).collection(COLLECTION);
    collection.find({}).toArray().then((playlists) => {
        res.send(playlists ? playlists : []); //if DB doesn't have any data inside create empty array
    }).catch((err) => {
        res.send(err);
    });
});

/**
 * DELETE
 * Function to delete entry from DB using ID
 */ 
app.delete('/api/playlist/:id', (req, res) => {
    const {
        id
    } = req.params;

    const collection = client.db(DB).collection(COLLECTION);
    if (id) {
        collection.deleteOne({_id: new ObjectID(id)}).then((data) => {
            res.send(data ? data : {});
        }).catch((err) => {
          res.send(err);
        });
    }
})
