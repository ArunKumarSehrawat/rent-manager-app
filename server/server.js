console.clear();
import "dotenv/config";
import express from "express";
import { createServer } from "https";
import { readFileSync } from "fs";
import axios from "axios";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import lodash from "lodash";
import cors from "cors";
import sgMail from "@sendgrid/mail";
import { authenticateTokenAndSendUserDetails } from "./controller/middlewares.js";
const app = express();

/**************** HTTPS SERVER SETUP ******************* */
// const KEY = readFileSync("./key.pem");
// const CERT = readFileSync("./cert.pem");
// const server = createServer({ key: KEY, cert: CERT }, app);
/*************************************** */
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/*************************************** */

// MODELS
// import { Admin } from "./model/admin.js";
import { Owner } from "./model/owner.js";
import { Tenant } from "./model/tenant.js";

// Connect to MongoDB Atlas
(async () => {
     try {
          await mongoose.connect(process.env.DB_URL);
          console.log("Connected to MongoDB Atlas Cloud Database");
     } catch (error) {
          console.log(`Error connecting to MongoDB Atlas Cloud Database.\n${error.message}`);

          try {
               console.log("Attempting to connect to the Local Fallback Database.");
               await mongoose.connect(process.env.DB_URL_LOCAL);
               console.log("Connected to the Local Fallback Database.");
          } catch (error) {
               console.log(`Error connecting to the Local Fallback Database.\n${error.message}`);
               process.exit();
          }
     }
})();

// ROUTERS
// import { adminRouter } from "./routes/admin.js";
import { ownerRouter } from "./routes/owner.js";
import { tenantRouter } from "./routes/tenant.js";

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
     cors({
          origin: "http://localhost:3000",
          credentials: true,
     })
);
// app.use("/admin", adminRouter);
app.use("/owner", ownerRouter);
app.use("/tenant", tenantRouter);

/************************** ROUTES **************************/
app.post("/register", async (req, res) => {
     let { ROLE, NAME, EMAIL, PHONE, PASSWORD, OTP } = req.body;

     /*if (OTP && EMAIL && ROLE) {
          // activate user's acccount
          const [USER] = await Owner.where("otp.otp").equals(OTP).where("email").equals(EMAIL).where("role").equals(ROLE)

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
     } else*/ if (ROLE && NAME && EMAIL && PHONE && PASSWORD) {
          const USER = {
               role: ROLE,
               name: NAME,
               email: EMAIL,
               phoneNumber: PHONE,
               password: PASSWORD,
          };

          try {
               await Owner.create(USER);
               // send an otp to user's email
               /*if (sendActivationLink(EMAIL, NAME, USER.otp.otp))
                    // if email was sent successfully
                    return res.status(201).json({
                         message: `Enter OTP sent to ${EMAIL}, to complete the registration process.`,
                    });
               else {
                    // if something went wrong with the server or sendgrid's api
                    await Owner.deleteOne({ email: EMAIL }, () => {})
                    return res.status(500).json({
                         message: {
                              errors: { otp: { message: "Error sending OTP. Please try again later." } },
                         },
                    });
               }*/
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

app.post("/login", authenticateTokenAndSendUserDetails, async (req, res) => {
     const { EMAIL, PASSWORD } = req.body;
     if (EMAIL && PASSWORD) {
          try {
               const USER = await Owner.findOne({ email: EMAIL });
               // console.log(USER, USER._id, USER.id);
               if (USER) {
                    return (await compare(PASSWORD, USER.password))
                         ? res.status(200).json({
                                message: "Authenticated",
                                user: {
                                     id: USER.id,
                                     role: USER.role,
                                     email: USER.email,
                                     phoneNumber: USER.phoneNumber,
                                     //   years: USER.years,
                                     accessToken: jwt.sign(
                                          {
                                               role: USER.role,
                                               email: EMAIL,
                                               id: USER.id,
                                          },
                                          process.env.ACCESS_TOKEN_SECRET,
                                          { expiresIn: "30d" }
                                     ),
                                },
                           })
                         : res.status(400).json({ message: "Wrong Password" });
               } else return res.status(400).json({ message: "Email does not exists." });
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

function genOtp(length) {
     let otp = "";
     if (length) for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
     return {
          otp: otp ? otp : String(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000),
          expiration: new Date().valueOf() + 1000 * 30,
     };
}

/* Delete all accounts where the registration process was not completed */
// setInterval(async () => {
//      const time = new Date().valueOf();
//      const halfOwners = await Owner.where("activated").equals(false).where("otp.expiration").lt(time).select("email activated otp ");

//      halfOwners.map((owner) => {
//           const id = owner.id.trim();
//           Owner.deleteOne({ id: id }, (err, data) => {});
//           console.log("Owner: deleted half owner. Reason: failed to register in due time.");
//      });
// }, 600000);
