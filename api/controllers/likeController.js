const { db } = require("../connect.js");
const jwt = require("jsonwebtoken");

const getLikes = (req, res) => {
	const q = "SELECT userId FROM likes WHERE postId = ? LIMIT 1;";

	db.query(q, [req.query.postId], (err, data) => {
		if (err) return res.status(500).json(err);
		return res.status(200).json(data.map((like) => like.userId));
	});
};

const addLike = (req, res) => {
	const token = req.cookies.accessToken;

	if (!token) {
		return res.status(401).json("Not logged in!");
	}

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) {
			return res.status(403).json("Token is not valid!");
		}

		const userId = userInfo.id;
		const postId = req.body.postId;

		// Check if the user has already liked the post
		const checkLikeQuery =
			"SELECT id FROM likes WHERE userId = ? AND postId = ?";

		db.query(checkLikeQuery, [userId, postId], (checkErr, checkData) => {
			if (checkErr) {
				return res.status(500).json(checkErr);
			}

			if (checkData.length === 0) {
				// User has not liked the post, so insert a like
				const insertLikeQuery =
					"INSERT INTO likes (`userId`, `postId`) VALUES (?, ?)";

				db.query(insertLikeQuery, [userId, postId], (insertErr, insertData) => {
					if (insertErr) {
						return res.status(500).json(insertErr);
					}
					return res.status(200).json("Post has been liked.");
				});
			} else {
				// User has already liked the post, so delete the like (dislike)
				const deleteLikeQuery =
					"DELETE FROM likes WHERE userId = ? AND postId = ?";

				db.query(deleteLikeQuery, [userId, postId], (deleteErr, deleteData) => {
					if (deleteErr) {
						return res.status(500).json(deleteErr);
					}
					return res.status(200).json("Post has been disliked.");
				});
			}
		});
	});
};

const deleteLike = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in!");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");

		const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

		db.query(q, [userInfo.id, req.query.postId], (err, data) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json("Post has been disliked.");
		});
	});
};

module.exports = { getLikes, addLike, deleteLike };
