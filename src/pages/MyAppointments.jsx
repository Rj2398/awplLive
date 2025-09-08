import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";
import CustomModal from "../component/CustomModal";
import MyAppointmentsSearch from "../component/MyAppointmentsSearch ";
import patientData from "../assets/patient.json";
import Pagination from "../component/Pagination";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  doctorCanceledAppointment,
  getAllCanceledAppointment,
  getAllCompletedAppointment,
  getAllIncompletedAppointment,
  getAllMissedAppointment,
  getAllUpcomingAppointment,
  getJoinVideoCall,
  sendPushNotification,
} from "../redux/slices/myAppointmentSlice";
import axios from "axios";
import { setVideoData } from "../redux/slices/infoSlice";
import baseUrl from "../config/BaseUrl";

const MyAppointments = () => {
  const navigate = useNavigate();
  const { channelDetails } = useSelector((state) => state.appointments);
  // console.log(channelDetails, "jfaklshfsahdfks");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    upcommingAppointment,
    completedAppointment,
    cancelledAppointment,
    incompletedAppointment,
    doctorcancelledAppointment,
    missedAppointment,
    upcomingLoading,
    completedLoading,
    cancelledLoading,
    incompletedLoading,
    doctorcancelledLoading,
    missedLoading,
  } = useSelector((state) => state.appointments);
  // const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const [activeTab, setActiveTab] = useState("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const patientsPerPage = 8;

  const [filters, setFilters] = useState({
    patientName: "",
    age: "",
    dsCode: "",
    disease: "",
  });

  const [filteredUpcomingPatients, setFilteredUpcomingPatients] = useState([]);
  const [filteredCompletedPatients, setFilteredCompletedPatients] = useState(
    []
  );
  const [filteredCancelledPatients, setFilteredCancelledPatients] = useState(
    []
  );
  const [filteredIncompletedPatients, setFilteredIncompletedPatients] =
    useState([]);

  const [filteredMissedPatients, setFilteredMissedPatients] = useState([]);

  useEffect(() => {
    dispatch(getAllUpcomingAppointment());
    dispatch(getAllCompletedAppointment());
    dispatch(getAllCanceledAppointment());
    dispatch(getAllIncompletedAppointment());
    dispatch(getAllMissedAppointment());
  }, [dispatch]);

  useEffect(() => {
    // Reset to first page when tab changes
    setCurrentPage(1);
    setFilters({
      patientName: "",
      age: "",
      dsCode: "",
      disease: "",
    });
    // Reset filtered patients to original data
    setFilteredUpcomingPatients(upcommingAppointment);
    setFilteredCompletedPatients(completedAppointment);
    setFilteredCancelledPatients(cancelledAppointment);
    setFilteredIncompletedPatients(incompletedAppointment);
    setFilteredMissedPatients(missedAppointment);
  }, [
    activeTab,
    upcommingAppointment,
    completedAppointment,
    cancelledAppointment,
    incompletedAppointment,
    missedAppointment,
  ]);

  // console.log("$$$$$$$$$$$$", upcommingAppointment);

  useEffect(() => {
    setFilteredCompletedPatients(
      applyFilters(completedAppointment, "completed")
    );
  }, [filters]);

  // Update the applyFilters function to properly filter completed patients
  const applyFilters = (patients, tab) => {
    return patients.filter((patient) => {
      const nameMatch =
        !filters.patientName ||
        patient.patient_name
          ?.toLowerCase()
          .includes(filters.patientName.toLowerCase());

      const ageMatch =
        !filters.age || patient.patient_age.toString().includes(filters.age);

      // const dscodeMatch = !filters.dscode || (patient.ds_code && patient.ds_code.toLowerCase().includes(filters.dscode.toLowerCase()));

      const dscodeMatch =
        !filters.dscode ||
        (patient.ds_code &&
          patient.ds_code.toLowerCase().includes(filters.dscode.toLowerCase()));

      // For cancelled tab, skip disease matching since those patients might not have disease field
      // if (tab === "cancelled") {
      //   return nameMatch && ageMatch && dscodeMatch;
      // }
      if (tab === "cancelled" || tab === "incompleted" || tab === "missed") {
        return nameMatch && ageMatch && dscodeMatch;
      }

      const diagnosisMatch =
        !filters.disease ||
        (patient.diagnosis &&
          patient.diagnosis !== "-" &&
          patient.diagnosis.toLowerCase() === filters.disease.toLowerCase());

      return nameMatch && ageMatch && dscodeMatch && diagnosisMatch;
    });
  };

  // Function to update filters from child component
  // const handleFilterChange = (newFilters) => {
  //     setFilters({
  //         patientName: newFilters.name || '',
  //         age: newFilters.age || '',
  //         disease: newFilters.diagnosis || ''
  //     });

  //     if (activeTab === 'completed') {
  //         const filtered = applyFilters(completedAppointment, 'completed');
  //         setFilteredCompletedPatients(filtered);
  //         setCurrentPage(1);
  //     }
  // };
  //for StartAppointment

  //   const [showAppointmentSection, setShowAppointmentSection] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  useEffect(() => {
    if (filteredUpcomingPatients) {
      const activeAppointment = filteredUpcomingPatients.find(
        (appointment) => appointment.status === 1
      );

      if (activeAppointment) {
        // console.log("Found active appointment:", activeAppointment);
        setCurrentAppointment(activeAppointment); // Set the actual appointment object
        // setShowAppointmentSection(true);
      } else {
        setCurrentAppointment(null);
        // setShowAppointmentSection(false);
      }
    }
  }, [filteredUpcomingPatients]);

  const handleFilterChange = (newFilters) => {
    setFilters({
      patientName: newFilters.patientName || "",
      age: newFilters.age || "",
      dscode: newFilters.dscode || "",
      disease: newFilters.disease || "",
    });

    // Apply filters to the current active tab
    switch (activeTab) {
      case "upcoming":
        setFilteredUpcomingPatients(
          applyFilters(upcommingAppointment, "upcoming")
        );
        break;
      case "completed":
        setFilteredCompletedPatients(
          applyFilters(completedAppointment, "completed")
        );
        break;
      case "cancelled":
        setFilteredCancelledPatients(
          applyFilters(cancelledAppointment, "cancelled")
        );
        break;
      case "incompleted":
        setFilteredIncompletedPatients(
          applyFilters(incompletedAppointment, "incompleted")
        );
        break;
      case "missed":
        setFilteredMissedPatients(applyFilters(missedAppointment, "missed"));
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  const appData = JSON.parse(localStorage.getItem("doctor-app") || "{}");
  const DoctorLoginId = appData.doctorData;

  // console.log(DoctorLoginId?.id, "Doctor Data");

  // handle create channel to join call

  // const handleCreateChannel = async (id) => {
  //   console.log(id, `JoinCall + ${DoctorLoginId?.id}`, "params of the data");
  //   dispatch(
  //     getJoinVideoCall({

  //       appointmentId: id,
  //     })
  //   );

  //   dispatch(
  //     sendPushNotification({
  //       // channelName: `JoinCall + ${DoctorLoginId?.id}`,
  //       appointment_id: id,
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
  //   }
  // };

  const handleCreateChannel = async (id) => {
    // console.log("call 11");
    setIsLoading(true); // Start loader
    try {
      const token = JSON.parse(localStorage.getItem("doctor-app"))?.token;

      const response = await axios.post(
        // "https://awplconnectadmin.tgastaging.com/api/create-channel",
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

  const sendNotitficaion = async (id) => {
    console.log("call 222");
    await dispatch(
      sendPushNotification({
        // channelName: `JoinCall + ${DoctorLoginId?.id}`,
        appointmentId: id,
      })
    );
  };

  const handleSearch = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    const isNumeric = /^\d+$/.test(query);

    // Common search logic for all appointment types
    const searchPatients = (patients) => {
      return patients.filter((patient) => {
        const patientAge = patient.patient_age?.toString() || "";
        const patientPhone = patient.patient_phone?.toString() || "";
        const dateStr = patient.datetime
          ? new Date(patient.datetime).getDate().toString()
          : "";

        const dsCode = patient.ds_code?.toLowerCase() || "";
        if (isNumeric) {
          return (
            patientAge === query ||
            patientPhone.includes(query) ||
            dsCode.includes(lowerQuery)
          );
        }
        return (
          patient.patient_name?.toLowerCase().includes(lowerQuery) ||
          patient.patient_gender?.toLowerCase() === lowerQuery ||
          patientPhone.includes(query) ||
          dateStr.includes(lowerQuery) ||
          dsCode.includes(lowerQuery) ||
          patient.datetime?.toLowerCase().includes(lowerQuery) ||
          (activeTab === "completed" &&
            patient.diagnosis?.toLowerCase().includes(lowerQuery))
        );
      });
    };

    // Apply search to the appropriate tab
    switch (activeTab) {
      case "upcoming":
        setFilteredUpcomingPatients(searchPatients(upcommingAppointment));
        break;
      case "completed":
        setFilteredCompletedPatients(searchPatients(completedAppointment));
        break;
      case "cancelled":
        setFilteredCancelledPatients(searchPatients(cancelledAppointment));
        break;
      case "incompleted":
        setFilteredIncompletedPatients(searchPatients(incompletedAppointment));
        break;
      case "missed":
        setFilteredMissedPatients(searchPatients(missedAppointment));
        break;
      default:
        break;
    }

    // Reset to first page when searching
    setCurrentPage(1);
  };
  // Updated parser to handle full date-time string
  const parseDDMMYYYYTime = (dateTimeStr) => {
    const [datePart, timePart, meridian] = dateTimeStr.split(" "); // Split into ["13/05/2025", "05:25", "PM"]
    const [day, month, year] = datePart.split("/").map(Number);
    let [hour, minute] = timePart.split(":").map(Number); // Now split "05:25" into [5, 25]

    // Convert 12-hour format to 24-hour format
    if (meridian === "PM" && hour !== 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;

    const finalResult = new Date(year, month - 1, day, hour, minute);
    return finalResult;
  };

  // const handleSearchDate = (dateRange) => {
  //     if (dateRange == null) {
  //         setFilteredCompletedPatients(completedAppointment);
  //         return;
  //     }

  //     if (!dateRange || dateRange.length !== 2) return;

  //     const [startDate, endDate] = dateRange;

  //     const filtered = completedAppointment.filter((patient) => {
  //         const appointmentDate = parseDDMMYYYYTime(patient.datetime);
  //         return appointmentDate >= startDate && appointmentDate <= endDate;
  //     });

  //     setFilteredCompletedPatients(filtered);
  // };

  const handleSearchDate = (dateRange) => {
    if (dateRange == null) {
      // Reset to original data for the current tab
      switch (activeTab) {
        case "completed":
          setFilteredCompletedPatients(completedAppointment);
          break;
        case "cancelled":
          setFilteredCancelledPatients(cancelledAppointment);
          break;
        case "incompleted":
          setFilteredCancelledPatients(cancelledAppointment);
          break;
        case "missed":
          setFilteredCancelledPatients(cancelledAppointment);
          break;
        default:
          break;
      }
      return;
    }

    if (!dateRange || dateRange.length !== 2) return;

    const [startDate, endDate] = dateRange;

    // Apply date filter to the appropriate tab
    switch (activeTab) {
      case "completed":
        const filteredCompleted = completedAppointment.filter((patient) => {
          const appointmentDate = parseDDMMYYYYTime(patient.datetime);
          return appointmentDate >= startDate && appointmentDate <= endDate;
        });
        setFilteredCompletedPatients(filteredCompleted);
        break;

      case "cancelled":
        const filteredCancelled = cancelledAppointment.filter((patient) => {
          const appointmentDate = parseDDMMYYYYTime(patient.datetime);
          return appointmentDate >= startDate && appointmentDate <= endDate;
        });
        setFilteredCancelledPatients(filteredCancelled);
        break;

      case "incompleted":
        const filteredIncompleted = incompletedAppointment.filter((patient) => {
          const appointmentDate = parseDDMMYYYYTime(patient.datetime);
          return appointmentDate >= startDate && appointmentDate <= endDate;
        });
        setFilteredIncompletedPatients(filteredIncompleted);
        break;

      case "missed":
        const filteredMissed = missedAppointment.filter((patient) => {
          const appointmentDate = parseDDMMYYYYTime(patient.datetime);
          return appointmentDate >= startDate && appointmentDate <= endDate;
        });
        setFilteredMissedPatients(filteredMissed);
        break;

      default:
        break;
    }
  };

  const handleCancelClick = (id) => {
    // console.log({"appointment_id":id, "cancel_message":cancelReason});
    // dispatch(doctorCanceledAppointment({"appointment_id":id, "cancel_message":cancelReason}))
    setSelectedAppointmentId(id);
    setShowModal(true);
  };

  const handleCancelConfirm = () => {
    setShowModal(false);
    setShowCancelReasonModal(true);
  };

  const handleCancelReasonSubmit = () => {
    // API call
    // console.log("Cancelled appointment ID:", selectedAppointmentId);
    // console.log("Reason:", cancelReason);
    dispatch(
      doctorCanceledAppointment({
        appointment_id: selectedAppointmentId,
        cancel_message: cancelReason,
      })
    ).then(() => {
      // Refresh the upcoming appointments list after successful cancellation
      dispatch(getAllUpcomingAppointment());
      setShowCancelReasonModal(false);
      setCancelReason("");
      setSelectedAppointmentId(null);
      setShowSuccessModal(true);
    });
  };

  // Calculate pagination for each tab
  const getPaginatedPatients = (patients) => {
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    return patients?.slice(indexOfFirstPatient, indexOfLastPatient);
  };

  // Calculate total pages
  const getTotalPages = (patients) => {
    return Math.ceil(patients?.length / patientsPerPage);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle next/previous
  const handleNext = () => {
    const totalPages = getTotalPages(
      activeTab === "upcoming"
        ? filteredUpcomingPatients
        : activeTab === "completed"
        ? filteredCompletedPatients
        : activeTab === "cancelled"
        ? filteredCancelledPatients
        : activeTab === "incompleted"
        ? filteredIncompletedPatients
        : filteredMissedPatients
    );
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // In your render method, before the return statement:
  const currentPatients =
    activeTab === "upcoming"
      ? filteredUpcomingPatients
      : activeTab === "completed"
      ? filteredCompletedPatients
      : activeTab === "cancelled"
      ? filteredCancelledPatients
      : activeTab === "incompleted"
      ? filteredIncompletedPatients
      : filteredMissedPatients;

  const totalPages = getTotalPages(currentPatients);
  const pageNumbers = [];

  // Create page number array with ellipsis logic
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pageNumbers.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
  }
  // const isWithinTwoHours = (dateTimeStr) => {
  //     const appointmentDate = parseDDMMYYYYTime(dateTimeStr);
  //     const now = new Date();
  //     const twoHoursFromNow = new Date(now.getTime() + 1 * 60 * 60 * 1000);
  //     console.log(appointmentDate);
  //     return appointmentDate <= twoHoursFromNow;
  // };

  const isPastAppointment = (dateTimeStr) => {
    const appointmentDate = parseDDMMYYYYTime(dateTimeStr);
    const now = new Date();
    return appointmentDate < now;
  };

  return (
    <div className="doctor-panel">
      <div className="container-fluid">
        <div className="doc-panel-inr">
          {" "}
          <Header />{" "}
        </div>
        {upcomingLoading ||
        completedLoading ||
        cancelledLoading ||
        incompletedLoading ? (
          <div className="loader-main">
            <span className="loader"></span>
          </div>
        ) : (
          <div className="doc-panel-body">
            <div className="docpnl-sec-head">
              <h1 className="h2-title">My Appointments</h1>
            </div>
            <div className="my-appointments-wrp">
              <div className="my-appointments-inr">
                {/* Tabs */}
                <div className="my-appointments-tab-header">
                  <div className="my-appointments-tab-head">
                    <ul style={{ position: "relative" }}>
                      <li className="tab-bg"></li>
                      <li
                        style={
                          activeTab == "upcoming"
                            ? {
                                backgroundColor: "white",
                                borderRadius: "10px",
                                color: "#356598",
                              }
                            : {}
                        }
                        onClick={() => setActiveTab("upcoming")}
                      >
                        {" "}
                        Upcoming{" "}
                      </li>
                      <li
                        style={
                          activeTab == "completed"
                            ? {
                                backgroundColor: "white",
                                borderRadius: "10px",
                                color: "#356598",
                              }
                            : {}
                        }
                        onClick={() => setActiveTab("completed")}
                      >
                        {" "}
                        Completed{" "}
                      </li>
                      <li
                        style={
                          activeTab == "cancelled"
                            ? {
                                backgroundColor: "white",
                                borderRadius: "10px",
                                color: "#356598",
                              }
                            : {}
                        }
                        onClick={() => setActiveTab("cancelled")}
                      >
                        {" "}
                        Cancelled{" "}
                      </li>

                      <li
                        style={
                          activeTab == "incompleted"
                            ? {
                                backgroundColor: "white",
                                borderRadius: "10px",
                                color: "#356598",
                              }
                            : {}
                        }
                        onClick={() => setActiveTab("incompleted")}
                      >
                        {" "}
                        Incompleted{" "}
                      </li>

                      <li
                        style={
                          activeTab == "missed"
                            ? {
                                backgroundColor: "white",
                                borderRadius: "10px",
                                color: "#356598",
                              }
                            : {}
                        }
                        onClick={() => setActiveTab("missed")}
                      >
                        {" "}
                        Missed{" "}
                      </li>
                    </ul>
                  </div>

                  <MyAppointmentsSearch
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    onSearchDate={handleSearchDate}
                    activeTab={activeTab}
                  />
                </div>

                {/* Tab Content */}
                <div className="my-appointments-tab-content-wrp">
                  {/* Upcoming */}
                  <div
                    className={`myapintmnt-content-tab ${
                      activeTab === "upcoming" ? "upcoming" : ""
                    }`}
                    style={{
                      display: activeTab === "upcoming" ? "block" : "none",
                    }}
                  >
                    <div className="myapintmnt-table">
                      <table>
                        <thead>
                          <tr>
                            <th>S.no.</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Phone number</th>
                            <th>Appointment date</th>
                            <th>Disease</th>

                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {console.log(
                            "filteredUpcomingPatients1234: ",
                            filteredUpcomingPatients
                          )}
                          {getPaginatedPatients(filteredUpcomingPatients)
                            ?.length == 0 && (
                            <tr>
                              <td
                                colSpan="8"
                                style={{
                                  textAlign: "center",
                                  padding: "25px 0",
                                  fontSize: 18,
                                  fontWeight: "400",
                                  color: "#199FD9",
                                }}
                              >
                                No data found
                              </td>
                            </tr>
                          )}
                          {getPaginatedPatients(filteredUpcomingPatients)?.map(
                            (patient, index) => (
                              <tr key={`upcoming-${index}`}>
                                {/* <td>{(currentPage - 1) * patientsPerPage + index + 1}</td> */}
                                <td style={{ color: "#199FD9" }}>
                                  {String(
                                    (currentPage - 1) * patientsPerPage +
                                      index +
                                      1
                                  ).padStart(2, "0")}
                                </td>
                                {/* <td>
                                                                <img src={baseUrl + "/" + patient?.patient_profile} alt="Patient" />
                                                                <Link to="/patient-profile" state={{ patientId: patient.patient_id }}><h3>{patient.patient_name || "-"}</h3></Link> 
                                                                
                                                                <div className="time" style={{ color: "#199fd9" }}>
                                                                     (DS Code: {patient.ds_code})
                                                                </div>
                                                                

                                                            </td> */}

                                <td
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <img
                                    src={
                                      baseUrl + "/" + patient?.patient_profile
                                    }
                                    alt="Patient"
                                  />

                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Link
                                      to="/patient-profile"
                                      state={{ patientId: patient.patient_id }}
                                    >
                                      <h3
                                        style={{
                                          margin: 0,
                                          textAlign: "left",
                                          color: "#199FD9",
                                        }}
                                      >
                                        {patient.patient_name || "-"}
                                      </h3>
                                    </Link>
                                    {/* {(patient?.ds_code &&
                                                                        <div style={{ color: "#199fd9", marginTop: "2px" }}>
                                                                            (DS Code: {patient.ds_code})
                                                                        </div>
                                                                    )} */}
                                    {patient?.referred == true ? (
                                      <div
                                        style={{
                                          // This div's color will be inherited by parts not explicitly styled
                                          color: "#199fd9",
                                          marginTop: "2px",
                                        }}
                                      >
                                        <span style={{ color: "black" }}>
                                          {" "}
                                          (Referred by DS Code:{" "}
                                        </span>
                                        {patient.ds_code}
                                        <span style={{ color: "black" }}>
                                          )
                                        </span>
                                      </div>
                                    ) : (
                                      <div
                                        style={{
                                          // This div's color will be inherited by parts not explicitly styled
                                          color: "#199fd9",
                                          marginTop: "2px",
                                        }}
                                      >
                                        <span style={{ color: "black" }}>
                                          {" "}
                                          (DS Code:{" "}
                                        </span>
                                        {patient.ds_code}
                                        <span style={{ color: "black" }}>
                                          )
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>

                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_age || "-"}
                                </td>
                                {/* <td>{patient.patient_gender || "-"}</td> */}
                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_gender
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    patient.patient_gender
                                      ?.slice(1)
                                      .toLowerCase()}
                                </td>
                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_phone || "-"}
                                </td>
                                <td style={{ color: "#199FD9" }}>
                                  {/* <div className="date h3-title">{patient.datetime}</div> */}
                                  <div
                                    className="date h3-title"
                                    style={{ color: "#199FD9" }}
                                  >
                                    {patient.datetime.split(" ")[0]}
                                  </div>
                                  <div
                                    className="time"
                                    style={{ color: "#199FD9" }}
                                  >
                                    {patient.datetime.split(" ")[1]}{" "}
                                    {patient.datetime.split(" ")[2]}
                                  </div>
                                </td>

                                <td style={{ color: "#199FD9" }}>
                                  {patient.diseaseName}
                                </td>
                                {/* <td>
                                                                {patient.status === 1 ? (
                                                                    // <Link to="/videocall" className="orange-btn">Start Now</Link>
                                                                    <a className="orange-btn" style={{ cursor: "pointer" }} onClick={() => handleCreateChannel(patient.appointment_id)}>Start now</a>) : isWithinTwoHours(patient.datetime) ? (
                                                                        <div className="info-tooltip">
                                                                            <i className="fas fa-info-circle"></i>

                                                                        </div>
                                                                    ) : (
                                                                    <button type="button" className="cmn-btn blue-bg" onClick={() => handleCancelClick(patient.appointment_id)}>
                                                                        Cancel
                                                                    </button>
                                                                )}
                                                            </td> */}
                                <td>
                                  {patient.status === 1 ? (
                                    <a
                                      className="orange-btn"
                                      style={{
                                        cursor: isLoading
                                          ? "not-allowed"
                                          : "pointer",
                                        pointerEvents: isLoading
                                          ? "none"
                                          : "auto",
                                      }}
                                      onClick={() =>
                                        handleCreateChannel(
                                          patient.appointment_id
                                        )
                                      }
                                    >
                                      {isLoading ? "Loading..." : "Start now"}
                                    </a>
                                  ) : (
                                    <button
                                      type="button"
                                      className="cmn-btn blue-bg"
                                      onClick={() =>
                                        handleCancelClick(
                                          patient.appointment_id
                                        )
                                      }
                                      disabled={isPastAppointment(
                                        patient.datetime
                                      )} // disable only if appointment is already passed
                                      style={{
                                        opacity: isPastAppointment(
                                          patient.datetime
                                        )
                                          ? 0.6
                                          : 1,
                                        cursor: isPastAppointment(
                                          patient.datetime
                                        )
                                          ? "not-allowed"
                                          : "pointer",
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </td>

                                <td>
                                  <Link
                                    to="/patient-profile"
                                    state={{ patientId: patient.patient_id }}
                                    className="cmn-btn"
                                  >
                                    View Profile
                                  </Link>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    {filteredUpcomingPatients?.length > 0 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={getTotalPages(filteredUpcomingPatients)}
                        onPageChange={handlePageChange}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                      />
                    )}
                  </div>

                  {/* Completed Tab */}
                  <div
                    className={`myapintmnt-content-tab ${
                      activeTab === "completed" ? "completed" : ""
                    }`}
                    style={{
                      display: activeTab === "completed" ? "block" : "none",
                    }}
                  >
                    <div className="myapintmnt-table">
                      <table>
                        <thead>
                          <tr>
                            <th>S.no.</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Phone number</th>
                            <th>Appointment date</th>
                            <th>Disease</th>
                            <th>Prescription Details</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {console.log("filteredCompletedPatients123456: ", filteredCompletedPatients)} */}
                          {getPaginatedPatients(filteredCompletedPatients)
                            ?.length == 0 && (
                            <tr>
                              <td
                                colSpan="8"
                                style={{
                                  textAlign: "center",
                                  padding: "25px 0",
                                  fontSize: 18,
                                  fontWeight: "400",
                                  color: "#199FD9",
                                }}
                              >
                                No data found
                              </td>
                            </tr>
                          )}
                          {getPaginatedPatients(filteredCompletedPatients)?.map(
                            (patient, index) => (
                              <tr key={`completed-${index}`}>
                                {/* <td>{(currentPage - 1) * patientsPerPage + index + 1}</td> */}
                                <td style={{ color: "#199FD9" }}>
                                  {String(
                                    (currentPage - 1) * patientsPerPage +
                                      index +
                                      1
                                  ).padStart(2, "0")}
                                </td>
                                {/* <td>
                                                                <img src={baseUrl + "/" + patient?.patient_profile} alt="Patient" />
                                                               
                                                                <Link to="/patient-profile" state={{ patientId: patient.patient_id }}><h3>{patient.patient_name || "-"}</h3></Link>

                                                            </td> */}
                                <td
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <img
                                    src={
                                      baseUrl + "/" + patient?.patient_profile
                                    }
                                    alt="Patient"
                                  />

                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Link
                                      to="/patient-profile"
                                      state={{ patientId: patient.patient_id }}
                                    >
                                      <h3
                                        style={{
                                          margin: 0,
                                          textAlign: "left",
                                          color: "#199FD9",
                                        }}
                                      >
                                        {patient.patient_name || "-"}
                                      </h3>
                                    </Link>
                                    {/* {(patient?.ds_code &&
                                                                        <div style={{ color: "#199fd9", marginTop: "2px" }}>
                                                                            (DS Code: {patient.ds_code})
                                                                        </div>
                                                                    )} */}
                                    {patient?.referred == true ? (
                                      <div
                                        style={{
                                          // This div's color will be inherited by parts not explicitly styled
                                          color: "#199fd9",
                                          marginTop: "2px",
                                        }}
                                      >
                                        <span style={{ color: "black" }}>
                                          {" "}
                                          (Referred by DS Code:{" "}
                                        </span>
                                        {patient.ds_code}
                                        <span style={{ color: "black" }}>
                                          )
                                        </span>
                                      </div>
                                    ) : (
                                      <div
                                        style={{
                                          color: "#199fd9", // This color will apply to the patient.ds_code if not overridden
                                          marginTop: "2px",
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: "black",
                                            fontSize: 15,
                                          }}
                                        >
                                          {" "}
                                          (DS Code:{" "}
                                        </span>
                                        {patient.ds_code}{" "}
                                        <span style={{ color: "black" }}>
                                          )
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_age || "-"}
                                </td>
                                {/* <td>{patient.patient_gender || "-"}</td> */}
                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_gender
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    patient.patient_gender
                                      ?.slice(1)
                                      .toLowerCase()}
                                </td>
                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_phone || "-"}
                                </td>
                                <td>
                                  {/* <div className="date h3-title">{patient.datetime}</div> */}
                                  <div
                                    className="date h3-title"
                                    style={{ color: "#199FD9" }}
                                  >
                                    {patient.datetime.split(" ")[0]}
                                  </div>
                                  <div
                                    className="time"
                                    style={{ color: "#199FD9" }}
                                  >
                                    {patient.datetime.split(" ")[1]}{" "}
                                    {patient.datetime.split(" ")[2]}
                                  </div>
                                </td>
                                <td style={{ color: "#199FD9" }}>
                                  {patient.diseaseName}
                                </td>
                                <td>
                                  <Link
                                    to="/completed-appointment-screen"
                                    state={{
                                      id: patient.appointment_id,
                                      patientId: patient.patient_id,
                                      chat_id: patient.chat_id,
                                      ds_code: patient.ds_code,

                                      referred: patient.referred,
                                      prescription_id: patient?.prescription_id,
                                    }}
                                    style={{
                                      color: "#199FD9",
                                      textDecoration: "underline !important",
                                    }}
                                    className=" text-decoration-underline"
                                  >
                                    View
                                  </Link>
                                </td>
                                <td>
                                  <Link
                                    to="/patient-profile"
                                    state={{
                                      patientId: patient.patient_id,
                                      appointmentId: patient.appointment_id,
                                      source: "completed",
                                      hideSchedule: false,
                                    }}
                                    className="cmn-btn"
                                  >
                                    View Profile
                                  </Link>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    {filteredCompletedPatients?.length > 0 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={getTotalPages(filteredCompletedPatients)}
                        onPageChange={handlePageChange}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                      />
                    )}
                  </div>

                  {/* Cancelled Tab */}
                  <div
                    className={`myapintmnt-content-tab ${
                      activeTab === "cancelled" ? "cancelled" : ""
                    }`}
                    style={{
                      display: activeTab === "cancelled" ? "block" : "none",
                    }}
                  >
                    <div className="myapintmnt-table">
                      <table>
                        <thead>
                          <tr>
                            <th>S.no.</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Phone number</th>
                            <th>Appointment date</th>
                            <th>Disease</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPaginatedPatients(filteredCancelledPatients)
                            ?.length == 0 && (
                            <tr>
                              <td
                                colSpan="8"
                                style={{
                                  textAlign: "center",
                                  padding: "25px 0",
                                  fontSize: 18,
                                  color: "#199FD9",
                                  fontWeight: "400",
                                }}
                              >
                                No data found
                              </td>
                            </tr>
                          )}
                          {getPaginatedPatients(filteredCancelledPatients)?.map(
                            (patient, index) => (
                              <tr key={`cancelled-${index}`}>
                                {/* <td>{(currentPage - 1) * patientsPerPage + index + 1}</td> */}
                                <td style={{ color: "#199FD9" }}>
                                  {String(
                                    (currentPage - 1) * patientsPerPage +
                                      index +
                                      1
                                  ).padStart(2, "0")}
                                </td>
                                {/* <td>
                                                                <img src={baseUrl + "/" + patient?.patient_profile} alt="Patient" />
                                                                
                                                                <Link to="/patient-profile" state={{ patientId: patient.patient_id }}><h3>{patient.patient_name || "-"}</h3></Link>

                                                            </td> */}
                                <td
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <img
                                    src={
                                      baseUrl + "/" + patient?.patient_profile
                                    }
                                    alt="Patient"
                                  />

                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Link
                                      to="/patient-profile"
                                      state={{ patientId: patient.patient_id }}
                                    >
                                      <h3
                                        style={{
                                          margin: 0,
                                          textAlign: "left",
                                          color: "#199FD9",
                                        }}
                                      >
                                        {patient.patient_name || "-"}
                                      </h3>
                                    </Link>
                                    {/* {(patient?.ds_code &&
                                                                        <div style={{ color: "#199fd9", marginTop: "2px" }}>
                                                                            (DS Code: {patient.ds_code})
                                                                        </div>
                                                                    )} */}
                                    {patient?.referred == true ? (
                                      <div
                                        style={{
                                          // This div's color will be inherited by parts not explicitly styled
                                          color: "#199fd9",
                                          marginTop: "2px",
                                        }}
                                      >
                                        <span style={{ color: "black" }}>
                                          {" "}
                                          (Referred by DS Code:{" "}
                                        </span>
                                        {patient.ds_code}
                                        <span style={{ color: "black" }}>
                                          )
                                        </span>
                                      </div>
                                    ) : (
                                      <div
                                        style={{
                                          // This div's color will be inherited by parts not explicitly styled
                                          color: "#199fd9",
                                          marginTop: "2px",
                                        }}
                                      >
                                        <span style={{ color: "black" }}>
                                          {" "}
                                          (DS Code:{" "}
                                        </span>
                                        {patient.ds_code}
                                        <span style={{ color: "black" }}>
                                          )
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_age || "-"}
                                </td>
                                {/* <td>{patient.patient_gender || "-"}</td> */}
                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_gender
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    patient.patient_gender
                                      ?.slice(1)
                                      .toLowerCase()}
                                </td>
                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_phone || "-"}
                                </td>
                                <td style={{ color: "#199FD9" }}>
                                  {/* <div className="date h3-title">{patient.datetime}</div> */}
                                  <div
                                    className="date h3-title"
                                    style={{ color: "#199FD9" }}
                                  >
                                    {patient.datetime.split(" ")[0]}
                                  </div>
                                  <div
                                    className="time"
                                    style={{ color: "#199FD9" }}
                                  >
                                    {patient.datetime.split(" ")[1]}{" "}
                                    {patient.datetime.split(" ")[2]}
                                  </div>
                                </td>
                                <td style={{ color: "#199FD9" }}>
                                  {patient.diseaseName}
                                </td>
                                <td>
                                  <Link
                                    to="/patient-profile"
                                    state={{
                                      patientId: patient.patient_id,
                                      appointmentId: patient.appointment_id,
                                      source: "cancelled",
                                      hideSchedule: true,
                                    }}
                                    className="cmn-btn"
                                  >
                                    View Profile
                                  </Link>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    {filteredCancelledPatients?.length > 0 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={getTotalPages(filteredCancelledPatients)}
                        onPageChange={handlePageChange}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                      />
                    )}
                  </div>

                  {/* <Pagination currentPage={currentPage} totalPages={totalPages}
                                    onPageChange={handlePageChange} onPrevious={handlePrevious}
                                    onNext={handleNext} /> */}

                  {/* incompleted Tab */}
                  <div
                    className={`myapintmnt-content-tab ${
                      activeTab === "incompleted" ? "incompleted" : ""
                    }`}
                    style={{
                      display: activeTab === "incompleted" ? "block" : "none",
                    }}
                  >
                    <div className="myapintmnt-table incomp_tbl">
                      <table>
                        <thead>
                          <tr>
                            <th>S.no.</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Phone number</th>
                            <th>Appointment date</th>
                            <th>Disease</th>
                            <th>Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPaginatedPatients(filteredIncompletedPatients)
                            ?.length == 0 && (
                            <tr>
                              <td
                                colSpan="8"
                                style={{
                                  textAlign: "center",
                                  padding: "25px 0",
                                  fontSize: 18,
                                  fontWeight: "400",
                                  color: "#199FD9",
                                }}
                              >
                                No data found
                              </td>
                            </tr>
                          )}
                          {getPaginatedPatients(
                            filteredIncompletedPatients
                          )?.map((patient, index) => (
                            <tr key={`incompleted-${index}`}>
                              {/* <td>{(currentPage - 1) * patientsPerPage + index + 1}</td> */}
                              <td style={{ color: "#199FD9" }}>
                                {String(
                                  (currentPage - 1) * patientsPerPage +
                                    index +
                                    1
                                ).padStart(2, "0")}
                              </td>
                              {/* <td>
                                                                <img src={baseUrl + "/" + patient?.patient_profile} alt="Patient" />
                                                                
                                                                <Link to="/patient-profile" state={{ patientId: patient.patient_id }}><h3>{patient.patient_name || "-"}</h3></Link>

                                                            </td> */}
                              <td
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <img
                                  src={baseUrl + "/" + patient?.patient_profile}
                                  alt="Patient"
                                />

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  {/* <Link
                                      to="/patient-profile"
                                      state={{ patientId: patient.patient_id }}
                                    > */}
                                  <h3
                                    style={{
                                      margin: 0,
                                      textAlign: "left",
                                      color: "#199FD9",
                                    }}
                                  >
                                    {patient.patient_name || "-"}
                                  </h3>
                                  {/* </Link> */}
                                  {/* {(patient?.ds_code &&
                                                                        <div style={{ color: "#199fd9", marginTop: "2px" }}>
                                                                            (DS Code: {patient.ds_code})
                                                                        </div>
                                                                    )} */}
                                  {patient?.referred == true ? (
                                    <div
                                      style={{
                                        // This div's color will be inherited by parts not explicitly styled
                                        color: "#199fd9",
                                        marginTop: "2px",
                                      }}
                                    >
                                      <span style={{ color: "black" }}>
                                        {" "}
                                        (Referred by DS Code:{" "}
                                      </span>
                                      {patient.ds_code}
                                      <span style={{ color: "black" }}>)</span>
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        // This div's color will be inherited by parts not explicitly styled
                                        color: "#199fd9",
                                        marginTop: "2px",
                                      }}
                                    >
                                      <span style={{ color: "black" }}>
                                        {" "}
                                        (DS Code:{" "}
                                      </span>
                                      {patient.ds_code}
                                      <span style={{ color: "black" }}>)</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td style={{ color: "#199FD9" }}>
                                {patient.patient_age || "-"}
                              </td>
                              {/* <td>{patient.patient_gender || "-"}</td> */}
                              <td style={{ color: "#199FD9" }}>
                                {patient.patient_gender
                                  ?.charAt(0)
                                  .toUpperCase() +
                                  patient.patient_gender
                                    ?.slice(1)
                                    .toLowerCase()}
                              </td>
                              <td style={{ color: "#199FD9" }}>
                                {patient.patient_phone || "-"}
                              </td>
                              <td>
                                {/* <div className="date h3-title">{patient.datetime}</div> */}
                                <div
                                  className="date h3-title"
                                  style={{ color: "#199FD9" }}
                                >
                                  {patient.datetime.split(" ")[0]}
                                </div>
                                <div
                                  className="time"
                                  style={{ color: "#199FD9" }}
                                >
                                  {patient.datetime.split(" ")[1]}{" "}
                                  {patient.datetime.split(" ")[2]}
                                </div>
                              </td>

                              <td style={{ color: "#199FD9" }}>
                                {patient.diseaseName}
                              </td>
                              <td style={{ color: "#199FD9" }}>
                                {/* <Link
                                    to="/patient-profile"
                                    state={{
                                      patientId: patient.patient_id,
                                      appointmentId: patient.appointment_id,
                                      source: "cancelled",
                                      hideSchedule: false,
                                    }}
                                    className="cmn-btn"
                                  >
                                    View Profile
                                  </Link> */}
                                {patient.reason}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredIncompletedPatients?.length > 0 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={getTotalPages(filteredIncompletedPatients)}
                        onPageChange={handlePageChange}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                      />
                    )}
                  </div>

                  {/* Missed Tab */}
                  <div
                    className={`myapintmnt-content-tab ${
                      activeTab === "missed" ? "missed" : ""
                    }`}
                    style={{
                      display: activeTab === "missed" ? "block" : "none",
                    }}
                  >
                    <div className="myapintmnt-table incomp_tbl">
                      <table>
                        <thead>
                          <tr>
                            <th>S.no.</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Phone number</th>
                            <th>Appointment date</th>
                            <th>Disease</th>
                            {/* <th>Reason</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {getPaginatedPatients(filteredMissedPatients)
                            ?.length == 0 && (
                            <tr>
                              <td
                                colSpan="8"
                                style={{
                                  textAlign: "center",
                                  padding: "25px 0",
                                  fontSize: 18,
                                  fontWeight: "400",
                                  color: "#199FD9",
                                }}
                              >
                                No data found
                              </td>
                            </tr>
                          )}
                          {getPaginatedPatients(filteredMissedPatients)?.map(
                            (patient, index) => (
                              <tr key={`missed-${index}`}>
                                {/* <td>{(currentPage - 1) * patientsPerPage + index + 1}</td> */}
                                <td style={{ color: "#199FD9" }}>
                                  {String(
                                    (currentPage - 1) * patientsPerPage +
                                      index +
                                      1
                                  ).padStart(2, "0")}
                                </td>
                                {/* <td>
                                                                <img src={baseUrl + "/" + patient?.patient_profile} alt="Patient" />
                                                                
                                                                <Link to="/patient-profile" state={{ patientId: patient.patient_id }}><h3>{patient.patient_name || "-"}</h3></Link>

                                                            </td> */}
                                <td
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <img
                                    src={
                                      baseUrl + "/" + patient?.patient_profile
                                    }
                                    alt="Patient"
                                  />

                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    {/* <Link
                                      to="/patient-profile"
                                      state={{ patientId: patient.patient_id }}
                                    > */}
                                    <h3
                                      style={{
                                        margin: 0,
                                        textAlign: "left",
                                        color: "#199FD9",
                                      }}
                                    >
                                      {patient.patient_name || "-"}
                                    </h3>
                                    {/* </Link> */}
                                    {/* {(patient?.ds_code &&
                                                                        <div style={{ color: "#199fd9", marginTop: "2px" }}>
                                                                            (DS Code: {patient.ds_code})
                                                                        </div>
                                                                    )} */}
                                    {patient?.referred == true ? (
                                      <div
                                        style={{
                                          // This div's color will be inherited by parts not explicitly styled
                                          color: "#199fd9",
                                          marginTop: "2px",
                                        }}
                                      >
                                        <span style={{ color: "black" }}>
                                          {" "}
                                          (Referred by DS Code:{" "}
                                        </span>
                                        {patient.ds_code}
                                        <span style={{ color: "black" }}>
                                          )
                                        </span>
                                      </div>
                                    ) : (
                                      <div
                                        style={{
                                          // This div's color will be inherited by parts not explicitly styled
                                          color: "#199fd9",
                                          marginTop: "2px",
                                        }}
                                      >
                                        <span style={{ color: "black" }}>
                                          {" "}
                                          (DS Code:{" "}
                                        </span>
                                        {patient.ds_code}
                                        <span style={{ color: "black" }}>
                                          )
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_age || "-"}
                                </td>
                                {/* <td>{patient.patient_gender || "-"}</td> */}
                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_gender
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    patient.patient_gender
                                      ?.slice(1)
                                      .toLowerCase()}
                                </td>
                                <td style={{ color: "#199FD9" }}>
                                  {patient.patient_phone || "-"}
                                </td>
                                <td>
                                  {/* <div className="date h3-title">{patient.datetime}</div> */}
                                  <div
                                    className="date h3-title"
                                    style={{ color: "#199FD9" }}
                                  >
                                    {patient.datetime.split(" ")[0]}
                                  </div>
                                  <div
                                    className="time"
                                    style={{ color: "#199FD9" }}
                                  >
                                    {patient.datetime.split(" ")[1]}{" "}
                                    {patient.datetime.split(" ")[2]}
                                  </div>
                                </td>

                                <td style={{ color: "#199FD9" }}>
                                  {patient.diseaseName}
                                </td>
                                {/* <td style={{ color: "#199FD9" }}>
                                  
                                  {patient.reason}
                                </td> */}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    {filteredMissedPatients?.length > 0 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={getTotalPages(filteredMissedPatients)}
                        onPageChange={handlePageChange}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                      />
                    )}
                  </div>
                </div>
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
        onConfirm={() => setShowSuccessModal(false)}
        onCancel={() => setShowSuccessModal(false)}
        actionType="success"
      />
    </div>
  );
};

export default MyAppointments;
