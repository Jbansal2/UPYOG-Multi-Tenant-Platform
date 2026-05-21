const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/upyog';

let client;
let db;

async function connect() {
  if (db) return db;
  client = new MongoClient(MONGODB_URI, {
    // use unified topology by default in modern driver
  });
  await client.connect();
  // determine DB name from URI path (if provided) otherwise default to 'upyog'
  let dbName = 'upyog';
  try {
    const m = MONGODB_URI.match(/\/([^/?]+)(?:\?|$)/);
    if (m && m[1]) dbName = m[1];
  } catch (e) {
    // ignore and use default
  }
  db = client.db(dbName);
  return db;
}

function getDb() {
  if (!db) throw new Error('MongoDB not connected. Call connect() first.');
  return db;
}

async function close() {
  if (client) await client.close();
  client = null;
  db = null;
}

module.exports = { connect, getDb, close };
