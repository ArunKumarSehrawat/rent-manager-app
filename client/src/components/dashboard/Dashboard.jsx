import styled from "styled-components";
import { GlobalStyles } from "../../GlobalStyles";
import Axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { MdHome, MdMiscellaneousServices, MdLogout } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import Cookies from "universal-cookie/es6";
const cookies = new Cookies();

const Dashboard = () => {
     const navigate = useNavigate();
     const [activeSidebarElement, setActiveSidebarElement] = useState("Home");
     console.log(useParams(), window.location.href);

     // useEffect(() => {
     //      (async function () {
     //           const token = cookies.get("access_token");
     //           if (!token) navigate("/login");
     //           else if (token) {
     //                const request = Axios.create({
     //                     method: "POST",
     //                     baseURL: "http://localhost:3001/login",
     //                     headers: {
     //                          authorization: `BEARER ${token}`,
     //                     },
     //                });

     //                try {
     //                     const response = await request();
     //                     if (response.status !== 200 && response.data.message !== "Authenticated") navigate("/login");
     //                } catch (error) {
     //                     console.log(error.message);
     //                }
     //           }
     //      })();
     // });

     const handleSidebarElementChange = (e) => {
          const option = e.target.innerText;
          setActiveSidebarElement(option);
          navigate(`/dashboard/${option.toLowerCase()}`);
     };
     const handleLogout = () => {
          cookies.remove("access_token");
          navigate("/");
     };

     return (
          <DashboardWrapper>
               <Sidebar>
                    <SidebarElements>
                         <SidebarMainElement onClick={handleSidebarElementChange} style={{ color: activeSidebarElement === "Home" ? "yellow" : "white" }}>
                              <MdHome />
                              Home
                         </SidebarMainElement>
                         <SidebarMainElement onClick={handleSidebarElementChange} style={{ color: activeSidebarElement === "Year" ? "yellow" : "white" }}>
                              <BiTime />
                              Year
                         </SidebarMainElement>
                         <SidebarMainElement onClick={handleSidebarElementChange} style={{ color: activeSidebarElement === "Tenants" ? "yellow" : "white" }}>
                              <BsFillPeopleFill />
                              Tenants
                         </SidebarMainElement>
                         <SidebarMainElement onClick={handleSidebarElementChange} style={{ color: activeSidebarElement === "Parameters" ? "yellow" : "white" }}>
                              <MdMiscellaneousServices />
                              Parameters
                         </SidebarMainElement>
                         <SidebarMainElement onClick={handleLogout}>
                              <MdLogout />
                              Logout
                         </SidebarMainElement>
                    </SidebarElements>
               </Sidebar>
               <Outlet />
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
     flex: 10;
`;
const SidebarElements = styled.ul`
     height: 100%;
     display: flex;
     flex-direction: column;
     justify-content: space-evenly;
     align-items: center;
     margin-inline: 1rem;
`;

const SidebarMainElement = styled.span`
     font-size: 20px;
     display: flex;
     align-items: center;
     gap: 0.5rem;
     cursor: pointer;
     padding-inline: 0.25rem;
     transition: transform 150ms, background 250ms;
     border-radius: 10px;

     :hover {
          transform: scale(1.05);
          background: #aaa;
     }
`;
