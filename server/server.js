console.clear();
require("dotenv").config();
const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const axios = require("axios");
const { hash, compare } = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const mongoose = require("mongoose");
const lodash = require("lodash");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

/**************** HTTPS SERVER SETUP ******************* */
const KEY = fs.readFileSync("./key.pem");
const CERT = fs.readFileSync("./cert.pem");
const server = https.createServer({ key: KEY, cert: CERT }, app);
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

/************************** ROUTES **************************/
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
               otp: genOTP(6),
               // otp: {
               //      otp: "000000",
               //      expiration: 321324684352432,
               // },
          };

          try {
               await (ROLE === "owner" ? Owner.create(USER) : Tenant.create(USER));
               // send an otp to user's email
               if (sendActivationLink(EMAIL, NAME, USER.otp.value))
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
               console.log(err);
               return res.status(400).json({ message: err });
          }
     } else
          return res.status(400).json({
               message: {
                    errors: { role: { message: "Please fill out all the details." } },
               },
          });
});

// LISTENING PORT
server.listen(3001, () => console.log("Server running on PORT 3001"));

/*********************** FUNCTIONS ***********************/
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

function genOTP(length = 6) {
     let otp = "";
     for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
     const expiration = new Date().valueOf() + 1000 * 30; // expiration set to 30 seconds
     return { otp, expiration };
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
