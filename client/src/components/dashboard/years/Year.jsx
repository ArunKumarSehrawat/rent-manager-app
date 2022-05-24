import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { GlobalStyles } from "../../../GlobalStyles";
import store from "../../../redux/store";
import * as ACTIONS from "../../../redux/actionTypes";
import Axios from "axios";
import Cookies from "universal-cookie";

/**
 * MONTHS
 * AVERAGE RENT
 * NUMBER OF TENANTS
 * TOTAL
 */
export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const cookies = new Cookies();

const Year = () => {
     const COST_OF_ONE_UNIT = 9;

     const navigate = useNavigate();
     const { year } = useParams();
     const headers = ["Months", "Average Rent", "Tenants", "Total"];
     const newRecordOptions = [
          {
               header: "Space ID",
               name: "spaceId",
               placeholder: "example: Room101",
               type: "text",
               required: true,
               disabled: false,
          },
          {
               header: "Date",
               name: "date",
               type: "date",
               placeholder: new Date().toISOString().split("T")[0],
               required: true,
               disabled: false,
          },
          {
               header: "Tenant",
               name: "tenant",
               placeholder: "Mr. Tony Stark",
               type: "text",
               required: true,
               disabled: false,
          },

          {
               header: "Rent",
               name: "rent",
               placeholder: "Rent (in Ruppees)",
               type: "number",
               required: true,
               disabled: false,
          },
          {
               header: "Electricity Units From",
               name: "unitsFrom",
               placeholder: "Last Recorded Units",
               type: "number",
               required: true,
               disabled: false,
          },
          {
               header: "Electrictiy Units To",
               name: "unitsTo",
               placeholder: "Units Now",
               type: "number",
               required: true,
               disabled: false,
          },
          {
               header: "Electricity Total",
               name: "electricityTotal",
               placeholder: "Electricity Total",
               type: "number",
               required: true,
               disabled: true,
          },
          {
               header: "Other Charges",
               name: "misc",
               placeholder: "Other Charges (in Ruppees)",
               type: "number",
               required: true,
               disabled: false,
          },

          {
               header: "Payment Method",
               name: "paymentMethod",
               type: "select",
               options: ["Cash", "Cheque", "UPI", "Bank Transfer", "Internet Banking"],
               required: true,
               disabled: false,
          },
          {
               header: "Notes",
               name: "notes",
               placeholder: "Notes...",
               type: "textarea",
               required: false,
               disabled: false,
          },
          {
               header: "Total",
               name: "total",
               placeholder: "Total",
               type: "number",
               required: false,
               disabled: true,
          },
     ];
     const currentYear = useSelector((state) => state.years[year]);
     const [selectedMonths, setSelectedMonths] = useState([]);
     const updateMonthlyTotal = (month, Year) => {
          let total = 0;
          for (const spaceid in Year[month].space) total += Year[month].space[spaceid].total;
          Year[month].monthlyTotal = total;
     };
     const updateYearlyTotal = (Year) => {
          let total = 0;
          for (const month of months) total += Year[month].monthlyTotal;
          Year.yearlyTotal = total;
     };
     const handleMonthSelection = (e) => {
          const { parentElement } = e.target;
          parentElement.id ? updateSelectedMonthsState(parentElement.id) : updateSelectedMonthsState(parentElement.parentElement.id);
          function updateSelectedMonthsState(newMonth) {
               const months = [...selectedMonths];
               if (!months.includes(newMonth)) months.push(newMonth);
               else months.splice(months.indexOf(newMonth), 1);
               setSelectedMonths(months);
          }
     };
     const handleRecordCreation = async (e) => {
          e.preventDefault();
          const { year, month } = e.target.dataset;
          let newSpace = {};
          for (let i = 0; i < e.target.length - 2; i++) {
               if (e.target[i].type === "number") newSpace[e.target[i].name] = Number(e.target[i].value);
               else newSpace[e.target[i].name] = e.target[i].value;
          }

          // create a copy of the currentYear and add the record to it
          const newYear = { ...store.getState().years[year] };
          newYear[month].space[newSpace.spaceId] = newSpace;
          updateMonthlyTotal(month, newYear);
          updateYearlyTotal(newYear);

          // send request to the server
          const token = cookies.get("accessToken");
          if (!token) return navigate("/login");
          else if (token) {
               try {
                    const response = await Axios({
                         method: "PATCH",
                         headers: { authorization: `Bearer ${token}` },
                         url: `http://localhost:3001/owner/years/${year}`,
                         data: { [newYear.year]: newYear },
                    });

                    if (response.status === 200 && response?.data?.message === `Year ${year} updated`) {
                         console.log("successfully updated the year");
                         store.dispatch({
                              type: ACTIONS.YEAR.SPACE_ADDED,
                              payload: { year, [newYear.year]: newYear },
                         });
                    }
               } catch (error) {
                    console.log(error.message);
               }
          }
     };
     const handleRecordDeletion = async (e) => {
          const { year, month, spaceid } = e.target.dataset;

          // create a copy of the currentYear and add the record to it
          const newYear = { ...store.getState().years[year] };
          delete newYear[month].space[spaceid];
          updateMonthlyTotal(month, newYear);
          updateYearlyTotal(newYear);

          // send request to the server
          const token = cookies.get("accessToken");
          if (!token) return navigate("/login");
          else if (token) {
               try {
                    const response = await Axios({
                         method: "PATCH",
                         headers: { authorization: `Bearer ${token}` },
                         url: `http://localhost:3001/owner/years/${year}`,
                         data: { [newYear.year]: newYear },
                    });

                    if (response.status === 200 && response?.data?.message === `Year ${year} updated`) {
                         console.log("successfully updated the year");
                         store.dispatch({
                              type: ACTIONS.YEAR.SPACE_REMOVED,
                              payload: { year, [newYear.year]: newYear },
                         });
                    }
               } catch (error) {
                    console.log(error.message);
               }
          }
     };
     const handleRecordUpdation = (e) => {
          const { year, month, spaceid } = e.target.dataset;
          const data = store.getState().years[year][month].space[spaceid];
          document.getElementById(`${month}-record-creation-spaceId`).value = data.spaceId;
          document.getElementById(`${month}-record-creation-tenant`).value = data.tenant;
          document.getElementById(`${month}-record-creation-paymentMethod`).value = data.paymentMethod;
          document.getElementById(`${month}-record-creation-rent`).value = data.rent;
          document.getElementById(`${month}-record-creation-misc`).value = data.misc;
          document.getElementById(`${month}-record-creation-date`).value = data.date;
          document.getElementById(`${month}-record-creation-notes`).value = data.notes;
          document.getElementById(`${month}-record-creation-total`).value = data.total;
          document.getElementById(`${month}-record-creation-unitsTo`).value = data.unitsTo;
          document.getElementById(`${month}-record-creation-unitsFrom`).value = data.unitsFrom;
          document.getElementById(`${month}-record-creation-electricityTotal`).value = data.electricityTotal;
     };
     const updateTotal = (e) => {
          const month = e.target.dataset.month;
          const rent = Number(document.getElementById(`${month}-record-creation-rent`).value);
          const misc = Number(document.getElementById(`${month}-record-creation-misc`).value);
          const unitsFrom = Number(document.getElementById(`${month}-record-creation-unitsFrom`).value);
          const unitsTo = Number(document.getElementById(`${month}-record-creation-unitsTo`).value);
          const electricityTotal = document.getElementById(`${month}-record-creation-electricityTotal`);
          electricityTotal.value = (unitsTo - unitsFrom) * COST_OF_ONE_UNIT;

          document.getElementById(`${month}-record-creation-total`).value = rent + misc + Number(electricityTotal.value);
     };

     return currentYear ? (
          <YearDetails>
               <YearHeader>
                    {headers.map((header, index) => (
                         <div key={header}>{header}</div>
                    ))}
               </YearHeader>
               <YearBody>
                    {months.map((month, index) => {
                         const numberOfSpaces = Object.keys(currentYear?.[month]?.space).length;
                         const averageRent = currentYear?.[month]?.monthlyTotal / numberOfSpaces;
                         return (
                              <React.Fragment key={month}>
                                   <Month key={month} id={month} onClick={handleMonthSelection} style={{ borderRadius: selectedMonths.includes(month) && "10px 10px 0 0" }}>
                                        <div className="month">
                                             <div className="month-name">{month}</div>
                                             <div className="month-average-rent">{isNaN(averageRent) ? 0 : averageRent}</div>
                                             <div className="month-tenants">{numberOfSpaces}</div>
                                             <div className="month-total">{currentYear[month].monthlyTotal}</div>
                                        </div>
                                   </Month>
                                   <Records key={month + "-records"} style={{ display: selectedMonths.includes(month) ? "block" : "none" }} className="month-details">
                                        <div className="padding-div">
                                             <RecordsHeader>
                                                  {newRecordOptions.map((option, index) => {
                                                       return <div key={option.header}>{option.header}</div>;
                                                  })}
                                             </RecordsHeader>
                                             <RecordsBody>
                                                  <ShowExistingRecords>
                                                       {Object.keys(currentYear[month].space).map((spaceId, index) => (
                                                            <div key={index} className="existing-record-row">
                                                                 {Object.values(currentYear[month].space[spaceId]).map((detail, index) => (
                                                                      <div key={index}>{detail}</div>
                                                                 ))}
                                                                 <button className="edit" onClick={handleRecordUpdation} data-month={month} data-year={year} data-spaceid={spaceId}>
                                                                      Edit
                                                                 </button>
                                                                 <button className="delete" onClick={handleRecordDeletion} data-month={month} data-year={year} data-spaceid={spaceId}>
                                                                      Delete
                                                                 </button>
                                                            </div>
                                                       ))}
                                                  </ShowExistingRecords>
                                                  <CreateRecord name={month} id={month + "-create-record"} onSubmit={handleRecordCreation} data-month={month} data-year={year}>
                                                       {newRecordOptions.map((option, index) => {
                                                            if (option.type === "select") {
                                                                 return (
                                                                      <select key={option.header} id={`${month}-record-creation-${option.name}`} name={option.name}>
                                                                           {option.options.map((innerOption) => (
                                                                                <option key={innerOption} value={innerOption}>
                                                                                     {innerOption}
                                                                                </option>
                                                                           ))}
                                                                      </select>
                                                                 );
                                                            } else if (option.type === "date") {
                                                                 return <input key={option.header} id={`${month}-record-creation-${option.name}`} name={option.name} type="date"></input>;
                                                            } else if (option.type === "textarea") {
                                                                 return (
                                                                      <textarea
                                                                           key={option.header}
                                                                           id={`${month}-record-creation-${option.name}`}
                                                                           name={option.name}
                                                                           placeholder={option.placeholder}
                                                                           rows={1}
                                                                           cols={1}
                                                                      />
                                                                 );
                                                            }

                                                            return (
                                                                 <input
                                                                      id={`${month}-record-creation-${option.name}`}
                                                                      type={option.type}
                                                                      key={option.header}
                                                                      name={option.name}
                                                                      placeholder={option.placeholder}
                                                                      disabled={option.disabled}
                                                                      required={option.required}
                                                                      onChange={option.type === "number" ? updateTotal : null}
                                                                      data-month={month}
                                                                 />
                                                            );
                                                       })}
                                                       <button className="add" type="submit">
                                                            Add
                                                       </button>
                                                       <button type="reset" className="delete">
                                                            Delete
                                                       </button>
                                                  </CreateRecord>
                                             </RecordsBody>
                                             {!numberOfSpaces && <div className="no-records">Records for the month of {month}, do not exists. Please add new records.</div>}
                                        </div>
                                   </Records>
                              </React.Fragment>
                         );
                    })}
               </YearBody>
          </YearDetails>
     ) : null;
};

