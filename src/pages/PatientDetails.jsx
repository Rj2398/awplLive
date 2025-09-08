// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Header from '../component/doctorPanel/Header';
// import Footer from '../component/doctorPanel/Footer';
// import CustomModal from '../component/CustomModal';
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import { doctorCanceledAppointment, patientAppointmentDetails } from '../redux/slices/myAppointmentSlice';

// const PatientDetails = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id, patientId, referrerDscode, referrer } = location.state || {};
//   console.log(referrerDscode,"reffer");

//   const [showModal, setShowModal] = useState(false);
//   const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
//   const [cancelReason, setCancelReason] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showImageModal, setShowImageModal] = useState(false);

//   const dispatch = useDispatch();
//   const { patientAppointmentsDetail, doctorcancelledAppointment, patientAppointmentsDetailLoading, doctorcancelledLoading, } = useSelector((state) => state.appointments);
//   const baseUrl = import.meta.env.VITE_BACKEND_URL

//   useEffect(() => {
//     if (id) {
//       dispatch(patientAppointmentDetails({ "appointmentId": id }));
//     }
//   }, [dispatch, id]);

//   console.log("patientAppointmentsDetail", patientAppointmentsDetail);
//   console.log("id", id);

//   const handleCancelClick = (id) => {
//     setSelectedAppointmentId(id);
//     setShowModal(true);
//   };

//   const handleCancelConfirm = () => {
//     setShowModal(false);
//     setShowCancelReasonModal(true);
//   };

//   const handleCancelReasonSubmit = () => {
//     dispatch(doctorCanceledAppointment({
//       appointment_id: selectedAppointmentId,
//       cancel_message: cancelReason
//     }))
//       .then(() => {
//         setShowCancelReasonModal(false);
//         setCancelReason('');
//         setSelectedAppointmentId(null);
//         setShowSuccessModal(true);
//       })
//   };

//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//     setShowImageModal(true);
//   };

//   return (
//     <>
//       <main className="doctor-panel">
//         <div className="container-fluid">
//           <div className="doc-panel-inr">
//             <Header />
//           </div>
//           {patientAppointmentsDetailLoading ? (
//             <div className="loader-main">
//               <span className="loader"></span>
//             </div>
//           ) : (
//             <div className="doc-panel-body appoint-details-pg has-texture">
//               <div className="texture only-img">
//                 <img src="/images/doctor-symbol.png" alt="Image" />
//               </div>
//               <div className="appointments">
//                 <div className="start-appointment cmn-mb">
//                   <div className="docpnl-sec-head">
//                     <h1 className="h2-title">Appointment Details</h1>
//                     <div className="back-btn">
//                       <Link to="#" onClick={(e) => {
//                         e.preventDefault();
//                         window.history.back();
//                       }}>
//                         <img src="./images/left-arrow.svg" alt="Back" />
//                       </Link>
//                     </div>
//                   </div>

//                   {patientAppointmentsDetail?.patientData?.is_referred_patient && (<div className="refered-by-cd">
//                     <p>Referred by {referrer} ({referrerDscode})</p>
//                   </div>)}

