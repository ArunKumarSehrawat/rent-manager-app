import Axios from "axios";
import { useState } from "react";
import store from "../../redux/store";
import * as ACTIONS from "../../redux/actionTypes";
import styled from "styled-components";
import { isEmpty, isEmail, isMobilePhone, isStrongPassword } from "validator";
import { useNavigate } from "react-router-dom";
import { GlobalStyles } from "../../GlobalStyles";
import Input from "./Input";
import Otp from "./Otp";
import { useSelector } from "react-redux";

const Register = () => {
     // console.log(GlobalStyles.themeSemiDark.split(/\(|\)/));
     const navigate = useNavigate();
     const role = useSelector((state) => state.register.role);
     const name = useSelector((state) => state.register.name);
     const email = useSelector((state) => state.register.email);
     const phoneNumber = useSelector((state) => state.register.phoneNumber);
     const password = useSelector((state) => state.register.password);
     const [otpBoxShown, setOtpBoxShown] = useState(false);

     const handleNameChange = (e) => {
          store.dispatch({
               type: ACTIONS.REGISTER.NAME_UPDATED,
               payload: { name: e.target.value },
          });
     };
     const handleEmailChange = (e) => {
          store.dispatch({
               type: ACTIONS.REGISTER.EMAIL_UPDATED,
               payload: { email: e.target.value },
          });
     };
     const handlePhoneNumberChange = (e) => {
          store.dispatch({
               type: ACTIONS.REGISTER.PHONE_NUMBER_UPDATED,
               payload: { phoneNumber: e.target.value },
          });
     };
     const handlePasswordChange = (e) => {
          store.dispatch({
               type: ACTIONS.REGISTER.PASSWORD_UPDATED,
               payload: { password: e.target.value },
          });
     };

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
                         // setOtpBoxShown(true);
                         navigate("/login");
                    }
               } catch (err) {
                    if (err?.message === "Network Error") return showError("Couldn't connect to server. Please try again later.");

                    const { message } = err?.response?.data;
                    if (message?.code === 11000) {
                         const value = message.keyValue[Object.keys(message.keyValue)];
                         return showError(`${value} is already registered.`);
                    } else if (message?.errors) {
                         const field = Object.keys(message.errors)[0];
                         return showError(`${message.errors[field].message}`);
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
                    <Input id="name" type="text" value={name} name="name" onChange={handleNameChange} placeholder="Name" required="true" minLength="1" maxLength="100" />
                    <Input id="email" type="email" value={email} name="email" onChange={handleEmailChange} placeholder="Email" required="true" minLength="5" maxLength="100" />
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
                    <Input id="password" type="password" value={password} name="password" onChange={handlePasswordChange} placeholder="Password" required="true" minLength="8" maxLength="64" />

                    <Errors id="validation-error"></Errors>

                    <SubmitButton type="submit" onClick={handleRegisterSubmit}>
                         Create an account
                    </SubmitButton>
               </Form>
          </>
     );
};

export default Register;

export const Form = styled.form`
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     gap: 1rem;
     width: clamp(300px, 25%, 1920px);
     margin: 1rem auto;

     /* used in tenant creation */
     select {
          border-radius: 10px;
          outline: none;
          border: none;
          padding: 0.5rem;
          font-size: 1rem;
          width: clamp(250px, 100%, 900px);
          color: black;
          background-color: ${GlobalStyles.themeFont};

          option {
               color: black;
          }
     }
`;

export const SubmitButton = styled.button`
     width: clamp(250px, 100%, 900px);
     border-radius: 10px;
     border: none;
     outline: none;
     padding: 0.5rem;
     font-size: 1rem;
     font-weight: bold;
     cursor: pointer;
     background-color: ${GlobalStyles.themeSemiLight};
     color: ${GlobalStyles.themeFont};
     transition: filter 150ms;

     :hover {
          filter: brightness(0.75);
     }
`;

export const Heading = styled.h1`
     text-align: center;
     margin-block: 1rem;
     font-size: 2rem;
     min-width: 300px;
`;

export const Errors = styled.p`
     color: orange;
     text-align: center;
     font-size: 1rem;
     min-width: 300px;
`;
