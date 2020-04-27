/**
 * @author Olga Kiseleva 2017136
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const address = process.env.IP || "0.0.0.0";

app.use(express.static('dist'));

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_IWA_URL;
const client = new MongoClient(uri, { useNewUrlParser: true });

app.get('/api/create', (req, res) => {
  client.connect(err => {
    if (err) {
        console.error(err);
        client.close();
        return;
    }
    const collection = client.db("playlist").collection("playlist");
    const writeResult = collection.insertOne({
      channel: "wearepussyriot",
      published_date: "8/31/2019 9:50:21 a8/p8",
      title: "Pussy Riot - Police State",
      url: "https://www.youtube.com/watch?v=oaZl12Z5P7g"
    }, { ordered: true });
    // perform actions on the collection object
    res.send(writeResult);
    client.close();
});
});

app.listen(port, address, function() {
  console.log("Server listening at", address + ":" + port);
});