//                   <div className="apointment-detail-card">
//                     {!patientAppointmentsDetail?.patientData?.is_referred_patient && (<div className="apoint-dtl-img">
//                       <img src={`${baseUrl}/${patientAppointmentsDetail?.patientData?.patient_profile}`} alt="Client" />
//                     </div>)}
//                     <div className={`appoint-dtl-content ${patientAppointmentsDetail?.patientData?.is_referred_patient ? 'w-100 p-0' : ''}`}>
//                       <div className="appoint-dtl-left">
//                         <div className="appoint-dtl-head">
//                           <h2 className="h3-title">{patientAppointmentsDetail?.patientData?.patient_name}</h2>
//                         </div>
//                         <div className="appoint-btm">
//                           <p><img src="/images/clock-icon.svg" alt="Icon" />{patientAppointmentsDetail?.patientData?.dayDate}</p>
//                           <p className="appoint-time">{patientAppointmentsDetail?.patientData?.time}</p>
//                         </div>
//                       </div>
//                       <Link to="/patient-profile" state={{ patientId: patientId , hideSchedule: true}} className="cmn-btn">View profile</Link>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="patient-details-wrp">
//                   <form>
//                     <div className="patient-dtl-form">
//                       <div className="patient-basic-info cmn-mb2">
//                         <h2>Basic Information</h2>
//                         <div className="row">
//                           <div className="col-lg-4 col-md-4 col-sm-6">
//                             <div className="formfield">
//                               <label>Full Name</label>
//                               <input type="text" placeholder="Name" value={patientAppointmentsDetail?.basicInformation?.name} readOnly />
//                             </div>
//                           </div>
//                           <div className="col-lg-4 col-md-4 col-sm-6">
//                             <div className="formfield">
//                               <label>Enter Your Height</label>
//                               <input type="text" placeholder="26" value={patientAppointmentsDetail?.basicInformation?.height} readOnly />
//                             </div>
//                           </div>
//                           <div className="col-lg-4 col-md-4 col-sm-6">
//                             <div className="formfield">
//                               <label>Enter Your Weight</label>
//                               <input type="text" placeholder="50kg" value={patientAppointmentsDetail?.basicInformation?.weight} readOnly />
//                             </div>
//                           </div>
//                           <div className="col-lg-4 col-md-4 col-sm-6">
//                             <div className="formfield">
//                               <label>Gender</label>
//                               {/* <input type="text" placeholder="Male" value={patientAppointmentsDetail?.basicInformation?.gender} readOnly /> */}
//                               <input type="text" placeholder="Male" value={patientAppointmentsDetail?.basicInformation?.gender?.charAt(0).toUpperCase() + patientAppointmentsDetail?.basicInformation?.gender?.slice(1).toLowerCase()} readOnly />
//                               {/* <td>{patient.patient_gender?.charAt(0).toUpperCase() + patient.patient_gender?.slice(1).toLowerCase()}</td> */}
//                             </div>
//                           </div>
//                           <div className="col-lg-4 col-md-4 col-sm-6">
//                             <div className="formfield">
//                               <label>Enter Age</label>
//                               <input type="text" placeholder="26" value={patientAppointmentsDetail?.basicInformation?.age} readOnly />
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="scheduled-call-consultations cmn-mb2">
//                         <h2>Scheduled Call Consultations</h2>
//                         <div className="row">
//                           <div className="col-lg-12">
//                             <div className="formfield">
//                               <label>1. How long are you suffering from this disease?</label>
//                               <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer1} readOnly />
//                             </div>
//                           </div>
//                           <div className="col-lg-12">
//                             <div className="formfield">
//                               <label>2. Any other problem which you would like to share related to your problem?</label>
//                               <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer2} readOnly />
//                             </div>
//                           </div>
//                           <div className="col-lg-12">
//                             <div className="formfield">
//                               <label>3. Do you have any history of this disease?</label>
//                               <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer3} readOnly />
//                             </div>
//                           </div>
//                           <div className="col-lg-12">
//                             <div className="formfield">
//                               <label>4. Are you taking any medicines? If yes, please share the name of medicine and since how long you are taking this medicine?</label>
//                               <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer4} readOnly />
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Uploaded Images */}
//                       {Array.isArray(patientAppointmentsDetail?.symptomFiles) && patientAppointmentsDetail?.symptomFiles.length > 0 && (
//                         <div className="view-uploaded-images-wrp">
//                           <h2>View Uploaded Images</h2>
//                           <div className="view-uploaded-img">
//                             {patientAppointmentsDetail?.symptomFiles
//                               .filter(file => file.file_type.toLowerCase().match(/jpg|jpeg|png|gif/))
//                               .map((file, index) => (
//                                 <div className="img-wrp" key={index}>
//                                   <a href="#" onClick={(e) => {
//                                     e.preventDefault();
//                                     handleImageClick(file);
//                                   }}>
//                                     <img src={`${baseUrl}/${file.file_path}`} alt={`Symptom Image ${index + 1}`} />
//                                   </a>
//                                 </div>
//                               ))}
//                           </div>
//                         </div>
//                       )}

