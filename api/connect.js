const mysql = require("mysql2");

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123456",
	database: "social",
});

db.connect((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("MySql Connected...");
		createTableIfNotExists();
	}
});

function createTableIfNotExists() {
	const createTableQuery = `
      CREATE TABLE IF NOT EXISTS form_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        address TEXT,
        email VARCHAR(100) NOT NULL,
        phone_number VARCHAR(10),
        dob DATE,
        gender VARCHAR(10),
        college_branch VARCHAR(50)
      )`;
	db.query(createTableQuery, (err) => {
		if (err) {
			console.error("Error creating table: " + err.message);
		} else {
			console.log("Table created successfully (if it didn't exist)");
		}
	});
}

module.exports = { db, mysql };
