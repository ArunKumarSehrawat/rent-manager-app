import mongoose from "mongoose";
import validator from "validator";

const tenantSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, "Name is required."],
          maxlength: [100, "Name is too long."],
          minlength: [3, "Name is too short."],
          trim: true,
          validate: {
               validator: function (name) {
                    return !/[^a-zA-z0-9 _]/.test(name);
               },
               message: "Name should only contain alpha-numeric characters [a-z][A-Z][0-9] SPACE UNDERSCORE",
          },
     },
     spaceId: {
          type: String,
          required: [true, "SpaceId is required."],
          minLength: [3, "SpaceId is too short"],
          maxlength: [100, "SpaceId is too long."],
          trim: true,
     },
     verified: {
          type: String,
          required: [true, "Police Verification is required."],
          trim: true,
          maxLength: [100, "Verification is too long."],
     },
     age: {
          type: Number,
          required: [true, "Age is required."],
          min: [18, "Age must be 18 or above."],
          max: [130, "Age must be 130 or below."],
     },
     aadhar: {
          type: String,
          required: [true, "Aadhar number is required."],
          minLength: [12, "Aadhar number must be 12 characters long."],
          maxLength: [12, "Aadhar number must be 12 characters long."],
     },
     occupation: {
          type: String,
          required: [true, "Occupation is required."],
          minLength: [2, "Occupation needs to be atleast 2 characters long."],
          maxLength: [100, "Occuptaion needs to be less than 100 charactes."],
     },
     mobile: {
          type: String,
          required: [true, "Phone number is required"],
          minlength: [10, "Phone number should be 10 character long"],
          maxlength: [10, "Phone number should be 10 character long"],
          trim: true,
     },
     alternateMobile: {
          type: String,
          required: [true, "Phone number is required"],
          minlength: [10, "Phone number must be 10 character long"],
          maxlength: [10, "Phone number must be 10 character long"],
          trim: true,
     },
     email: {
          type: String,
          required: [true, "Email is required."],
          maxlength: [100, "Email is too long."],
          minlength: [5, "Email is too short."],
          trim: true,
          validate: {
               validator: function (email) {
                    return validator.isEmail(email);
               },
               message: "Email is invalid.",
          },
     },
     currentAddress: {
          type: String,
          required: [true, "Current Address is required."],
          minlength: [3, "Current Address should be atleast 3 characters long."],
          maxlength: [200, "Current Address should be atmost 200 characters long."],
          trim: true,
     },
     permanentAddress: {
          type: String,
          required: [true, "Permanent Address is required."],
          minlength: [3, "Permanent Address should be atleast 3 characters long."],
          maxlength: [200, "Permanent Address should be atmost 200 characters long."],
          trim: true,
     },
     createdAt: {
          type: String,
          default: new Date().toString(),
     },
     updatedAt: {
          type: String,
          default: new Date().toString(),
     },
});

tenantSchema.pre("save", async function (next) {
     if (!this.isModified("password")) return next();
     this.password = await hash(this.password, 10);
     next();
});

export const Tenant = mongoose.model("Tenant", tenantSchema);
