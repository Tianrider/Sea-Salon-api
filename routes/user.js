const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/register", multer().none(), async (req, res) => {
	console.log(req.body);
	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = bcrypt.hashSync(req.body.password, salt);

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		phoneNumber: req.body.phoneNumber,
		password: hashedPassword,
		role: req.body.role,
	});

	user.save()
		.then(() => res.json("User added!"))
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/login", multer().none(), async (req, res) => {
	const user = await User.findOne({email: req.body.email});

	if (!user) {
		return res.status(400).json("User not found");
	}

	if (!bcrypt.compareSync(req.body.password, user.password)) {
		return res.status(400).json("Invalid password");
	}

	const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET, {
		expiresIn: "10m",
	});

	res.cookie("token", token, {
		sameSite: "None",
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000,
	});

	res.send({
		message: "Logged in",
		token: token,
	});
});

router.get("/all", async (req, res) => {
	const users = await User.find();

	res.json(users);
});

router.get("/", async (req, res) => {
	const cookie = req.cookies["token"];

	if (!cookie) {
		return res.status(401).send("Not authenticated");
	}

	try {
		const claims = jwt.verify(cookie, process.env.TOKEN_SECRET);

		if (!claims) {
			return res.status(401).send("Not authenticated");
		}

		const user = await User.findOne({_id: claims.id});
		res.json(user);
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).send("Token expired");
		} else if (error.name === "JsonWebTokenError") {
			return res.status(401).send("Invalid token");
		} else {
			return res.status(500).send("Internal server error");
		}
	}
});

router.post("/logout", (req, res) => {
	res.cookie("token", "", {maxAge: 0});
	res.send({
		message: "Logged out",
	});
});

module.exports = router;
