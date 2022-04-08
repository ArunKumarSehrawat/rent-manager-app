import styled from "styled-components";
import { GlobalStyles } from "../../GlobalStyles";
import Axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie/es6";
const cookies = new Cookies();

const Dashboard = () => {
     useEffect(() => {
          (async function () {
               const token = cookies.get("access_token");
               if (!token) navigate("/login");
               else if (token) {
                    const request = Axios.create({
                         method: "POST",
                         baseURL: "http://localhost:3001/login",
                         headers: {
                              authorization: `BEARER ${token}`,
                         },
                    });

                    try {
                         const response = await request();
                         if (response.status !== 200 && response.data.message !== "Authenticated") navigate("/login");
                    } catch (error) {
                         console.log(error.message);
                    }
               }
          })();
     });

     const navigate = useNavigate();
     const handleLogout = () => {
          cookies.remove("access_token");
          navigate("/");
     };

     return (
          <DashboardWrapper>
               <Sidebar></Sidebar>
               <Main>
                    <Logout onClick={handleLogout}>Logout</Logout>
               </Main>
          </DashboardWrapper>
     );
};

export default Dashboard;

const DashboardWrapper = styled.div`
     display: flex;
`;
const Sidebar = styled.div`
     background-color: rgb(10, 10, 10);
     min-height: 100vh;
     flex: 1;
`;
const Main = styled.div`
     background-color: rgb(225, 225, 255);
     min-height: 100vh;
     flex: 4;
`;
const Logout = styled.button`
     background: ${GlobalStyles.themeDark};
     color: ${GlobalStyles.themeFont};
     font-size: 20px;
     padding: 0.5em 1em;
     border-radius: 10px;
     position: relative;
     top: 50px;
     left: 50px;
     outline: none;
     border: none;
     cursor: pointer;
     transition: transform 150ms;

     :hover {
          opacity: 0.9;
          transform: scale(1.02);
     }
`;
