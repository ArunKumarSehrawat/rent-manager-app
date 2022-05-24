import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { GlobalStyles } from "../../../GlobalStyles";
import { Heading } from "../../register/Register";
import { InputWrapper, Label, Inputs } from "../../register/Input";
import { newRecordOptions } from "./tenantOptions";
import "./tenants.css";

const Tenants = () => {
     const Tenants = useSelector((state) => state.tenants);
     const [showCreateTenantModal, setShowCreateTenantModal] = useState(true);
     const [activeModalTab, setActiveModalTab] = useState(Object.keys(newRecordOptions)[0]);

     const openModal = () => setShowCreateTenantModal(true);
     const closeModal = () => setShowCreateTenantModal(false);
     const handleModalTabChange = (e) => setActiveModalTab(e.target.innerText.split(" ").splice(1).join(" "));
     const removeErrors = (e) => {
          document.getElementById(`tenant-creation-${e.target.name}`).classList.remove("error");
          document.getElementById(`tenant-creation-error-${e.target.name}`).innerText = "";
     };
     // const showErrors = (errorMessage) => {
     //      document.getElementById("validation-errors").innerText = errorMessage;
     // };
     const validateRecordCreation = (e) => {
          e.preventDefault();
          let newTenant = {};
          // create a new tenant object
          for (let i = 0; i < e.target.length - 2; i++) {
               const element = e.target[i];
               // remove all previous errors to show the most recent error
               document.getElementById(`tenant-creation-${element.name}`).classList.remove("error");
               document.getElementById(`tenant-creation-error-${element.name}`).innerText = "";

               // since the data comes in String type but if the input was a Number category -> typecast String to Number
               if (element.type === "number") newTenant[element.name] = Number(element.value);
               else newTenant[element.name] = element.value.trim();
          }

          // Validate the newly created tenant object for any errors
          for (const newTenantKey of Object.keys(newTenant)) {
               // find out which category the values are related to
               // toggle to that category
               // focus that element
               for (const catergory of Object.keys(newRecordOptions)) {
                    for (const option of newRecordOptions[catergory]) {
                         if (option.name === newTenantKey && !option?.validate?.(newTenant[newTenantKey]).valid) {
                              // console.log(option.header);
                              setActiveModalTab(catergory);
                              document.getElementById(`tenant-creation-error-${option.name}`).innerText = option?.validate?.(newTenant[newTenantKey], "MESSAGE").message || "";
                              setTimeout(() => {
                                   let input = document.getElementById(`tenant-creation-${option.name}`);
                                   input.classList.add("error");
                                   input.focus();
                              }, 0);
                              return;
                         }
                    }
               }
          }

          // If validation is successfull then attempt to create the tenant
          handleRecordCreation(newTenant);
     };

     const handleRecordCreation = (newTenant) => {
          navigator.clipboard.writeText(JSON.stringify(newTenant, null, 4));
     };

     return (
          <Container>
               <Records>
                    <RecordsHeader>
                         {/* {newRecordOptions.map((option, index) => {
                              return <div key={option.header}>{option.header}</div>;
                         })} */}
                    </RecordsHeader>
                    {Object.keys(Tenants).length ? <RecordsBody></RecordsBody> : null}
                    <OpenCreateRecordModalButton className="btn" onClick={openModal}>
                         Add a new tenant
                    </OpenCreateRecordModalButton>
               </Records>
               {showCreateTenantModal && (
                    <CreateRecord>
                         <CloseModal onClick={closeModal}></CloseModal>
                         <Heading>Add a new Tenant</Heading>
                         <TabularForm id="tenant-creation" className="tabular-form" onSubmit={validateRecordCreation} noValidate>
                              <div className="tabs">
                                   {Object.keys(newRecordOptions).map((category, index) => (
                                        <div key={index} className={`tab ${activeModalTab === category && "active"}`} onClick={handleModalTabChange}>
                                             {`${index + 1}. ${category}`}
                                        </div>
                                   ))}
                              </div>
                              <div className="details">
                                   {Object.keys(newRecordOptions).map((category, index) => {
                                        return (
                                             <div key={index} id={category} className={`detail ${activeModalTab === category && "active"}`}>
                                                  {newRecordOptions[category].map((option) => (
                                                       <InputWrapper key={option.header} className="input-wrapper">
                                                            <Label htmlFor={`tenant-creation-${option.name}`}>
                                                                 {`${option.header}${option.required === true ? "*" : ""}`}
                                                                 {option.tooltip && (
                                                                      <div className="tooltip">
                                                                           <span>{option.tooltip}</span>
                                                                      </div>
                                                                 )}
                                                            </Label>
                                                            {option.type === "select" ? (
                                                                 <select id={`tenant-creation-${option.name}`} name={option.name} onChange={removeErrors}>
                                                                      {option.options.map((optionsForSelectMenu, index) => (
                                                                           <option key={index} value={optionsForSelectMenu}>
                                                                                {optionsForSelectMenu}
                                                                           </option>
                                                                      ))}
                                                                 </select>
                                                            ) : (
                                                                 <Inputs
                                                                      id={`tenant-creation-${option.name}`}
                                                                      type={option.type}
                                                                      name={option.name}
                                                                      minLength={option.minLength}
                                                                      maxLength={option.maxLength}
                                                                      placeholder={option.placeholder}
                                                                      onChange={removeErrors}
                                                                 />
                                                            )}
                                                            <div id={`tenant-creation-error-${option.name}`} className="tenant-creation-error"></div>
                                                       </InputWrapper>
                                                  ))}
                                             </div>
                                        );
                                   })}
                              </div>

                              <FormControls>
                                   <button type="submit" className="btn create">
                                        Create
                                   </button>
                                   <button type="reset" className="btn cancel">
                                        Cancel
                                   </button>
                              </FormControls>
                         </TabularForm>
                    </CreateRecord>
               )}
          </Container>
     );
};

