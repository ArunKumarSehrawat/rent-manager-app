import styled from "styled-components";
import { GlobalStyles } from "../../GlobalStyles";
import moreInfoSVG from "./info-with-circle.svg";

export const InputWrapper = styled.div`
     display: flex;
     flex-direction: column;
     justify-content: space-between;
     /* align-items: center; */
     gap: 0.25rem;
     width: 100%;
     margin: auto;
`;

export const Inputs = styled.input`
     border-radius: 10px;
     outline: none;
     border: none;
     padding: 0.5rem;
     font-size: 1rem;
     width: clamp(250px, 100%, 900px);
     color: black;
     background-color: ${GlobalStyles.themeFont};

     ::placeholder {
          color: ${GlobalStyles.themeDark};
     }

     ::-webkit-outer-spin-button,
     ::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
     }

     &[type="number"] {
          -moz-appearance: textfield;
     }

     &[type="date"]::-webkit-calendar-picker-indicator {
          transform: scale(1.5);
          cursor: pointer;
     }
`;

export const Label = styled.label`
     font-size: 1rem;
     position: relative;

     .tooltip {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: inline-block;
          background-image: url(${moreInfoSVG});
          /* background-position: center center; */
          background-size: cover;

          color: white;
          height: 20px;
          width: 20px;
          margin-left: 0.5rem;

          :hover span {
               position: absolute;
               left: 100%;
               top: 50%;
               transform: translateY(-50%);

               display: block;
               width: 225px;
               background-color: ${GlobalStyles.themeDark};
               font-size: 0.75rem;
               padding: 0.5rem;
               border-radius: 10px;
          }

          span {
               display: none;
          }
     }
`;

const Input = (props) => {
     return (
          <InputWrapper>
               <Label htmlFor={props.id}>{props.label || props.placeholder}</Label>
               <Inputs
                    id={props.id}
                    type={props.type}
                    value={props.value}
                    name={props.name}
                    placeholder={props.placeholder}
                    onChange={props.onChange}
                    minLength={props.minLength}
                    maxLength={props.maxLength}
                    required={props.required ? true : false}
                    spellCheck="false"
               />
          </InputWrapper>
     );
};

export default Input;