export default Year;

const YearDetails = styled.div`
     margin-top: 1rem;
     background-color: ${GlobalStyles.themeSemiDark};
     border-radius: 10px;
     padding: 0.75rem;

     display: flex;
     flex-direction: column;
     gap: 0.5rem;
`;
const YearHeader = styled.div`
     display: flex;
     justify-content: space-between;
     font-weight: bold;
     background-color: ${GlobalStyles.themeDark};
     border-radius: 10px;
     font-size: 1.25rem;
     padding: 0.25rem;

     div {
          flex: 1;
          text-align: center;
          padding-inline: 1rem;
     }
`;
const YearBody = styled.div`
     font-size: 1.25rem;
     display: flex;
     flex-direction: column;
     gap: 0.25rem;
`;
const Month = styled.section`
     border-radius: 10px;
     background-color: ${GlobalStyles.themeDark};
     transition: transform 150ms, background-color 150ms;
     cursor: pointer;

     :hover {
          background-color: ${GlobalStyles.themeSemiLight};
          transform: translateX(5px);
     }
     .month {
          display: flex;
          justify-content: space-between;
          border-radius: 10px;
          padding-block: 0.25rem;

          div {
               flex: 1;
               padding-inline: 1rem;

               :not(.month-name) {
                    text-align: center;
                    position: relative;

                    ::before {
                         content: "";
                         position: absolute;
                         left: 0;
                         top: 0;
                         width: 2px;
                         height: 100%;
                         background-color: black;
                    }
               }
          }
     }
`;
const Records = styled.div`
     background-color: black;
     border-radius: 0 0 10px 10px;
     overflow-x: auto;
     position: relative;
     padding: 0.75rem;

     .padding-div {
          overflow: auto;
          padding-bottom: 0.5rem;
     }

     .no-records {
          margin-block: 0.5rem;
          text-align: center;
          position: sticky;
          left: 0;
          font-size: 1rem;
     }
`;
const RecordsHeader = styled.div`
     display: flex;
     gap: 0.5rem;
     font-size: 1rem;

     div {
          min-width: 300px;
          flex: 1;
     }
`;
const RecordsBody = styled.div`
     display: flex;
     flex-direction: column;
     gap: 0.5rem;

     .existing-record-row {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;

          div {
               flex: 1;
               min-width: 300px;
          }
     }
`;
const ShowExistingRecords = styled.div`
     display: flex;
     flex-direction: column;
     gap: 0.25rem;

     button {
          border: none;
          outline: none;
          padding: 0.25em 0.5em;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;

          &.edit {
               background-color: ${GlobalStyles.themeSemiLight};
          }
          &.delete {
               background-color: #ff4a4a;
          }
     }
`;
const CreateRecord = styled.form`
     display: flex;
     align-items: flex-start;
     gap: 0.5rem;

     input,
     select,
     textarea {
          flex: 1;
          min-width: 300px;
          border-radius: 5px;
          padding: 0.25rem 0.25rem;
          color: black;
          outline: none;
          border: none;
          font-size: 16px;

          :disabled {
               background-color: white;
          }

          :focus {
               box-shadow: 0 0 2px 3px hotpink;
          }

          option {
               color: black;
          }
     }

     button {
          border: none;
          outline: none;
          padding: 0.25em 0.5em;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1rem;

          &.add {
               background-color: green;
          }
          &.delete {
               background-color: #ff4a4a;
          }
     }
`;
