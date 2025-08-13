// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Modal } from 'react-bootstrap';
// import Header from '../component/doctorPanel/Header';
// import Footer from '../component/doctorPanel/Footer';
// import { toast } from 'react-toastify';
// import { Calendar } from 'rsuite';
// import 'rsuite/Calendar/styles/index.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { bookAppointment, getScheduleTime } from '../redux/slices/prescriptionSlice';
// import { useLocation } from 'react-router-dom';

// const ScheduleAppointment = () => {
//     const location = useLocation();
//     const { patientId, appointmentId } = location.state || {};
//     console.log("patientId111", patientId);
//     console.log("appointmentId111", appointmentId);
//     const dispatch = useDispatch();
//     const { scheduleTime, bookAppointments, loading } = useSelector((state) => state.prescriptions);
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [selectedTime, setSelectedTime] = useState();
//     const [showSuccessModal, setShowSuccessModal] = useState(false);

//     // const availableTimes = [
//     //     "10:30am", "11:00am", "11:30am", "12:00pm",
//     //     "12:30pm", "01:00pm", "01:30pm", "02:00pm",
//     //     "02:30pm", "03:00pm", "03:30pm", "04:00pm",
//     //     "04:30pm", "05:00pm", "05:30pm", "07:00pm"
//     // ];

//     // const availableTimes = [
//     //     "10:30am", "11:00am", "11:30am", "12:00pm",
//     //     "12:30pm", "01:00pm", "01:30pm", "02:00pm",
//     //     "02:30pm", "03:00pm", "03:30pm", "04:00pm",
//     //     "04:30pm", "05:00pm", "05:30pm", "07:00pm"
//     // ];
//     // const bookedTimes = ["11:30am", "03:00pm", "05:00pm"];

//     function formatDateToYYYYMMDD(dateString) {
//         const date = new Date(dateString);
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     }

//     useEffect(() => {
//         const fetchSchedule = async () => {
//             const today = new Date();
//             await dispatch(getScheduleTime({ date: formatDateToYYYYMMDD(today) }));
//         };

//         fetchSchedule();
//     }, []);

//     const handleDateSelect = async (day) => {
//         setSelectedDate(day);
//         await dispatch(getScheduleTime({date : formatDateToYYYYMMDD(day)}));

//             // Revalidate the selectedTime on date change
//     if (selectedTime && isPastTimeSlot(selectedTime, day)) {
//         setSelectedTime(undefined); // clear invalid time
//     }
//     };

//     const handleTimeSelect = (time, isBooked) => {
//         // const isBooked = scheduleTime.is_available.includes(time);
//         console.log("scheduleTime.is_available123",scheduleTime);
//         console.log("scheduleTime.is_available00",isBooked);
//         const isPast = isPastTimeSlot(time);
//         if (isBooked && !isPast) {
//             setSelectedTime(time);
//             // console.log("Selected time:", time);
//         }
//         // else {
//         //     console.log("Time not selectable:", time);
//         // }
//     };

//     const isPastTimeSlot = (time, date = selectedDate) => {
//         if (!time || !date) return false;

//         const match = time.match(/(\d{1,2}:\d{2})\s*(AM|PM)/i);
//         if (!match) return false;

//         const [, rawTime, modifier] = match;
//         let [hours, minutes] = rawTime.split(":").map(Number);

//         if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
//         if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

//         const now = new Date();
//         const selected = new Date(date);
//         selected.setHours(0, 0, 0, 0);
//         now.setSeconds(0, 0);

//         const isToday = selected.toDateString() === now.toDateString();
//         if (!isToday) return false;

//         const timeSlotDate = new Date();
//         timeSlotDate.setHours(hours, minutes, 0, 0);

//         return timeSlotDate <= now;
//     };

//     // const handleBookNow = async () => {
//     //     if(!selectedTime){
//     //         console.log("Please select time");
//     //         toast.error("Please select a time");
//     //         return;
//     //     }

//     //         // Double check that time is still valid for selectedDate
//     // // if (isPastTimeSlot(selectedTime)) {
//     // //     toast.error("Selected time is in the past. Please choose a valid time.");
//     // //     setSelectedTime(undefined); // Clear invalid selection
//     // //     return;
//     // // }

