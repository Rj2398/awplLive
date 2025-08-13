import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addDays } from "date-fns";
import {
  doctorUnavailability,
  unavailabilityRequest,
} from "../redux/slices/patientProfileSlice";
import Pagination from "../component/Pagination";
import { FaPen, FaRegPlusSquare } from "react-icons/fa";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import HodScreenSearch from "../component/HodScreenSearch";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import baseUrl from "../config/BaseUrl";

const doctorUnavailibility = () => {
  // const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const {
    doctorUnavailabilityList,
    doctorUnavailabilityLoading,
    unavailabilityrequest,
    unavailabilityLoading,
    error,
  } = useSelector((state) => state.patientProfile);

  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [requestType, setRequestType] = useState("");
  // const [totalTime, setTotalTime] = useState("00:00:00");
  const [reason, setReason] = useState("");

  // search functionality
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
    setCurrentPage(1); // Reset to first page when searching
  };

  const filterRequests = (request) => {
    if (!searchQuery) return true;
    return (
      request.appliedOn?.toLowerCase().includes(searchQuery) ||
      request.fromDate?.toLowerCase().includes(searchQuery) ||
      request.fromTime?.toLowerCase().includes(searchQuery) ||
      request.toDate?.toLowerCase().includes(searchQuery) ||
      request.toTime?.toLowerCase().includes(searchQuery) ||
      request.timePeriod?.toLowerCase().includes(searchQuery) ||
      request.reason?.toLowerCase().includes(searchQuery) ||
      request.type?.toLowerCase().includes(searchQuery) ||
      request.status?.toLowerCase().includes(searchQuery)
    );
  };
  // search functionality

  // Calculate total time
  // useEffect(() => {
  //     if (fromDate && toDate && toDate > fromDate) {
  //         const diff = toDate - fromDate;
  //         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  //         const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  //         const minutes = Math.floor((diff / (1000 * 60)) % 60);

  //         const dayUI = days === 1 ? "day" : "days";
  //         const hourUI = hours === 1 ? "hour" : "hours";
  //         const minuteUI = minutes === 1 ? "minute" : "minutes";

  //         const formatted = `${String(days).padStart(2, "0")} ${dayUI} : ${String(
  //             hours
  //         ).padStart(2, "0")} ${hourUI} : ${String(minutes).padStart(2, "0")} ${minuteUI}`;

  //         setTotalTime(formatted);
  //     } else {
  //         setTotalTime("00 days : 00 hours : 00 minutes");
  //     }
  //     }, [fromDate, toDate]);

  const formatDateTimeForAPI = (dateObj) => {
    if (!dateObj) return null;

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSendRequest = () => {
    if (!fromDate || !toDate || !requestType || !reason.trim()) {
      toast.error("Please fill all fields!");
      return;
    }

    const payload = {
      from_datetime: formatDateTimeForAPI(fromDate),
      to_datetime: formatDateTimeForAPI(toDate),
      type: requestType,
      reason: reason,
    };

    // console.log("submitting request:", payload);

    setShowModal(false);

    dispatch(unavailabilityRequest(payload))
      .then((action) => {
        if (action.payload?.status) {
          toast.success(action.payload.message);
          dispatch(doctorUnavailability()); // Refresh the list
        } else {
          toast.error(action.payload?.message);
        }
      })
      .catch((error) => {
        toast.error("An error occurred while Confirming for doctor's leave");
      });
    setShowModal(false);
    setFromDate(null);
    setToDate(null);
    setRequestType("");
    setReason("");
  };

  const handleCancel = () => {
    setShowModal(false);
    setFromDate(null);
    setToDate(null);
    setRequestType("");
    setReason("");
    // setTotalTime("00:00:00");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  // Fetch pending prescription on component mount
  // useEffect(() => {
  //     dispatch(doctorPendingPrescriptions());
  // }, [dispatch]);

  //fetching doctorUnavailabilityList

  useEffect(() => {
    dispatch(doctorUnavailability({ search: searchQuery }));
  }, [dispatch, searchQuery]);

  // const currentData = doctorUnavailabilityList || [];
  const currentData = doctorUnavailabilityList?.filter(filterRequests) || [];
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

  {
    // console.log(
    //   doctorUnavailabilityList,
    //   "doctorUnavailabilityList@@@@@@@@@@@@"
    // );
  }

  return (
    <>
      <main className="doctor-panel">
        <div className="container-fluid">
          <div className="doc-panel-inr">
            <Header />
          </div>
          {unavailabilityLoading ? (
            <div className="loader-main">
              <span className="loader"></span>
            </div>
          ) : (
            <div className="doc-panel-body">
              <div
                className="docpnl-sec-head"
                style={{ display: "flex", alignItems: "center" }}
              >
                <h1 className="h2-title">Mark Unavailability</h1>
                <div
                  style={{
                    display: "flex",
                    // alignItems: "center",
                    justifyContent: "right",
                    width: "50%",
                    gap: "10px",
                  }}
                >
                  <div style={{ width: "40%", borderRadius: "10px" }}>
                    <HodScreenSearch
                      onSearch={handleSearch}
                      placeholder="Search anything here..."
                    />
                  </div>

                  <div className="mb-4 text-right">
                    <Button
                      onClick={() => setShowModal(true)}
                      style={{ backgroundColor: "#F47820" }}
                      className="border-0 px-6 py-2 rounded-lg shadow-md text-white flex items-center gap-2 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75"
                    >
                      <FaRegPlusSquare
                        style={{ marginBottom: 5, marginRight: 5 }}
                      />
                      Add Request
                    </Button>
                  </div>
                </div>

                {/* <div className="mb-4 text-right">
                                    <Button
                                        onClick={() => setShowModal(true)}
                                        style={{ backgroundColor: "#F47820" }}
                                        className="border-0 px-6 py-2 rounded-lg shadow-md text-white flex items-center gap-2 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75"
                                    >
                                        <FaRegPlusSquare style={{ marginBottom: 5, marginRight: 5 }} />
                                        Add Request
                                    </Button>
                                </div> */}
              </div>

              {/* <div className="past-patient-filter-wrp past-patient-pg">
                            <button type="button" >
                                Filter <img src="./images/filter-icon.svg" alt="Filter" />
                            </button>
                            </div> */}

              <div className="pending-prescriptions-wrp">
                <div className="my-appointments-inr">
                  {/* {activeTab === 'pending' && ( */}
                  <div className="myapintmnt-content-tab pending">
                    <div className="pending-presc-table">
                      <table>
                        <thead>
                          <tr>
                            <th>S.no.</th>
                            <th>Applied On</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Total Time</th>
                            <th>Reason</th>
                            <th>Type</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRequests.length == 0 && (
                            <tr>
                              <td colSpan="8" style={{ textAlign: "center" }}>
                                {doctorUnavailabilityLoading ? (
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
                              <td style={{ fontSize: 20, color: "#199FD9" }}>
                                {String(
                                  (currentPage - 1) * requestsPerPage +
                                    index +
                                    1
                                ).padStart(2, "0")}
                              </td>

                              <td
                                style={{
                                  textAlign: "left",
                                  maxWidth: "287px",
                                  paddingLeft: "165px",
                                  color: "#199FD9",
                                }}
                              >
                                {data.appliedOn}
                              </td>

                              <td>
                                <div
                                  className="date"
                                  style={{ color: "#199FD9", fontSize: 20 }}
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
                                  style={{ color: "#199FD9", fontSize: 20 }}
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

                              <td style={{ color: "#199FD9" }}>
                                {data.timePeriod}
                              </td>
                              <td style={{ color: "#199FD9" }}>
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
                                {/* <div className="mb-4 text-right">
                                    <Button
                                        style={{ backgroundColor: "#199FD9" }}
                                        className="border-0 px-6 rounded-lg shadow-md text-white flex items-center gap-2"
                                    >
                                       
                                        Pending
                                    </Button>
                                </div> */}
                                {data.type}
                              </td>
                              <td style={{ color: "#199FD9" }}>
                                {data.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
          )}

          <Modal show={showModal} onHide={handleCancel} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add Unavailability Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Applied For:</Form.Label>
                  <div className="d-flex gap-2">
                    {/* <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      showTimeSelect
                      // timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="From"
                      className="form-control"
                    />
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      showTimeSelect
                      // timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="To"
                      className="form-control"
                    /> */}

                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      showTimeSelect
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="From"
                      className="form-control"
                      minDate={new Date()} // Disables dates before today
                    />

                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      showTimeSelect
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="To"
                      className="form-control"
                      minDate={fromDate || new Date()} // Can't select before fromDate or today
                    />
                  </div>
                </Form.Group>

                {/* <Form.Group className="mb-3">
                                    <Form.Label>Total Time</Form.Label>
                                    <Form.Control type="text" value={totalTime} readOnly />
                                </Form.Group> */}

                <Form.Group className="mb-3">
                  <Form.Label>Request Type</Form.Label>
                  <Form.Select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                  >
                    <option value="">Select Request Type</option>
                    <option value="emergency">Emergency</option>
                    <option value="planned">Planned</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Reason</Form.Label>
                  <Form.Control
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason..."
                    // maxLength={50}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSendRequest}
                disabled={unavailabilityLoading}
              >
                {unavailabilityLoading ? "Sending..." : "Send"}
              </Button>
            </Modal.Footer>
          </Modal>

          <Footer />
        </div>
      </main>
    </>
  );
};

export default doctorUnavailibility;
