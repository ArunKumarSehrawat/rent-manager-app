import styled from "styled-components";
import { GlobalStyles } from "../../GlobalStyles";

const InputWrapper = styled.div`
     display: flex;
     flex-direction: column;
     justify-content: space-around;
     /* align-items: center; */
     gap: 0.15rem;
     width: 100%;
     margin: auto;
`;

const Inputs = styled.input`
     border-radius: 10px;
     outline: none;
     border: none;
     padding: 0.5rem;
     font-size: 16px;
     width: clamp(250px, 100%, 900px);
     color: ${GlobalStyles.themeDark};
     background-color: ${GlobalStyles.themeFont};

     ::placeholder {
          color: ${GlobalStyles.themeDark};
     }

     ::-webkit-outer-spin-button,
     ::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
     }

     [type="number"] {
          -moz-appearance: textfield;
     }
`;

const Label = styled.label`
     font-size: 16px;
     /* text-align: center; */
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
