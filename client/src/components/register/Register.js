import Axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import { isEmpty, isEmail, isMobilePhone, isStrongPassword } from "validator";
import { useNavigate } from "react-router-dom";
import { GlobalStyles } from "../../GlobalStyles";
import Input from "./Input";
import Slider from "./Slider";
import Otp from "./Otp";

export const Form = styled.form`
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     gap: 1rem;
     width: clamp(300px, 25%, 1920px);
     margin: 1rem auto;
`;

export const SubmitButton = styled.button`
     width: clamp(250px, 100%, 900px);
     border-radius: 10px;
     border: none;
     outline: none;
     padding: 0.5rem;
     font-size: 16px;
     font-weight: bold;
     cursor: pointer;
     background-color: ${GlobalStyles.themeSemiLight};
     color: ${GlobalStyles.themeFont};
`;

const ClientType = styled.div`
     display: flex;
     justify-content: center;
     gap: 1rem;
     margin-bottom: 1rem;
`;

const ClientTypeOptions = styled.label`
     font-size: 16px;
     transition: opacity 500ms;
`;

export const Heading = styled.h1`
     text-align: center;
     margin-block: 1rem;
     font-size: 30px;
     min-width: 300px;
`;

export const Errors = styled.p`
     color: orange;
     text-align: center;
     font-size: 16px;
     min-width: 300px;
`;

const Register = () => {
     const navigate = useNavigate();
     const [role, setRole] = useState("owner");
     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [phoneNumber, setPhoneNumber] = useState("");
     const [password, setPassword] = useState("");
     const [otpBoxShown, setOtpBoxShown] = useState(false);

     const handleClientTypeChange = (e) => (e.target.checked ? setRole("owner") : setRole("tenant"));
     const handleNameChange = (e) => setName(e.target.value);
     const handleEmailChange = (e) => setEmail(e.target.value);
     const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
     const handlePasswordChange = (e) => setPassword(e.target.value);
     const handleRegisterSubmit = async (e) => {
          e.preventDefault();
          if (validate()) {
               // submit the form
               try {
                    const { status } = await Axios.post("http://localhost:3001/register", {
                         ROLE: role,
                         NAME: name,
                         EMAIL: email,
                         PHONE: phoneNumber,
                         PASSWORD: password,
                    });

                    if (status === 201 || status === 200) {
                         // display OTP div
                         setOtpBoxShown(true);
                    }
               } catch (err) {
                    console.log(err.message);
                    const { message } = err.response.data;
                    if (message.code === 11000) {
                         const value = message.keyValue[Object.keys(message.keyValue)];
                         showError(`${value} is already registered.`);
                    } else if (message.errors) {
                         const field = Object.keys(message.errors)[0];
                         showError(`${message.errors[field].message}`);
                    }
               }
          }
     };
     const showError = (error) => {
          document.getElementById("validation-error").innerText = error;
     };
     const validate = () => {
          // return true;
          // firstName
          if (isEmpty(name)) {
               showError(`Name can't be empty.`);
               return false;
          } else if (/[^a-zA-Z0-9 _]/.test(name)) {
               showError("Name can only contain alpha-numeric character [A-Z][0-9] SPACE UNDERSCORE");
               return false;
          }

          // email
          if (isEmpty(email)) {
               showError(`Email can't be empty.`);
               return false;
          } else if (!isEmail(email)) {
               showError(`${email} is not a valid email`);
               return false;
          }

          // phone number
          if (isEmpty(phoneNumber)) {
               showError(`Phone number can't be empty.`);
               return false;
          } else if (!isMobilePhone(phoneNumber)) {
               showError(`${phoneNumber} is not a valid number`);
               return false;
          }

          // password
          if (isEmpty(password)) {
               showError(`Password can't be empty.`);
               return false;
          } else if (
               !isStrongPassword(password, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 0,
                    minNumbers: 0,
                    minSymbols: 0,
               })
          ) {
               showError("Password must contain atleast 8 characters.");
               return false;
          }

          showError("");
          return true;
     };
     const handleOtpValidation = () => {
          setOtpBoxShown(false);
          navigate("/login");
     };

     return (
          <>
               {otpBoxShown && <Otp email={email} role={role} onOtpValidate={handleOtpValidation} />}
               <Heading>Register</Heading>

               <Form>
                    <ClientType>
                         <ClientTypeOptions style={{ opacity: `${role === "tenant" ? 1 : 0.5}` }}>
                              I need a space
                         </ClientTypeOptions>
                         <Slider
                              name="clientType"
                              id="clientType"
                              checked={role === "owner" ? true : false}
                              onChange={handleClientTypeChange}
                         />
                         <ClientTypeOptions style={{ opacity: `${role === "owner" ? 1 : 0.5}` }}>
                              I own a space
                         </ClientTypeOptions>
                    </ClientType>

                    <Input
                         id="name"
                         type="text"
                         value={name}
                         name="name"
                         onChange={handleNameChange}
                         placeholder="Name"
                         required="true"
                         minLength="1"
                         maxLength="100"
                    />
                    <Input
                         id="email"
                         type="email"
                         value={email}
                         name="email"
                         onChange={handleEmailChange}
                         placeholder="Email"
                         required="true"
                         minLength="5"
                         maxLength="100"
                    />
                    <Input
                         id="phoneNumber"
                         type="tel"
                         value={phoneNumber}
                         name="phoneNumber"
                         onChange={handlePhoneNumberChange}
                         placeholder="Phone Number"
                         required="true"
                         minLength="10"
                         maxLength="10"
                    />
                    <Input
                         id="password"
                         type="password"
                         value={password}
                         name="password"
                         onChange={handlePasswordChange}
                         placeholder="Password"
                         required="true"
                         minLength="8"
                         maxLength="64"
                    />

                    <Errors id="validation-error"></Errors>

                    <SubmitButton type="submit" onClick={handleRegisterSubmit}>
                         Create an account
                    </SubmitButton>
               </Form>
          </>
     );
};

export default Register;