//     // //     if (selectedDate && selectedTime) {
//     // //         setShowSuccessModal(true);
//     // //         console.log("Selected Date and time:", formatDateToYYYYMMDD(selectedDate) + " " + selectedTime);
//     // //     }
//     // try {
//     //     // Call your booking API
//     //     const result = await dispatch(bookAppointment({
//     //         date: formatDateToYYYYMMDD(selectedDate),
//     //         time: selectedTime,
//     //         patient_id:patientId,
//     //         appointment_id:appointmentId
//     //     }));

//     //     console.log("result.payload?.status", result.payload?.status);

//     //     if (result.payload?.status) {
//     //         // Update local state to mark the time as booked
//     //         // const updatedSchedule = scheduleTime.map(slot => {
//     //         //     if (slot.display_time === selectedTime) {
//     //         //         return { ...slot, is_available: false };
//     //         //     }
//     //         //     return slot;
//     //         // });

//     //         // // You might need to update how you set scheduleTime based on your Redux setup
//     //         // // This assumes scheduleTime is managed locally - adjust if it's from Redux
//     //         // setScheduleTime(updatedSchedule);

//     //         setShowSuccessModal(true);
//     //     } else {
//     //         toast.error(result.payload?.message || "Failed to book appointment");
//     //     }
//     // } catch (error) {
//     //     toast.error("An error occurred while booking the appointment");
//     // }
//     // };
//     const isWithinTwoHours = (time, date = selectedDate) => {
//         if (!time || !date) return false;

//         const match = time.match(/(\d{1,2}:\d{2})\s*(AM|PM)/i);
//         if (!match) return false;

//         const [, rawTime, modifier] = match;
//         let [hours, minutes] = rawTime.split(":").map(Number);

//         if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
//         if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

//         const now = new Date();
//         const selected = new Date(date);
//         selected.setHours(hours, minutes, 0, 0);

//         // Calculate difference in hours
//         const diffInHours = (selected - now) / (1000 * 60 * 60);

//         return diffInHours >= 2;
//     };

//     const handleBookNow = async () => {
//         if (!selectedTime) {
//             toast.error("Please select a time");
//             return;
//         }

//         // Check if time is at least 2 hours in advance
//         if (!isWithinTwoHours(selectedTime)) {
//             toast.error("Appointments must be booked at least 2 hours in advance");
//             return;
//         }

//         try {
//             const result = await dispatch(bookAppointment({
//                 date: formatDateToYYYYMMDD(selectedDate),
//                 time: selectedTime, // Ensure uppercase AM/PM
//                 patient_id: patientId,
//                 appointment_id: appointmentId
//             }));

//                     if (selectedDate && selectedTime) {
//         //    setShowSuccessModal(true);
//            console.log("Selected Date and time:", formatDateToYYYYMMDD(selectedDate) + " " + selectedTime);
//            console.log("patientId", patientId);
//            console.log("appointmentId", appointmentId);
//         }

//             if (result.payload?.status) {
//                 setShowSuccessModal(true);
//             } else {
//                 toast.error(result.payload?.message || "Failed to book appointment");
//             }
//         } catch (error) {
//             toast.error("An error occurred while booking the appointment");
//         }
//     };

//     const handleCloseSuccessModal = () => {
//         setShowSuccessModal(false);
//     }

//     const disablePastDates = (date) => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); // Remove time part
//         return date < today;
//     };

//     return (
//         <div className="doctor-panel">
//             <div className="container-fluid">
//                 <div className="doc-panel-inr"> <Header /> </div>
//                 {loading ? (
//           <div className="loader-main">
//             <span className="loader"></span>
//           </div>
//         ) : (

//                 <div className="doc-panel-body has-texture">
//                     <div className="start-appointment cmn-mb">
//                         <div className="docpnl-sec-head text-center">
//                             <h1 className="h2-title">Schedule Appointment</h1>
//                             <div className="back-btn">
//                                 <Link to="#" onClick={(e) => {
//                                     e.preventDefault();
//                                     window.history.back();
//                                 }}>
//                                     <img src="./images/left-arrow.svg" alt="Back" />
//                                 </Link>
//                             </div>
//                         </div>

//                         <div className="schedule-appointment-wrp">
//                             <div className="schedule-appointment row">
//                                 <div className="schedule-appointment-left-wrp col-lg-6">
//                                     <div className="schedule-appointmnet-left">
//                                         <img src="./images/schedule-aapointment-left-img.png" alt="Schedule" />
//                                     </div>
//                                 </div>
//                                 <div className="schedule-appointment-right-wrp col-lg-6">
//                                     <div className="schedule-appointment-right">
//                                         <div className="calender-wrp">
//                                             <div className="caleder-heading">
//                                                 <h2 className="h3-title">Select Date and Time</h2>
//                                             </div>

