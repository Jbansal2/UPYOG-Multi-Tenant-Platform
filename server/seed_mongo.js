const fs = require('fs');
const path = require('path');
const { connect, getDb, close } = require('./mongo');

async function run() {
  try {
    await connect();
    const db = getDb();
    const file = path.join(__dirname, '..', 'src', 'assets', 'properties.json');
    const raw = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(raw);

    const coll = db.collection('properties');
    // ensure unique index on property_id
    await coll.createIndex({ property_id: 1 }, { unique: true });

    let ops = data.map(p => ({
      updateOne: {
        filter: { property_id: p.property_id },
        update: { $set: p },
        upsert: true
      }
    }));

    const res = await coll.bulkWrite(ops, { ordered: false });
    console.log('Seeded documents:', res.upsertedCount + res.modifiedCount);
    await close();
    process.exit(0);
  } catch (err) {
    console.error('Seed mongo error', err);
    process.exit(1);
  }
}

run();
