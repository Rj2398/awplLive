import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Video from "../../Video";
import Header from "../doctorPanel/Header";
import {
  PiSpeakerSimpleHighFill,
  PiSpeakerSimpleSlashFill,
} from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  completePrescription,
  medicineSearch,
} from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { getPatientProfileData } from "../../redux/slices/patientProfileSlice";
import { videoCallSubmit } from "../../redux/slices/dataSlice";
import axios from "axios";
import baseUrl from "../../config/BaseUrl";
import { CiVolumeHigh } from "react-icons/ci";
import { setInvitedUserData } from "../../redux/slices/infoSlice";

const VideoCall = () => {
  const navigate = useNavigate();

  const doctorData = localStorage.getItem("doctor-app");

  console.log(doctorData, "doctorDatadoctorDatadoctorData");

  const [isVolumeBoosted, setIsVolumeBoosted] = useState(false);
  const [remoteAudioOn, setRemoteAudioOn] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  // const toggleVolumeBoost = () => {
  //   setIsVolumeBoosted((prev) => !prev);
  // };

  //

  const toggleRemoteAudio = () => {
    setRemoteAudioOn((prev) => !prev);
  };

  const [isPrescriptionDone, setIsPrescriptionDone] = useState(false);

  //

  //
  const videoStreamRef = useRef(null);
  const location = useLocation();
  const { id, patientId, time_period, ObjNavigate, userRole } =
    location.state || {};
  console.log(
    id,
    patientId,
    time_period,
    ObjNavigate,
    userRole,
    "user role of this ***"
  );
  const suggestionsRefs = useRef([]);
  const dispatch = useDispatch();

  const { patientProfileData } = useSelector((state) => state.patientProfile);

  const { invitedUser } = useSelector(({ info }) => info);

  console.log(invitedUser, "data comes from invited user");
  // const time_period11 = "12:45 - 01:00 PM";
  // console.log(time_period, "time period*****");

  useEffect(() => {
    if (!id || !patientId || !time_period) {
      navigate("/doctor-home");
    }
  }, [location]);
  // code testted

  // const time_period11 = "03:30 - 03:36 PM";
  const [displayTime, setDisplayTime] = useState(""); // State for displaying HH:MM:SS or MM:SS elapsed

  // console.log(time_period, id, patientId, "ksahfasdfjksdfsdfls");

  useEffect(() => {
    // Parse start and end times from the string
    const parts = time_period?.split(" - ");
    const startTimeStr = parts?.[0]; // e.g., "03:30"
    const endTimeStr = parts?.[1]; // e.g., "03:36 PM"

    // --- Prepare Start Time (for the continuous counter) ---

    if (!startTimeStr) return;
    const [startHoursStr, startMinutesStr] = startTimeStr?.split(":");
    let startHours = parseInt(startHoursStr, 10);
    const startMinutes = parseInt(startMinutesStr, 10);

    // Determine AM/PM for the start time.
    // Assuming if the end time is PM, the start time is also PM unless it crosses 12 AM.
    // This is a common pattern for time ranges. For robustness, you might need more complex parsing.
    const amPmForStartTime = endTimeStr.slice(-2); // Use AM/PM from end time for simplicity

    if (amPmForStartTime === "PM" && startHours !== 12) {
      startHours += 12;
    } else if (amPmForStartTime === "AM" && startHours === 12) {
      startHours = 0; // 12 AM (midnight)
    }

    // --- Prepare End Time (for the navigation trigger) ---
    const [endHoursStr, endMinutesStr] = endTimeStr.slice(0, -2).split(":");
    let endHours = parseInt(endHoursStr, 10);
    const endMinutes = parseInt(endMinutesStr, 10);
    const amPmForEndTime = endTimeStr.slice(-2);

    if (amPmForEndTime === "PM" && endHours !== 12) {
      endHours += 12;
    } else if (amPmForEndTime === "AM" && endHours === 12) {
      endHours = 0;
    }
    let hasAppointmentEndToastShown = false;
    const updateTime = () => {
      const now = new Date(); // Current date and time

      // 1. Create the `actualStartTime` Date object for the continuous counter
      // This is 03:30 PM today.
      const actualStartTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        startHours,
        startMinutes,
        0 // Seconds
      );

      // 2. Create the `parsedEndTime` Date object for the navigation calculation
      // This is 03:36 PM today.
      const parsedEndTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        endHours,
        endMinutes,
        0
      );

      // 3. Calculate the `navigationTargetTime`: 5 minutes after `parsedEndTime`
      const navigationTargetTime = new Date(
        parsedEndTime.getTime() + 5 * 60 * 1000
      );
      // const edtTimeTarge = new Date(parsedEndTime.getTime());
      const edtTimeTarge = parsedEndTime;

      // console.log(edtTimeTarge.getTime(), "test phone **********");
      //
      // if (now.getTime() == edtTimeTarge.getTime()) {
      //   toast.success("Appointment time finish , call will end in 5 minutes");
      // }
      if (
        !hasAppointmentEndToastShown &&
        now.getTime() >= edtTimeTarge.getTime()
      ) {
        toast.success(
          "Note: This call will automatically end in 5 minutes. Please wrap up your discussion accordingly!",
          {
            duration: 10000, // 10000 milliseconds = 10 seconds
          }
        );
        hasAppointmentEndToastShown = true; // Set the flag to true so it doesn't show again
      }

      // --- Navigation Check ---
      if (now.getTime() >= navigationTargetTime.getTime()) {
        // console.log(
        //   "Navigating to /pendingprescription as 5 minutes passed after",
        //   endTimeStr
        // );
        window.location.href = "/doctor-home";
        return; // Important: Stop further processing in this interval after navigation.
      }

      // --- Continuous Timer Display Logic (Always running from actualStartTime) ---
      let timeDifferenceInMilliseconds =
        now.getTime() - actualStartTime.getTime();

      // If the actual start time is in the future, show 00:00 initially or a countdown
      // For "always running" as in "always counting up since 03:30 PM, even if 03:30 PM hasn't come yet"
      // we might want to handle negative difference if `now` is before `actualStartTime`.
      // If you mean it only starts counting once 03:30 PM hits, then the logic needs adjustment.
      // Assuming "always running" means showing 00:00 until 03:30 PM, then counting up.
      if (timeDifferenceInMilliseconds < 0) {
        // If current time is before the actual start time
        // You could show a countdown to 03:30 PM, or just '00:00'
        setDisplayTime("00:00:00"); // Or adjust to show countdown if preferred
      } else {
        const totalSeconds = Math.floor(timeDifferenceInMilliseconds / 1000);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");

        // Display as HH:MM:SS (or just MM:SS if hours are 0)
        if (hours > 0) {
          setDisplayTime(
            `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
          );
        } else {
          setDisplayTime(`${formattedMinutes}:${formattedSeconds}`);
        }
      }
    };

    updateTime(); // Initial call
    const intervalId = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [time_period]);

  // code tested

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientProfileData({ patientId: patientId }));
    }
  }, [dispatch, patientId]);

  const patientInfo =
    patientProfileData?.basic_information ||
    invitedUser?.data?.basic_information ||
    {};

  const {
    completeAssignedPrescription,
    loading,
    loading2,
    error,
    medicineSearch: medicineSearchResults,
    user,
  } = useSelector((state) => state.user);
  // const [showModal, setShowModal] = useState(false);
  const [debouncedQueries, setDebouncedQueries] = useState([]);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [query, setQuery] = useState("");
  const [showSuggestionsPopup, setShowSuggestionsPopup] = useState(false);
  const handleNotesChange = (e) => setNotes(e.target.value);
  const handleDiagnosisChange = (e) => setDiagnosis(e.target.value);
  const [searchTimeouts, setSearchTimeouts] = useState({});
  const [activeMedicineIndex, setActiveMedicineIndex] = useState(null);
  const [medicineErrors, setMedicineErrors] = useState([]);
  const [medicines, setMedicines] = useState([
    {
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      suggestions: [],
      showSuggestion: false,
      isValid: false,
    },
  ]);

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addMoreMedicine = () => {
    setMedicines([
      ...medicines,
      {
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        suggestions: [],
        showSuggestion: false,
        isValid: false,
      },
    ]);
  };
  const [serverSuggestions, setServerSuggestions] = useState({});
  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    updated[index].isValid = false;

    if (field === "medicineName") {
      setActiveMedicineIndex(index);

      if (searchTimeouts[index]) {
        clearTimeout(searchTimeouts[index]);
      }

      // Only search if input is not empty
      if (value.trim().length > 0) {
        const timeout = setTimeout(() => {
          dispatch(medicineSearch({ query: value }));
        }, 500);

        setSearchTimeouts((prev) => ({ ...prev, [index]: timeout }));
      } else {
        updated[index].suggestions = [];
      }

      const errors = [...medicineErrors];
      errors[index] = "";
      setMedicineErrors(errors);
    }

    setMedicines(updated);
  };

  useEffect(() => {
    if (medicineSearchResults && activeMedicineIndex !== null) {
      const updated = [...medicines];
      updated[activeMedicineIndex].suggestions = medicineSearchResults;
      setMedicines(updated);
      setServerSuggestions((prev) => ({
        ...prev,
        [activeMedicineIndex]: medicineSearchResults,
      }));
    }
  }, [medicineSearchResults]);

  const handleSuggestionSelect = (index, name) => {
    const updated = [...medicines];
    updated[index].medicineName = name;
    updated[index].suggestions = [];
    updated[index].isValid = true;

    setMedicines(updated);

    setMedicineErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = "";
      return newErrors;
    });
    setServerSuggestions((prev) => ({
      ...prev,
      [index]: prev[index] ? prev[index] : [],
    }));

    setActiveMedicineIndex(null);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      setShowSuggestionsPopup(false);
      const updated = [...medicines];
      let changed = false;

      medicines.forEach((med, i) => {
        const ref = suggestionsRefs.current[i];
        if (ref && !ref.contains(event.target) && med.suggestions.length > 0) {
          updated[i].suggestions = [];
          changed = true;
        }
      });

      if (changed) {
        setMedicines(updated);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [medicines]);

  /// validation for medicine name
  const isValidatemedicine = (medicineName, index) => {
    const suggestionsForIndex = serverSuggestions[index] || [];
    return suggestionsForIndex.some((sug) => sug.product_name === medicineName);
  };
  const handleSubmit = async () => {
    // Validate required fields
    if (
      !diagnosis ||
      medicines.some(
        (med) =>
          !med.medicineName || !med.dosage || !med.frequency || !med.duration
      )
    ) {
      toast.error("All fields are required (marked with *)");
      return;
    }

    // loop for medicine validation
    const errors = [...medicineErrors];
    let hasErrors = false;

    medicines.forEach((med, i) => {
      if (!med.isValid) {
        const suggestionsForIndex = serverSuggestions[i] || [];
        const isValid = suggestionsForIndex.some(
          (sug) => sug.product_name === med.medicineName
        );

        if (!isValid) {
          errors[i] = "Please select a valid medicine name from suggestions";
          hasErrors = true;
        } else {
          errors[i] = "";
          // Update the isValid flag if it was valid but the flag wasn't set
          const updated = [...medicines];
          updated[i].isValid = true;
          setMedicines(updated);
        }
      } else {
        errors[i] = "";
      }
    });

    setMedicineErrors(errors);

    if (hasErrors) {
      return;
    }

    // if (errors.some(err => err)) {
    //   return;
    // }

    const formData = {
      // symptom_id: id,
      appointment_id: id,
      diagnosis,
      notes,
      medicines: medicines.map((med) => ({
        name: med.medicineName,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
      })),
    };
    // console.log(formData, "ffff123412341234123412341");

    const res = dispatch(videoCallSubmit(formData));
    // if (res.payload && res.payload.status) {
    //   // setShowModal(true);
    //   navigate("/doctor-home")

    // }
  };

  const handleToggleMute = () => setIsMuted((prev) => !prev);

  const handleToggleCamera = () => {
    setIsCameraOn((prev) => {
      const newState = !prev;
      return newState;
    });
  };

  // const handleEndCall = () => navigate("/doctor-home");

  const handleEndCall = (id) => {
    if (userRole === "admin") {
      //
      navigate("/login");

      localStorage.removeItem("anyoneJoin");

      dispatch(setInvitedUserData(null));
    } else {
      navigate("/doctor-home", {
        state: {
          appointmentIdd: id,
          modaleOpen: true,
        },
      });
    }
  };

  // const formatTime = (totalSeconds) => {
  //   const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  //   const secs = String(totalSeconds % 60).padStart(2, '0');
  //   return `${minutes}:${secs}`;
  // };

  // const formatTime = (totalSeconds) => {
  //   const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  //   const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
  //     2,
  //     "0"
  //   );
  //   const secs = String(totalSeconds % 60).padStart(2, "0");
  //   return `${hours}:${minutes}:${secs}`;
  // };

  const checkPrescriptionStatus = useCallback(async () => {
    // If we're already checking, or if 'id' isn't available, don't proceed
    if (!id) {
      return;
    }

    const doctorAppData = JSON.parse(localStorage.getItem("doctor-app"));
    const authToken = doctorAppData?.token;

    const payload = {
      appointment_id: id, // Use the appointment ID
    };

    try {
      const response = await axios.get(
        // "https://awplconnectadmin.tgastaging.com/api/doctor/prescriptions/is-completed",
        `${baseUrl}api/doctor/prescriptions/is-completed`,
        {
          params: payload,
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.data) {
        setIsPrescriptionDone(response.data.data.is_done);
        // console.log(response.data.data.is_done, "check is don or noe");
      } else {
        setIsPrescriptionDone(false);
        console.warn("API response.data.data is missing or unexpected.");
      }
    } catch (err) {
      console.error("Error checking prescription status on focus:", err);

      setIsPrescriptionDone(false);
    }
  }, [id]); // Dependency array: recreate if 'id' changes

  // Effect to call API on initial mount and when 'id' changes
  useEffect(() => {
    checkPrescriptionStatus();
  }, [checkPrescriptionStatus]); // Dependency on the memoized function

  // Effect for window focus event
  useEffect(() => {
    const handleFocus = () => {
      // console.log("Window gained focus, re-checking prescription status...");
      checkPrescriptionStatus(); // Re-fetch data when window gets focus
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkPrescriptionStatus]);
  //

  const buttonStyle = {
    opacity: isPrescriptionDone ? 0.5 : 1, // Reduce opacity if done
    cursor: isPrescriptionDone ? "not-allowed" : "pointer", // Change cursor
  };

  return (
    <main className="doctor-panel video-call-pg">
      <div className="container-fluid">
        <div className="doc-panel-inr">
          <Header />
        </div>

        {/* Video Call Screen */}
        <div className="video-call-screen">
          <div className="vdo-call-scrn-row row">
            {/* Left side - Video */}
            <div className="vdo-call-scrn-left-wrp col-lg-6">
              <div className="vdoclscrn-left">
                <div className="vdo-screen">
                  <div className="vdo-screen-controls">
                    <div className="vdoscrn-controls-head">
                      <h1>{patientInfo?.name}</h1>
                      <div className="vdoscrn-status-time-wrp">
                        <span className="vdoscrn-status live">LIVE</span>
                        <span className="vdoscrnduration-time">
                          {displayTime}
                        </span>
                      </div>
                    </div>
                    <div className="vdoscrn-controls-body">
                      <div className="vdoscrn-volume-con">
                        <img src="./images/speaker-icon.svg" alt="Icon" />
                        <input type="range" />
                      </div>
                    </div>
                    <div
                      className="vdoscrn-controls-ftr"
                      style={{ marginLeft: 100 }}
                    >
                      <div className="vdoscrn-action-controls">
                        <button
                          className="vdo-toggle-btn"
                          onClick={handleToggleCamera}
                          style={{ marginTop: -30 }}
                        >
                          <img
                            src={
                              isCameraOn
                                ? "./images/video-cam-icon.svg"
                                : "./images/video-camera-off-icon.svg"
                            }
                            alt="Camera Icon"
                            style={{
                              filter: !isCameraOn ? "invert(100%)" : "none",
                            }}
                          />
                        </button>

                        <button
                          className="vdo-call-end-btn"
                          onClick={() => handleEndCall(id)}
                          style={{
                            borderRadius: "50%",
                            padding: "10px",
                            marginTop: -30,
                          }}
                        >
                          <img
                            src="./images/call-icon.svg"
                            alt="Call End Icon"
                          />
                        </button>

                        {/* <button className="vdo-mute-toggle-btn">
                            <img src="./images/mic-icon.svg" alt="Icon" />
                          </button> */}
                        <button
                          className="vdo-mute-toggle-btn"
                          onClick={handleToggleMute}
                          style={{ marginTop: -30 }}
                        >
                          <img
                            src={
                              isMuted
                                ? "./images/mic-off.svg"
                                : "./images/mic-icon.svg"
                            }
                            alt="Mic Icon"
                            style={{
                              filter: isMuted ? "invert(100%)" : "none", // Apply invert to make the mic-off icon white
                            }}
                          />
                        </button>
                      </div>

                      <div className="doc-vdo-scrn">
                        {/* <img
                            src="./images/doc-vdo-thumb.png"
                            alt="Doctor Video Thumbnail"
                          /> */}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggleRemoteAudio}
                    style={{
                      position: "absolute",
                      bottom: "40px",
                      left: "20px",
                      right: "20px",
                      zIndex: 9999999999999, // High z-index to sit on top of everything
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: remoteAudioOn
                        ? "0 0 10px #28a745"
                        : "0 2px 5px rgba(0,0,0,0.5)",
                      backgroundColor: remoteAudioOn
                        ? "#28a745"
                        : "rgba(255,255,255,0.2)",
                      transition: "all 0.3s ease",
                    }}
                    title={
                      remoteAudioOn ? "Turn off Volume Boost" : "Boost Volume"
                    }
                  >
                    <CiVolumeHigh size={24} />
                  </button>
                  {/* 
                  <button
                    onClick={toggleRemoteAudio}
                    style={{
                      position: "absolute",
                      bottom: "40px",
                      left: "20px",
                      width: "48px",
                      height: "48px",
                      backgroundColor: remoteAudioOn ? "#fff" : "#f00", // Red when muted
                      color: remoteAudioOn ? "#000" : "#fff",
                      borderRadius: "50%",
                      cursor: "pointer",
                      zIndex: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                    }}
                    title={
                      remoteAudioOn
                        ? "Mute Remote Audio"
                        : "Unmute Remote Audio"
                    }
                  >
                    {remoteAudioOn ? (
                      <PiSpeakerSimpleHighFill size={24} />
                    ) : (
                      <PiSpeakerSimpleSlashFill size={24} />
                    )}
                  </button> */}

                  <div className="patient-vdo-screen">
                    {/* <img src="./images/patient-video-thumb.png" alt="Patient Video Thumbnail" /> */}
                    <Video
                      isCameraOn={isCameraOn}
                      isMuted={isMuted}
                      patientInfo={
                        patientInfo.name || invitedUser?.basic_information?.name
                      }
                      videoStreamRef={videoStreamRef}
                      remoteAudioOn={remoteAudioOn}
                      ObjNavigate={ObjNavigate}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Patient Details */}

            <div className=" col-lg-6">
              {loading ? (
                <div className="loader-main">
                  <span className="loader"></span>
                </div>
              ) : (
                <form>
                  <div className="vdoclscrn-patient-details-wrp-inr">
                    <div className="vdoclscrn-patient-details">
                      <div className="vdoclscrnpd-wrp">
                        <h2>Patient Details:</h2>
                        <div className="vdoclscrnpd">
                          {[
                            {
                              label: "Patient Name",
                              value: patientInfo.name || "N/A",
                            },
                            { label: "Age", value: patientInfo.age || "N/A" },
                            {
                              label: "Gender",
                              value: patientInfo.gender
                                ? patientInfo.gender.charAt(0).toUpperCase() +
                                  patientInfo.gender.slice(1)
                                : "N/A",
                            },
                            {
                              label: "Height",
                              value: patientInfo.height || "N/A",
                            },
                            {
                              label: "Weight",
                              value: patientInfo.weight || "N/A",
                            },
                            {
                              label: "Contact No.",
                              value: patientInfo.phone_no || "N/A",
                            },
                          ].map((item, index) => (
                            <div className="vdoclscrnpd-grp" key={index}>
                              <span className="vdoclscrnpd-label">
                                {item.label}
                              </span>
                              <span className="vdoclscrnpd-val">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 text-right">
                        <a
                          href={`/PrescriptiveDoctor?id=${id}&patientId=${patientId}`} // Construct the URL with query parameters
                          target="_blank" // Opens the link in a new tab
                          rel="noopener noreferrer" // Recommended for security when using target="_blank"
                          onClick={(e) => {
                            if (isPrescriptionDone) {
                              e.preventDefault(); // Prevent navigation if done
                            }
                          }}
                        >
                          {userRole === "admin" ? null : (
                            <button
                              type="button"
                              className="orange-btn"
                              style={buttonStyle}
                              disabled={isPrescriptionDone}
                            >
                              Go for Prescription
                            </button>
                          )}
                        </a>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoCall;