//                                             <div className="calender">
//                                                 <Calendar bordered disabledDate={disablePastDates} onSelect={handleDateSelect} />

//                                                 {selectedDate && (
//                                                     <div className="selected-date">
//                                                         {/* Selected: December {selectedDate}, 2024 */}
//                                                         {selectedDate && (
//                                                             <div className="selected-date">
//                                                                 Selected: {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getDate()}, {selectedDate.getFullYear()}
//                                                             </div>
//                                                         )}

//                                                     </div>
//                                                 )}
//                                                 <div className="select-time-wrp">
//                                                     { loading && <div style={{display:"flex", justifyContent:"center", alignItems:"center", width:"100%", minHeight:"400px"}}><span class="loader"></span></div>}

//                                                     {scheduleTime.map(slot => {
//                                                         const isBooked = !slot?.is_available;
//                                                         const isPast = isPastTimeSlot(slot?.display_time);
//                                                         const isSelected = selectedTime === slot?.display_time;

//                                                         return (
//                                                             <div
//                                                                 key={slot?.value}
//                                                                 className={`available-time
//                                                                     ${isBooked ? 'booked-time' : ''}
//                                                                     ${isPast ? 'disabled-time' : ''}
//                                                                     ${isSelected ? 'selected' : ''}`}
//                                                                 onClick={() => handleTimeSelect(slot?.display_time, slot?.is_available )}
//                                                                 style={{ pointerEvents: isBooked || isPast ? 'none' : 'auto', opacity: isBooked || isPast ? 0.5 : 1 }}
//                                                             >
//                                                                 {slot?.display_time}
//                                                             </div>
//                                                         );
//                                                     })}
//                                                 </div>

//                                                 <button
//                                                     type="button"
//                                                     className="orange-btn book-btn"
//                                                     // data-bs-toggle="modal"
//                                                     // data-bs-target="#appointBooked"
//                                                     onClick={handleBookNow}
//                                                     // disabled={!selectedDate || !selectedTime}
//                                                 >
//                                                     Book Now
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//         )}
//                 <Footer />
//             </div>

//             {/* Booked Modal */}

//             <Modal
//                 show={showSuccessModal}
//                 onHide={handleCloseSuccessModal}
//                 centered
//                 className="popup-wrp"
//                 id="congratulations"
//                 dialogClassName="custom-modal"
//             >
//                 <style>{`
//                       .custom-modal .modal-content{
//                         padding:30px 0 50px 0;
//                         margin:0;
//                       }

//                     `}</style>
//                     <button
//                 type="button"
//                 className="close"
//                 onClick={handleCloseSuccessModal}
//                 aria-label="Close"
//               >
//                 <span aria-hidden="true">
//                   <img src="/images/cross-blue.png" alt="Close" />
//                 </span>
//               </button>
//                 <div className="modal-icon text-center mt-4">
//                     <img src="./images/check-icon.png" alt="Icon" />
//                 </div>
//                 <Modal.Header className="border-0 flex-column text-center">
//                     <Modal.Title id="exampleModalLongTitle" className="w-100">
//                         <h2>Congratulations</h2>
//                     </Modal.Title>
//                     <p style={{ padding: '20px' }}>Your appointment with Patient Name is confirmed for <span className="bookingDateTime">
//                         {/* {selectedDate && selectedTime ? `December ${selectedDate}, 2024 at ${selectedTime}` : ''} */}
//                         {selectedDate && selectedTime
//                             ? `${selectedDate.toLocaleString('default', {
//                                 month: 'long',
//                                 day: 'numeric',
//                                 year: 'numeric'
//                             })} at ${selectedTime}`
//                             : ''}
//                     </span>.</p>
//                 </Modal.Header>
//                 <Modal.Footer className="d-flex justify-content-center border-0">
//                     <Link to="/doctor-home" className="orange-btn" onClick={handleCloseSuccessModal}>Ok</Link>
//                 </Modal.Footer>
//             </Modal>

//         </div>
//     );
// };

// export default ScheduleAppointment;
// -----------------------------------------------------------------------------------------

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Modal } from 'react-bootstrap';
// import Header from '../component/doctorPanel/Header';
// import Footer from '../component/doctorPanel/Footer';
// import { toast } from 'react-toastify';
// import { Calendar } from 'rsuite';
// import 'rsuite/Calendar/styles/index.css';

