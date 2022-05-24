import isEmail from "validator/es/lib/isEmail";
import isEmpty from "validator/es/lib/isEmpty";

new Date();

export const newRecordOptions = {
     "Personal Details": [
          {
               header: "Name",
               name: "name",
               placeholder: "Mr. Tony Stark",
               type: "text",
               tooltip: "Name of the tenant.",
               required: true,
               minLength: 3,
               maxLength: 100,
               validate: function (name) {
                    if (isEmpty(name)) return { valid: false, message: `${this.header} can't be empty.` };
                    else if (name.length < this.minLength) return { valid: false, message: `${this.header} must be atleast ${this.minLength} characters.` };
                    else if (/[^a-zA-Z0-9 _]/.test(name)) return { valid: false, message: `${this.header} can only contain alpha-numeric character [A-Z][0-9] SPACE UNDERSCORE` };
                    else return { valid: true, message: "" };
               },
          },
          {
               header: "Space ID",
               name: "spaceId",
               placeholder: "Space ID",
               type: "text",
               tooltip: "Use distinct names for each 'space' you add. Example: call your 1st floor room as 101, 102 etc.",
               required: true,
               minLength: 3,
               maxLength: 100,
               validate: function (spaceId) {
                    if (isEmpty(spaceId)) return { valid: false, message: `${this.header} can't be empty` };
                    else if (spaceId.length > this.maxLength) return { valid: false, message: `${this.header} must be between ${this.minLength} - ${this.maxLength}` };
                    else return { valid: true, message: "" };
               },
          },
          {
               header: "Police Verification",
               name: "verified",
               placeholder: "",
               type: "select",
               tooltip: "Have you completed the police verification of the tenant?",
               options: ["No", "Yes", "Pending"],
               required: true,
               validate: function (verified) {
                    if (this.options.includes(verified)) return { valid: true, message: "" };
                    else return { valid: false, message: "Police verification : IDK if this should even run" };
               },
          },
          {
               header: "Age",
               name: "age",
               placeholder: "Age",
               type: "number",
               tooltip: "The tenant must be of atleast 18 years old.",
               required: true,
               minAge: 18,
               maxAge: 130,
               validate: function (age) {
                    if (age < this.minAge || age > this.maxAge) return { valid: false, message: `${this.header} must be between ${this.minAge} - ${this.maxAge}` };
                    else return { valid: true, message: "" };
               },
          },
          {
               header: "Aadhar Number",
               name: "aadhar",
               placeholder: "Aadhar Card Number",
               type: "tel",
               minLength: 12,
               maxLength: 12,
               tooltip: "Aadhar Number is 12 characters long and is necessary for the identification of the tenant. It can be found on the front of the tenant's aadhar card. Example: 123412341234",
               required: true,
               validate: function (aadhar) {
                    if (aadhar.length < this.minLength || aadhar.length > this.maxLength) return { valid: false, message: `${this.header} must be 12 characters long.` };
                    return { valid: true, message: "" };
               },
          },
          {
               header: "Occupation",
               name: "occupation",
               placeholder: "Occupation",
               type: "text",
               minLength: 2,
               maxLength: 100,
               tooltip: "Please specify what they do and where they work, seprated by commas. Example: Developer, Google",
               required: true,
               validate: function (occupation) {
                    if (isEmpty(occupation)) return { valid: false, message: `${this.header} can't be empty.` };
                    else if (occupation.length < this.minLength || occupation.length > this.maxLength)
                         return { valid: false, message: `${this.header} must be between ${this.minLength} - ${this.maxLength} characters.` };
                    return { valid: true, message: "" };
               },
          },
     ],
     "Communication Details": [
          {
               header: "Mobile Number",
               name: "mobile",
               placeholder: "Mobile Number",
               type: "tel",
               maxLength: 10,
               tooltip: "Mobile number of the tenant. Please do not add any sort of country code. Example: XXX-XXX-XXXXXX",
               required: true,
               validate: function (mobile) {
                    if (mobile.length < this.maxLength || mobile.length > this.maxLength) return { valid: false, message: `${this.header} must be ${this.maxLength} characters long.` };
                    else return { valid: true, message: "" };
               },
          },
          {
               header: "Alternate Number",
               name: "alternateMobile",
               placeholder: "Alternate Mobile",
               type: "tel",
               maxLength: 10,
               tooltip: "Do they have any alternate mobile number? If so, add it below.",
               required: false,
               validate: function (mobile) {
                    if (!mobile) return { valid: true, message: "" };
                    else if (mobile.length < this.maxLength || mobile.length > this.maxLength) return { valid: false, message: `${this.header} must be ${this.maxLength} characters long.` };
                    else return { valid: true, message: "" };
               },
          },
          {
               header: "Email",
               name: "email",
               placeholder: "Email",
               type: "email",
               minLength: 5,
               maxLength: 100,
               tooltip: "Email can be used to contact them when the matter is not urgent or they can't be contacted on their cell phone.",
               required: false,
               validate: function (email) {
                    if (isEmpty(email)) return { valid: true, message: "" };
                    else if (!isEmail(email)) return { valid: false, message: "Email is not valid." };
                    else return { valid: true, message: "" };
               },
          },
          {
               header: "Current Address",
               name: "currentAddress",
               placeholder: "Current Address",
               type: "text",
               minLength: 3,
               maxLength: 200,
               tooltip: "This is the address of your premises, which has been lent out to the tenant.",
               required: true,
               validate: function (address) {
                    if (isEmpty(address)) return { valid: false, message: `${this.header} can't be empty.` };
                    else if (address.length < this.minLength || address.length > this.maxLength)
                         return { valid: false, message: `${this.header} must be ${this.minLength} - ${this.maxLength} characters.` };
                    else return { valid: true, message: "" };
               },
          },
          {
               header: "Permanent Address",
               name: "permanentAddress",
               placeholder: "Permanent Address",
               type: "text",
               minLength: 3,
               maxLength: 200,
               tooltip: "Tenant's permanent address can be used to contact them incase they leave the premises and a contact can't be made.",
               required: true,
               validate: function (address) {
                    if (isEmpty(address)) return { valid: false, message: `${this.header} can't be empty.` };
                    else if (address.length < this.minLength || address.length > this.maxLength)
                         return { valid: false, message: `${this.header} must be ${this.minLength} - ${this.maxLength} characters.` };
                    else return { valid: true, message: "" };
               },
          },
     ],
     Others: [
          {
               header: "Date Of Moving In",
               name: "movedIn",
               placeholder: "",
               type: "date",
               tooltip: "The date when they started living in your premises. Please enter the date in DD-MM-YYYY format",
               required: true,
               validate: function (date) {
                    if (isEmpty(date)) return { valid: false, message: `${this.header} can't be empty.` };
                    return { valid: true, message: "" };
               },
          },
          {
               header: "Date of Leaving",
               name: "movedOut",
               placeholder: "",
               type: "date",
               tooltip: "A tenant with the Date of leaving will not appear in the 'Add Records' in the 'Years' section.",
               required: false,
               validate: function (date) {
                    if (isEmpty(date)) return { valid: false, message: `${this.header} can't be empty.` };
                    return { valid: true, message: "" };
               },
          },
          {
               header: "Electricity units at time of moving in",
               name: "electricityStart",
               placeholder: "Default: 0",
               type: "number",
               min: 0,
               tooltip: "If you're charging the tenant for electricity. Enter the electricity units in the electricity meter on the date of moving in.",
               required: true,
               validate: function (units) {
                    if (units < this.min) return { valid: false, message: `${this.header} can't be less than 0.` };
                    else return { valid: true, message: "" };
               },
          },
          {
               header: "Security Deposit",
               name: "security",
               placeholder: "Default: 0",
               type: "number",
               min: 0,
               tooltip: "Amount of Security Deposits (if any). Generally 2 months of security deposit is given by the tenant to the owner.",
               required: true,
               validate: function (units) {
                    if (units < this.min) return { valid: false, message: `${this.header} can't be less than 0.` };
                    else return { valid: true, message: "" };
               },
          },
          {
               header: "Keycard Number",
               name: "keycardNumber",
               placeholder: "Keycard Number",
               type: "text",
               maxLength: 100,
               tooltip: "Keycard number of Biometric or Keycard Lock (if any).",
               required: false,
               validate: function (keycard) {
                    if (isEmpty(keycard)) return { valid: true, message: "" };
                    else if (keycard.length > this.maxLength) return { valid: false, message: `${this.header} must be less than ${this.maxLength} characters` };
                    else return { valid: true, message: "" };
               },
          },
          {
               header: "Rent Agreement Number",
               name: "rentAgreementNumber",
               placeholder: "Rent Agreement Number",
               type: "text",
               maxLength: 100,
               tooltip: "Do you have a Rent Agreement between you and your tenant? If so, please add the rent agreement number below. A rent agreement is very useful in case of disputes.",
               required: false,
               validate: function (keycard) {
                    if (isEmpty(keycard)) return { valid: true, message: "" };
                    else if (keycard.length > this.maxLength) return { valid: false, message: `${this.header} must be less than ${this.maxLength} characters` };
                    else return { valid: true, message: "" };
               },
          },
     ],
};

// personal details {...}
// communication details {...}
// others {...}
