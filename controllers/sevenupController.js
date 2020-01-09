require("dotenv").config();
const express = require("express");
var router = express.Router();
var mongodb = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
const Sevenup = require('../models/Sevenup')

insertDocument = (collectionName, body) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(process.env.MONGODB_URL, function(err, client) {
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection(collectionName);

      collection.insertOne(body, function(err, result) {
        resolve(result);
      });
      client.close();
    });
  });
};

findDocument = (collectionName, body) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(process.env.MONGODB_URL, function(err, client) {
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection(collectionName);

      collection.findOne(body, function(err, result) {
        resolve(result);
      });
      client.close();
    });
  });
};

updateDocument = (collectionName, find, body) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(process.env.MONGODB_URL, function(err, client) {
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection(collectionName);

      collection.updateOne(
        find,
        {
          $set: body
        },
        function(err, result) {
          resolve(result);
        }
      );
      client.close();
    });
  });
};

router.post("/toss", async function(req, res) {
  var doc = await findDocument("config", {
    type: "store"
  });
  if (doc.value < 0) {
    res.send({
      result: -1
    });
  } else if (doc.value == 0) {
    res.send({
      result: 0
    });
  } else {
    res.send({
      result: 1
    });
  }
});

router.post("/create", async function(req, res) {
  // await insertDocument("sevenup", {
  //   email: req.body.email,
  //   timestamp: Date.now(),
  //   status: req.body.status
  // });

  var sevenup = new Sevenup({
    email: req.body.email,
    status: req.body.status
  })

  await sevenup.save()

  var result = await findDocument("config", {
    type: "store"
  });

  newValue = result.value;
  if (req.body.status == "winner") newValue -= 10;
  if (req.body.status == "loser") newValue += 10;

  await updateDocument(
    "config",
    {
      type: "store"
    },
    {
      value: newValue
    }
  );

  var doc = await findDocument("profiles", {
    email: req.body.email
  });

  value = doc.coins;
  if (req.body.status == "winner") value += 10;
  if (req.body.status == "loser") value -= 10;

  await updateDocument(
    "profiles",
    {
      email: req.body.email
    },
    {
      coins: value
    }
  );

  res.send({
    coins: value
  });
});

module.exports = router;
