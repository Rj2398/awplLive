import { useState, useEffect } from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
import { useDispatch, useSelector } from "react-redux";
import baseUrl from "../config/BaseUrl";

const MyAppointmentsSearch = ({
  onFilterChange,
  onSearch,
  activeTab,
  onSearchDate,
}) => {
  const [patientName, setPatientName] = useState("");

  const [patients, setPatients] = useState([]);
  const [age, setAge] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [diagnosisOptions, setDiagnosisOptions] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    age: "",
    dscode: "",
    diagnosis: "",
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectingFromDate, setSelectingFromDate] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const dispatch = useDispatch();
  const { completedAppointment } = useSelector((state) => state.appointments);
  // const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Reset the state when the component is mounted
  useEffect(() => {
    resetForm();
  }, []);

  useEffect(() => {
    // Reset calendar and filters when tab changes
    resetForm();
    onSearchDate(null); // Clear any date filtering
    onFilterChange({ name: "", age: "", dscode: "", diagnosis: "" }); // Clear other filters
  }, [activeTab]);

  useEffect(() => {
    if (completedAppointment && completedAppointment.length > 0) {
      const uniqueDiagnoses = [
        ...new Set(
          completedAppointment
            .map((appt) => appt.diagnosis)
            .filter(
              (diagnosis) =>
                diagnosis && diagnosis.trim() !== "" && diagnosis.trim() !== "-"
            )
        ),
      ];
      setDiagnosisOptions(uniqueDiagnoses);
    }
  }, [completedAppointment]);

  const resetForm = () => {
    setPatientName("");
    setAge("");
    setFilters({ name: "", age: "", diagnosis: "" });
    setShowFilter(false);
    setFromDate("");
    setToDate("");
    setShowCalendar(false);
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
    setSearchQuery("");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

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

  // const [ageError, setAgeError] = useState("");

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

  const handleFilterToggle = () => {
    setShowFilter((prev) => !prev);
  };

  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // const renderCalendar = () => {
  //   const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  //   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  //   const weeks = [];
  //   let days = [];

  //   // Add empty cells for days before the first day of the month
  //   for (let i = 0; i < firstDay; i++) {
  //     days.push(<td key={`empty-${i}`} className="empty-cell"></td>);
  //   }

  //   // Add cells for each day of the month
  //   for (let day = 1; day <= daysInMonth; day++) {
  //     const isSelectedFrom = fromDate && fromDate.startsWith(`${day}/${currentMonth + 1}`);
  //     const isSelectedTo = toDate && toDate.startsWith(`${day}/${currentMonth + 1}`);

  //     days.push(
  //       <td
  //         key={`day-${day}`}
  //         className={`calendar-day ${isSelectedFrom ? 'selected-from' : ''} ${isSelectedTo ? 'selected-to' : ''}`}
  //         onClick={() => handleDateSelection(day)}
  //       >
  //         {day}
  //       </td>
  //     );

  //     // Start a new row after Saturday or at the end of the month
  //     if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
  //       weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);
  //       days = [];
  //     }
  //   }

  //   return weeks;
  // };

  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const weeks = [];
    let days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="empty-cell"></td>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelectedFrom =
        fromDate && fromDate.startsWith(`${day}/${currentMonth + 1}`);
      const isSelectedTo =
        toDate && toDate.startsWith(`${day}/${currentMonth + 1}`);

      // Check if this date is before from date when selecting to date
      let isDisabled = false;
      if (!selectingFromDate && fromDate) {
        const fromParts = fromDate.split("/");
        const fromDateObj = new Date(
          fromParts[2],
          fromParts[1] - 1,
          fromParts[0]
        );
        const currentDateObj = new Date(currentYear, currentMonth, day);
        isDisabled = currentDateObj <= fromDateObj;
      }

      days.push(
        <td
          key={`day-${day}`}
          className={`calendar-day 
            ${isSelectedFrom ? "selected-from" : ""} 
            ${isSelectedTo ? "selected-to" : ""}
            ${isDisabled ? "disabled-day" : ""}`}
          onClick={() => !isDisabled && handleDateSelection(day)}
          style={isDisabled ? { color: "#ccc", cursor: "not-allowed" } : {}}
        >
          {day}
        </td>
      );

      // Start a new row after Saturday or at the end of the month
      if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
        weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);
        days = [];
      }
    }

    return weeks;
  };

  const handleSelectDate = (e) => {
    const value = e.target.value;
    setSearchDate(value);
    if (onSearchDate) {
      onSearchDate(value);
    }
  };

  // const handleDateSelection = (day) => {
  //   const selectedDate = `${day}/${currentMonth + 1}/${currentYear}`;

  //   if (selectingFromDate) {
  //     setFromDate(selectedDate);
  //     setSelectingFromDate(false);
  //   } else {
  //     setToDate(selectedDate);
  //     // Removed the auto-apply logic from here
  //   }
  // };

  const handleDateSelection = (day) => {
    const selectedDate = `${day}/${currentMonth + 1}/${currentYear}`;

    if (selectingFromDate) {
      // When selecting from date, just set it
      setFromDate(selectedDate);
      setSelectingFromDate(false);
      // Clear any existing to date if it's now invalid
      if (toDate) {
        const toParts = toDate.split("/");
        const toDateObj = new Date(toParts[2], toParts[1] - 1, toParts[0]);
        const newFromDateObj = new Date(currentYear, currentMonth, day);

        if (toDateObj <= newFromDateObj) {
          setToDate("");
        }
      }
    } else {
      // When selecting to date, validate it's after from date
      const fromParts = fromDate.split("/");
      const fromDateObj = new Date(
        fromParts[2],
        fromParts[1] - 1,
        fromParts[0]
      );
      const toDateObj = new Date(currentYear, currentMonth, day);

      if (toDateObj > fromDateObj) {
        setToDate(selectedDate);
      } else {
        // Show error or alert that to date must be after from date
        alert("To Date must be after From Date");
        // Keep selecting to date
        return;
      }
    }
  };

  const handleCalendarToggle = () => {
    setShowCalendar((prev) => !prev);
    // Only reset if we're opening with no current selection
    if (!showCalendar && !fromDate && !toDate) {
      setSelectingFromDate(true);
    }
  };

  // const handleFilterSubmit = (action) => {
  //   if (action === "clear") {
  //     setFilters({ name: "", age: "", dscode: "", diagnosis: "" });
  //     onFilterChange({ name: "", age: "", dscode: "", diagnosis: "" });
  //     setShowFilter(false);
  //   } else {
  //     onFilterChange(filters);
  //     setShowFilter(false);
  //   }
  // };

  const handleFilterSubmit = (action) => {
    if (action === "clear") {
      setFilters({ name: "", age: "", dscode: "", diagnosis: "" });
      onFilterChange({ patientName: "", age: "", dscode: "", disease: "" }); // Make sure all fields are cleared
      setShowFilter(false);
    } else {
      onFilterChange({
        patientName: filters.name,
        age: filters.age,
        dscode: filters.dscode, // Make sure this is passed
        disease: filters.diagnosis,
      });
      setShowFilter(false);
    }
  };

  // const handleClearDateFilter = () => {
  //   setFromDate('');
  //   setToDate('');
  //   setSelectingFromDate(true);
  //   // Call parent component with empty dates to clear filter
  //   onSearchDate([]);
  // };

  // const handleApplyDateFilter = () => {
  //   if (fromDate && toDate) {
  //     // Convert dates to Date objects for comparison
  //     const fromParts = fromDate.split('/');
  //     const toParts = toDate.split('/');

  //     const startDate = new Date(fromParts[2], fromParts[1] - 1, fromParts[0]);
  //     const endDate = new Date(toParts[2], toParts[1] - 1, toParts[0]);

  //     // Call the parent component's date search handler
  //     onSearchDate([startDate, endDate]);
  //     setShowCalendar(false);
  //   }
  // };

  const handleClearDateFilter = () => {
    setFromDate("");
    setToDate("");
    setSelectingFromDate(true);
    // Call parent component with null to clear filter
    onSearchDate(null); // or onSearchDate([]) depending on your parent component
    setShowCalendar(false); // Close the calendar when clearing
  };

  const handleApplyDateFilter = () => {
    if (fromDate && toDate) {
      // Convert dates to Date objects for comparison
      const fromParts = fromDate.split("/");
      const toParts = toDate.split("/");

      const startDate = new Date(fromParts[2], fromParts[1] - 1, fromParts[0]);
      const endDate = new Date(toParts[2], toParts[1] - 1, toParts[0]);

      // Ensure end date is at end of day
      endDate.setHours(23, 59, 59, 999);

      // Call the parent component's date search handler
      onSearchDate([startDate, endDate]);
      setShowCalendar(false);
    }
  };

  // Get unique patient names with DS codes from completed appointments
  const getPatientSuggestions = () => {
    const uniquePatients = [];
    const seenNames = new Set();

    if (completedAppointment) {
      completedAppointment.forEach((appointment) => {
        if (
          appointment.patient_name &&
          !seenNames.has(appointment.patient_name.toLowerCase())
        ) {
          seenNames.add(appointment.patient_name.toLowerCase());
          uniquePatients.push({
            name: appointment.patient_name,
            dsCode: appointment.ds_code || "",
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

  // Add this utility function at the top of your file
  // const formatDateDisplay = (dateStr) => {
  //   if (!dateStr) return '';

  //   const [day, month, year] = dateStr.split('/').map(Number);
  //   const date = new Date(year, month - 1, day);

  //   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  //   return `${monthNames[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
  // };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";

    const [day, month, year] = dateStr.split("/").map(Number);
    // Return in DD/MM/YYYY format
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  return (
    <div
      className="my-appointments-search-wrp"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* <div className='datepicker-wrp' style={(activeTab == "upcoming" || activeTab == "cancelled") ? { display: "none" } : {}}> */}
      {/* <div
        className="datepicker-wrp"
        style={
          activeTab == "upcoming"
            // activeTab == "incompleted" ||
            // activeTab == "missed"
            ? { display: "none" }
            : activeTab === "cancelled"
              ? { width: "50%" }
              : {}
        }
      > */}
      <div
        className="datepicker-wrp"
        style={
          activeTab === "upcoming"
            ? { display: "none" }
            : ["cancelled", "incompleted", "missed"].includes(activeTab)
            ? { width: "50%" }
            : {}
        }
      >
        {/* <input
          type="text"
          id="dateRangeInput"
          placeholder="Select date range"
          readOnly
          value={fromDate && toDate ? `${fromDate} - ${toDate}` : ''}
          onClick={handleCalendarToggle}
        /> */}

        {/* <input
          type="text"
          id="dateRangeInput"
          placeholder="Select date range"
          readOnly
          value={fromDate && toDate ?
            `${formatDateDisplay(fromDate)} - ${formatDateDisplay(toDate)}` :
            ''}
          onClick={handleCalendarToggle}
        /> */}

        <input
          type="text"
          id="dateRangeInput"
          placeholder="Select date range"
          readOnly
          value={
            fromDate && toDate
              ? `${formatDateDisplay(fromDate)} - ${formatDateDisplay(toDate)}`
              : ""
          }
          onClick={handleCalendarToggle}
        />

        {showCalendar && (
          <div
            className="calendar-popup"
            style={{
              display: "block",
              position: "absolute",
              zIndex: 1000,
              background: "white",
              padding: "0px",
              borderRadius: "5px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              width: "300px",
              left: 0,
              overflow: "hidden",
            }}
          >
            <div className="calendar-header">
              <div className="cal-head-btn-wrp">
                {/* <button
                  type="button"
                  className={`range-btn ${selectingFromDate ? 'active' : ''}`}
                  onClick={() => setSelectingFromDate(true)}
                >
                  <span id="fromDateLabel">{fromDate || 'From Date'}</span>
                </button> */}
                {/* <button
                  type="button"
                  className={`range-btn ${selectingFromDate ? 'active' : ''}`}
                  onClick={() => setSelectingFromDate(true)}
                >
                  <span id="fromDateLabel">{fromDate ? formatDateDisplay(fromDate) : 'From Date'}</span>
                </button> */}

                <button
                  type="button"
                  className={`range-btn ${selectingFromDate ? "active" : ""}`}
                  onClick={() => setSelectingFromDate(true)}
                >
                  <span id="fromDateLabel">
                    {fromDate ? formatDateDisplay(fromDate) : "From Date"}
                  </span>
                </button>
              </div>
              <div className="cal-head-btn-wrp">
                {/* <button
                  type="button"
                  className={`range-btn ${!selectingFromDate ? 'active' : ''}`}
                  onClick={() => setSelectingFromDate(false)}
                >
                  <span id="toDateLabel">{toDate || 'To Date'}</span>
                </button> */}
                {/* <button
                  type="button"
                  className={`range-btn ${!selectingFromDate ? 'active' : ''}`}
                  onClick={() => setSelectingFromDate(false)}
                >
                  <span id="toDateLabel">{toDate ? formatDateDisplay(toDate) : 'To Date'}</span>
                </button> */}

                <button
                  type="button"
                  className={`range-btn ${!selectingFromDate ? "active" : ""}`}
                  onClick={() => setSelectingFromDate(false)}
                >
                  <span id="toDateLabel">
                    {toDate ? formatDateDisplay(toDate) : "To Date"}
                  </span>
                </button>
              </div>

              <div
                className="monthyear-wrp w-100"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "10px 0",
                }}
              >
                <button
                  type="button"
                  className="arrow-btn"
                  onClick={() => changeMonth(-1)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  &#x2190;
                </button>
                <span id="monthYearLabel" style={{ fontWeight: "bold" }}>
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button
                  type="button"
                  className="arrow-btn"
                  onClick={() => changeMonth(1)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  &#x2192;
                </button>
              </div>
            </div>
            <table
              className="calendar-grid"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <th
                        key={day}
                        style={{ padding: "5px", textAlign: "center" }}
                      >
                        {day}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>{renderCalendar()}</tbody>
            </table>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                borderTop: "1px solid #eee",
              }}
            >
              <button
                onClick={handleClearDateFilter}
                style={{
                  padding: "5px 10px",
                  background: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
              <button
                onClick={handleApplyDateFilter}
                disabled={!fromDate || !toDate}
                style={{
                  padding: "5px 10px",
                  background: fromDate && toDate ? "#0066cc" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: fromDate && toDate ? "pointer" : "not-allowed",
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className="formfield"
        style={
          activeTab == "completed"
            ? { display: "none" }
            : ["cancelled", "incompleted", "missed"].includes(activeTab)
            ? { width: "50%" }
            : {}
        }
      >
        <input
          placeholder="Search anything here"
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <input type="submit" />
      </div>

      <div
        className="past-patient-filter-wrp"
        style={
          activeTab === "cancelled" ||
          activeTab === "upcoming" ||
          activeTab === "incompleted" ||
          activeTab === "missed"
            ? { display: "none" }
            : {}
        }
      >
        <button type="button" onClick={handleFilterToggle}>
          Filter
          <img src="./images/filter-icon.svg" alt="Icon" />
        </button>

        <div className={`filter-options-drpdn ${showFilter ? "active" : ""}`}>
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
                            onClick={() => handleSuggestionClick(patient)}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <div>{patient.name}</div>
                            {patient.dsCode && (
                              <div
                                style={{ color: "#199fd9", fontSize: "0.8em" }}
                              >
                                (DS Code: {patient.dsCode})
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>

              <div className="filter-grp">
                <label>Age</label>
                <input
                  type="text"
                  name="age"
                  value={filters.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  // maxLength={2}
                  // inputMode="numeric"
                  pattern="[0-9]*" // Helps with mobile numeric keyboard
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
                  name="diagnosis"
                  value={filters.diagnosis}
                  onChange={handleInputChange}
                >
                  <option value="">Disease</option>
                  {diagnosisOptions.map((diagnosis, index) => (
                    <option key={index} value={diagnosis}>
                      {diagnosis}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="filter-form-btn-wrp">
              <button
                type="button"
                className="orange-btn"
                onClick={() => handleFilterSubmit("clear")}
                style={{ borderRadius: 0 }}
              >
                Clear Filter
              </button>
              <button
                type="button"
                className="orange-btn"
                onClick={() => handleFilterSubmit("apply")}
                style={{ borderRadius: 0 }}
              >
                Apply Filter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyAppointmentsSearch;