// const ScheduleAppointment = () => {
//     // const [currentDate, setCurrentDate] = useState(new Date());
//     // const [selectedDate, setSelectedDate] = useState(null);

//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [selectedTime, setSelectedTime] = useState();
//     const [showSuccessModal, setShowSuccessModal] = useState(false);

//     // Mock calendar data - in a real app you would fetch this or generate it dynamically
//     // const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
//     // const monthDays = Array(31).fill().map((_, i) => i + 1); // Days 1-31
//     // const currentMonthYear = "December 2024";
//     const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

//     // const monthNames = ["January", "February", "March", "April", "May", "June",
//     //     "July", "August", "September", "October", "November", "December"
//     // ];
//     // const currentMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

//     const availableTimes = [
//         "10:30am", "11:00am", "11:30am", "12:00pm",
//         "12:30pm", "01:00pm", "01:30pm", "02:00pm",
//         "02:30pm", "03:00pm", "03:30pm", "04:00pm",
//         "04:30pm", "05:00pm", "05:30pm", "07:00pm"
//     ];
//     const bookedTimes = ["11:30am", "03:00pm", "05:00pm"];

//     const handleDateSelect = (day) => {
//         setSelectedDate(day);
//         // console.log("Selected Date:", day);
//     };

//     // const handleDateSelect = (day) => {
//     //     const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     //     setSelectedDate(selected);
//     //     console.log(day);
//     //     console.log(selected);
//     // };

//     // const handleTimeSelect = (time) => {
//     //     if (!bookedTimes.includes(time)) {
//     //         setSelectedTime(time);
//     //     }
//     // };

//     const handleTimeSelect = (time) => {
//         const isBooked = bookedTimes.includes(time);
//         const isPast = isPastTimeSlot(time);
//         if (!isBooked && !isPast) {
//             setSelectedTime(time);
//             // console.log("Selected time:", time);
//         }
//         // else {
//         //     console.log("Time not selectable:", time);
//         // }
//     };

//     const isPastTimeSlot = (time) => {
//         if (!selectedDate) return false;

//         const now = new Date();
//         const selected = new Date(selectedDate);
//         selected.setHours(0, 0, 0, 0);
//         now.setSeconds(0, 0);

//         const isToday = selected.toDateString() === now.toDateString();
//         if (!isToday) return false;

//         const [rawTime, modifier] = time.match(/(\d{2}:\d{2})(am|pm)/i).slice(1, 3);
//         let [hours, minutes] = rawTime.split(":").map(Number);

//         if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
//         if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

//         const timeSlotDate = new Date();
//         timeSlotDate.setHours(hours, minutes, 0, 0);

//         return timeSlotDate <= now;
//     };

//     const handleBookNow = () => {
//         if(!selectedTime){
//             console.log("Please select time");
//             toast.error("Please select a time");
//             return;
//         }

//         if (selectedDate && selectedTime) {
//             setShowSuccessModal(true);
//             console.log("Selected Date:", selectedDate);
//             console.log("Selected time:", selectedTime);
//         }
//     };

//     const handleCloseSuccessModal = () => {
//         setShowSuccessModal(false);
//     }

//     const disablePastDates = (date) => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); // Remove time part
//         return date < today;
//     };

//     return (
//         <div className="doctor-panel">
//             <div className="container-fluid">
//                 <div className="doc-panel-inr">
//                     <Header />
//                 </div>

//                 {/* Panel Body Begin */}
//                 <div className="doc-panel-body has-texture">
//                     <div className="start-appointment cmn-mb">
//                         <div className="docpnl-sec-head text-center">
//                             <h1 className="h2-title">Schedule Appointment</h1>
//                             <div className="back-btn">
//                                 <Link to="#" onClick={(e) => {
//                                     e.preventDefault();
//                                     window.history.back();
//                                 }}>
//                                     <img src="./images/left-arrow.svg" alt="Back" />
//                                 </Link>
//                             </div>
//                         </div>

//                         <div className="schedule-appointment-wrp">
//                             <div className="schedule-appointment row">
//                                 <div className="schedule-appointment-left-wrp col-lg-6">
//                                     <div className="schedule-appointmnet-left">
//                                         <img src="./images/schedule-aapointment-left-img.png" alt="Schedule" />
//                                     </div>
//                                 </div>
//                                 <div className="schedule-appointment-right-wrp col-lg-6">
//                                     <div className="schedule-appointment-right">
//                                         <div className="calender-wrp">
//                                             <div className="caleder-heading">
//                                                 <h2 className="h3-title">Select Date and Time</h2>
//                                             </div>

