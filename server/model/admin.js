// const mongoose = require("mongoose");
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({});

export const Admin = mongoose.model("Admin", adminSchema);
