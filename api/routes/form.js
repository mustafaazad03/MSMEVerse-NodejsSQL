const express = require("express");
const router = express.Router();
const db = require("../connect").db;

router.post("/submitform", (req, res) => {
	const {
		firstName,
		lastName,
		address,
		email,
		phoneNumber,
		dob,
		gender,
		collegeBranch,
	} = req.body;
	const query =
		"INSERT INTO form_table (first_name, last_name, address, email, phone_number, dob, gender, college_branch) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
	db.query(
		query,
		[
			firstName,
			lastName,
			address,
			email,
			phoneNumber,
			dob,
			gender,
			collegeBranch,
		],
		(err, results) => {
			if (err) {
				console.error("Error saving data to the database: " + err.message);
				res.status(500).json({ error: "An error occurred while saving data" });
			} else {
				res.status(200).json({ message: "Data saved successfully" });
			}
		}
	);
});

router.get("/get-form-data", (req, res) => {
	db.query("SELECT * FROM form_table", (err, results) => {
		if (err) {
			console.error("Error fetching data from the database: " + err.message);
			res.status(500).json({ error: "An error occurred while fetching data" });
		} else {
			res.status(200).json({ data: results });
		}
	});
});

module.exports = router;
