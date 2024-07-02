const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		allowedHeaders: "Content-Type,Authorization",
	})
);
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

const uri = process.env.MONGO_URI;

mongoose.connect(uri);
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", () => {
	console.log("MongoDB database connection established successfully");
});

const reservationRouter = require("./routes/reservation");
const ratingRouter = require("./routes/rating");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const serviceRouter = require("./routes/service");

app.use("/reservation", reservationRouter);
app.use("/rating", ratingRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/service", serviceRouter);

app.listen(port, () => {
	console.log(`Server is running on port: http://localhost:${port}`);
	console.log("CTRL + C to stop the server");
});