//                       <div className="btn-wrp">
//                         <button type="button" className="orange-btn" onClick={() => handleCancelClick(id)}>
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           )}

//           <Footer />
//         </div>

//         {/* First Confirmation Modal */}
//         <CustomModal
//           visible={showModal}
//           title="Cancel Appointment"
//           subtitle="Are you sure you want to cancel the appointment?"
//           onConfirm={handleCancelConfirm}
//           onCancel={() => setShowModal(false)}
//           actionType="cancel"
//         />

//         {/* Second Modal for Reason */}
//         <CustomModal
//           visible={showCancelReasonModal}
//           title="Cancel Appointment"
//           subtitle="Reason for cancellation"
//           inputField={true}
//           inputValue={cancelReason}
//           onInputChange={(value) => setCancelReason(value)}
//           onCancel={() => {
//             setShowCancelReasonModal(false);
//             setCancelReason('');
//           }}
//           onConfirm={handleCancelReasonSubmit}
//           actionType="info"
//         />

//         {/* Success Modal */}
//         <CustomModal
//           visible={showSuccessModal}
//           title="Appointment Cancelled"
//           subtitle="Your appointment is cancelled successfully."
//           onConfirm={() => {
//             setShowSuccessModal(false);
//             navigate('/doctor-home');
//           }}
//           onCancel={() => setShowSuccessModal(false)}
//           actionType="success"
//         />

//         {/* Image Modal */}
//         {/* Image Modal */}
//         {/* Image Modal */}
//         {showImageModal && selectedImage && (
//           <div style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.9)',
//             zIndex: 1050,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             overflow: 'auto'
//           }}>
//             {/* Close button - fixed at top right corner of screen */}
//             <button
//               onClick={() => setShowImageModal(false)}
//               style={{
//                 position: 'fixed',
//                 right: '30px',
//                 top: '30px',
//                 zIndex: 1060,
//                 background: 'transparent',
//                 border: 'none',
//                 cursor: 'pointer',
//                 padding: 0
//               }}
//               aria-label="Close"
//             >
//               <img
//                 src="/images/cross-blue.png"
//                 alt="Close"
//                 style={{
//                   width: '24px',
//                   height: '24px',
//                   filter: 'brightness(0) invert(1)'
//                 }}
//               />
//             </button>

//             {/* Image container - centered both horizontally and vertically */}
//             <div style={{
//               maxWidth: '90vw',
//               maxHeight: '90vh',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center'
//             }}>
//               <img
//                 src={`${baseUrl}/${selectedImage.file_path}`}
//                 alt="Enlarged view"
//                 style={{
//                   maxWidth: '100%',
//                   maxHeight: '100%',
//                   objectFit: 'contain'
//                 }}
//               />
//             </div>
//           </div>
//         )}
//       </main>
//     </>
//   );
// };

// export default PatientDetails;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";
import CustomModal from "../component/CustomModal";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  doctorCanceledAppointment,
  patientAppointmentDetails,
} from "../redux/slices/myAppointmentSlice";
import baseUrl from "../config/BaseUrl";

const PatientDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, patientId, referrerDscode, referrer } = location.state || {};
  // console.log(referrerDscode, "reffer");

  // console.log(id, "*********************************");

  const [showModal, setShowModal] = useState(false);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const dispatch = useDispatch();
  const {
    patientAppointmentsDetail,
    doctorcancelledAppointment,
    patientAppointmentsDetailLoading,
    doctorcancelledLoading,
  } = useSelector((state) => state.appointments);
  // const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (id) {
      dispatch(patientAppointmentDetails({ appointmentId: id }));
    }
  }, [dispatch, id]);

  // console.log("patientAppointmentsDetail", patientAppointmentsDetail);
  // console.log("id", id);

  const handleCancelClick = (id) => {
    setSelectedAppointmentId(id);
    setShowModal(true);
  };

  const handleCancelConfirm = () => {
    setShowModal(false);
    setShowCancelReasonModal(true);
  };

  const handleCancelReasonSubmit = () => {
    dispatch(
      doctorCanceledAppointment({
        appointment_id: selectedAppointmentId,
        cancel_message: cancelReason,
      })
    ).then(() => {
      setShowCancelReasonModal(false);
      setCancelReason("");
      setSelectedAppointmentId(null);
      setShowSuccessModal(true);
    });
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };
  // const isCancelDisabled = () => {
  //   const dateStr = patientAppointmentsDetail?.patientData?.dayDate; // "Tue Jun 10"
  //   const timeStr = patientAppointmentsDetail?.patientData?.time; // "03:00 - 03:15 PM"

  //   if (!dateStr || !timeStr) return false;

  //   try {
  //     // Parse the date parts
  //     const [, month, day] = dateStr.split(" "); // ["Tue", "Jun", "10"]
  //     const currentYear = new Date().getFullYear();

  //     // Parse the time (take the start time)
  //     const [startTime, rest] = timeStr.split(" - "); // "03:00", "03:15 PM"
  //     const period = rest.split(" ")[1]; // "PM"

  //     // Combine into a parseable date string
  //     const dateTimeStr = `${month} ${day} ${currentYear} ${startTime} ${period}`;
  //     // Example: "Jun 10 2023 03:00 PM"

  //     const appointmentDate = new Date(dateTimeStr);
  //     const now = new Date();

  //     // Calculate difference in hours
  //     const diffInMs = appointmentDate - now;
  //     const diffInHours = diffInMs / (1000 * 60 * 60);

  //     return diffInHours <= 2;
  //   } catch (error) {
  //     console.error("Date parse error:", error);
  //     return false;
  //   }
  // };

  const hasAppointmentStarted = () => {
    const dateStr = patientAppointmentsDetail?.patientData?.dayDate; // "Tue Jun 24"
    const timeStr = patientAppointmentsDetail?.patientData?.time; // "07:00 - 07:15 PM"

    if (!dateStr || !timeStr) return false;

    try {
      const [, month, day] = dateStr.split(" "); // ["Tue", "Jun", "24"]
      const year = new Date().getFullYear();

      const [startTime, endTimeWithPeriod] = timeStr.split(" - "); // "07:00", "07:15 PM"
      const period = endTimeWithPeriod.trim().slice(-2); // AM or PM
      const startTimeWithPeriod = `${startTime.trim()} ${period}`; // "07:00 PM"

      const startDateTime = new Date(
        `${month} ${day} ${year} ${startTimeWithPeriod}`
      );
      const now = new Date();

      return now >= startDateTime; // Appointment already started
    } catch (error) {
      console.error("Time parse error:", error);
      return false;
    }
  };

  return (
    <>
      <main className="doctor-panel">
        <div className="container-fluid">
          <div className="doc-panel-inr">
            <Header />
          </div>
          {patientAppointmentsDetailLoading ? (
            <div className="loader-main">
              <span className="loader"></span>
            </div>
          ) : (
            <div className="doc-panel-body appoint-details-pg has-texture">
              <div className="texture only-img">
                <img src="/images/doctor-symbol.png" alt="Image" />
              </div>
              <div className="appointments">
                <div className="start-appointment cmn-mb mb-4">
                  <div className="docpnl-sec-head">
                    <h1 className="h2-title mb-1">Appointment Details</h1>
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

                  {patientAppointmentsDetail?.patientData
                    ?.is_referred_patient && (
                    <div className="refered-by-cd">
                      <p>
                        Referred by {referrer} ({referrerDscode})
                      </p>
                    </div>
                  )}

                  <div
                    className="apointment-detail-card"
                    style={{ border: "2px solid #199FD9" }}
                  >
                    {!patientAppointmentsDetail?.patientData
                      ?.is_referred_patient && (
                      <div className="apoint-dtl-img">
                        <img
                          src={`${baseUrl}/${patientAppointmentsDetail?.patientData?.patient_profile}`}
                          alt="Client"
                        />
                      </div>
                    )}
                    <div
                      className={`appoint-dtl-content ${
                        patientAppointmentsDetail?.patientData
                          ?.is_referred_patient
                          ? "w-100 p-0"
                          : ""
                      }`}
                    >
                      <div className="appoint-dtl-left">
                        <div className="appoint-dtl-head">
                          <h2 className="h3-title">
                            {
                              patientAppointmentsDetail?.patientData
                                ?.patient_name
                            }

                            {!patientAppointmentsDetail?.patientData
                              ?.is_referred_patient && (
                              <div style={{ fontSize: "15px" }}>
                                (
                                <span style={{ color: "black" }}>
                                  DS Code:{" "}
                                </span>
                                <span style={{ color: "#199FD9" }}>
                                  {referrerDscode}
                                </span>
                                )
                              </div>
                            )}
                          </h2>

                          <h2 className="h3-title">
                            <span style={{ color: "black", fontSize: 16 }}>
                              Disease :
                              <span style={{ color: "#199FD9" }}>
                                {" "}
                                {
                                  patientAppointmentsDetail?.patientData
                                    ?.diseaseName
                                }
                              </span>
                            </span>
                          </h2>
                        </div>
                        <div className="appoint-btm" style={{ marginTop: -10 }}>
                          <p>
                            <img src="/images/clock-icon.svg" alt="Icon" />
                            {patientAppointmentsDetail?.patientData?.dayDate}
                          </p>
                          <p className="appoint-time">
                            {patientAppointmentsDetail?.patientData?.time}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/patient-profile"
                        state={{ patientId: patientId, hideSchedule: true }}
                        className="cmn-btn"
                      >
                        View profile
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="patient-details-wrp">
                  <form>
                    <div className="patient-dtl-form">
                      <div className="patient-basic-info cmn-mb2">
                        <h2>Basic Information</h2>
                        <div className="row">
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="formfield">
                              <label>Full Name</label>
                              <input
                                type="text"
                                placeholder="Name"
                                value={
                                  patientAppointmentsDetail?.basicInformation
                                    ?.name
                                }
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="formfield">
                              <label>Height</label>
                              <input
                                type="text"
                                placeholder="26"
                                value={
                                  patientAppointmentsDetail?.basicInformation
                                    ?.height
                                }
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="formfield">
                              <label>Weight</label>
                              <input
                                type="text"
                                placeholder="50kg"
                                value={
                                  patientAppointmentsDetail?.basicInformation
                                    ?.weight
                                }
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="formfield">
                              <label>Gender</label>
                              <input
                                type="text"
                                placeholder="Male"
                                value={
                                  patientAppointmentsDetail?.basicInformation?.gender
                                    ?.charAt(0)
                                    .toUpperCase() +
                                  patientAppointmentsDetail?.basicInformation?.gender
                                    ?.slice(1)
                                    .toLowerCase()
                                }
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="formfield">
                              <label>Age</label>
                              <input
                                type="text"
                                placeholder="26"
                                value={
                                  patientAppointmentsDetail?.basicInformation
                                    ?.age
                                }
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="formfield">
                              <label>Disease</label>
                              <input
                                type="text"
                                placeholder="26"
                                value={
                                  patientAppointmentsDetail?.basicInformation
                                    ?.diseaseName
                                }
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="scheduled-call-consultations cmn-mb2">
                        <h2>Scheduled Call Consultations</h2>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="formfield">
                              <label>
                                1. How long are you suffering from this disease?
                              </label>
                              <input
                                type="text"
                                placeholder="Answer"
                                value={
                                  patientAppointmentsDetail?.symptomAnswers
                                    ?.answer1
                                }
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="formfield">
                              <label>
                                2. Any other problem which you would like to
                                share related to your problem?
                              </label>
                              <input
                                type="text"
                                placeholder="Answer"
                                value={
                                  patientAppointmentsDetail?.symptomAnswers
                                    ?.answer2
                                }
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="formfield">
                              <label>
                                3. Do you have any history of this disease?
                              </label>
                              <input
                                type="text"
                                placeholder="Answer"
                                value={
                                  patientAppointmentsDetail?.symptomAnswers
                                    ?.answer3
                                }
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="formfield">
                              <label>
                                4. Are you taking any medicines? If yes, please
                                share the name of medicine and since how long
                                you are taking this medicine?
                              </label>
                              <input
                                type="text"
                                placeholder="Answer"
                                value={
                                  patientAppointmentsDetail?.symptomAnswers
                                    ?.answer4
                                }
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Uploaded Images */}
                      {Array.isArray(patientAppointmentsDetail?.symptomFiles) &&
                        patientAppointmentsDetail?.symptomFiles.length > 0 && (
                          <div className="view-uploaded-images-wrp">
                            <h2>View Uploaded Images</h2>
                            <div className="view-uploaded-img">
                              {patientAppointmentsDetail?.symptomFiles
                                .filter((file) =>
                                  file.file_type
                                    .toLowerCase()
                                    .match(/jpg|jpeg|png|gif/)
                                )
                                .map((file, index) => (
                                  <div className="img-wrp" key={index}>
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleImageClick(file);
                                      }}
                                    >
                                      <img
                                        src={`${baseUrl}/${file.file_path}`}
                                        alt={`Symptom Image ${index + 1}`}
                                      />
                                    </a>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                      {
                        patientAppointmentsDetail?.patientData
                          ?.need_prescription == true ? (
                          <div className="btn-wrp">
                            <Link
                              to="/CompletedAssignedPrescription"
                              state={{
                                id: id,
                                patientId: patientId,
                              }}
                            >
                              <button type="button" className="orange-btn">
                                Respond
                              </button>
                            </Link>
                          </div>
                        ) : !hasAppointmentStarted() ? ( // ✅ CONDITION OUTSIDE
                          <div className="btn-wrp">
                            <button
                              type="button"
                              className="orange-btn"
                              onClick={() => handleCancelClick(id)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : null

                        // <div className="btn-wrp">
                        //   <button
                        //     type="button"
                        //     className="orange-btn"
                        //     onClick={() => {
                        //       if (!isCancelDisabled()) {
                        //         handleCancelClick(id);
                        //       }
                        //     }}
                        //     disabled={isCancelDisabled()}
                        //     style={
                        //       isCancelDisabled()
                        //         ? {
                        //             opacity: 0.5,
                        //             cursor: "not-allowed",
                        //             pointerEvents: "none",
                        //           }
                        //         : {}
                        //     }
                        //   >
                        //     Cancel
                        //   </button>
                        // </div>
                      }
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </div>

        {/* First Confirmation Modal */}
        <CustomModal
          visible={showModal}
          title="Cancel Appointment"
          subtitle="Are you sure you want to cancel the appointment?"
          onConfirm={handleCancelConfirm}
          onCancel={() => setShowModal(false)}
          actionType="cancel"
        />

        {/* Second Modal for Reason */}
        <CustomModal
          visible={showCancelReasonModal}
          title="Cancel Appointment"
          subtitle="Reason for cancellation"
          inputField={true}
          inputValue={cancelReason}
          onInputChange={(value) => setCancelReason(value)}
          onCancel={() => {
            setShowCancelReasonModal(false);
            setCancelReason("");
          }}
          onConfirm={handleCancelReasonSubmit}
          actionType="info"
        />

        {/* Success Modal */}
        <CustomModal
          visible={showSuccessModal}
          title="Appointment Cancelled"
          subtitle="Your appointment is cancelled successfully."
          onConfirm={() => {
            setShowSuccessModal(false);
            navigate("/doctor-home");
          }}
          onCancel={() => setShowSuccessModal(false)}
          actionType="success"
        />

        {/* Image Modal */}
        {/* Image Modal */}
        {/* Image Modal */}
        {showImageModal && selectedImage && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              zIndex: 1050,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "auto",
            }}
          >
            {/* Close button - fixed at top right corner of screen */}
            <button
              onClick={() => setShowImageModal(false)}
              style={{
                position: "fixed",
                right: "30px",
                top: "30px",
                zIndex: 1060,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label="Close"
            >
              <img
                src="/images/cross-blue.png"
                alt="Close"
                style={{
                  width: "24px",
                  height: "24px",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </button>

            {/* Image container - centered both horizontally and vertically */}
            <div
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={`${baseUrl}/${selectedImage.file_path}`}
                alt="Enlarged view"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default PatientDetails;
