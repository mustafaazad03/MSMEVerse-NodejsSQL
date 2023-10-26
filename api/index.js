const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const app = express();

//import userRoutes from "./routes/users.js"
app.listen(8800, () => {
	console.log("backend worrking");
});
//middlewares
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Credentials", true);

	next();
});
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
	})
);
app.use(cookieParser());

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "../client/public/upload");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
	const file = req.file;
	res.status(200).json(file.filename);
});

app.use("/api/users", require("./routes/users.js"));
app.use("/api/posts", require("./routes/posts.js"));
app.use("/api/comments", require("./routes/comments.js"));
app.use("/api/likes", require("./routes/likes.js"));
app.use("/api/relationships", require("./routes/relationship.js"));
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api", require("./routes/form.js"));
