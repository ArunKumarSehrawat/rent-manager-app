import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Axios from "axios";
import store from "../../../redux/store";
import { GlobalStyles } from "../../../GlobalStyles";
import * as ACTIONS from "../../../redux/actionTypes";
import Cookies from "universal-cookie";
// import InfoPopup from "../../InfoPopup";

const cookies = new Cookies();

const Years = () => {
     const navigate = useNavigate();
     useEffect(() => {
          (async function () {
               const token = cookies.get("accessToken");
               if (!token) return navigate("/login");
               else if (token) {
                    try {
                         const response = await Axios({
                              method: "get",
                              headers: { authorization: `Bearer ${token}` },
                              url: "http://localhost:3001/owner/years",
                         });

                         if (response.status === 200) {
                              store.dispatch({ type: ACTIONS.YEAR.UPDATED_ALL, payload: response.data.years });
                         }
                    } catch (error) {
                         console.log(error.message);
                    }
               }
          })();
          // eslint-disable-next-line
     }, []);

     const yearsList = Object.keys(useSelector((state) => state.years));
     const [showYearCreationModal, setShowYearCreationModal] = useState(false);
     const [createNewYear, setCreateNewYear] = useState("");
     const currentSelectedYear = useParams().year;
     const handleYearListSelect = (e) => {
          navigate(`/dashboard/years/${e.target.dataset.year}`);
     };
     const handleYearDelete = async (e) => {
          const { id: yearToDelete } = e.target;
          const { accessToken } = store.getState().user;
          if (accessToken) {
               const instance = Axios.create({
                    method: "DELETE",
                    baseURL: `http://localhost:3001/owner/years/${yearToDelete}`,
                    headers: {
                         authorization: `Bearer ${accessToken}`,
                    },
               });

               try {
                    const response = await instance();
                    if (response.status === 200 && response.data.message === `Year ${yearToDelete} deleted`) {
                         navigate("/dashboard/years");
                         store.dispatch({ type: ACTIONS.YEAR.DELETED, payload: yearToDelete });
                    }
               } catch (error) {
                    console.log(error.message);
               }
          }
     };
     const handleYearListScroll = (e) => {
          // const yearContainer = document.getElementById("yearsContainer");
          // yearContainer.scrollLeft += e.deltaY * 2;
     };
     const toggleYearCreationModal = (e) => {
          setShowYearCreationModal((prevState) => !prevState);
     };
     const handleCreateYearChange = (e) => {
          setCreateNewYear((prevState) => e.target.value);
     };
     const generateNewYear = async (e) => {
          e.preventDefault();
          const { accessToken } = store.getState().user;
          if (accessToken) {
               const instance = Axios.create({
                    method: "POST",
                    baseURL: `http://localhost:3001/owner/years/${createNewYear}`,
                    headers: {
                         authorization: `Bearer ${accessToken}`,
                    },
               });

               try {
                    const response = await instance();
                    if (response.status === 200 && response.data.message === `Year ${createNewYear} created`) {
                         // setShowYearCreationModal(false);
                         const input = document.getElementById("createNewYear");
                         input.classList.remove("year-creation-error");
                         store.dispatch({ type: ACTIONS.YEAR.ADDED, payload: { year: createNewYear, [createNewYear]: response.data[createNewYear] } });
                    } else if (response.status === 200 && response.data.message === `Year ${createNewYear} already exists`) {
                         const input = document.getElementById("createNewYear");
                         input.classList.add("shake");
                         input.classList.add("year-creation-error");
                         setTimeout(() => {
                              input.classList.remove("shake");
                         }, 150);
                    }
               } catch (error) {
                    console.log(error.message);
               }
          }
     };

     return (
          <>
               {/* <InfoPopup message="Error creating year 2021" error={true} color="green"/> */}
               <Container id="yearsContainer" onWheel={handleYearListScroll}>
                    {yearsList.map((year) => (
                         <Card key={year} data-year={year} onClick={handleYearListSelect}>
                              <h1 style={{ color: currentSelectedYear === year ? "white" : "#444444" }} data-year={year}>
                                   {year}
                              </h1>
                              <div id={year} className="delete-year" onClick={handleYearDelete}></div>
                         </Card>
                    ))}
                    <Card onClick={toggleYearCreationModal}>
                         <div className="create-year"></div>
                    </Card>
               </Container>
               {showYearCreationModal && (
                    <Modal id="year-creation-modal">
                         <div className="modal-header">Add a new year</div>
                         <form className="modal-body">
                              <input
                                   id="createNewYear"
                                   type="tel"
                                   name="newYear"
                                   value={createNewYear}
                                   onChange={handleCreateYearChange}
                                   autoFocus={true}
                                   minLength={4}
                                   maxLength={4}
                                   placeholder={new Date().getFullYear()}
                              />
                              <button type="submit" className="btn" onClick={generateNewYear}>
                                   Create
                              </button>
                              <button className="btn" onClick={toggleYearCreationModal}>
                                   Cancel
                              </button>
                         </form>
                    </Modal>
               )}

               <Outlet />
          </>
     );
};

