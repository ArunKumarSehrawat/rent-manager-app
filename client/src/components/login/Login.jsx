import Axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "../../redux/store";
import * as ACTIONS from "../../redux/actionTypes";
// import styled from "styled-components";
import { isEmpty, isEmail, isStrongPassword } from "validator";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie/es6";
import Input from "../register/Input";
import { Form } from "../register/Register";
import { SubmitButton } from "../register/Register";
import { Heading } from "../register/Register";
import { Errors } from "../register/Register";

const cookies = new Cookies();

const Login = () => {
     const email = useSelector((state) => state.login.email);
     const password = useSelector((state) => state.login.password);

     useEffect(() => {
          (async function () {
               const token = cookies.get("access_token");
               if (token) {
                    const instance = Axios.create({
                         method: "POST",
                         baseURL: "http://localhost:3001/login",
                         headers: {
                              authorization: `BEARER ${token}`,
                         },
                    });

                    try {
                         const response = await instance();
                         if (response.status === 200 && response.data.message === "Authenticated") navigate("/dashboard");
                    } catch (error) {
                         console.log(error.message);
                    }
               }
          })();
     });
     const navigate = useNavigate();
     const handleEmailChange = (e) => {
          store.dispatch({ type: ACTIONS.LOGIN_EMAIL_UPDATED, payload: { email: e.target.value } });
     };
     const handlePasswordChange = (e) => {
          store.dispatch({ type: ACTIONS.LOGIN_PASSWORD_UPDATED, payload: { password: e.target.value } });
     };
     const handleLoginSubmit = async (e) => {
          console.log(store.getState());
          e.preventDefault();
          if (validate()) {
               // submit the form
               try {
                    const { email, password } = store.getState().login;
                    const response = await Axios.post("http://localhost:3001/login", {
                         EMAIL: email,
                         PASSWORD: password,
                    });

                    if (response.status === 201 || response.status === 200) {
                         cookies.set("access_token", response.data["access_token"], { path: "/" });
                         navigate("/dashboard");
                    }
               } catch (err) {
                    // const { message } = err.response.data;
                    // showError(`${message}`);
                    showError(`${err.response.data.message}`);
                    // console.log(err);
               }
          }
     };
     const showError = (error) => (document.getElementById("validation-error").innerText = error);
     const validate = () => {
          const { email, password } = store.getState().login;
          // return true;
          // email
          if (isEmpty(email)) {
               showError(`Email can't be empty.`);
               return false;
          } else if (!isEmail(email)) {
               showError("Email is not valid.");
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
     return (
          <>
               <Heading>Login</Heading>
               <Form>
                    <Input id="email" value={email} type="text" name="email" onChange={handleEmailChange} placeholder="Email" required="true" minLength="1" maxLength="100" />
                    <Input id="password" value={password} type="password" name="password" onChange={handlePasswordChange} placeholder="Password" required="true" minLength="8" maxLength="64" />
                    <Errors id="validation-error"></Errors>
                    <SubmitButton type="submit" onClick={handleLoginSubmit}>
                         Login
                    </SubmitButton>
               </Form>
          </>
     );
};
export default Login;
