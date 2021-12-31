import styled from "styled-components";
import { GlobalStyles } from "../GlobalStyles";

const NavbarWrapper = styled.nav`
     display: flex;
     justify-content: space-between;
     gap: 16px;
     align-items: center;
     flex-wrap: wrap;
     flex-grow: 2;
     flex-shrink: 0;
     padding: 8px 8px;
     font-size: 0.75rem;
     background-color: ${GlobalStyles.themeDark};
     min-width: 300px;

     @media (max-width: 700px) {
          justify-content: center;
     }
`;

const NavbarHome = styled.a`
     text-decoration: none;
     color: ${GlobalStyles.themeFont};
     font-size: 30px;
     width: max-content;
`;

const NavbarLinks = styled.ul`
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
     gap: 1rem;
     list-style-type: none;

     a {
          text-decoration: none;
          position: relative;
          color: ${GlobalStyles.themeFont};
     }
     a::before {
          content: "";
          position: absolute;
          width: 0;
          inset: calc(100% - 1px) 0 0 0;
          background-color: ${GlobalStyles.themeFont};
          transition: width 100ms;
          transform-origin: left;
     }
     a:hover::before {
          width: 100%;
     }
     a::after {
          content: "";
          position: absolute;
          width: 0;
          inset: 0 0 calc(100% - 1px) 0;
          background-color: ${GlobalStyles.themeFont};
          transition: width 100ms;
          transform-origin: right;
     }
     a:hover::after {
          width: 50%;
     }
`;

const Navbar = () => {
     return (
          <NavbarWrapper>
               <NavbarHome href="/">Manage MySpace</NavbarHome>
               <NavbarLinks>
                    <li>
                         <a href="/">Home</a>
                    </li>
                    <li>
                         <a href="/contact">Contact Us</a>
                    </li>
                    <li>
                         <a href="/login">Login</a>
                    </li>
                    <li>
                         <a href="/register">Register</a>
                    </li>
               </NavbarLinks>
          </NavbarWrapper>
     );
};

export default Navbar;
