const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
	name: {type: String, required: true},
	phoneNumber: {type: String, required: true},
	service: {type: String, required: true},
	date: {type: Date, required: true},
	startTime: {type: String, required: true},
});

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
