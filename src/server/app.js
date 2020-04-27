/**
 * @author Olga Kiseleva 2017136
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const address = process.env.IP || "0.0.0.0";

const MONGODB_DB = "playlist";
const MONGODB_COLLECTION = "playlist";


app.use(express.static('dist'));
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_IWA_URL;

let client = null;
MongoClient.connect(uri, { 
    useNewUrlParser: true, 
    }, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }   
    client = res
    app.listen(port, address, function() {
        console.log("Server listening at", address + ":" + port);
    });
});

app.post('/api/create', (req, res) => {
    const {
        channel,
        published_date,
        title,
        url
    } = req.body;

    const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
    collection.insertOne({
        channel,
        published_date,
        title,
        url
    }, { ordered: true }).then((writeResult) => {
        res.send(writeResult);
        client.close();
    });
});