//                                             <div className="calender">
//                                                 <Calendar bordered
//                                                     disabledDate={disablePastDates}
//                                                     onSelect={handleDateSelect} />
//                                                 {/* <div className="calender-monthyear">
//                                                     <button className="prev-month">
//                                                         <img src="./images/chevron-left.svg" alt="Previous" />
//                                                     </button>
//                                                     <h2 className="h3-title">{currentMonthYear}</h2>
//                                                     <button className="next-month">
//                                                         <img src="./images/chevron-right.svg" alt="Next" />
//                                                     </button>
//                                                 </div> */}

//                                                 {/* <div className="calneder-body">
//                                                     <div className="calender-body-inr">
//                                                         <div className="week-days-wrp">
//                                                             {weekDays.map(day => (
//                                                                 <div key={day}>{day}</div>
//                                                             ))}
//                                                         </div>

//                                                         <div className="moth-days-wrp">
//                                                             {monthDays.map(day => (
//                                                                 <div
//                                                                     key={day}
//                                                                     className={selectedDate === day ? 'selected' : ''}
//                                                                     onClick={() => handleDateSelect(day)}

//                                                                 >
//                                                                     {day}
//                                                                 </div>
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 </div> */}

//                                                 {selectedDate && (
//                                                     <div className="selected-date">
//                                                         {/* Selected: December {selectedDate}, 2024 */}
//                                                         {selectedDate && (
//                                                             <div className="selected-date">
//                                                                 Selected: {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getDate()}, {selectedDate.getFullYear()}
//                                                             </div>
//                                                         )}

//                                                     </div>
//                                                 )}

//                                                 {/* <div className="select-time-wrp">
//                                                     {availableTimes.map(time => (
//                                                         <div
//                                                             key={time}
//                                                             className={`available-time ${bookedTimes.includes(time) ? 'booked-time' : ''} ${selectedTime === time ? 'selected' : ''}`}
//                                                             onClick={() => handleTimeSelect(time)}
//                                                         >
//                                                             {time}
//                                                         </div>
//                                                     ))}
//                                                 </div> */}

//                                                 <div className="select-time-wrp">
//                                                     {availableTimes.map(time => {
//                                                         const isBooked = bookedTimes.includes(time);
//                                                         const isPast = isPastTimeSlot(time);
//                                                         const isSelected = selectedTime === time;

//                                                         return (
//                                                             <div
//                                                                 key={time}
//                                                                 className={`available-time
//                     ${isBooked ? 'booked-time' : ''}
//                     ${isPast ? 'disabled-time' : ''}
//                     ${isSelected ? 'selected' : ''}`}
//                                                                 onClick={() => handleTimeSelect(time)}
//                                                                 style={{ pointerEvents: isBooked || isPast ? 'none' : 'auto', opacity: isBooked || isPast ? 0.5 : 1 }}
//                                                             >
//                                                                 {time}
//                                                             </div>
//                                                         );
//                                                     })}
//                                                 </div>

//                                                 <button
//                                                     type="button"
//                                                     className="orange-btn book-btn"
//                                                     // data-bs-toggle="modal"
//                                                     // data-bs-target="#appointBooked"
//                                                     onClick={handleBookNow}
//                                                     // disabled={!selectedDate || !selectedTime}
//                                                 >
//                                                     Book Now
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* End Of Panel Body */}

//                 {/* Panel Footer Begin */}
//                 <Footer />
//                 {/* End Of Panel Footer */}
//             </div>

//             {/* Booked Modal */}

//             <Modal
//                 show={showSuccessModal}
//                 onHide={handleCloseSuccessModal}
//                 centered
//                 className="popup-wrp"
//                 id="congratulations"
//                 dialogClassName="custom-modal"
//             >
//                 <style>{`
//                       .custom-modal .modal-content{
//                         padding:30px 0 50px 0;
//                         margin:0;
//                       }

