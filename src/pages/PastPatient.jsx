import React, { useState, useEffect } from "react";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";
import { Link } from "react-router-dom";
import Pagination from "../component/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { pastPatient } from "../redux/slices/dataSlice";
import baseUrl from "../config/BaseUrl";

const PastPatient = () => {
  // const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const { pastPatients, loading, error, patient_id } = useSelector(
    (state) => state.userdata
  );
  const dispatch = useDispatch();

  const itemsPerPage = 4;

  const [patients, setPatients] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    age: "",
    dscode: "",
    disease: "",
  });
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [diseaseOptions, setDiseaseOptions] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    dispatch(pastPatient());
  }, [dispatch]);

  useEffect(() => {
    setPatients(pastPatients);
    setAllPatients(pastPatients);
    const uniqueDiseases = [
      ...new Set(
        pastPatients
          .map((p) => p.latestDisease)
          .filter(
            (disease) =>
              disease && disease.trim() !== "" && disease.trim() !== "-"
          )
      ),
    ];
    setDiseaseOptions(uniqueDiseases);
  }, [pastPatients]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilters(prev => ({ ...prev, [name]: value }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      // Only allow letters and spaces (no numbers or special characters)
      const filteredValue = value.replace(/[^A-Za-z\s]/g, "");
      setFilters((prev) => ({ ...prev, [name]: filteredValue }));
    } else if (name === "age") {
      // Only allow numbers (0-9) and enforce 2-digit limit
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        // if (
        //   value === "" ||
        //   (parseInt(value, 10) >= 0 &&
        //     parseInt(value, 10) <= 99 &&
        //     value.length <= 2)
        // ) {
        setFilters((prev) => ({ ...prev, [name]: value }));
        // }
      }
    } else if (name === "dscode") {
      setFilters((prev) => ({ ...prev, [name]: value }));
    } else {
      // Default behavior for other fields (e.g., diagnosis)
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === "age") {
  //     // Age validation logic (as before)
  //     if (value === "" || /^\d+$/.test(value)) {
  //       setFilters((prevFilters) => ({
  //         ...prevFilters,
  //         [name]: value,
  //       }));

  //       if (value !== "") {
  //         const ageNum = parseInt(value, 10);
  //         if (ageNum < 12 || ageNum > 120) {
  //           setAgeError("Age must be between 12 and 120.");
  //         } else {
  //           setAgeError("");
  //         }
  //       } else {
  //         setAgeError("");
  //       }
  //     }
  //   } else if (name === "name") {
  //     // Name validation logic: Only allow letters and spaces
  //     // Regex /^[A-Za-z\s]*$/ matches zero or more letters (uppercase/lowercase) or spaces
  //     if (/^[A-Za-z\s]*$/.test(value)) {
  //       setFilters((prevFilters) => ({
  //         ...prevFilters,
  //         [name]: value,
  //       }));
  //       setNameError(""); // Clear error if valid input
  //     } else {
  //       // If invalid character is typed, set error and prevent updating state for that character
  //       setNameError("Name can only contain letters and spaces.");
  //     }
  //   } else {
  //     // For any other input fields, just update the state
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       [name]: value,
  //     }));
  //   }
  // };

  const totalPages = Math.ceil(patients.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // const handleApplyFilter = (e) => {
  //   e.preventDefault();
  //   const filtered = patients.filter((patient) => {
  //     const nameMatch = patient.name.toLowerCase().includes(filters.name.toLowerCase());
  //     const ageMatch = filters.age ? patient.age === parseInt(filters.age) : true;
  //     const diseaseMatch = filters.disease ? patient.disease.toLowerCase() === filters.disease.toLowerCase() : true;
  //     return nameMatch && ageMatch && diseaseMatch;
  //   });
  //   setPatients(filtered);
  //   setShowFilter(false);
  // };

  const handleApplyFilter = () => {
    const formData = new FormData();
    if (filters.name) formData.append("patient_name", filters.name);
    if (filters.age) formData.append("age", filters.age);
    if (filters.dscode) formData.append("ds_code", filters.dscode);
    if (filters.disease) formData.append("disease", filters.disease);
    dispatch(pastPatient(formData));
    setShowFilter(false);
  };

  const handleClearFilter = (e) => {
    e.preventDefault();
    setFilters({ name: "", age: "", dscode: "", disease: "" });

    // 🔁 API call bina filter ke to get original data
    const formData = new FormData(); // empty formData
    dispatch(pastPatient(formData)); // ✅ redux update karega
    setShowFilter(false);
  };

  const toggleFilterDropdown = () => {
    setShowFilter((prev) => {
      // console.log("Toggling filter dropdown. Current value:", prev);
      return !prev;
    });
  };

  // Get unique patient names with DS codes from past patients
  const getPatientSuggestions = () => {
    const uniquePatients = [];
    const seenNames = new Set();

    if (pastPatients) {
      pastPatients.forEach((patient) => {
        if (
          patient.patient_name &&
          !seenNames.has(patient.patient_name.toLowerCase())
        ) {
          seenNames.add(patient.patient_name.toLowerCase());
          uniquePatients.push({
            name: patient.patient_name,
            dsCode: patient.ds_code || "",
          });
        }
      });
    }

    return uniquePatients;
  };

  const patientSuggestions = getPatientSuggestions();

  // Filter suggestions based on input
  const filteredSuggestions = filters.name
    ? patientSuggestions.filter((patient) =>
        patient.name.toLowerCase().includes(filters.name.toLowerCase())
      )
    : patientSuggestions;

  const handleSuggestionClick = (patient) => {
    setFilters((prev) => ({
      ...prev,
      name: patient.name,
    }));
    setShowSuggestions(false);
  };

  const PastPatientCard = ({ patient }) => (
    <div className="col-lg-6 col-md-6">
      <div className="past-patient-detail-card">
        <div className="past-patient-cd-img">
          {/* {patient.id === 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '155px',
              border: '1px solid #199FD9',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <img src='./images/client-img-5.png' alt="User" />
            </div>
          ) : ( */}
          {patient.referred_by_patient_name ? (
            <img
              src="./images/referredProfile.png"
              alt="referred patient"
              style={{ border: "1px solid #199FD9" }}
            />
          ) : (
            <img src={`${baseUrl}/${patient.patient_profile}`} alt="Client" />
          )}
          {/* <img src={`${baseUrl}/${patient.patient_profile}`} alt="Client" /> */}
          {/* // )} */}
        </div>
        <div className="p-patient-card-content">
          <div className="p-patient-cd-head">
            <h3>{patient?.patient_name}</h3>
            {patient.referred_by_patient_name ? (
              // <p>Referred by {patient.referred_by_patient_name}</p>

              <p>
                <span style={{ color: "black" }}>Referred by </span>
                {/* <span style={{ color: "#199FD9" }}>{patient.ds_code}</span> */}
                <span style={{ color: "#199FD9" }}>
                  {patient.referred_by_patient_name}
                </span>
              </p>
            ) : (
              // <p>DS Code: {patient.ds_code}</p>

              <p>
                <span style={{ color: "black" }}>DS Code: </span>
                <span style={{ color: "#199FD9" }}>{patient.ds_code}</span>
              </p>
            )}
          </div>
          <div className="p-patient-cd-body">
            <div className="p-patient-dtl-wrp">
              <strong className="p-patient-dtl">Age: {patient.age}</strong>
              {/* <strong className="p-patient-dtl">Gender: {patient.gender}</strong> */}
              <strong className="p-patient-dtl">
                Gender:{" "}
                {patient.gender?.charAt(0).toUpperCase() +
                  patient.gender?.slice(1).toLowerCase()}
              </strong>
            </div>
            <div className="p-patient-disease">
              <b>Latest Disease: {patient.latestDisease}</b>
            </div>
            <Link
              to="/patient-profile"
              state={{ patientId: patient.patient_id }}
              className="orange-btn"
            >
              View full details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main
      className="doctor-panel"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div className="container-fluid" style={{ flex: 1 }}>
        <div className="doc-panel-inr">
          <Header />
        </div>
        {loading ? (
          <div className="loader-main">
            <span className="loader"></span>
          </div>
        ) : (
          <div className="doc-panel-body pp-list-pg">
            <div className="docpnl-sec-head text-center">
              <h1 className="h2-title">My Past Patients</h1>
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

              <div className="past-patient-filter-wrp past-patient-pg">
                <button type="button" onClick={toggleFilterDropdown}>
                  Filter <img src="./images/filter-icon.svg" alt="Filter" />
                </button>

                <div
                  className={`filter-options-drpdn ${
                    showFilter ? "active" : ""
                  }`}
                >
                  <form>
                    <div className="filter-form">
                      {/* <div className="filter-grp">
                        <label>Patient Name</label>
                        
                        <input
                          type="text"
                          name="name"
                          value={filters.name}
                          onChange={handleInputChange}
                          placeholder="Patient Name"
                          pattern="[A-Za-z\s]+"  // HTML5 validation (optional)
                          title="Only letters and spaces allowed"  // Error message (optional)
                        />
                      </div> */}

                      <div className="filter-grp">
                        <label>Patient Name</label>
                        <div
                          className="suggestion-container"
                          style={{ position: "relative" }}
                        >
                          <input
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleInputChange}
                            placeholder="Patient Name"
                            pattern="[A-Za-z\s]+"
                            title="Only letters and spaces allowed"
                            autoComplete="off"
                            onFocus={() => {
                              setInputFocused(true);
                              if (filters.name) setShowSuggestions(true);
                            }}
                            onBlur={() => {
                              setTimeout(() => {
                                setInputFocused(false);
                                setShowSuggestions(false);
                              }, 200);
                            }}
                          />
                          {(showSuggestions || inputFocused) &&
                            filteredSuggestions.length > 0 && (
                              <ul
                                className="suggestions-dropdown"
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: 0,
                                  right: 0,
                                  backgroundColor: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "4px",
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                  zIndex: 1000,
                                  marginTop: "5px",
                                  padding: 0,
                                  listStyle: "none",
                                }}
                              >
                                {filteredSuggestions.map((patient, index) => (
                                  <li
                                    key={index}
                                    onClick={() =>
                                      handleSuggestionClick(patient)
                                    }
                                    style={{
                                      padding: "8px 12px",
                                      cursor: "pointer",
                                      borderBottom: "1px solid #eee",
                                      display: "flex",
                                      flexDirection: "column",
                                      textAlign: "left",
                                    }}
                                  >
                                    <div>{patient.name}</div>
                                    {patient.dsCode && (
                                      <div
                                        style={{
                                          color: "#199fd9",
                                          fontSize: "0.8em",
                                        }}
                                      >
                                        (DS Code: {patient.dsCode})
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                        {/* {nameError && (
                          <p style={{ color: "red", fontSize: "0.85em" }}>
                            {nameError}
                          </p>
                        )} */}
                      </div>
                      <div className="filter-grp">
                        <label>Age</label>
                        {/* <input
                          type="text"
                          name="age"
                          value={filters.age}
                          onChange={handleInputChange}
                          placeholder="Age"
                          maxLength={2}
                          // inputMode="numeric"
                          pattern="[0-9]*" // Helps with mobile numeric keyboard
                        /> */}

                        <input
                          id="age"
                          type="text"
                          name="age"
                          value={filters.age}
                          onChange={handleInputChange}
                          placeholder="Age"
                          // maxLength={3} // Changed to 3 to allow 120
                          pattern="[0-9]*"
                          inputMode="numeric"
                        />
                      </div>
                      {/* // add new thing , search by dscode  */}
                      <div className="filter-grp">
                        <label>DS Code</label>

                        <input
                          id="dscode"
                          type="text"
                          name="dscode"
                          value={filters.dscode}
                          onChange={handleInputChange}
                          placeholder="DS Code"
                          // pattern="[0-9]*"
                          // inputMode="numeric"
                        />
                      </div>

                      <div className="filter-grp">
                        <label>Disease</label>
                        <select
                          name="disease"
                          value={filters.disease}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>
                            Disease
                          </option>
                          {diseaseOptions.map((disease, index) => (
                            <option key={index} value={disease}>
                              {disease}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="filter-form-btn-wrp">
                      <button
                        type="button"
                        className="orange-btn"
                        onClick={handleClearFilter}
                        style={{ borderRadius: 0 }}
                      >
                        Clear Filter
                      </button>
                      <button
                        type="button"
                        className="orange-btn"
                        onClick={handleApplyFilter}
                        style={{ borderRadius: 0 }}
                      >
                        Apply Filter
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="past-patients-list-wrp">
              <div className="row">
                {patients.length == 0 ? (
                  <h3
                    style={{
                      textAlign: "center",
                      padding: "25px 0",
                      fontWeight: "bold",
                      color: "#356598",
                      fontSize: 18,
                    }}
                  >
                    No data found
                  </h3>
                ) : (
                  patients
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((patient) => (
                      <PastPatientCard key={patient.id} patient={patient} />
                    ))
                )}
              </div>
            </div>
            {patients.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            )}
          </div>
        )}

        <Footer />
      </div>
    </main>
  );
};

export default PastPatient;
