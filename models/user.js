const mongoose = require("mongoose");
const {removeListener} = require("./rating");

const userSchema = new mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true},
	phoneNumber: {type: String, required: true},
	password: {type: String, required: true},
	role: {type: String, required: true},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
