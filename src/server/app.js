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


// CREATE OR UPDATE
app.post('/api/playlist', (req, res) => {
    const {
        _id,
        channel,
        published_date,
        title,
        url
    } = req.body;

    const collection = client.db(DB).collection(COLLECTION);
    if (_id) {
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
    } else {
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


// READ
app.get('/api/playlist', (_, res) => {
    const collection = client.db(DB).collection(COLLECTION);
    collection.find({}).toArray().then((playlists) => {
        res.send(playlists ? playlists : []);
    }).catch((err) => {
        res.send(err);
    });
});

// DELETE
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
