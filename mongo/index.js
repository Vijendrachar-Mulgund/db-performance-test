const { MongoClient } = require("mongodb");
const invoices = require("./invoices.js");
const config = require("./config.js");

async function main() {
  const uri = config.db.uri;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(config.db.name);
    const collection = db.collection(config.db.collection);

    const documents = invoices;

    if (documents.length) {
      const startWrite = Date.now();
      // Write the documents to the database
      const result = await collection.insertMany(documents);
      const endWrite = Date.now();
      // Display the results and time taken
      console.log(`Write result: ${result.insertedCount} documents were inserted in ${endWrite - startWrite}ms`);

      // Query the database
      const startRead = Date.now();
      const data = await collection.find({}).toArray();
      const endRead = Date.now();

      // Display the results and time taken
      console.log(`Read result: ${data.length} records returned in ${endRead - startRead}ms`);
    } else {
      console.error("No documents to insert");
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);
