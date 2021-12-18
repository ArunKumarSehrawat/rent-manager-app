const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({});

const Admin = mongoose.model("Admin", adminSchema);

exports.Admin = Admin;
