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
        address VARCHAR(150) NOT NULL,
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

	const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL
    )
  `;

	db.query(createUserTableQuery, (err, result) => {
		if (err) {
			console.error("Error creating user table:", err);
		} else {
			console.log("User table created successfully.");
		}
	});

	const createCommentsTableQuery = `
	CREATE TABLE IF NOT EXISTS comments (
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		description VARCHAR(100) NOT NULL,
		created_at DATE NOT NULL,
		user_id INT NOT NULL,
		post_id INT NOT NULL
	  );
`;
	db.query(createCommentsTableQuery, (err) => {
		if (err) throw err;
		console.log("Comments table created.");
	});

	const createLikesTable = `
	CREATE TABLE IF NOT EXISTS likes (
		id INT AUTO_INCREMENT PRIMARY KEY,
		userId INT,
		postId INT,
		FOREIGN KEY (userId) REFERENCES users(id),
		FOREIGN KEY (postId) REFERENCES posts(id)
	);
	
`;

	db.query(createLikesTable, (err) => {
		if (err) {
			console.error("Error creating likes table:", err);
		} else {
			console.log("Likes table created");
		}
	});
	const createPostTable = `
	CREATE TABLE IF NOT EXISTS posts (
		id INT AUTO_INCREMENT PRIMARY KEY,
		description TEXT,
		img VARCHAR(255),
		createdAt DATETIME,
		userId INT,
		FOREIGN KEY (userId) REFERENCES users(id)
	);
	
`;

	db.query(createPostTable, (err) => {
		if (err) {
			console.error("Error creating Post table:", err);
		} else {
			console.log("Post table created");
		}
	});

	const createTableRelation = `
    CREATE TABLE IF NOT EXISTS relationships (
      id INT AUTO_INCREMENT PRIMARY KEY,
      followerUserId INT,
      followedUserId INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (followerUserId) REFERENCES users(id),
      FOREIGN KEY (followedUserId) REFERENCES users(id)
    )
  `;

	db.query(createTableRelation, (err) => {
		if (err) {
			console.error("Error creating relationships table:", err);
		} else {
			console.log("Relationships table created or already exists.");
		}
	});
}

module.exports = { db, mysql };
