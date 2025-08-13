// import React from "react";
// import Header from "../doctorPanel/Header";
// import Footer from "../doctorPanel/Footer";
// import { Link } from "react-router-dom";

// const PendingFullAssigned = () => {
//     return (
//         <main className="doctor-panel">
//             <div className="container-fluid">
//                 <div className="doc-panel-inr">
//                     <Header />
//                 </div>
//                 <div className="doc-panel-body appoint-details-pg has-texture">
//                     <div className="texture only-img">
//                         <img src="./images/doctor-symbol.png" alt="Image" />
//                     </div>
//                     <div className="appointments">
//                         <div className="start-appointment cmn-mb">
//                             <div className="docpnl-sec-head">
//                                 <h1 className="h2-title">Start Appointment</h1>
//                                 <div className="back-btn">
//                                     <Link to="#" onClick={(e) => {
//                                         e.preventDefault();
//                                         window.history.back();
//                                     }}>
//                                         <img src="./images/left-arrow.svg" alt="Back" />
//                                     </Link>
//                                 </div>
//                             </div>
//                             <div className="apointment-detail-card">
//                                 <div className="apoint-dtl-img">
//                                     <img src="./images/client-img-5.png" alt="Client" />
//                                 </div>
//                                 <div className="appoint-dtl-content">
//                                     <div className="appoint-dtl-left">
//                                         <div className="appoint-dtl-head">
//                                             <h2 className="h3-title">Patient’s name</h2>
//                                         </div>
//                                         <div className="appoint-btm">
//                                             <p>
//                                                 <img src="./images/clock-icon.svg" alt="Icon" />
//                                                 Thu May 14
//                                             </p>
//                                             <p className="appoint-time">10:00 - 10:15 AM</p>
//                                         </div>
//                                     </div>
//                                     <a href="patient-profile.html" className="cmn-btn">
//                                         View profile
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="patient-details-wrp">
//                             <form>
//                                 <div className="patient-dtl-form">
//                                     <div className="patient-basic-info cmn-mb2">
//                                         <h2>Basic Information</h2>
//                                         <div className="row">
//                                             {[
//                                                 { label: "Full Name", placeholder: "Name" },
//                                                 { label: "Enter Your Height", placeholder: "26" },
//                                                 { label: "Enter Your Weight", placeholder: "50kg" },
//                                                 { label: "Gender", placeholder: "Male" },
//                                                 { label: "Enter Age", placeholder: "26" },
//                                             ].map((field, idx) => (
//                                                 <div
//                                                     className="col-lg-4 col-md-4 col-sm-6"
//                                                     key={`field-${idx}`}
//                                                 >
//                                                     <div className="formfield">
//                                                         <label>{field.label}</label>
//                                                         <input
//                                                             type="text"
//                                                             placeholder={field.placeholder}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div className="health-issues-symptoms cmn-mb2">
//                                         <h2>Health Issues & Symptoms</h2>
//                                         <div className="health-symptoms-inr">
//                                             {[
//                                                 {
//                                                     label:
//                                                         "What symptoms are you facing? Please describe your symptoms in brief.",
//                                                 },
//                                                 {
//                                                     label:
//                                                         "How long have you been experiencing these symptoms?",
//                                                 },
//                                                 {
//                                                     label:
//                                                         "Any knows Diseases / Health Conditions you are facing?",
//                                                     placeholder:
//                                                         "Parasitic diseases       Parasitic diseases       Parasitic diseases",
//                                                 },
//                                                 {
//                                                     label: "Any past medical conditions?",
//                                                 },
//                                                 {
//                                                     label: "Any past medications?",
//                                                 },
//                                                 {
//                                                     label: "Any Past known allergies?",
//                                                 },
//                                             ].map((symptom, idx) => (
//                                                 <div className="formfield white-input" key={idx}>
//                                                     <label>{symptom.label}</label>
//                                                     <input
//                                                         type="text"
//                                                         placeholder={symptom.placeholder || "Answer"}
//                                                     />
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div className="scheduled-call-consultations cmn-mb2">
//                                         <h2>Scheduled Call Consultations</h2>
//                                         <div className="row">
//                                             {[1, 2, 3].map((i) => (
//                                                 <div className="col-lg-12" key={`consult-${i}`}>
//                                                     <div className="formfield">
//                                                         <label>
//                                                             {i}. Lorem ipsum dolor sit amet, consectetur
//                                                         </label>
//                                                         <input type="text" placeholder="Answer" />
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div className="view-uploaded-images-wrp">
//                                         <h2>View Uploaded Images</h2>
//                                         <div className="view-uploaded-img">
//                                             {[...Array(3)].map((_, idx) => (
//                                                 <div className="img-wrp" key={idx}>
//                                                     <a
//                                                         href="./images/symptom-img.png"
//                                                         data-fancybox="symptoms"
//                                                     >
//                                                         <img
//                                                             src="./images/symptom-img.png"
//                                                             alt="Symptoms"
//                                                         />
//                                                     </a>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div className="btn-wrp">
//                                         <a href="#url" className="orange-btn">
//                                             Cancel
//                                         </a>
//                                     </div>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Modal */}
//                 <div
//                     className="modal fade popup-wrp small-pop dash-pop"
//                     id="logOut"
//                     tabIndex="-1"
//                     role="dialog"
//                     aria-labelledby="exampleModalCenterTitle"
//                     aria-hidden="true"
//                 >
//                     <div className="modal-dialog modal-dialog-centered" role="document">
//                         <div className="modal-content">
//                             <div className="modal-icon">
//                                 <img src="./images/logout-icon.svg" alt="Icon" />
//                             </div>
//                             <div className="modal-header">
//                                 <h2>Logout</h2>
//                                 <p>Are you sure you want to logout?</p>
//                             </div>
//                             <div className="modal-footer btn-wrp">
//                                 <button
//                                     type="button"
//                                     className="cmn-btn"
//                                     data-bs-dismiss="modal"
//                                     aria-label="Close"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <a href="login.html" className="cmn-btn orange-btn">
//                                     Logout
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <Footer />
//             </div></main>
//     );
// };

