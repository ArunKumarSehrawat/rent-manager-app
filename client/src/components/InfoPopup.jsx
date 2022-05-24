import styled from "styled-components";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { MdError } from "react-icons/md";

const InfoPopup = ({ message, error, success }) => {
     return (
          <Popup>
               {error ? <MdError fill="orange" /> : <BsFillPatchCheckFill fill="green" />}
               <div className="popup-message">{message}</div>
          </Popup>
     );
};

export default InfoPopup;

const Popup = styled.div`
     position: absolute;
     z-index: 1000;
     left: 50%;
     transform: translateX(-50%);
     height: 50px;
     background-color: white;
     border-radius: 10px;
     padding: 0.75rem 0.5rem;
     display: flex;
     align-items: center;
     justify-content: center;
     gap: 0.5rem;

     .popup-message {
          /* color: ${(props) => (props.error ? "red" : "green")}; */
          color: inherit;
          font-size: 0.75rem;
     }
`;