export default Years;

const Container = styled.div`
     display: flex;
     padding-block: 1rem;
     width: 100%;
     gap: 1rem;
     overflow-x: auto;
     scroll-behavior: smooth;
     scroll-snap-type: x mandatory;
`;

const Card = styled.div`
     scroll-snap-align: start;
     background-image: linear-gradient(to bottom right, #ff69b4, #dd1684);
     height: 100px;
     min-width: 100px;
     border-radius: 10px;
     display: flex;
     align-items: center;
     justify-content: center;
     cursor: pointer;
     position: relative;
     transition: transform 150ms;

     :hover h1 {
          transform: scale(1.05);
     }
     :hover .create-year {
          transform: rotate(90deg);
     }
     h1 {
          transition: transform 150ms;
     }

     .delete-year {
          background-color: black;
          position: absolute;
          height: 30px;
          width: 30px;
          top: 0;
          right: 0;
          border-radius: 50%;
          transform: translate(50%, -50%);
          display: flex;
          justify-content: center;
          align-items: center;
          ::before,
          ::after {
               content: "";
               position: absolute;
               height: 25px;
               width: 4px;
               border-radius: 1em;
               background-color: gray;
               transform: rotate(45deg);
          }
          ::after {
               transform: rotate(-45deg);
          }
          :hover::before,
          :hover::after {
               background-color: #ff6600;
          }
     }

     .create-year {
          background-color: white;
          height: 60px;
          width: 60px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 250ms;

          :hover {
               transform: rotate(180deg);
          }

          ::before,
          ::after {
               content: "";
               position: absolute;
               height: 30px;
               width: 6px;
               border-radius: 1em;
               background-color: hotpink;
          }
          ::after {
               transform: rotate(90deg);
          }
     }
`;

const Modal = styled.div`
     background-color: ${GlobalStyles.themeSemiDark};
     width: 100%;
     margin-block: 1rem;
     border-radius: 10px;
     padding: 0.5rem 0.75rem;
     display: flex;
     justify-content: space-between;
     align-items: center;

     &.opening {
          transform: translateY(-50%);
          animation: slide-from-top 150ms forwards;

          @keyframes slide-from-top {
               0% {
                    transform: translateY(-50%);
                    opacity: 0;
               }
               100% {
                    transform: translateY(0%);
                    opacity: 1;
               }
          }
     }

     .modal-body {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          font-size: 1rem;

          input {
               border-radius: 10px;
               border: none;
               padding: 0.25rem 0.5rem;
               font-size: inherit;
               outline: none;
               color: black;

               .shake {
                    animation: shake 150ms ease-in forwards;
               }

               @keyframes shake {
                    25% {
                         transform: translateX(-20px);
                    }
                    50% {
                         transform: translateX(0%);
                    }
                    75% {
                         transform: translateX(20px);
                    }
                    100% {
                         transform: translateX(0%);
                    }
               }
          }
          input.year-creation-error {
               outline: 4px solid red;
          }

          .btn {
               background-color: hotpink;
          }

          .btn:last-child {
               background-color: gray;
          }
     }
`;