// export default PendingFullAssigned;

import React, { useState, useEffect } from "react";
import Header from "../doctorPanel/Header";
import Footer from "../doctorPanel/Footer";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import baseUrl from "../../config/BaseUrl";

// import { useDispatch, useSelector } from 'react-redux';
// import {useLocation} from 'react-router-dom';
// import { symptomUploadDetails } from '../../redux/slices/userSlice';
// import Fancybox from "@fancyapps/ui"; // if you use it as a React wrapper or include via script

const PendingFullAssigned = () => {
  // const location = useLocation();
  // const {id} = location.state || {};

  // const dispatch = useDispatch();
  // const {symptomUploadDetail, loading} = useSelector((state) => state.user);
  // const baseUrl = import.meta.env.VITE_BACKEND_URL

  // useEffect(() => {
  //     if (id) {

  //         dispatch(symptomUploadDetails({"symptom_id":id}));
  //     }
  // }, [dispatch, id]);

  // console.log("symptom uploaded details", symptomUploadDetail);
  // console.log("id", id);
  // useEffect(() => {
  //     dispatch()
  // },[dispatch])

  return (
    <>
      <main className="doctor-panel">
        <Container fluid>
          <div className="doc-panel-inr">
            <Header />
          </div>

          {/* Panel Body */}
          <div className="doc-panel-body appoint-details-pg has-texture papd-pg">
            <div className="texture only-img">
              <img src="./images/doctor-symbol.png" alt="Symbol" />
            </div>

            <div className="appointments">
              <div className="start-appointment cmn-mb">
                <div className="docpnl-sec-head">
                  <h1 className="h2-title">Symptom Upload Details</h1>
                  <div className="back-btn">
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.back();
                      }}
                    >
                      <img src="./images/left-arrow.svg" alt="Back" />
                    </Link>
                  </div>
                </div>
                <div className="apointment-detail-card">
                  <div className="apoint-dtl-img">
                    <img src="./images/client-img-5.png" alt="Patient" />
                  </div>
                  <div className="appoint-dtl-content">
                    <div className="appoint-dtl-left">
                      {/* <h2 className="h4-title">"{user.patientData.patient_name}"</h2> */}
                      <div className="date h3-title">21/12/2024</div>
                      <div className="time">10:40 PM</div>
                    </div>
                    <Link to="/patient-profile" className="cmn-btn">
                      View profile
                    </Link>
                  </div>
                </div>
              </div>

              <div className="patient-details-wrp">
                <Form>
                  <div className="patient-dtl-form">
                    {/* Basic Info */}
                    <div className="patient-basic-info cmn-mb2">
                      <h2>Basic Information</h2>
                      <Row>
                        {["Name", "Height", "Weight", "Gender", "Age"].map(
                          (label, i) => (
                            <Col lg={4} md={4} sm={6} key={i}>
                              <div className="formfield">
                                <label>{label}</label>
                                <Form.Control
                                  type="text"
                                  placeholder={
                                    label === "Name" ? "Name" : "Answer"
                                  }
                                />
                              </div>
                            </Col>
                          )
                        )}
                      </Row>
                    </div>

                    {/* Health Symptoms */}

                    {/* // hide karna ha abhi ye section vashu sir ne kha ha. */}
                    {/* <div className="health-issues-symptoms cmn-mb2">
                                            <h2>Health Issues & Symptoms</h2>
                                            <div className="health-symptoms-inr">
                                                {[
                                                    'What symptoms are you facing?',
                                                    'How long have you had these symptoms?',
                                                    'Any known diseases or conditions?',
                                                    'Any past medical conditions?',
                                                    'Any past medications?',
                                                    'Any known allergies?',
                                                ].map((label, i) => (
                                                    <div className="formfield white-input" key={i}>
                                                        <label>{label}</label>
                                                        <Form.Control type="text" placeholder="Answer" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div> */}

                    {/* Uploaded Symptoms */}
                    <div className="scheduled-call-consultations cmn-mb2">
                      <h2>Uploaded Symptoms</h2>
                      <Row>
                        {[1, 2, 3, 4].map((num) => (
                          <Col lg={12} key={num}>
                            <div className="formfield">
                              <label>{num}. Lorem ipsum dolor sit amet</label>
                              <Form.Control type="text" placeholder="Answer" />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>

                    {/* Uploaded Images */}
                    <div className="view-uploaded-images-wrp">
                      <h2>View Uploaded Images</h2>
                      <div className="view-uploaded-img">
                        {[...Array(3)].map((_, i) => (
                          <div className="img-wrp" key={i}>
                            <a
                              href="./images/symptom-img.png"
                              data-fancybox="symptoms"
                            >
                              <img
                                src="./images/symptom-img.png"
                                alt="Symptom"
                              />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Uploaded Videos */}
                    <div className="view-uploaded-images-wrp uploaded-vdo-wrp">
                      <h2>View Uploaded Videos</h2>
                      <div className="view-uploaded-img">
                        {[...Array(3)].map((_, i) => (
                          <div className="img-wrp" key={i}>
                            <a
                              href="https://youtu.be/EngW7tLk6R8?si=m3prZmspIQt_MGXm"
                              data-fancybox="symptoms"
                            >
                              <img src="./images/symptom-img.png" alt="Video" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Uploaded Files */}
                    <div className="view-uploaded-images-wrp upload-file-wrp">
                      <h2>View Uploaded Files</h2>
                      <div className="view-uploaded-img">
                        {[...Array(3)].map((_, i) => (
                          <div className="img-wrp" key={i}>
                            <a
                              href="./images/file-icon.svg"
                              data-fancybox="symptoms"
                            >
                              <img src="./images/file-icon.svg" alt="File" />
                              <span className="file-size">5.3mb</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Respond Button */}
                    <div className="btn-wrp">
                      <Link to="/CompletedAssignedPrescription">
                        <button type="button" className="orange-btn">
                          Respond
                        </button>
                      </Link>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </Container>
      </main>
    </>
  );
};

export default PendingFullAssigned;
