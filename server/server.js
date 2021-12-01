require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const mongoose = require("mongoose");
const uuid = require("uuid");
const lodash = require("lodash");

const print = console.log;

// ROUTERS
const adminRouter = require("./model/admin");
const ownerRouter = require("./model/owner");
const tenantRouter = require("./model/tenant");

// MIDDLEWARES
app.use("/admin", adminRouter);
app.use("/owner", ownerRouter);
app.use("/tenant", tenantRouter);

// LISTENING PORT
app.listen(3001, () => print("Server running on PORT 3001"));
