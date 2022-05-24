import mongoose from "mongoose";
import validator from "validator";
import { hash } from "bcrypt";

const ownerSchema = new mongoose.Schema({
     role: {
          type: String,
          required: [true, "Role is required."],
          trim: true,
     },
     name: {
          type: String,
          required: [true, "Name is required."],
          maxlength: [100, "Name is too long."],
          minlength: [1, "Name is too short."],
          trim: true,
          validate: {
               validator: function (name) {
                    return !/[^a-zA-z0-9 _]/.test(name);
               },
               message: "Name should only contain alpha-numeric characters [a-z][A-Z][0-9] SPACE UNDERSCORE",
          },
     },
     phoneNumber: {
          type: String,
          required: [true, "Phone number is required"],
          minlength: [10, "Phone number should be 10 character long"],
          maxlength: [10, "Phone number should be 10 character long"],
          unique: [true, "Phone number is already registered."],
          trim: true,
          validate: {
               validator: function (number) {
                    return validator.isMobilePhone(number);
               },
               message: "Phone Number is invalid.",
          },
     },
     email: {
          type: String,
          required: [true, "Email is required."],
          maxlength: [100, "Email is too long."],
          minlength: [5, "Email is too short."],
          lowercase: true,
          trim: true,
          unique: [true, "Email is already registered."],
          validate: {
               validator: function (email) {
                    return validator.isEmail(email);
               },
               message: "Email is invalid.",
          },
     },
     password: {
          type: String,
          required: [true, "Password is required."],
          maxlength: [64, "Password should not be longer than 64 characters."],
          minlength: [8, "Password should be atleast 8 characters long."],
          trim: true,
          validate: {
               validator: function (password) {
                    return validator.isStrongPassword(password, {
                         minLength: 8,
                         minLowercase: 0,
                         minUppercase: 0,
                         minNumbers: 0,
                         minSymbols: 0,
                    });
               },
               message: "Password is weak.",
          },
     },
     parameters: {
          type: Object,
          default: {
               spaceID: {
                    optional: false,
                    type: String,
               },
               tenantsName: {
                    optional: false,
                    type: String,
               },
               rent: {
                    optional: false,
                    type: Number,
               },
               misc: {
                    optional: true,
                    type: Number,
               },
          },
     },
     years: {
          type: Object,
          default: {},
     },
     createdAt: {
          type: Date,
          immutable: true,
          default: () => new Date().toString(),
     },
     updatedAt: {
          type: Date,
          default: () => new Date().toString(),
     },
     locked: {
          type: Boolean,
          default: false,
     },
     activated: {
          type: Boolean,
          default: false,
     },
     otp: {
          type: Object,
          default: {
               otp: "",
               expiration: 0,
          },
     },
});

ownerSchema.pre("save", async function (next) {
     if (!this.isModified("password")) return next();
     this.password = await hash(this.password, 10);
     next();
});

export const Owner = mongoose.model("Owner", ownerSchema);
