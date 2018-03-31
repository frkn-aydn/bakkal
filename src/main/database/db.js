"use strict";
const mongodb = require("mongodb");

const dbAddr = process.env.bakkal || "mongodb://127.0.0.1:27017/bakkal";
if (!dbAddr) throw new Error("community-inviter environment variable is not set");

const db = mongodb.MongoClient.connect(dbAddr);

exports.products = db.then(db => db.collection("products"));
exports.transactions = db.then(db => db.collection("transactions"));