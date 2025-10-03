import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";
import CustomModal from "../component/CustomModal";
import { useDispatch, useSelector } from "react-redux";
// import { doctorHomeDashboard } from '../redux/slices/userSlice';
import { doctorHomeDashboard } from "../redux/slices/dataSlice";
import {
  doctorCanceledAppointment,
  getJoinVideoCall,
  sendPushNotification,
} from "../redux/slices/myAppointmentSlice";

import { feedbackapi } from "../redux/slices/patientProfileSlice";

import { getDoctorProfile } from "../redux/slices/userSlice";
import axios from "axios";
import { setVideoData } from "../redux/slices/infoSlice";
import SuspensionModal from "../component/SuspensionModal";
import {
  getAllNotifications,
  notifyNewChatRes,
} from "../redux/slices/notificationSlice";
import StarRating from "../component/StartRating";
import baseUrl from "../config/BaseUrl";
import BaseUrl from "../config/Constant";

const DoctorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [nextApiCallTime, setNextApiCallTime] = useState(null);

  // console.log(nextApiCallTime, "asdfasdfhkashdfksh");

  const localStorageModal = JSON.parse(localStorage.getItem("feedbackPopup"));
  // console.log(localStorageModal, "data seted from here this is");

  const appData = JSON.parse(localStorage.getItem("doctor-app") || "{}");
  const DoctorLoginId = appData.doctorData;

  // console.log(DoctorLoginId?.id, "Doctor Data");

  // const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  // const {userdata, loading} = useSelector((state) => state.dataSlice)
  const { userdata, loading, error } = useSelector((state) => state.userdata);
  const { appointmentIdd, modaleOpen } = location.state || {};
  const { channelDetails } = useSelector((state) => state.appointments);
  // console.log(channelDetails, "jfaklshfsahdfks");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { feedbackSubmit, feedbackLoading } = useSelector(
    (state) => state.patientProfile
  );

  const { user } = useSelector((state) => state.user);

  // console.log(appointmentIdd, "appointment idddddd", modaleOpen);

  useEffect(() => {
    if (!user?.profile_path) {
      dispatch(getDoctorProfile());
    }
  }, [dispatch, user]);

  // useEffect(() => {
  //   dispatch(doctorHomeDashboard());
  // }, [dispatch, navigate]);

  useEffect(() => {
    // Initial API call
    dispatch(doctorHomeDashboard())
      .then((response) => {
        // Assuming response.payload contains the userData
        const apiData = response.payload?.data;
        // console.log(apiData, "ASDFASDFASDFASFASDASDFAS");

        if (
          apiData &&
          apiData.upcomingAppointments &&
          apiData.upcomingAppointments.length > 0
        ) {
          const firstAppointmentTime =
            apiData.upcomingAppointments[0].appointment_starttime;
          setNextApiCallTime(new Date(firstAppointmentTime));
        }
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(notifyNewChatRes());
  // }, []);

  // This effect will run when nextApiCallTime changes
  useEffect(() => {
    if (nextApiCallTime) {
      const currentTime = new Date();
      const delay = nextApiCallTime.getTime() - currentTime.getTime();
      // console.log(delay, "fddgfgfghgfgfdfdd");

      if (delay > 0) {
        // console.log(`Scheduling next API call in ${delay / 1000} seconds.`);
        const timerId = setTimeout(() => {
          // console.log("Re-hitting API due to scheduled time.");
          dispatch(doctorHomeDashboard());
        }, delay);

        // Cleanup function for useEffect
        return () => clearTimeout(timerId);
      } else {
        // console.log(
        //   "Appointment time is in the past or now. Re-hitting API immediately."
        // );
        // If the time has already passed or is current, re-hit immediately
        dispatch(doctorHomeDashboard());
      }
    }
  }, [nextApiCallTime, dispatch]);

  // const [activeTab, setActiveTab] = useState('upcoming');
  const [showModal, setShowModal] = useState(false);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [showAllPrescriptions, setShowAllPrescriptions] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [canOpenModal, setCanOpenModal] = useState(true);
  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigate("/login-password");
    localStorage.removeItem("doctor-app");
  };

  const [isLoading, setIsLoading] = useState(false);

  //for StartAppointment
  // State to track if we should show the start appointment section
  const [showAppointmentSection, setShowAppointmentSection] = useState(false);
  // State to store the current appointment that matches the time
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // New Condition Check for active appointments (status === 1)
  useEffect(() => {
    if (userdata?.upcomingAppointments) {
      const activeAppointment = userdata.upcomingAppointments.find(
        (appointment) => appointment.status === 1
      );

      if (activeAppointment) {
        // console.log("Found active appointment:", activeAppointment);
        setCurrentAppointment(activeAppointment); // Set the actual appointment object
        setShowAppointmentSection(true);
      } else {
        setCurrentAppointment(null);
        setShowAppointmentSection(false);
      }
    }
  }, [userdata?.upcomingAppointments]);

  const handleCancelClick = (id) => {
    setSelectedAppointmentId(id);
    setShowModal(true);
  };

  const handleCancelConfirm = () => {
    setShowModal(false);
    setShowCancelReasonModal(true);
  };

  const handleCancelReasonSubmit = () => {
    // console.log("Cancelled appointment ID:", selectedAppointmentId);
    // console.log("Reason:", cancelReason);

    dispatch(
      doctorCanceledAppointment({
        appointment_id: selectedAppointmentId,
        cancel_message: cancelReason,
      })
    ).then(() => {
      // Refresh the upcoming appointments list after successful cancellation
      dispatch(doctorHomeDashboard());
      setShowCancelReasonModal(false);
      setCancelReason("");
      setSelectedAppointmentId(null);
      setShowSuccessModal(true);
    });
  };

  useEffect(() => {
    const reminderTimer = setTimeout(() => {}, 1000);

    const appointmentTimer = setTimeout(() => {
      setShowAppointmentSection(true); // Show the appointment section after the reminder
    }, 3000); // 2 minutes for the appointment section to appear

    return () => {
      clearTimeout(reminderTimer); // Clear the reminder timer
      clearTimeout(appointmentTimer); // Clear the appointment section timer
    };
  }, []);

  // Get upcoming appointments and pending prescriptions from API data
  const upcomingAppointments = userdata?.upcomingAppointments || [];
  const pendingPrescriptions = userdata?.pendingPrescriptions || [];

  // Determine which appointments/prescriptions to show based on "See all" state
  const visibleAppointments = showAllAppointments
    ? upcomingAppointments
    : upcomingAppointments.slice(0, 6);

  const visiblePrescriptions = showAllPrescriptions
    ? pendingPrescriptions
    : pendingPrescriptions.slice(0, 3);

  // handle create channel to join call

  const sendNotitficaion = async (id) => {
    // console.log("call 222");
    await dispatch(
      sendPushNotification({
        // channelName: `JoinCall + ${DoctorLoginId?.id}`,
        appointmentId: id,
      })
    );
  };

  // const handleCreateChannel = async (id) => {
  //   console.log(id, `JoinCall + ${DoctorLoginId?.id}`, "params of the data");
  //   await dispatch(
  //     getJoinVideoCall({
  //       // channelName: `JoinCall + ${DoctorLoginId?.id}`,
  //       appointmentId: id,
  //     })
  //   );
  //   if (channelDetails) {
  //     navigate("/VideoCall", {
  //       state: {
  //         id: currentAppointment.appointment_id,
  //         patientId: currentAppointment.patient_id,
  //         name: currentAppointment?.patient_name,
  //         time_period: currentAppointment?.time,
  //       },
  //     });
  //     sendNotitficaion(id);
  //   }
  // };

  //
  useEffect(() => {
    dispatch(getAllNotifications());
  }, []);
  const handleCreateChannel = async (id) => {
    // console.log("call 11");
    setIsLoading(true); // Start loader
    try {
      const token = JSON.parse(localStorage.getItem("doctor-app"))?.token;

      const response = await axios.post(
        `${baseUrl}api/create-channel`,
        { appointmentId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        // console.log(response?.data?.data, "sdhfkjasfhjksjf");
        dispatch(setVideoData(response?.data?.data));
        navigate("/VideoCall", {
          state: {
            id: currentAppointment.appointment_id,
            patientId: currentAppointment.patient_id,
            name: currentAppointment?.patient_name,
            time_period: currentAppointment?.time,
            // channelDetails: {
            //   appId: response?.data?.data?.appId,
            //   token: response?.data?.data?.channelName,
            //   channelName: response?.data?.data?.token,
            //   uid: response?.data?.data?.uid,
            // },
          },
        });

        sendNotitficaion(id);
      } else {
        console.error("Channel creation failed:", response.data?.message);
      }
    } catch (error) {
      console.error("Error creating channel:", error);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  // useEffect(() => {
  //   if (channelDetails) {
  //     navigate("/VideoCall", {
  //       state: {
  //         id: currentAppointment.appointment_id,
  //         patientId: currentAppointment.patient_id,
  //         name: currentAppointment?.patient_name,
  //       },
  //     });

  //     // Clear selectedAppointmentId to avoid duplicate navigation
  //     // setSelectedAppointmentId(null);
  //   }
  // }, [channelDetails]);

  // const convertTimeRangeTo24Hour = (timeRange) => {
  //   const [startTime, endTime] = timeRange.split(" - ");

  //   const convertTo24Hour = (timeStr) => {
  //     const [time, modifier] = timeStr.split(" ");
  //     let [hours, minutes] = time.split(":");

  //     if (modifier === "PM" && hours !== "12") {
  //       hours = parseInt(hours, 10) + 12;
  //     }
  //     if (modifier === "AM" && hours === "12") {
  //       hours = "00";
  //     }

  //     return `${String(hours).padStart(2, '0')}:${minutes}`;
  //   };

  //   const start24 = convertTo24Hour(startTime + " " + endTime.split(" ")[1]); // include AM/PM from endTime
  //   const end24 = convertTo24Hour(endTime);

  //   return `${start24} - ${end24}`;
  // };

  // const convertTo24HourTiming = (dateTimeStr) => {
  //   if (!dateTimeStr) return '';

  //   const parts = dateTimeStr.split(' ');
  //   if (parts.length < 2) return '';

  //   const [time, modifier] = [parts[1], parts[2]];
  //   let [hours, minutes] = time.split(':');
  //   hours = parseInt(hours, 10);

  //   if (modifier === "PM" && hours !== 12) {
  //     hours += 12;
  //   }
  //   if (modifier === "AM" && hours === 12) {
  //     hours = 0;
  //   }

  //   return `${String(hours).padStart(2, '0')}:${minutes}`;
  // };

  //cancel disable function

  // const isCancelDisabled = (dateStr, timeStr) => {
  //   if (!dateStr || !timeStr) return false;

  //   try {
  //     // Extract parts from the date (e.g., "Tue Jun 10")
  //     const [weekday, month, day] = dateStr.split(" ");
  //     const year = new Date().getFullYear(); // current year

  //     // Extract start time and AM/PM (e.g., "07:30 - 07:45 PM")
  //     const [startTime, endTimeWithPeriod] = timeStr.split(" - ");
  //     const period = endTimeWithPeriod.trim().slice(-2); // "AM" or "PM"
  //     const startTimeWithPeriod = `${startTime.trim()} ${period}`;

  //     // Combine date and time into a full string like: "Jun 10, 2025 07:30 PM"
  //     const dateTimeStr = `${month} ${day}, ${year} ${startTimeWithPeriod}`;
  //     const appointmentDateTime = new Date(dateTimeStr);
  //     const now = new Date();

  //     const diffInMs = appointmentDateTime - now;
  //     // const diffInHours = diffInMs / (1000 * 60 * 60);

  //     // Disable if appointment has passed or is within 2 hours
  //     // return diffInHours <= 2;
  //     // Disable only if appointment time has already passed this new functionality added
  //     return diffInMs <= 0;
  //   } catch (error) {
  //     console.error("Date parse error:", error);
  //     return false;
  //   }
  // };

  const isAppointmentOngoing = (dateStr, timeStr) => {
    try {
      const [weekday, month, day] = dateStr.split(" ");
      const year = new Date().getFullYear();

      const [startTimeStr, endTimeStrWithPeriod] = timeStr.split(" - ");
      const period = endTimeStrWithPeriod.trim().slice(-2); // AM/PM

      const startTimeWithPeriod = `${startTimeStr.trim()} ${period}`;
      const endTimeWithPeriod = endTimeStrWithPeriod.trim();

      const startDateTime = new Date(
        `${month} ${day}, ${year} ${startTimeWithPeriod}`
      );
      const endDateTime = new Date(
        `${month} ${day}, ${year} ${endTimeWithPeriod}`
      );

      const now = new Date();
      return now >= startDateTime && now <= endDateTime;
    } catch (error) {
      console.error("Error parsing appointment time:", error);
      return false;
    }
  };

  const formatDate = (rawDateStr) => {
    if (!rawDateStr) return "N/A";

    // Append current year to complete the date
    const currentYear = new Date().getFullYear();
    const fullDateStr = `${rawDateStr} ${currentYear}`; // e.g., "Thu Jun 19 2025"

    const date = new Date(fullDateStr);
    if (isNaN(date)) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // JS months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  //user suspeded out the app

  const checkSuspensionStatus = useCallback(async () => {
    const apiEndpoint =
      // "https://awplconnectadmin.tgastaging.com/api/doctor/is_suspended";
      `${baseUrl}api/doctor/is_suspended`;

    try {
      const storedAuth = JSON.parse(localStorage.getItem("doctor-app"));
      const token = storedAuth?.token;

      if (!token) {
        console.warn(
          "No token found in localStorage. User might not be logged in."
        );
        // If no token, the user is likely not authenticated.
        // Redirect to login or show an unauthenticated state.

        // navigate("/login"); // Example: if you have navigate from react-router-dom
        return;
      }

      // Using Axios for the POST request
      const response = await axios.post(
        apiEndpoint,
        {},
        {
          // The second argument {} is for the request body (empty in this case),
          // the third argument is for config (headers, etc.)
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming Bearer token
          },
        }
      );

      // Axios automatically parses JSON, so response.data is directly the JSON object
      const result = response.data;

      if (response.data) {
        // console.log(result?.data?.is_suspended, "jsdfkashdkfhsjfjsjdfs");
        // Check for successful HTTP status codes
        if (result.data.is_suspended) {
          setIsModalVisible(true);
        } else {
          setIsModalVisible(false); // Ensure modal is hidden if not suspended
        }
      } else {
        // This block might be less frequently hit with Axios because it throws errors for 4xx/5xx
        console.error(
          "API Error (unexpected Axios success path):",
          result.message
        );
      }
    } catch (err) {
      // Axios throws an error for 4xx and 5xx status codes,
      // so this catch block will handle both network errors and API errors (e.g., 401, 403, 500)
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const apiErrorMsg = err.response.data?.message || err.message;
          console.error("Axios API Error Response:", err.response.data);
          // Specific handling for 401 Unauthorized, etc.
          // if (err.response.status === 401) { navigate("/login"); }
        } else if (err.request) {
          // The request was made but no response was received

          console.error("Axios No Response Error:", err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Axios Request Setup Error:", err.message);
        }
      } else {
        // Any other non-Axios related error
        console.error("General Error:", err);
      }
    }
  }, [navigate]);
  useEffect(() => {
    checkSuspensionStatus();
  }, [checkSuspensionStatus]);

  ///

  // feedback popup
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (modaleOpen && appointmentIdd && localStorageModal != "1") {
      setShowRatingModal(true);
    }
  }, [modaleOpen, appointmentIdd]);

  const handleRatingSubmit = () => {
    dispatch(
      feedbackapi({
        appointment_id: appointmentIdd,
        rating: rating,
        comment: feedback,
      })
    );

    setShowRatingModal(false);
  };

  return (
    <>
      {/* <Header /> */}

      <main className="doctor-panel">
        <div className="container-fluid">
          <SuspensionModal
            visible={isModalVisible}
            onClose={handleCloseModal}
          />
          <div
            className="doc-panel-inr"
            style={{ display: "flex", gap: "20px" }}
          >
            <div style={{ width: "100%" }}>
              <Header />
            </div>
            <div>
              <div className="doc-img">
                <img
                  src={`${BaseUrl?.BaseUrl}${user?.profile_path}`}
                  alt="Doctor"
                />
              </div>
              <div className="doc-profile-body">
                <Link to="/UserProfile">
                  <p style={{ color: "#199FD9" }}>
                    {user?.prefixed_name || "Doctor Name"}
                  </p>
                </Link>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="loader-main">
              <span className="loader"></span>
            </div>
          ) : (
            <div className="doc-panel-body">
              <div className="appointments">
                {/* Start Appointment */}
                {showAppointmentSection && currentAppointment && (
                  <div
                    className="start-appointment mt-0"
                    style={{ marginBottom: "60px" }}
                  >
                    <div className="docpnl-sec-head">
                      <h6 className="h2-title">Start Appointment</h6>
                      {/* // to decrease their size i add css of 35px fontsize in dasboard */}
                    </div>
                    <div className="apointment-detail-card">
                      <div className="apoint-dtl-img">
                        {/* <img
                          src={`${baseUrl}/${currentAppointment.patient_profile}`}
                          alt={currentAppointment.patient_name}
                          style={{ height: 200, resize: "contain" }}
                        /> */}
                        {currentAppointment.is_referred_patient == true ? (
                          <div
                            style={{
                              border: "2px solid #199FD9",
                              borderRadius: 8,
                            }}
                          >
                            <img
                              src="./images/referredProfile.png"
                              alt="referred patient"
                            />
                          </div>
                        ) : (
                          <img
                            src={`${baseUrl}/${currentAppointment.patient_profile}`}
                            alt={currentAppointment.patient_name}
                            style={{ height: 180, resize: "contain" }}
                          />
                        )}
                      </div>
                      <div className="appoint-dtl-content">
                        <div className="appoint-dtl-left">
                          <div className="appoint-dtl-head">
                            <h2 className="h3-title">
                              {currentAppointment.patient_name}
                            </h2>
                            {/* {currentAppointment.is_referred_patient && (
                              <p>
                                Referred by DS: {currentAppointment.ds_code}
                              </p>
                            )} */}
                            {currentAppointment.is_referred_patient == true ? (
                              // <p style={{ color: "#199fd9" }}>
                              //   Referred by DS Code:{" "}
                              //   {currentAppointment.ds_code}
                              // </p>

                              <p>
                                <span style={{ color: "black" }}>
                                  Referred by DS Code:{" "}
                                </span>
                                <span style={{ color: "#199FD9" }}>
                                  {currentAppointment.ds_code}
                                </span>
                              </p>
                            ) : (
                              // <p style={{ color: "#199fd9" }}>
                              //   DS Code: {currentAppointment.ds_code}
                              // </p>
                              <p>
                                <span style={{ color: "black" }}>
                                  DS Code:{" "}
                                </span>
                                <span style={{ color: "#199FD9" }}>
                                  {currentAppointment.ds_code}
                                </span>
                              </p>
                            )}
                          </div>
                          <div className="appoint-btm">
                            <p>
                              <img src="/images/clock-icon.svg" alt="Icon" />
                              {currentAppointment.date}
                            </p>
                            <p className="appoint-time">
                              {currentAppointment.time}
                            </p>
                            {/* <p className="appoint-time">{convertTimeRangeTo24Hour(currentAppointment.time)}</p> */}

                            {/* <a
                              className="orange-btn"
                              onClick={() =>
                                handleCreateChannel(
                                  String(currentAppointment.appointment_id)
                                )
                              }
                              style={{ cursor: "pointer" }}
                            >
                              Start now
                            </a> */}
                            <a
                              className="orange-btn"
                              onClick={() =>
                                handleCreateChannel(
                                  String(currentAppointment.appointment_id)
                                )
                              }
                              style={{
                                cursor: isLoading ? "not-allowed" : "pointer",
                                pointerEvents: isLoading ? "none" : "auto",
                              }}
                            >
                              {isLoading ? "Loading..." : "Start now"}
                            </a>
                          </div>
                        </div>
                        <Link
                          to="/patient-profile"
                          state={{ patientId: currentAppointment.patient_id }}
                          className="cmn-btn"
                        >
                          View profile
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <div className="upcoming-apoints cmn-mb">
                  <div className="docpnl-sec-head">
                    <h1 className="h2-title">Upcoming Appointments</h1>
                    <button
                      className="cmn-btn"
                      onClick={() => navigate("/my-appointments")}
                    >
                      See all
                    </button>
                  </div>
                  {/* Upcoming Appointments */}
                  <div
                    className="appointments-row-wrp cmn-mb"
                    style={{ marginTop: -35 }}
                  >
                    <div className="appointments-row row">
                      {visibleAppointments.length == 0 && (
                        <h3
                          style={{
                            textAlign: "center",
                            padding: "25px 0",
                            fontWeight: "400",
                            color: "#199FD9",
                            fontSize: 18,
                          }}
                        >
                          No upcoming appointments.
                        </h3>
                      )}
                      {visibleAppointments.map((appointment, idx) => (
                        <div
                          className="appointment-card-wrp col-lg-2 col-md-4 col-sm-6"
                          key={idx}
                        >
                          <div className="appointment-card">
                            <div className="card-img">
                              {/* <img
                                src={
                                  `${baseUrl}/${appointment.patient_profile}` ||
                                  ""
                                }
                                alt={appointment.patient_name}
                              /> */}

                              {appointment.is_referred_patient == true ? (
                                <img
                                  src="./images/referredProfile.png"
                                  alt="referred patient"
                                />
                              ) : (
                                <img
                                  src={`${baseUrl}/${appointment.patient_profile}`}
                                  alt={appointment.patient_name}
                                />
                              )}
                            </div>
                            <div className="card-body">
                              <Link
                                to="/patient-details"
                                state={{
                                  id: appointment.appointment_id,
                                  patientId: appointment.patient_id,
                                  referrerDscode: appointment.ds_code,
                                  referrer: appointment.referred_patient_name,
                                }}
                                className="cmn-btn"
                              >
                                View full detail
                              </Link>
                              {/* {console.log(
                                "appointment_id for patient details",
                                appointment.appointment_id
                              )} */}
                              <div className="appointment-datetime">
                                <p className="date">{appointment.date}</p>
                                <p className="time">{appointment.time}</p>
                                {/* <p className="appoint-time">{convertTimeRangeTo24Hour(appointment.time)}</p> */}
                              </div>
                              {/* Add min-height to maintain consistent space */}
                              <div style={{ minHeight: "24px" }}>
                                {appointment.is_referred_patient ? (
                                  <p>
                                    <span style={{ color: "black" }}>
                                      Referred by DS Code:{" "}
                                    </span>
                                    <span style={{ color: "#199FD9" }}>
                                      {appointment.ds_code}
                                    </span>
                                  </p>
                                ) : (
                                  <p>
                                    <span style={{ color: "black" }}>
                                      DS Code:{" "}
                                    </span>
                                    <span style={{ color: "#199FD9" }}>
                                      {appointment.ds_code}
                                    </span>
                                  </p>
                                )}
                              </div>
                              <h3 style={{ fontSize: 22 }}>
                                {appointment.patient_name}
                              </h3>{" "}
                              <h3 style={{ fontSize: 22 }}>
                                Disease:
                                <span
                                  style={{ color: "#199FD9", fontSize: 16 }}
                                >
                                  {" "}
                                  {appointment.diseaseName}
                                </span>
                              </h3>
                              {isAppointmentOngoing(
                                appointment.date,
                                appointment.time
                              ) ? (
                                // <a
                                //   className="orange-btn w-100 d-block text-center"
                                //   style={{ cursor: "pointer" }}
                                //   onClick={() => handleCreateChannel(String(appointment.appointment_id))}
                                // >
                                //   Start now
                                // </a>
                                <input
                                  type="submit"
                                  value="Start now"
                                  className="w-100"
                                  onClick={() =>
                                    handleCreateChannel(
                                      String(appointment.appointment_id)
                                    )
                                  }
                                  style={{
                                    cursor: "pointer",
                                  }}
                                />
                              ) : (
                                <input
                                  type="submit"
                                  value="Cancel"
                                  className="w-100 up-btn"
                                  onClick={() =>
                                    handleCancelClick(
                                      appointment.appointment_id
                                    )
                                  }
                                  style={{
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                              {/* <input
                                type="submit"
                                value="Cancel"
                                className="w-100"
                                onClick={() =>
                                  handleCancelClick(appointment.appointment_id)
                                }
                                disabled={isCancelDisabled(
                                  appointment.date,
                                  appointment.time
                                )}
                                style={{
                                  opacity: isCancelDisabled(
                                    appointment.date,
                                    appointment.time
                                  )
                                    ? 0.5
                                    : 1,
                                  cursor: isCancelDisabled(
                                    appointment.date,
                                    appointment.time
                                  )
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                              /> */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="pending-prescriptions"
                    style={{ marginTop: -40 }}
                  >
                    <div className="docpnl-sec-head">
                      <h2>Pending Prescriptions</h2>
                      <button
                        className="cmn-btn"
                        onClick={() => navigate("/pendingprescription")}
                      >
                        See all
                      </button>
                    </div>
                    <div
                      className="pending-presc-table"
                      style={{ marginTop: -20 }}
                    >
                      <table>
                        <thead>
                          <tr>
                            <th>S.no.</th>
                            <th>Patient Name</th>
                            <th>Upload Date</th>
                            <th>View Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visiblePrescriptions.length == 0 && (
                            <tr>
                              <td
                                colSpan="8"
                                style={{
                                  textAlign: "center",
                                  fontWeight: "400",
                                  fontSize: 18,
                                }}
                              >
                                {loading ? "Loading..." : "No data found"}
                              </td>
                            </tr>
                          )}
                          {visiblePrescriptions.map((prescription, index) => (
                            <tr key={index}>
                              {/* <td>{index + 1}</td> */}
                              <td style={{ color: "#199FD9" }}>
                                {String(index + 1).padStart(2, "0")}
                              </td>

                              <td
                                style={{
                                  textAlign: "left",
                                  paddingLeft: "45px",
                                  width: "200px",
                                }}
                              >
                                <Link
                                  to="/patient-profile"
                                  state={{ patientId: prescription.patient_id }}
                                  className="no-underline-link"
                                  style={{
                                    display: "inline-block",
                                    fontSize: 21,
                                    marginLeft: -5,
                                  }}
                                >
                                  {prescription.patient_name}
                                </Link>
                                {/* {(prescription?.ds_code &&
                                  <div className="time" style={{ color: "#199FD9" }}>
                                    (DS Code: {prescription.ds_code})
                                  </div>
                                )} */}
                                {prescription?.is_referred_patient == true ? (
                                  <div
                                    className="time"
                                    style={{
                                      color: "#199fd9",
                                      marginTop: "2px",
                                      fontSize: 16,
                                      marginLeft: -5,
                                      fontWeight: "400",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "black",
                                        fontWeight: "400",
                                      }}
                                    >
                                      (Referred by DS Code:
                                    </span>
                                    {prescription.ds_code}
                                    <spna
                                      style={{
                                        color: "black",
                                        fontWeight: "400",
                                      }}
                                    >
                                      )
                                    </spna>
                                  </div>
                                ) : (
                                  <div
                                    className="time"
                                    style={{
                                      color: "#199fd9",
                                      marginTop: "2px",
                                      fontSize: 16,
                                      marginLeft: -5,
                                      fontWeight: "400",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "black",
                                        fontWeight: "400",
                                      }}
                                    >
                                      (DS Code:
                                    </span>
                                    {prescription.ds_code}

                                    <span
                                      style={{
                                        color: "black",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      )
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td>
                                <div
                                  className="date"
                                  style={{ fontSize: 21, color: "#199FD9" }}
                                >
                                  {/* {prescription.symptom_upload_date.split(" ")[0]} */}
                                  {/* {prescription.date} */}
                                  {formatDate(prescription.date)}
                                </div>
                                <div
                                  className="time"
                                  style={{ fontSize: 16, color: "#199fd9" }}
                                >
                                  {prescription.time}
                                </div>
                              </td>
                              <td>
                                <Link
                                  to="/patient-details"
                                  state={{
                                    id: prescription.appointment_id,
                                    patientId: prescription.patient_id,
                                    referrerDscode: prescription.ds_code,
                                    referrer:
                                      prescription.referred_patient_name,
                                  }}
                                  style={{ fontSize: 21, marginLeft: -50 }}
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              {/* <Footer /> */}
            </div>
          )}
          {!showAppointmentSection && showReminderModal && (
            <div
              className="modal fade show"
              tabIndex="-1"
              style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div
                  className="modal-content text-center position-relative shadow"
                  style={{
                    width: "400px",
                    minHeight: "280px",
                    borderRadius: "20px",
                    padding: "30px 20px",
                  }}
                >
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setShowReminderModal(false)}
                    className="position-absolute top-0 end-0 m-3 border-0 bg-transparent"
                    aria-label="Close"
                  >
                    <img
                      src="./images/cross-blue.png"
                      alt="Close Icon"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </button>

                  {/* Modal Icon */}
                  <div className="modal-icon mb-3">
                    <img
                      src="./images/bell-icon.svg"
                      alt="Reminder Icon"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>

                  {/* Header */}
                  <div className="modal-header border-0 flex-column align-items-center p-0">
                    <h2
                      className="fw-bold mb-2"
                      style={{ fontSize: "22px", color: "#333" }}
                    >
                      Reminder:
                    </h2>
                    <p
                      className="m-0"
                      style={{ color: "#009CDE", fontWeight: "500" }}
                    >
                      Your Appointment Starts in 2 Minutes!
                    </p>
                  </div>

                  {/* Body */}
                  <div className="modal-body p-0 mt-4">
                    <div className="text-muted mb-2">
                      Patient’s Name:{" "}
                      <span className="fw-medium" style={{ color: "#356598" }}>
                        John Smith
                      </span>
                    </div>
                    <div className="text-muted">
                      Date and Time:{" "}
                      <span className="fw-medium" style={{ color: "#356598" }}>
                        December 26, 2024, 3:00 PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Footer />
        </div>
        <CustomModal
          visible={showModal}
          title="Cancel Appointment"
          subtitle="Are you sure you want to cancel the appointment?"
          onConfirm={handleCancelConfirm}
          onCancel={() => setShowModal(false)}
          actionType="cancel"
        />

        {/* Reason Input Modal */}
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
          onConfirm={() => setShowSuccessModal(false)}
          onCancel={() => setShowSuccessModal(false)}
          actionType="success"
        />

        {/* feedback modal */}

        {showRatingModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content"
                style={{ padding: "20px", borderRadius: "10px" }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Rate Your Experience</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowRatingModal(false)}
                    style={{ color: "#199FD9", fontSize: 30 }}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body text-center">
                  <StarRating rating={rating} onRatingChange={setRating} />
                  <textarea
                    className="form-control mt-3"
                    placeholder="Share your feedback (optional)"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="modal-footer justify-content-center">
                  <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={() => setShowRatingModal(false)}
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ backgroundColor: "#199FD9" }}
                    onClick={handleRatingSubmit}
                  >
                    {feedbackLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default DoctorHome;
