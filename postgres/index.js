// Import required modules
const { Pool } = require("pg");
const fs = require("fs");
const config = require("./config");

// Configure the PostgreSQL connection pool
const pool = new Pool({
  user: config.db.user, // Your PostgreSQL username
  host: config.db.host, // Database server address
  database: config.db.database, // Name of the database
  password: config.db.password, // Your PostgreSQL password
  port: config.db.port, // Default PostgreSQL port
});

// Function to read and execute SQL commands from a file
async function executeSqlFromFile(filePath) {
  // Read the file content asynchronously
  fs.readFile(filePath, "utf8", async (err, sql) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    try {
      // Connect to the pool
      await pool.connect();

      // Execute the SQL commands
      const startWrite = Date.now();
      const result = await pool.query(sql);
      const endWrite = Date.now();

      // Display the results and time taken
      console.log(`Write result: ${result.length} documents were inserted in ${endWrite - startWrite}ms`);

      const startRead = Date.now();
      // Query the database
      const data = await pool.query("SELECT * FROM books");
      const endRead = Date.now();

      // Display the results and time taken
      console.log(`Read result: ${data.rowCount} records returned in ${endRead - startRead}ms`);
    } catch (error) {
      console.error("Error executing SQL commands:", error);
    } finally {
      // Close the pool connection
      await pool.end();
    }
  });
}

// Call the function and pass the path to the .sql file
executeSqlFromFile("books.sql");
