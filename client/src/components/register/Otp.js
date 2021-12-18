import styled from "styled-components";
import { useState } from "react";
import { GlobalStyles } from "../../GlobalStyles";
import "./otpStyle.css";
import { SubmitButton } from "./Register";
import Axios from "axios";

const OtpWrapper = styled.div`
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
     height: clamp(200px, 50vh, 500px);
     width: clamp(300px, 50vw, 500px);
     background-color: ${GlobalStyles.themeDark};
     z-index: 100;
     border-radius: 20px;
     padding: 1rem;

     display: flex;
     flex-direction: column;
     justify-content: space-between;
     align-items: center;

     h1 {
          font-size: 25px;
     }
     p {
          font-size: 14px;
     }
`;

const OtpInputs = styled.form`
     display: flex;
     justify-content: center;
     gap: 16px;
     margin: auto;
     margin-block: 1rem;
     width: clamp(200px, 100%, 400px);

     input {
          width: 40px;
          height: 40px;
          color: black;
          font-size: 40px;
          text-align: center;
          outline: none;
          border: none;
          border-radius: 5px;
     }
`;

const Error = styled.p`
     color: green;
     text-align: center;
     margin-top: 16px;
`;

const Otp = (props) => {
     const [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
     const [tries, setTries] = useState(3);
     const handleOtpChange = (e) => {
          const { id, value } = e.target;
          if (!otpValue[id] && value && id !== "5") document.getElementById(`${Number(id) + 1}`).focus();
          const newState = [...otpValue];
          newState[Number(id)] = value;
          setOtpValue(newState);

          // show error if OTP is not 6 digits long
          const otpError = document.getElementById("otpValidationMessage");
          if (newState.join("").length < 6) {
               otpError.style.color = "orange";
               otpError.innerText = "OTP must be of 6 digits";
          } else {
               otpError.innerText = "";
               otpError.style.color = "green";
          }
     };
     const handleOtpSubmit = async (e) => {
          e.preventDefault();
          const OTP = otpValue.join("");
          try {
               // check if the OTP is correct
               const {
                    status,
                    data: { message },
               } = await Axios.post(`https://localhost:3001/register`, {
                    OTP,
                    EMAIL: props.email,
                    ROLE: props.role,
               });
               if (status === 200 || status === 201) {
                    document.getElementById("otpValidationMessage").innerText = message;
                    setTimeout(() => {
                         props.onOtpValidate();
                    }, 1000);
               }
          } catch (error) {
               const { message } = error.response.data;
               if (message && tries !== 0) {
                    const inputs = document.getElementById("otpInputGroup");
                    inputs.classList.add("shake");
                    setTimeout(() => {
                         inputs.classList.remove("shake");
                    }, 150);

                    document.getElementById("otpValidationMessage").style.color = "orange";
                    document.getElementById("otpValidationMessage").innerText = message;

                    setTries(tries - 1);
               }
          }
     };

     return (
          <div
               style={{
                    position: "absolute",
                    height: "100%",
                    width: "100vw",
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    zIndex: 100,
               }}
          >
               <OtpWrapper>
                    <h1>OTP Verification</h1>
                    <div>
                         <p>
                              An OTP was sent to <strong>{props.email}</strong>, and is valid for 10 minutes.
                         </p>
                         <OtpInputs id="otpInputGroup">
                              <input
                                   id="0"
                                   name="otp1"
                                   type="tel"
                                   minLength="1"
                                   maxLength="1"
                                   placeholder="0"
                                   value={otpValue[0]}
                                   onChange={handleOtpChange}
                                   required={true}
                                   autoFocus={true}
                              />
                              <input
                                   id="1"
                                   name="otp2"
                                   type="tel"
                                   minLength="1"
                                   maxLength="1"
                                   placeholder="0"
                                   value={otpValue[1]}
                                   onChange={handleOtpChange}
                                   required={true}
                              />
                              <input
                                   id="2"
                                   name="otp3"
                                   type="tel"
                                   minLength="1"
                                   maxLength="1"
                                   placeholder="0"
                                   value={otpValue[2]}
                                   onChange={handleOtpChange}
                                   required={true}
                              />
                              <input
                                   id="3"
                                   name="otp4"
                                   type="tel"
                                   minLength="1"
                                   maxLength="1"
                                   placeholder="0"
                                   value={otpValue[3]}
                                   onChange={handleOtpChange}
                                   required={true}
                              />
                              <input
                                   id="4"
                                   name="otp5"
                                   type="tel"
                                   minLength="1"
                                   maxLength="1"
                                   placeholder="0"
                                   value={otpValue[4]}
                                   onChange={handleOtpChange}
                                   required={true}
                              />
                              <input
                                   id="5"
                                   name="otp6"
                                   type="tel"
                                   minLength="1"
                                   maxLength="1"
                                   placeholder="0"
                                   value={otpValue[5]}
                                   onChange={handleOtpChange}
                                   required={true}
                              />
                         </OtpInputs>
                         <SubmitButton form="otpInputContainer" type="submit" onClick={handleOtpSubmit}>
                              Verify OTP
                         </SubmitButton>

                         <Error id="otpValidationMessage"></Error>
                    </div>

                    <p>
                         You have {tries} {tries > 1 ? "tries" : "try"} remaining
                    </p>
               </OtpWrapper>
          </div>
     );
};

export default Otp;
