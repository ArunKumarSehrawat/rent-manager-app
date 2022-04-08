console.clear();
require("dotenv").config();
const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const axios = require("axios");
const { hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const lodash = require("lodash");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

/**************** HTTPS SERVER SETUP ******************* */
// const KEY = fs.readFileSync("./key.pem");
// const CERT = fs.readFileSync("./cert.pem");
// const server = https.createServer({ key: KEY, cert: CERT }, app);
/*************************************** */
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/*************************************** */

// MODELS
const { Admin } = require("./model/admin");
const { Owner } = require("./model/owner");
const { Tenant } = require("./model/tenant");

// Connect to MongoDB Atlas
(async () => {
     try {
          await mongoose.connect(process.env.DB_URL);
          console.log("Connected to Database");
     } catch (error) {
          console.log("Error connecting to Database");
          console.log(error);
          process.exit();
     }
})();

// ROUTERS
const adminRouter = require("./routes/admin");
const ownerRouter = require("./routes/owner");
const tenantRouter = require("./routes/tenant");
const { userInfo } = require("os");
const { JsonWebTokenError } = require("jsonwebtoken");

// MIDDLEWARES
app.use("/admin", adminRouter);
app.use("/owner", ownerRouter);
app.use("/tenant", tenantRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
     cors({
          origin: "http://localhost:3000",
          credentials: true,
     })
);
// app.use(express.static(__dirname + "/build"));

// app.use(authenticateToken);

/************************** ROUTES **************************/
// app.get("/", (req, res) => {
//      res.sendFile("index");
// });
// app.get("/login", (req, res) => {
//      res.sendFile("index");
// });

app.post("/register", async (req, res) => {
     let { ROLE, NAME, EMAIL, PHONE, PASSWORD, OTP } = req.body;

     if (OTP && EMAIL && ROLE) {
          // activate user's acccount
          const [USER] = await (ROLE === "owner"
               ? Owner.where("otp.otp").equals(OTP).where("email").equals(EMAIL).where("role").equals(ROLE)
               : Tenant.where("otp.otp").equals(OTP).where("email").equals(EMAIL).where("role").equals(ROLE));

          if (!USER) return res.status(400).json({ message: "Wrong OTP" });

          USER.activated = true;
          try {
               await new Owner(USER).save();
               console.log("Account activated");
               return res.status(200).json({ message: "Verification successful." });
          } catch (error) {
               console.log(error);
               return res.status(400).json({ message: "Something went wrong. Please try again later." });
          }
     } else if (ROLE && NAME && EMAIL && PHONE && PASSWORD) {
          const USER = {
               role: ROLE,
               name: NAME,
               email: EMAIL,
               phoneNumber: PHONE,
               password: PASSWORD,
               otp: genOTP(),
          };

          try {
               await (ROLE === "owner" ? Owner.create(USER) : Tenant.create(USER));
               // send an otp to user's email
               if (sendActivationLink(EMAIL, NAME, USER.otp.otp))
                    // if email was sent successfully
                    return res.status(201).json({
                         message: `Enter OTP sent to ${EMAIL}, to complete the registration process.`,
                    });
               else {
                    // if something went wrong with the server or sendgrid's api
                    await (ROLE === "owner"
                         ? Owner.deleteOne({ email: EMAIL }, () => {})
                         : Tenant.deleteOne({ email: EMAIL }, () => {}));
                    return res.status(500).json({
                         message: {
                              errors: { otp: { message: "Error sending OTP. Please try again later." } },
                         },
                    });
               }
          } catch (err) {
               console.log(err.message);
               return res.status(400).json({ message: err });
          }
     } else
          return res.status(400).json({
               message: {
                    errors: { role: { message: "Please fill out all the details." } },
               },
          });
});

app.post("/login", async (req, res) => {
     const authHeader = req.headers.authorization;
     const token = authHeader && authHeader.split(" ")[1];

     if (token) {
          try {
               const tokenIsValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
               return tokenIsValid && res.status(200).json({ message: "Authenticated" });
          } catch (error) {
               console.log(error.message);
          }
     }

     const { EMAIL, PASSWORD } = req.body;
     if (EMAIL && PASSWORD) {
          try {
               const USER = await Owner.findOne({ email: EMAIL });
               if (USER)
                    return (await compare(PASSWORD, USER.password))
                         ? res.status(200).json({
                                message: "Authenticated",
                                access_token: jwt.sign(
                                     {
                                          role: USER.role,
                                          email: EMAIL,
                                     },
                                     process.env.ACCESS_TOKEN_SECRET,
                                     { expiresIn: 86400 }
                                ),
                           })
                         : res.status(400).json({ message: "Wrong Password" });
               else return res.status(400).json({ message: "Email does not exists." });
          } catch (error) {
               console.log(error.message);
               return res.status(500).json({ message: "Something went wrong. Please try again later." });
          }
     } else return res.status(400).json({ message: "Please fill out all the required fields." });
});

// LISTENING PORT
// server.listen(3001, () => console.log("Server running on PORT 3001"));
app.listen(3001, () => console.log("Server running on PORT 3001"));

/*********************** FUNCTIONS ***********************/
function authenticateToken(req, res, next) {
     const authHeader = req.headers["Authorization"];
     const token = authHeader && authHeader.split(" ")[1];

     if (!token) return res.status(401).json({ message: "Please login first." });
     else {
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
               if (err) return res.status(403).json({ message: "Invalid token." });
               return res.status(200).json({ message: "OK" });
          });
     }
}

async function sendActivationLink(email, name, OTP) {
     try {
          await sgMail.send({
               to: email,
               from: "register.arunksehrawat@gmail.com",
               subject: "Account activation link | Manage MySpace",
               html: `<p>Hi, ${name}! Thank you for signing up at <strong>Manage MySpace</strong>. Please enter the <strong>OTP ${OTP}</strong> at the registration screen to complete the registration process.`,
          });
          return true;
     } catch (err) {
          console.log(err);
          return false;
     }
}

function genOTP(length) {
     let otp = "";
     if (length) for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
     return {
          otp: otp ? otp : String(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000),
          expiration: new Date().valueOf() + 1000 * 30,
     };
}

/* Delete all accounts where the registration process was not completed */
setInterval(async () => {
     const time = new Date().valueOf();
     const halfOwners = await Owner.where("activated")
          .equals(false)
          .where("otp.expiration")
          .lt(time)
          .select("email activated otp ");

     halfOwners.map((owner) => {
          const id = owner.id.trim();
          Owner.deleteOne({ id: id }, (err, data) => {});
          console.log("Owner: deleted half owner. Reason: failed to register in due time.");
     });
}, 600000);