export default Tenants;

// test for tabulated form
const TabularForm = styled.form``;
const Container = styled.div`
     position: relative;
     width: 100%;
     height: 100%;
     overflow: auto;
`;
const Records = styled.div`
     width: 100%;
     overflow-y: auto;
     font-size: 0.75rem;
     display: flex;
     flex-direction: column;
     gap: 1rem;
`;
const RecordsHeader = styled.div`
     display: flex;
     align-items: center;

     div {
          flex: 1;
          min-width: 300px;
          padding-inline: 0.25rem;
     }
`;
const RecordsBody = styled.div`
     display: flex;

     div {
          flex: 1;
          min-width: 300px;
          padding-inline: 0.25rem;
     }
`;
const OpenCreateRecordModalButton = styled.button`
     font-size: 0.75rem;
     width: 100%;
     position: sticky;
     left: 0;
     background-color: ${GlobalStyles.themeSemiLight};
     margin-bottom: 0.5rem;
`;
const CreateRecord = styled.div`
     position: absolute;
     top: 0;
     width: 100%;
     min-height: 100%;
     background-color: ${GlobalStyles.themeSemiDark};
     border-radius: 10px;

     display: flex;
     flex-direction: column;
`;
const CloseModal = styled.div`
     width: 30px;
     height: 30px;
     position: fixed;
     right: 30px;
     cursor: pointer;
     --background-color: #dfdfdf;

     :hover {
          --background-color: #a6a6a6;
     }

     ::before,
     ::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);

          border-radius: 1em;
          background-color: var(--background-color);
          width: 100%;
          height: 5px;
          transition: background-color 150ms;
     }

     ::after {
          transform: translate(-50%, -50%) rotate(45deg);
     }
`;

const FormControls = styled.div`
     display: flex;
     margin: auto;
     gap: 1rem;
     width: clamp(250px, 100%, 500px);

     .btn {
          flex: 1;
          font-size: 1rem;
          &.create {
               background-color: ${GlobalStyles.themeSemiLight};
          }
          &.cancel {
               background-color: #ff4a4a;
          }
     }
`;
