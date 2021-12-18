import styled from "styled-components";
import { GlobalStyles } from "../../GlobalStyles";

const Switch = styled.label`
     position: relative;
     display: inline-block;
     width: 60px;
     height: 25px;

     input {
          opacity: 0;
          width: 0;
          height: 0;
     }

     input:checked + span {
          background-color: ${GlobalStyles.themeSemiLight};
     }
     input:focus + span {
          box-shadow: 0 0 1px #2196f3;
     }

     input:checked + span:before {
          -webkit-transform: translateX(30px);
          -ms-transform: translateX(30px);
          transform: translateX(30px);
     }
`;

const Span = styled.span`
     position: absolute;
     cursor: pointer;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     background-color: ${GlobalStyles.themeSemiLight};
     -webkit-transition: 0.4s;
     transition: 0.4s;
     border-radius: 1em;

     :before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 5px;
          bottom: 2.5px;
          background-color: ${GlobalStyles.themeFont};
          border-radius: 50%;

          -webkit-transition: 0.4s;
          transition: 0.4s;
     }
`;

const Slider = (props) => {
     return (
          <Switch>
               <input
                    name={props.name}
                    id={props.id}
                    type="checkbox"
                    onChange={props.onChange}
                    checked={props.checked ? true : false}
               />
               <Span />
          </Switch>
     );
};

export default Slider;