//                     `}</style>
//                 <div className="modal-icon text-center mt-4">
//                     <img src="./images/check-icon.png" alt="Icon" />
//                 </div>
//                 <Modal.Header className="border-0 flex-column text-center">
//                     <Modal.Title id="exampleModalLongTitle" className="w-100">
//                         <h2>Congratulations</h2>
//                     </Modal.Title>
//                     <p style={{ padding: '20px' }}>Your appointment with Patient Name is confirmed for <span className="bookingDateTime">
//                         {/* {selectedDate && selectedTime ? `December ${selectedDate}, 2024 at ${selectedTime}` : ''} */}
//                         {selectedDate && selectedTime
//                             ? `${selectedDate.toLocaleString('default', {
//                                 month: 'long',
//                                 day: 'numeric',
//                                 year: 'numeric'
//                             })} at ${selectedTime}`
//                             : ''}
//                     </span>.</p>
//                 </Modal.Header>
//                 <Modal.Footer className="d-flex justify-content-center border-0">
//                     <Link to="/doctor-home" className="orange-btn" onClick={handleCloseSuccessModal}>Ok</Link>
//                 </Modal.Footer>
//             </Modal>

//         </div>
//     );
// };

// export default ScheduleAppointment;

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  bookAppointment,
  getScheduleTime,
} from "../redux/slices/prescriptionSlice";

