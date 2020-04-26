/**
 * @author Olga Kiseleva 2017136
 */

const express = require('express');
const router = express();
const port = process.env.PORT || 3000;
const address = process.env.IP || "0.0.0.0";

router.use(express.static('dist'));

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_IWA_URL;
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
    if (err) {
        console.error(err);
        client.close();
        return;
    }
    const collection = client.db("playlist").collection("playlist");
    // perform actions on the collection object
    client.close();
});

router.listen(port, address, function() {
  console.log("Server listening at", address + ":" + port);
});