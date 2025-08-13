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
import { Modal, Button } from "react-bootstrap";
import "./css/style2.css";
import { MdOutlineWatchLater } from "react-icons/md";
import { toast } from "react-toastify";
import HodScreenSearch from "../component/HodScreenSearch";
import {
  hodRequestsConfirmButton,
  hodRequestsRespondButton,
  hodScreenDoctorsList,
  hodScreenRequestsList,
  markDoctorAvailable,
  unavailabilitySubmitByHod,
} from "../redux/slices/patientProfileSlice";
import baseUrl from "../config/BaseUrl";

const Hod = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    hodScreenRequests,
    hodScreenRequestsLoading,
    hodRequestsConfirmButtonLoading,
    hodRequestsConfirm,
    hodRequestsRespondButtonLoading,
    hodRequestsRespond,
    hodScreenDoctors,
    hodScreenDoctorsListLoading,
    confirmDoctorAvailable,
    markDoctorAvailableLoading,
    doctorUnavailabilitySubmit,
    unavailabilitySubmitByHodLoading,
  } = useSelector((state) => state.patientProfile);

  //search functionality
  const [searchQueryDoctors, setSearchQueryDoctors] = useState("");
  const [searchQueryRequests, setSearchQueryRequests] = useState("");

  useEffect(() => {
    dispatch(hodScreenRequestsList({ search: searchQueryRequests }));
  }, [dispatch, searchQueryRequests]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(hodScreenDoctorsList({ search: searchQueryDoctors }));
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [dispatch, searchQueryDoctors]);

  // useEffect(() => {
  //   dispatch(hodScreenDoctorsList({search:searchQueryDoctors}))

  // }, [dispatch, searchQueryDoctors]);

  // Status of Availability and unavailability should update automatically.
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      hodScreenDoctors?.forEach((doctor) => {
        if (!doctor.hasUnavailability) return;

        const unavailability = doctor.unavailabilities?.[0];
        if (!unavailability) return;

        const fromDateTime = new Date(
          `${unavailability.fromDate} ${unavailability.fromTime}`
        );
        const toDateTime = new Date(
          `${unavailability.toDate} ${unavailability.toTime}`
        );

        // Compare current time to fromDateTime or toDateTime
        const nowFormatted = now.toLocaleString("en-US", { hour12: true });
        const fromFormatted = fromDateTime.toLocaleString("en-US", {
          hour12: true,
        });
        const toFormatted = toDateTime.toLocaleString("en-US", {
          hour12: true,
        });

        const isFromTimeMatch = Math.abs(now - fromDateTime) < 60 * 1000; // ±1 min
        const isToTimeMatch = Math.abs(now - toDateTime) < 60 * 1000; // ±1 min

        if (isFromTimeMatch || isToTimeMatch) {
          // console.log("Time matched. Fetching updated doctor list...");
          dispatch(hodScreenDoctorsList());
        }
      });
    }, 60000); // Run every 60 seconds

    return () => clearInterval(interval); // Cleanup
  }, [hodScreenDoctors, dispatch]);

  const handleSearchDoctors = (query) => {
    setSearchQueryDoctors(query.toLowerCase());
    setCurrentPage1(1); // Reset to first page when searching
  };

  const handleSearchRequests = (query) => {
    setSearchQueryRequests(query.toLowerCase());
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter functions for doctors and requests
  const filterDoctors = (doctor) => {
    if (!searchQueryDoctors) return true;
    return (
      doctor.name?.toLowerCase().includes(searchQueryDoctors) ||
      doctor.email?.toLowerCase().includes(searchQueryDoctors) ||
      doctor.phone?.toLowerCase().includes(searchQueryDoctors) ||
      doctor.experience?.toString().includes(searchQueryDoctors) ||
      doctor.shiftTiming?.toLowerCase().includes(searchQueryDoctors) ||
      doctor.signupDate?.toLowerCase().includes(searchQueryDoctors) ||
      (doctor.hasUnavailability &&
        (doctor.unavailabilities?.[0]?.type
          ?.toLowerCase()
          .includes(searchQueryDoctors) ||
          doctor.unavailabilities?.[0]?.status
            ?.toLowerCase()
            .includes(searchQueryDoctors) ||
          doctor.unavailabilities?.[0]?.reason
            ?.toLowerCase()
            .includes(searchQueryDoctors)))
    );
  };

  const filterRequests = (request) => {
    if (!searchQueryRequests) return true;
    return (
      request.doctorName?.toLowerCase().includes(searchQueryRequests) ||
      request.appliedOn?.toLowerCase().includes(searchQueryRequests) ||
      request.fromDate?.toLowerCase().includes(searchQueryRequests) ||
      request.fromTime?.toLowerCase().includes(searchQueryRequests) ||
      request.toDate?.toLowerCase().includes(searchQueryRequests) ||
      request.toTime?.toLowerCase().includes(searchQueryRequests) ||
      request.type?.toLowerCase().includes(searchQueryRequests) ||
      request.status?.toLowerCase().includes(searchQueryRequests) ||
      request.reason?.toLowerCase().includes(searchQueryRequests) ||
      request.timePeriod?.toLowerCase().includes(searchQueryRequests)
    );
  };

  //search functionality---------------

  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 8;

  // const currentData = hodScreenRequests || [];
  const currentData = hodScreenRequests?.filter(filterRequests) || [];
  const totalPages = Math.ceil(currentData.length / requestsPerPage);

  // Get current patients
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = currentData.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Change page
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleConfirmClick = (id) => {
    // console.log("Confirming request with ID:", id);

    dispatch(hodRequestsConfirmButton({ unavailability_id: id }))
      .then((action) => {
        if (action.payload?.status) {
          toast.success(action.payload.message);
          dispatch(hodScreenRequestsList()); // Refresh the list
        } else {
          toast.error(action.payload?.message);
        }
      })
      .catch((error) => {
        toast.error("An error occurred while Confirming for doctor's leave");
      });
  };

  const handleApproveClick = (id, status) => {
    // console.log("Approving request with ID:", id);

    dispatch(
      hodRequestsRespondButton({ unavailability_id: id, status: status })
    )
      .then((action) => {
        if (action.payload?.status) {
          toast.success(action.payload.message);
          dispatch(hodScreenRequestsList()); // Refresh the list
        } else {
          toast.error(action.payload?.message);
        }
      })
      .catch((error) => {
        toast.error("An error occurred while Approving doctor's leave'");
      });
  };

  const handleDeclineClick = (id, status) => {
    // console.log("Declining request with ID:", id);
    dispatch(
      hodRequestsRespondButton({ unavailability_id: id, status: status })
    )
      .then((action) => {
        if (action.payload?.status) {
          toast.success(action.payload.message);
          dispatch(hodScreenRequestsList()); // Refresh the list
        } else {
          toast.error(action.payload?.message);
        }
      })
      .catch((error) => {
        toast.error("An error occurred while Declining doctor's leave'");
      });
  };

  const markDoctorAvailableFunc = (id) => {
    dispatch(markDoctorAvailable({ doctor_id: id }))
      .then((action) => {
        if (action.payload?.status) {
          toast.success(
            action.payload.message || "Doctor marked as available successfully"
          );
          setShowConfirmAvailability(false);
          dispatch(hodScreenDoctorsList()); // Refresh the list
        } else {
          toast.error(
            action.payload?.message || "Failed to mark doctor as available"
          );
        }
      })
      .catch((error) => {
        setShowConfirmAvailability(false);
        toast.error("An error occurred while marking doctor as available");
      });
  };

  const handleUnavailabilitySubmitByHod = (e) => {
    e.preventDefault();
    if (
      !unavailabilityData.startDate ||
      !unavailabilityData.endDate ||
      !unavailabilityData.startTime ||
      !unavailabilityData.endTime ||
      !unavailabilityData.reason
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Format the datetime strings as required by API (YYYY-MM-DD HH:MM:SS)
    const from_datetime = `${unavailabilityData.startDate} ${unavailabilityData.startTime}:00`;
    const to_datetime = `${unavailabilityData.endDate} ${unavailabilityData.endTime}:00`;

    const unavailabilityDataToSend = {
      doctor_id: currentDoctorId,
      from_datetime,
      to_datetime,
      type: unavailabilityData.type,
      reason: unavailabilityData.reason,
    };

    dispatch(unavailabilitySubmitByHod(unavailabilityDataToSend))
      .then((action) => {
        if (action.payload?.status) {
          dispatch(hodScreenDoctorsList()); // Refresh the list
          toast.success(
            action.payload.message || "Unavailability set successfully"
          );
          setShowConfirmUnavailability(false);
          // Reset form
          setUnavailabilityData({
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            type: "emergency",
            reason: "",
          });
        } else {
          toast.error(
            action.payload?.message || "Failed to set unavailability"
          );
        }
        // toast.error(action.payload?.message || "Failed to set unavailability");
      })
      .catch((error) => {
        setShowConfirmUnavailability(false);
        toast.error("An error occurred while setting unavailability");
      });
  };

  //now Hod Doctor Screen
  const [currentPage1, setCurrentPage1] = useState(1);

  // const currentData1 = hodScreenDoctors || [];
  const currentData1 = hodScreenDoctors?.filter(filterDoctors) || [];
  const totalPages1 = Math.ceil(currentData1.length / requestsPerPage);

  // Get current patients
  const indexOfLastRequest1 = currentPage1 * requestsPerPage;
  const indexOfFirstRequest1 = indexOfLastRequest1 - requestsPerPage;
  const currentRequests1 = currentData1.slice(
    indexOfFirstRequest1,
    indexOfLastRequest1
  );

  const handlePageChange1 = (pageNumber) => {
    setCurrentPage1(pageNumber);
  };
  // Change page
  const nextPage1 = () =>
    currentPage1 < totalPages1 && setCurrentPage1(currentPage1 + 1);
  const prevPage1 = () => currentPage1 > 1 && setCurrentPage1(currentPage1 - 1);

  // Generate page numbers for pagination
  const pageNumbers1 = [];
  for (let i = 1; i <= totalPages1; i++) {
    pageNumbers1.push(i);
  }

  // useEffect(() => {
  //   dispatch(hodScreenDoctorsList({search:searchQueryDoctors}))

  // }, [dispatch, searchQueryDoctors]);

  // const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const [showConfirmUnavailability, setShowConfirmUnavailability] =
    useState(false);
  const [showConfirmAvailability, setShowConfirmAvailability] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);

  const [unavailabilityData, setUnavailabilityData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    type: "emergency", // always this value for hod
    reason: "",
  });

  const [activeTab, setActiveTab] = useState("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // const patientsPerPage = 8;

  // const [unavailabilityData, setUnavailabilityData] = useState({
  //   startDate: '',
  //   endDate: '',
  //   startTime: '',
  //   endTime: ''
  // });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnavailabilityData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  // const handleFilterChange = (newFilters) => {
  //   setFilters({
  //     patientName: newFilters.patientName || "",
  //     age: newFilters.age || "",
  //     dscode: newFilters.dscode || "",
  //     disease: newFilters.disease || "",
  //   });

  // Apply filters to the current active tab
  //   switch (activeTab) {
  //     case "upcoming":
  //       setFilteredUpcomingPatients(
  //         applyFilters(upcommingAppointment, "upcoming")
  //       );
  //       break;
  //     case "completed":
  //       setFilteredCompletedPatients(
  //         applyFilters(completedAppointment, "completed")
  //       );
  //       break;

  //     default:
  //       break;
  //   }
  //   setCurrentPage(1);
  // };

  const appData = JSON.parse(localStorage.getItem("doctor-app") || "{}");
  const DoctorLoginId = appData.doctorData;

  // console.log(DoctorLoginId?.id, "Doctor Data");

  // handle create channel to join call

  // const handleCreateChannel = async (id) => {
  // console.log(id, `JoinCall + ${DoctorLoginId?.id}`, "params of the data");
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

  // const handleSearch = (query) => {
  //   const lowerQuery = query.toLowerCase().trim();
  //   const isNumeric = /^\d+$/.test(query);

  //   // Common search logic for all appointment types
  //   const searchPatients = (patients) => {
  //     return patients.filter((patient) => {
  //       const patientAge = patient.patient_age?.toString() || "";
  //       const patientPhone = patient.patient_phone?.toString() || "";
  //       const dateStr = patient.datetime
  //         ? new Date(patient.datetime).getDate().toString()
  //         : "";

  //       const dsCode = patient.ds_code?.toLowerCase() || "";
  //       if (isNumeric) {
  //         return (patientAge === query || patientPhone.includes(query) || dsCode.includes(lowerQuery));
  //       }
  //       return (
  //         patient.patient_name?.toLowerCase().includes(lowerQuery) ||
  //         patient.patient_gender?.toLowerCase() === lowerQuery ||
  //         patientPhone.includes(query) ||
  //         dateStr.includes(lowerQuery) ||
  //         dsCode.includes(lowerQuery) ||
  //         patient.datetime?.toLowerCase().includes(lowerQuery) ||
  //         (activeTab === "completed" &&
  //           patient.diagnosis?.toLowerCase().includes(lowerQuery))
  //       );
  //     });
  //   };

  //   // Apply search to the appropriate tab
  //   // switch (activeTab) {
  //   //   case "upcoming":
  //   //     setFilteredUpcomingPatients(searchPatients(upcommingAppointment));
  //   //     break;
  //   //   case "completed":
  //   //     setFilteredCompletedPatients(searchPatients(completedAppointment));
  //   //     break;
  //   //   default:
  //   //     break;
  //   // }

  //   // Reset to first page when searching
  //   setCurrentPage(1);
  // };
  // Updated parser to handle full date-time string
  // const parseDDMMYYYYTime = (dateTimeStr) => {
  //   const [datePart, timePart, meridian] = dateTimeStr.split(" "); // Split into ["13/05/2025", "05:25", "PM"]
  //   const [day, month, year] = datePart.split("/").map(Number);
  //   let [hour, minute] = timePart.split(":").map(Number); // Now split "05:25" into [5, 25]

  //   // Convert 12-hour format to 24-hour format
  //   if (meridian === "PM" && hour !== 12) hour += 12;
  //   if (meridian === "AM" && hour === 12) hour = 0;

  //   const finalResult = new Date(year, month - 1, day, hour, minute);
  //   return finalResult;
  // };

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

  // const handleSearchDate = (dateRange) => {
  //   if (dateRange == null) {
  //     // Reset to original data for the current tab
  //     switch (activeTab) {
  //       case "completed":
  //         setFilteredCompletedPatients(completedAppointment);
  //         break;

  //       default:
  //         break;
  //     }
  //     return;
  //   }

  //   if (!dateRange || dateRange.length !== 2) return;

  //   const [startDate, endDate] = dateRange;

  //   // Apply date filter to the appropriate tab
  //   switch (activeTab) {
  //     case "completed":
  //       const filteredCompleted = completedAppointment.filter((patient) => {
  //         const appointmentDate = parseDDMMYYYYTime(patient.datetime);
  //         return appointmentDate >= startDate && appointmentDate <= endDate;
  //       });
  //       setFilteredCompletedPatients(filteredCompleted);
  //       break;

  //     default:
  //       break;
  //   }
  // };

  // const handleCancelClick = (id) => {
  // console.log({"appointment_id":id, "cancel_message":cancelReason});
  //   // dispatch(doctorCanceledAppointment({"appointment_id":id, "cancel_message":cancelReason}))
  //   setSelectedAppointmentId(id);
  //   setShowModal(true);
  // };

  // const handleCancelConfirm = () => {
  //   setShowModal(false);
  //   setShowCancelReasonModal(true);
  // };

  // const handleCancelReasonSubmit = () => {
  //   // API call
  // console.log("Cancelled appointment ID:", selectedAppointmentId);
  // console.log("Reason:", cancelReason);
  //   dispatch(
  //     doctorCanceledAppointment({
  //       appointment_id: selectedAppointmentId,
  //       cancel_message: cancelReason,
  //     })
  //   ).then(() => {
  //     // Refresh the upcoming appointments list after successful cancellation
  //     dispatch(getAllUpcomingAppointment());
  //     setShowCancelReasonModal(false);
  //     setCancelReason("");
  //     setSelectedAppointmentId(null);
  //     setShowSuccessModal(true);
  //   });
  // };

  // Calculate pagination for each tab
  // const getPaginatedPatients = (patients) => {
  //   const indexOfLastPatient = currentPage * patientsPerPage;
  //   const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  //   return patients?.slice(indexOfFirstPatient, indexOfLastPatient);
  // };

  // Calculate total pages
  // const getTotalPages = (patients) => {
  //   return Math.ceil(patients?.length / patientsPerPage);
  // };

  // Handle page change
  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  // Handle next/previous
  // const handleNext = () => {
  //   const totalPages = getTotalPages(
  //     activeTab === "upcoming"
  //       ? filteredUpcomingPatients
  //       : filteredCompletedPatients

  //   );
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePrevious = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // In your render method, before the return statement:
  // const currentPatients =
  //   activeTab === "upcoming"
  //     ? filteredUpcomingPatients
  //     : filteredCompletedPatients

  // const totalPages = getTotalPages(currentPatients);
  // const pageNumbers = [];

  // if (totalPages <= 5) {
  //   for (let i = 1; i <= totalPages; i++) {
  //     pageNumbers.push(i);
  //   }
  // } else {
  //   if (currentPage <= 3) {
  //     pageNumbers.push(1, 2, 3, 4, "...", totalPages);
  //   } else if (currentPage >= totalPages - 2) {
  //     pageNumbers.push(
  //       1,
  //       "...",
  //       totalPages - 3,
  //       totalPages - 2,
  //       totalPages - 1,
  //       totalPages
  //     );
  //   } else {
  //     pageNumbers.push(
  //       1,
  //       "...",
  //       currentPage - 1,
  //       currentPage,
  //       currentPage + 1,
  //       "...",
  //       totalPages
  //     );
  //   }
  // }

  // const isPastAppointment = (dateTimeStr) => {
  //   const appointmentDate = parseDDMMYYYYTime(dateTimeStr);
  //   const now = new Date();
  //   return appointmentDate < now;
  // };

  const formatTimeTo12Hour = (timeStr) => {
    const [start, end] = timeStr.split(" - ");
    const format = (time) => {
      const [hour, minute] = time.split(":");
      const date = new Date();
      date.setHours(hour, minute);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };
    return `${format(start)} - ${format(end)}`;
  };

  return (
    <div className="doctor-panel">
      <div className="container-fluid">
        <div className="doc-panel-inr">
          {" "}
          <Header />{" "}
        </div>
        {hodScreenRequestsLoading || hodScreenDoctorsListLoading ? (
          <div className="loader-main">
            <span className="loader"></span>
          </div>
        ) : (
          <div className="doc-panel-body">
            <div className="docpnl-sec-head">
              <h1 className="h2-title">Unavailability Management</h1>
            </div>
            {/* Add the search component for each tab */}
            {/* <div
              style={{
                display: activeTab === "upcoming" ? "block" : "none",
                marginBottom: "20px",
              }}
            >
              <HodScreenSearch
                onSearch={handleSearchDoctors}
                placeholder="Search anything here..."
                value={searchQueryDoctors}
              />
            </div>

            <div
              style={{
                display: activeTab === "completed" ? "block" : "none",
                marginBottom: "20px",
              }}
            >
              <HodScreenSearch
                onSearch={handleSearchRequests}
                placeholder="Search anything here..."
              />
            </div> */}
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
                        Doctors{" "}
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
                        Requests{" "}
                      </li>
                    </ul>
                  </div>

                  {/* <MyAppointmentsSearch
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    onSearchDate={handleSearchDate}
                    activeTab={activeTab}
                  /> */}
                  {activeTab === "upcoming" && (
                    <HodScreenSearch
                      onSearch={handleSearchDoctors}
                      placeholder="Search anything here..."
                      value={searchQueryDoctors}
                    />
                  )}
                  {activeTab === "completed" && (
                    <HodScreenSearch
                      onSearch={handleSearchRequests}
                      placeholder="Search anything here..."
                      value={searchQueryRequests}
                    />
                  )}
                </div>

                {/* Tab Content */}
                <div className="my-appointments-tab-content-wrp">
                  {/* HOD dOCTORS SCREEN */}
                  <div
                    className={`myapintmnt-content-tab ${
                      activeTab === "upcoming" ? "upcoming" : ""
                    }`}
                    style={{
                      display: activeTab === "upcoming" ? "block" : "none",
                    }}
                  >
                    <div className="myapintmnt-table tbl-large">
                      <table>
                        <thead>
                          <tr>
                            <th>S.no.</th>
                            <th style={{ width: "200px" }}>Doctor Name</th>
                            <th>Experience</th>
                            <th>phone Number</th>
                            <th>Email Address</th>
                            <th>Shift Timing</th>
                            <th>Sign Up Date</th>
                            <th>Availability Status</th>
                            <th>Upcoming Unavailability</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRequests1.length == 0 && (
                            <tr>
                              <td colSpan="8" style={{ textAlign: "center" }}>
                                {hodScreenDoctorsListLoading ? (
                                  "Loading..."
                                ) : (
                                  <span
                                    style={{ fontWeight: "400", fontSize: 18 }}
                                  >
                                    No data found
                                  </span>
                                )}
                              </td>
                            </tr>
                          )}

                          {currentRequests1.map((data, index) => (
                            <tr key={index}>
                              <td style={{ color: "#199FD9" }}>
                                {String(
                                  (currentPage1 - 1) * requestsPerPage +
                                    index +
                                    1
                                ).padStart(2, "0")}
                              </td>

                              <td
                                style={{
                                  color: "#199FD9",
                                }}
                              >
                                {data.name}
                              </td>

                              <td style={{ color: "#199FD9" }}>
                                {data.experience}
                              </td>

                              <td style={{ color: "#199FD9" }}>{data.phone}</td>

                              <td style={{ color: "#199FD9" }}>{data.email}</td>

                              <td style={{ color: "#199FD9" }}>
                                {/* {data.shiftTiming} */}
                                {formatTimeTo12Hour(data.shiftTiming)}
                              </td>
                              <td style={{ color: "#199FD9" }}>
                                {data.signupDate}
                              </td>

                              <td>
                                {data.isSuspended ? (
                                  "--"
                                ) : (
                                  <>
                                    <div className="availability-toggle1">
                                      <div className="status-text1">
                                        <span className="unavailable">
                                          Unavailable
                                        </span>
                                        <label className="toggle-label1">
                                          {/* <input type="checkbox"
                                          className="availability-switch"
                                          checked={data.hasUnavailability} onChange={() => data.hasUnavailability ? setShowConfirmUnavailability(true) : setShowConfirmAvailability(true)}
                                        /> */}
                                          <input
                                            type="checkbox"
                                            className="availability-switch"
                                            checked={
                                              !data.hasUnavailability ||
                                              (data.hasUnavailability &&
                                                !data.unavailabilities?.[0]
                                                  ?.isRunning)
                                            }
                                            onChange={() => {
                                              setCurrentDoctorId(
                                                data.doctor_id
                                              );
                                              if (!data.hasUnavailability) {
                                                setShowConfirmUnavailability(
                                                  true
                                                );
                                              } else {
                                                const isRunning =
                                                  data.unavailabilities?.[0]
                                                    ?.isRunning;
                                                if (isRunning) {
                                                  setShowConfirmAvailability(
                                                    true
                                                  );
                                                } else {
                                                  setShowConfirmUnavailability(
                                                    true
                                                  );
                                                }
                                              }
                                            }}
                                          />
                                          <span className="slider1"></span>
                                        </label>
                                        <span className="available">
                                          Available
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </td>

                              <td style={{ color: "#199FD9" }}>
                                {data.isSuspended || !data.hasUnavailability ? (
                                  "--"
                                ) : (
                                  <>
                                    <div className="tbl-inr-date-slot1">
                                      <p>From:</p>
                                      <div className="tble-inr-date">
                                        <div className="date h3-title">
                                          {
                                            data?.unavailabilities?.[0]
                                              ?.fromDate
                                          }
                                        </div>
                                        <div className="time">
                                          {
                                            data?.unavailabilities?.[0]
                                              ?.fromTime
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    <div className="tbl-inr-date-slot1">
                                      <p>To:</p>
                                      <div className="tble-inr-date">
                                        <div className="date h3-title">
                                          {data?.unavailabilities?.[0]?.toDate}
                                        </div>
                                        <div className="time">
                                          {data?.unavailabilities?.[0]?.toTime}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </td>
                              <td style={{ color: "#199FD9" }}>
                                {data.isSuspended || !data.hasUnavailability
                                  ? "--"
                                  : data?.unavailabilities?.[0]?.type}
                              </td>
                              <td style={{ color: "#199FD9" }}>
                                {data.isSuspended || !data.hasUnavailability
                                  ? "--"
                                  : data?.unavailabilities?.[0]?.status}
                              </td>
                              <td style={{ color: "#199FD9" }}>
                                {/* {data.isSuspended || !data.hasUnavailability
                                  ? "--"
                                  : data?.unavailabilities?.[0]?.reason} */}
                                {data.isSuspended || !data.hasUnavailability ? (
                                  "--"
                                ) : (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        data?.unavailabilities?.[0]?.reason.replace(
                                          /(.{20})/g,
                                          "$1<br/>"
                                        ),
                                    }}
                                  />
                                )}
                              </td>
                            </tr>
                          ))}

                          {/* <td>01</td>
                          <td>Akash Gupta</td>
                          <td>13 Years</td>
                          <td>1234567890</td>
                          <td>dr.akash@gmail.com</td>
                          <td>09:00-18:00</td>
                          <td>15/07/2025</td>
                          <td>
                            <div className="availability-toggle1">
                              <div className="status-text1">
                                <span className="unavailable">Unavailable</span>
                                <label className="toggle-label1">
                                  <input type="checkbox"
                                    className="availability-switch"
                                    checked={true} onChange={() => true ? setShowConfirmUnavailability(true) : setShowConfirmAvailability(false)}
                                  />
                                  <span className="slider1"></span>
                                </label>
                                <span className="available">Available</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            
                            <div className="tbl-inr-date-slot1">
                              <p>From:</p>
                              <div className="tble-inr-date">
                                <div className="date h3-title">15/07/2025</div>
                                <div className="time">3:00pm</div>
                              </div>
                            </div>
                            <div className="tbl-inr-date-slot1">
                              <p>To:</p>
                              <div className="tble-inr-date">
                                <div className="date h3-title">16/07/2025</div>
                                <div className="time">4:00pm</div>
                              </div>
                            </div>
                            
                          </td>
                          <td>Planned</td>
                          <td>Pending</td>
                          <td>Reason is this....</td> */}
                        </tbody>
                      </table>
                    </div>
                    {currentData1.length > 0 && (
                      <Pagination
                        currentPage={currentPage1}
                        totalPages={totalPages1}
                        onPageChange={handlePageChange1}
                        onPrevious={prevPage1}
                        onNext={nextPage1}
                      />
                    )}
                  </div>

                  {/* REQUESTS Tab */}
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
                            <th style={{ width: "200px" }}>Doctor Name</th>
                            <th>Applied On</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Reason</th>
                            <th>Total Time</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRequests.length == 0 && (
                            <tr>
                              <td colSpan="8" style={{ textAlign: "center" }}>
                                {hodScreenRequestsLoading ? (
                                  "Loading..."
                                ) : (
                                  <span
                                    style={{ fontWeight: "400", fontSize: 18 }}
                                  >
                                    No data found
                                  </span>
                                )}
                              </td>
                            </tr>
                          )}
                          {currentRequests.map((data, index) => (
                            <tr key={index}>
                              <td style={{ color: "#199FD9" }}>
                                {String(
                                  (currentPage - 1) * requestsPerPage +
                                    index +
                                    1
                                ).padStart(2, "0")}
                              </td>

                              <td
                                style={{
                                  // textAlign: "left",
                                  // maxWidth: "287px",
                                  // paddingLeft: "165px",
                                  color: "#199FD9",
                                }}
                              >
                                {data.doctorName}
                              </td>
                              <td
                                style={{
                                  textAlign: "left",
                                  maxWidth: "287px",
                                  // paddingLeft: "165px",
                                  color: "#199FD9",
                                }}
                              >
                                {data.appliedOn}
                              </td>

                              <td>
                                <div
                                  className="date"
                                  style={{ color: "#199FD9" }}
                                >
                                  {/* {formatDate(data.date)} */}
                                  {data.fromDate}
                                </div>

                                <div
                                  className="time"
                                  style={{ color: "#199FD9" }}
                                >
                                  {data.fromTime}
                                </div>
                              </td>

                              <td>
                                <div
                                  className="date"
                                  style={{ color: "#199FD9" }}
                                >
                                  {/* {formatDate(data.date)} */}
                                  {data.toDate}
                                </div>

                                <div
                                  className="time"
                                  style={{ color: "#199FD9" }}
                                >
                                  {data.toTime}
                                </div>
                              </td>

                              <td style={{ color: "#199FD9" }}>{data.type}</td>
                              <td style={{ color: "#199FD9" }}>
                                {data.status}
                              </td>
                              <td style={{ color: "#199FD9" }}>
                                {/* {data.reason} */}
                                {/* {data.reason.length > 6 ? data.reason.substring(0, 6) + "..." : data.reason} */}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: data.reason.replace(
                                      /(.{20})/g,
                                      "$1<br/>"
                                    ),
                                  }}
                                />
                              </td>
                              <td style={{ color: "#199FD9" }}>
                                {data.timePeriod}
                              </td>
                              <td style={{ color: "#199FD9" }}>
                                {/* <div className="mb-4 text-right" style={{border:"2px solid red"}}> */}
                                {data.status === "Approved" &&
                                data.type === "Emergency" ? (
                                  data?.emergency_status ? (
                                    "Approved"
                                  ) : (
                                    <Button
                                      style={{ backgroundColor: "#199FD9" }}
                                      className="border-0 px-6 rounded-lg shadow-md text-white flex items-center gap-2"
                                      onClick={() =>
                                        handleConfirmClick(
                                          data.unavailability_id
                                        )
                                      }
                                    >
                                      {hodRequestsConfirmButtonLoading
                                        ? "Confirming.."
                                        : "Confirm"}
                                      {/* Confirm */}
                                    </Button>
                                  )
                                ) : data.status == "Approved" &&
                                  !data.approvalRequired ? (
                                  "Approved"
                                ) : data.status == "Rejected" &&
                                  !data.approvalRequired ? (
                                  "Rejected"
                                ) : data.status === "Pending" ? (
                                  <>
                                    <div
                                      style={{ display: "flex", gap: "4px" }}
                                    >
                                      <Button
                                        style={{
                                          backgroundColor: "#28a745",
                                          marginRight: "8px",
                                        }}
                                        className="border-0 px-4 rounded-lg shadow-md text-white flex items-center gap-2"
                                        onClick={() =>
                                          handleApproveClick(
                                            data.unavailability_id,
                                            "approved"
                                          )
                                        }
                                      >
                                        {hodRequestsRespondButtonLoading
                                          ? "Approving.."
                                          : "Approve"}
                                        {/* Approve */}
                                      </Button>
                                      <Button
                                        style={{ backgroundColor: "#dc3545" }}
                                        className="border-0 px-4 rounded-lg shadow-md text-white flex items-center gap-2"
                                        onClick={() =>
                                          handleDeclineClick(
                                            data.unavailability_id,
                                            "rejected"
                                          )
                                        }
                                      >
                                        {hodRequestsRespondButtonLoading
                                          ? "Declining.."
                                          : "Decline"}
                                        {/* Decline */}
                                      </Button>
                                    </div>
                                  </>
                                ) : null}
                                {/* </div> */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {currentData.length > 0 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onPrevious={prevPage}
                        onNext={nextPage}
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

      {/* Confirm Unavailability Modal */}
      <Modal
        show={showConfirmUnavailability}
        onHide={() => setShowConfirmUnavailability(false)}
        className="popup-wrp1 p-dcrse1"
      >
        <Modal.Body>
          <button
            type="button"
            className="close1"
            onClick={() => setShowConfirmUnavailability(false)}
          >
            <span aria-hidden="true">
              <img src="./images/cross-blue.png" alt="Icon" />
            </span>
          </button>
          <div className="modal-icon1">
            <img src="./images/suspend-icon.svg" alt="Icon" />
          </div>
          <div className="modal-header1 mb-4">
            <h2>Confirm Unavailability</h2>
            <p className="m-0">
              Are you sure you want to mark this doctor as unavailable?
            </p>
            <div className="note">
              <strong>Note:</strong> All appointments scheduled till the
              selected end time will be canceled and reassigned to other
              available doctors.
            </div>
          </div>
          <div className="modal-body">
            <div className="unavailability-form">
              <form id="unavailabilityForm">
                <div className="unavailability-form-inr1">
                  <div className="formfield">
                    <label htmlFor="unavailability-start-date">From</label>
                    <div className="cstm-input-lbl1">
                      {/* <span>Start Date</span> */}
                      <input
                        type="date"
                        id="unavailability-start-date"
                        name="startDate"
                        value={unavailabilityData.startDate}
                        onChange={handleInputChange}
                        placeholder="Start Date"
                        // min={new Date().toISOString().split('T')[0]} // Disable past dates
                      />
                    </div>
                  </div>
                  <div className="formfield">
                    <label htmlFor="unavailability-end-date">To</label>
                    <div className="cstm-input-lbl1">
                      {/* <span>End Date</span> */}
                      <input
                        type="date"
                        id="unavailability-end-date"
                        name="endDate"
                        value={unavailabilityData.endDate}
                        onChange={handleInputChange}
                        // min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="formfield">
                    <div className="cstm-input-lbl1">
                      {/* <span>Start Time</span> */}
                      <input
                        type="time"
                        id="unavailability-start-time"
                        name="startTime"
                        value={unavailabilityData.startTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="formfield">
                    <div className="cstm-input-lbl1">
                      {/* <span>End Time</span> */}
                      <input
                        type="time"
                        id="unavailability-end-time"
                        name="endTime"
                        value={unavailabilityData.endTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="formfield w-100">
                    <label htmlFor="unavailability-reason">Reason</label>
                    <div className="cstm-input-lbl1">
                      <input
                        type="text"
                        id="unavailability-reason"
                        name="reason"
                        value={unavailabilityData.reason}
                        onChange={handleInputChange}
                        placeholder="Enter reason for unavailability"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="btn-wrp1">
                  <button
                    type="submit"
                    id="confirmUnavailabilityBtn"
                    className="cmn-btn1"
                    onClick={handleUnavailabilitySubmitByHod}
                    disabled={markDoctorAvailableLoading}
                  >
                    {markDoctorAvailableLoading ? "Processing..." : "Confirm"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmUnavailability(false)}
                    className="cmn-btn1"
                    disabled={markDoctorAvailableLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Confirm Availability Modal */}
      <Modal
        show={showConfirmAvailability}
        onHide={() => setShowConfirmAvailability(false)}
        className="popup-wrp1"
      >
        <Modal.Body>
          <button
            type="button"
            className="close1"
            onClick={() => setShowConfirmAvailability(false)}
          >
            <span aria-hidden="true">
              <img src="./images/cross-blue.png" alt="Icon" />
            </span>
          </button>
          <div className="modal-icon1">
            <img src="./images/check-icon-blue.svg" alt="Icon" />
          </div>
          <div className="modal-header1">
            <h2>Confirm Availability</h2>
            <p className="m-0">
              Are you sure you want to mark this doctor as available?
            </p>
            <div className="note">
              Note: Patients can now book appointments with this doctor, and any
              previous restrictions will be lifted.
            </div>
          </div>
          <div className="modal-footer1 btn-wrp1">
            <button
              type="submit"
              id="confirmAvailabilityBtn"
              className="cmn-btn1"
              onClick={() => markDoctorAvailableFunc(currentDoctorId)}
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmAvailability(false)}
              id="cancelAvailabilityBtn"
              className="cmn-btn1"
            >
              Cancel
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Hod;
