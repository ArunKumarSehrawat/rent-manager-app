import styled from "styled-components";
import { GlobalStyles } from "../../GlobalStyles";
import Axios from "axios";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// eslint-disable-next-line
import { MdHome, MdMiscellaneousServices, MdLogout } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import * as ACTIONS from "../../redux/actionTypes";
import Cookies from "universal-cookie/es6";
import store from "../../redux/store";
import { capitalize, lowerCase } from "lodash";
const cookies = new Cookies();

const Dashboard = () => {
     const navigate = useNavigate();
     const tab = window.location.href.split("/")[4] || "home";
     const [activeSidebarElement, setActiveSidebarElement] = useState(capitalize(tab));

     useEffect(() => {
          (async function () {
               const token = cookies.get("accessToken");
               if (!token) return navigate("/login");
               else if (token) {
                    try {
                         const response = await Axios({
                              method: "post",
                              headers: { authorization: `Bearer ${token}` },
                              url: "http://localhost:3001/login",
                         });

                         if (response.status !== 200 && response.data.message !== "Authenticated") navigate("/login");
                         else if (response.status === 200 && response.data.message === "Authenticated") {
                              const { user } = response.data;
                              store.dispatch({ type: ACTIONS.USER.LOGGED_IN, payload: { user } });
                         }
                    } catch (error) {
                         console.log(error.message);
                    }
               }
          })();
          // eslint-disable-next-line
     }, []);

     const handleSidebarElementChange = (e) => {
          const option = e.target.innerText;
          setActiveSidebarElement(option);
          navigate(`/dashboard/${lowerCase(option)}`);
     };
     const handleLogout = () => {
          /**
           * sometimes the cookie containing the access token doesn't gets deleted
           */
          cookies.remove("accessToken");
          store.dispatch({ type: ACTIONS.USER.LOGGED_OUT });
          store.dispatch({ type: ACTIONS.YEAR.UPDATED_ALL, payload: {} });
          navigate("/login");
     };
     const activeSidebarColor = (element, activeSidebarElement) => ({ color: activeSidebarElement === element ? "hotpink" : "white" });

     return (
          <DashboardWrapper>
               <Sidebar>
                    <SidebarElements>
                         <SidebarMainElement onClick={handleSidebarElementChange} style={activeSidebarColor("Home", activeSidebarElement)}>
                              <MdHome />
                              Home
                         </SidebarMainElement>
                         <SidebarMainElement onClick={handleSidebarElementChange} style={activeSidebarColor("Years", activeSidebarElement)}>
                              <BiTime />
                              Years
                         </SidebarMainElement>
                         <SidebarMainElement onClick={handleSidebarElementChange} style={activeSidebarColor("Tenants", activeSidebarElement)}>
                              <BsFillPeopleFill />
                              Tenants
                         </SidebarMainElement>
                         {/* <SidebarMainElement onClick={handleSidebarElementChange} style={activeSidebarColor("Parameters", activeSidebarElement)}>
                              <MdMiscellaneousServices />
                              Parameters
                         </SidebarMainElement> */}
                         <SidebarMainElement onClick={handleLogout}>
                              <MdLogout />
                              Logout
                         </SidebarMainElement>
                    </SidebarElements>
               </Sidebar>
               <Main>
                    <Outlet />
               </Main>
          </DashboardWrapper>
     );
};

export default Dashboard;

const DashboardWrapper = styled.div`
     display: flex;
     height: calc(100vh - 1rem);
     gap: 0.5rem;
     margin: 0.5rem;
     justify-content: stretch;
`;
const Sidebar = styled.div`
     background-color: rgb(10, 10, 10);
     min-height: 100%;
     flex: 1;
     border-radius: 10px;
`;
const SidebarElements = styled.ul`
     height: 100%;
     display: flex;
     flex-direction: column;
     justify-content: space-evenly;
     align-items: center;
     margin-inline: 0.5rem;

     @media (max-width: 1000px) {
     }
`;

const SidebarMainElement = styled.span`
     font-size: 1.25rem;
     display: flex;
     align-items: center;
     gap: 0.5rem;
     cursor: pointer;
     padding-inline: 0.25rem;
     transition: transform 150ms, background-color 150ms;
     border-radius: 10px;

     :hover {
          transform: scale(1.05);
          background-color: #3f3f3f;
     }
`;
const Main = styled.div`
     background-color: ${GlobalStyles.themeDark};
     padding: 1rem;
     /* min-height: calc(100vh - 1rem); */
     flex: 20;
     border-radius: 10px;
     position: relative;
     overflow-y: auto;
`;