const ScheduleAppointment = () => {
  const location = useLocation();
  const { patientId, appointmentId, patientName } = location.state || {};
  const dispatch = useDispatch();
  const { scheduleTime, loading } = useSelector((state) => state.prescriptions);
  const { patientProfileData } = useSelector((state) => state.patientProfile);

  // console.log("patient::::::::::::", patientName);
  // Initialize selectedDate with today
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // For calendar month/year display & navigation
  const [calendarMonth, setCalendarMonth] = useState(selectedDate.getMonth());
  const [calendarYear, setCalendarYear] = useState(selectedDate.getFullYear());

  // Utility to format date as YYYY-MM-DD
  function formatDateToYYYYMMDD(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // When selectedDate changes, update calendarMonth and calendarYear accordingly
  useEffect(() => {
    setCalendarMonth(selectedDate.getMonth());
    setCalendarYear(selectedDate.getFullYear());
  }, [selectedDate]);

  // Fetch scheduleTime when selectedDate changes
  useEffect(() => {
    dispatch(getScheduleTime({ date: formatDateToYYYYMMDD(selectedDate) }));
  }, [dispatch, selectedDate]);

  // Build days to display in calendar grid
  const buildCalendarDays = () => {
    const days = [];

    // First day of month (0=Sun, 1=Mon,...)
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();

    // Adjust so week starts Monday instead of Sunday
    // Sunday (0) -> 7
    const startDay = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

    // Number of days in current month
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    // Number of days in previous month
    const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();

    // Fill days from previous month for leading empty slots
    for (let i = startDay - 1; i > 0; i--) {
      days.push({
        day: prevMonthDays - i + 1,
        currentMonth: false,
        date: new Date(calendarYear, calendarMonth - 1, prevMonthDays - i + 1),
      });
    }

    // Fill current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
        date: new Date(calendarYear, calendarMonth, i),
      });
    }

    // Fill days for next month to complete weeks (total days should be multiple of 7)
    const nextDaysCount = 7 - (days.length % 7);
    if (nextDaysCount < 7) {
      for (let i = 1; i <= nextDaysCount; i++) {
        days.push({
          day: i,
          currentMonth: false,
          date: new Date(calendarYear, calendarMonth + 1, i),
        });
      }
    }

    return days;
  };

  const calendarDays = buildCalendarDays();

  const handlePrevMonth = () => {
    let newMonth = calendarMonth - 1;
    let newYear = calendarYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);

    // Update selectedDate to first day of new month
    setSelectedDate(new Date(newYear, newMonth, 1));
    setSelectedTime(undefined);
  };

  const handleNextMonth = () => {
    let newMonth = calendarMonth + 1;
    let newYear = calendarYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);

    // Update selectedDate to first day of new month
    setSelectedDate(new Date(newYear, newMonth, 1));
    setSelectedTime(undefined);
  };

  const handleDayClick = (dayObj) => {
    if (!dayObj.currentMonth) return; // Disable click on days not in current month

    setSelectedDate(dayObj.date);
    setSelectedTime(undefined);
  };

  const isPastTimeSlot = (time, date = selectedDate) => {
    if (!time || !date) return false;

    const match = time.match(/(\d{1,2}:\d{2})\s*(AM|PM)/i);
    if (!match) return false;

    const [, rawTime, modifier] = match;
    let [hours, minutes] = rawTime.split(":").map(Number);

    if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

    const now = new Date();
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    now.setSeconds(0, 0);

    const isToday = selected.toDateString() === now.toDateString();
    if (!isToday) return false;

    const timeSlotDate = new Date();
    timeSlotDate.setHours(hours, minutes, 0, 0);

    return timeSlotDate <= now;
  };

  const isWithinTwoHours = (time, date = selectedDate) => {
    if (!time || !date) return false;

    const match = time.match(/(\d{1,2}:\d{2})\s*(AM|PM)/i);
    if (!match) return false;

    const [, rawTime, modifier] = match;
    let [hours, minutes] = rawTime.split(":").map(Number);

    if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

    const now = new Date();
    const selected = new Date(date);
    selected.setHours(hours, minutes, 0, 0);

    const diffInHours = (selected - now) / (1000 * 60 * 60);

    return diffInHours >= 2;
  };

  const handleTimeSelect = (time, isAvailable) => {
    if (!isAvailable) return;
    if (isPastTimeSlot(time)) return;
    setSelectedTime(time);
  };

  const handleBookNow = async () => {
    if (!selectedTime) {
      toast.error("Please select a time");
      return;
    }

    if (!isWithinTwoHours(selectedTime)) {
      toast.error("Appointments must be booked at least 2 hours in advance");
      return;
    }

    try {
      const result = await dispatch(
        bookAppointment({
          date: formatDateToYYYYMMDD(selectedDate),
          time: selectedTime,
          patient_id: patientId,
          appointment_id: appointmentId,
        })
      );

      if (result.payload?.status) {
        setShowSuccessModal(true);
      } else {
        toast.error(result.payload?.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error("An error occurred while booking the appointment");
    }
  };

  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  // Disable past dates for your calendar
  const disablePastDates = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="doctor-panel">
      <div className="container-fluid">
        <div className="doc-panel-inr">
          <Header />
        </div>

        {loading ? (
          <div className="loader-main">
            <span className="loader"></span>
          </div>
        ) : (
          <div className="doc-panel-body has-texture">
            <div className="start-appointment cmn-mb">
              <div className="docpnl-sec-head text-center">
                <h1 className="h2-title">Schedule Appointment</h1>
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

              <div className="schedule-appointment-wrp">
                <div className="schedule-appointment row">
                  <div className="schedule-appointment-left-wrp col-lg-6">
                    <div className="schedule-appointmnet-left">
                      <img
                        src="./images/schedule-aapointment-left-img.png"
                        alt="Schedule"
                      />
                    </div>
                  </div>

                  {/* === Your Custom Calendar === */}
                  <div className="schedule-appointment-right-wrp col-lg-6">
                    <div className="schedule-appointment-right">
                      <div className="calender-wrp">
                        <div className="caleder-heading">
                          <h2 className="h3-title">Select Date and Time</h2>
                        </div>

                        <div className="calender">
                          <div className="calender-monthyear">
                            <button
                              className="prev-month"
                              onClick={handlePrevMonth}
                              type="button"
                            >
                              <img src="./images/chevron-left.svg" alt="Icon" />
                            </button>
                            <h2 className="h3-title">
                              {new Date(
                                calendarYear,
                                calendarMonth
                              ).toLocaleString("default", {
                                month: "long",
                                year: "numeric",
                              })}
                            </h2>
                            <button
                              className="next-month"
                              onClick={handleNextMonth}
                              type="button"
                            >
                              <img
                                src="./images/chevron-right.svg"
                                alt="Icon"
                              />
                            </button>
                          </div>

                          <div className="calneder-body">
                            <div className="calender-body-inr">
                              <div className="week-days-wrp">
                                <div>Mon</div>
                                <div>Tue</div>
                                <div>Wed</div>
                                <div>Thu</div>
                                <div>Fri</div>
                                <div>Sat</div>
                                <div>Sun</div>
                              </div>

                              <div className="moth-days-wrp">
                                {calendarDays.map((dayObj, idx) => {
                                  const isSelected =
                                    formatDateToYYYYMMDD(dayObj.date) ===
                                    formatDateToYYYYMMDD(selectedDate);
                                  const isToday =
                                    formatDateToYYYYMMDD(dayObj.date) ===
                                    formatDateToYYYYMMDD(new Date());
                                  const isDisabled =
                                    !dayObj.currentMonth ||
                                    disablePastDates(dayObj.date);

                                  return (
                                    <div
                                      key={idx}
                                      className={`day ${
                                        isSelected
                                          ? "selected-day"
                                          : isToday
                                          ? "today"
                                          : ""
                                      } ${
                                        !dayObj.currentMonth
                                          ? "not-current-month"
                                          : ""
                                      } ${isDisabled ? "disabled-day" : ""}`}
                                      onClick={() => handleDayClick(dayObj)}
                                      style={{
                                        cursor: isDisabled
                                          ? "default"
                                          : "pointer",
                                        color: !dayObj.currentMonth
                                          ? "#ccc"
                                          : isDisabled
                                          ? "#999"
                                          : isSelected
                                          ? "#fff"
                                          : "#356598",
                                        backgroundColor: isSelected
                                          ? "#199FD9"
                                          : isToday
                                          ? "#ccc"
                                          : "transparent",
                                        borderRadius: isSelected ? "50%" : "0",
                                        userSelect: "none",
                                        width: "32px",
                                        height: "32px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "2px",
                                        fontWeight: isSelected
                                          ? "bold"
                                          : "normal",
                                      }}
                                    >
                                      {dayObj.day}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div
                            className="selected-date"
                            style={{ marginTop: "15px", fontWeight: "bold" }}
                          >
                            Selected:{" "}
                            {selectedDate.toLocaleString("default", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>

                          <div
                            className="select-time-wrp"
                            style={{ marginTop: "15px" }}
                          >
                            {loading && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "100%",
                                  minHeight: "100px",
                                }}
                              >
                                <span className="loader"></span>
                              </div>
                            )}

                            {scheduleTime.map((slot) => {
                              const isBooked = !slot?.is_available;
                              const isPast = isPastTimeSlot(slot?.display_time);
                              const isSelected =
                                selectedTime === slot?.display_time;

                              return (
                                <div
                                  key={slot?.value}
                                  className={`available-time 
                                      ${isBooked ? "booked-time" : ""}
                                      ${isPast ? "disabled-time" : ""}
                                      ${isSelected ? "selected" : ""}`}
                                  onClick={() =>
                                    handleTimeSelect(
                                      slot?.display_time,
                                      slot?.is_available
                                    )
                                  }
                                  style={{
                                    pointerEvents:
                                      isBooked || isPast ? "none" : "auto",
                                    opacity: isBooked || isPast ? 0.5 : 1,
                                    cursor:
                                      isBooked || isPast
                                        ? "default"
                                        : "pointer",
                                    userSelect: "none",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    margin: "4px",
                                    display: "inline-block",
                                    border: isSelected
                                      ? "2px solid #199FD9"
                                      : "1px solid #ccc",
                                    // backgroundColor: isSelected ? "#199FD9" : "#fff",
                                    fontWeight: isSelected ? "bold" : "normal",
                                  }}
                                >
                                  {slot?.display_time}
                                </div>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            className="orange-btn book-btn"
                            onClick={handleBookNow}
                            disabled={!selectedDate || !selectedTime}
                            style={{ marginTop: "20px" }}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* End calendar */}
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={handleCloseSuccessModal}
        centered
        className="popup-wrp"
        id="congratulations"
        dialogClassName="custom-modal"
      >
        <style>{`
            .custom-modal .modal-content {
              padding: 30px 0 50px 0;
              margin: 0;
            }
          `}</style>
        <button
          type="button"
          className="close"
          onClick={handleCloseSuccessModal}
          aria-label="Close"
        >
          <span aria-hidden="true">
            <img src="/images/cross-blue.png" alt="Close" />
          </span>
        </button>
        <div className="modal-icon text-center mt-4">
          <img src="./images/check-icon.png" alt="Icon" />
        </div>
        <Modal.Header className="border-0 flex-column text-center">
          <Modal.Title id="exampleModalLongTitle" className="w-100">
            <h2>Congratulations</h2>
          </Modal.Title>
          <p style={{ padding: "20px", fontSize: "20px", color: "#858484" }}>
            Your appointment with
            <br /> {patientName} is confirmed for <br />
            <span className="bookingDateTime">
              {selectedDate && selectedTime
                ? `${selectedDate.toLocaleString("default", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })} at ${selectedTime}`
                : ""}
            </span>
            .
          </p>
        </Modal.Header>
        <Modal.Footer className="d-flex justify-content-center border-0">
          <Link
            to="/doctor-home"
            className="orange-btn"
            onClick={handleCloseSuccessModal}
          >
            Ok
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ScheduleAppointment;
