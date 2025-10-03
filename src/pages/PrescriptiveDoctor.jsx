//date 27-06-2025

import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaPen, FaRegPlusSquare } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { presciveMedicine, videoCallSubmit } from "../redux/slices/dataSlice";
import { medicineSearch } from "../redux/slices/userSlice";

// Import React-Toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// import baseurl from "../config/BaseUrl";
import baseUrl from "../config/BaseUrl";

const PrescriptiveDoctor = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const MAX_CHARS = 500;
  const navigate = useNavigate();
  const [isloading, setIsLoading] = useState(false);
  const [adviceText, setAdviceText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { medicineSearch: medicineSearchResults, loading2 } = useSelector(
    (state) => state.user
  );
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const patientId = params.get("patientId");

  useEffect(() => {
    if (!id || !patientId) {
      navigate("/doctor-home");
    }
  }, []);

  useEffect(() => {
    dispatch(medicineSearch()); // Keep commented out if you're using hardcoded data
  }, [dispatch]);

  // console.log("ID:!!!!!!!!!!!!!!!!!!!!!!!", id);
  // console.log("Patient ID:", patientId);
  // const { id, patientId } = location.state || {};

  const { allMedicine, loading, error } = useSelector(
    (state) => state.userdata
  );

  // console.log(
  //   id,
  //   "is appointment id ",
  //   patientId,
  //   "is the patient id",
  //   allMedicine,
  //   "SELECTED DATA *******"
  // );
  const currentChars = adviceText.length;

  const [data, setData] = useState(allMedicine);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false); // New state for submit confirmation modal

  useEffect(() => {
    if (allMedicine) {
      setData(allMedicine);
    }
  }, [allMedicine]);

  useEffect(() => {
    dispatch(presciveMedicine({ appointment_id: id }));
  }, [dispatch, id]);

  const medicineSuggestions = useMemo(() => {
    if (!allMedicine || !allMedicine.treatments) {
      return [];
    }
    const uniqueMedicines = new Set();
    const suggestions = [];

    allMedicine.treatments.forEach((treatment) => {
      if (!uniqueMedicines.has(treatment.medicine_name)) {
        uniqueMedicines.add(treatment.medicine_name);
        suggestions.push({
          medicine_id: treatment.medicine_id,
          medicine_name: treatment.medicine_name,
        });
      }
    });
    return suggestions;
  }, [allMedicine]);

  // console.log(medicineSuggestions, "DERIVED MEDICINE SUGGESTIONS *******");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [currentTreatment, setCurrentTreatment] = useState(null);

  const [newTreatment, setNewTreatment] = useState({
    medicine_name: "",
    dosage: "",
    duration: "",
    unit: "",
    with_water: "",
    dosage_frequency: "",
    meal_timing: "",
    day_time: "",
    remarks: "",
  });

  // Helper function to format day_time for display
  const formatDayTimeForDisplay = (dayTime) => {
    switch (dayTime) {
      case "morning":
        return "Morning";
      case "morning_afternoon":
        return "Morning + Afternoon";
      case "morning_evening":
        return "Morning + Evening";
      case "morning_afternoon_evening":
        return "Morning + Afternoon + Evening";
      case "morning_afternoon_evening_night":
        return "Morning + Afternoon + Evening + Night";
      case "morning_night":
        return "Morning + Night";
      case "night":
        return "Night";
      default:
        return dayTime;
    }
  };

  // Helper function to format meal_timing for display
  const formatMealTimingForDisplay = (mealTiming) => {
    switch (mealTiming) {
      case "before":
        return "Before";
      case "after":
        return "After";
      default:
        return mealTiming;
    }
  };

  const handleEditClick = (treatment) => {
    setCurrentTreatment({
      // Ensure 'with_water' is correctly set as 'Yes' or 'No' for the select input
      ...treatment,
      with_water: treatment.with_water === 1 ? "Yes" : "No",
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentTreatment(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentTreatment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //new changes search feature

  //  a new medicine in your component by rajan date 03-10-2025
  // This function will handle changes in the new search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // This function will handle selecting a medicine from the filtered list
  const handleSelectMedicine = (medicineName) => {
    // Update the main form state
    handleNewChange({
      target: {
        name: "medicine_name",
        value: medicineName,
      },
    });
    // Optionally, clear the search term after selection
    setSearchTerm("");
  };

  // Filter the results dynamically based on the searchTerm
  const filteredMedicines = medicineSearchResults
    ? medicineSearchResults.filter((medicine) =>
        medicine.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  //new changes search feature

  const handleUpdate = () => {
    // --- Validation Logic for Edit Medicine Modal ---
    let isValid = true;
    const requiredFields = [
      "medicine_name",
      "dosage",
      "duration",
      "unit",
      "with_water",
      "dosage_frequency",
      "meal_timing",
      "day_time",
    ];

    for (const field of requiredFields) {
      // Check for currentTreatment, as it's the state for the edit modal
      if (
        !currentTreatment[field] ||
        String(currentTreatment[field]).trim() === ""
      ) {
        toast.error(`Please fill in the "${field.replace(/_/g, " ")}" field.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        isValid = false;
        break; // Stop on the first invalid field
      }
    }

    if (!isValid) {
      return; // Stop the function if validation fails
    }

    // Original update logic (only runs if validation passes)
    const updatedTreatment = {
      ...currentTreatment,
      with_water: currentTreatment.with_water === "Yes" ? 1 : 0,
    };

    setData((prevData) => ({
      ...prevData,
      treatments: prevData.treatments.map((t) =>
        t.treatment_id === updatedTreatment.treatment_id ? updatedTreatment : t
      ),
    }));
    handleCloseEditModal();

    toast.success("Medicine updated successfully!");
  };

  const handleDelete = (treatmentId) => {
    setData((prevData) => ({
      ...prevData,
      treatments: prevData.treatments.filter(
        (t) => t.treatment_id !== treatmentId
      ),
    }));
    toast.info("Medicine deleted successfully!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleNewClick = () => {
    setShowNewModal(true);
    setNewTreatment({
      medicine_name: "",
      dosage: "",
      duration: "",
      unit: "",
      with_water: "",
      dosage_frequency: "",
      meal_timing: "",
      day_time: "",
      remarks: "",
    });
  };

  const handleCloseNewModal = () => {
    setShowNewModal(false);
  };

  // const handleNewChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewTreatment((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleNewChange = (e) => {
    const { name, value } = e.target;

    setNewTreatment((prev) => {
      const updatedTreatment = { ...prev, [name]: value };

      if (name === "medicine_name" && value) {
        const selectedMed = medicineSearchResults.find(
          (med) => med.product_name === value
        );
        if (selectedMed && selectedMed.unit) {
          updatedTreatment.unit = selectedMed.unit;
        }
      }
      return updatedTreatment;
    });
  };

  const handleAddNew = () => {
    let isValid = true;
    const requiredFields = [
      "medicine_name",
      "dosage",
      "duration",
      "unit",
      "with_water",
      "dosage_frequency",
      "meal_timing",
      "day_time",
    ];

    for (const field of requiredFields) {
      if (!newTreatment[field] || String(newTreatment[field]).trim() === "") {
        toast.error(`Please fill in the "${field.replace(/_/g, " ")}" field.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        isValid = false;
        break;
      }
    }

    if (!newTreatment.medicine_name.trim()) {
      toast.error("Please select a Medicine Name.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isValid = false;
    }

    if (
      data.treatments &&
      data.treatments.some(
        (t) =>
          t.medicine_name.toLowerCase() ===
          newTreatment.medicine_name.toLowerCase()
      )
    ) {
      toast.error(
        "Duplicate medicine not added. This medicine already exists in the table.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const newTreatmentId =
      data.treatments && data.treatments.length > 0
        ? Math.max(...data.treatments.map((t) => t.treatment_id || 0)) + 1
        : 1;

    const selectedMedicineFromSearch = medicineSearchResults.find(
      (med) => med.product_name === newTreatment.medicine_name
    );

    const newMedicineId = selectedMedicineFromSearch
      ? selectedMedicineFromSearch.product_code
      : newTreatmentId;

    const updatedNewTreatment = {
      ...newTreatment,
      treatment_id: newTreatmentId,
      medicine_id: newMedicineId,
      with_water: newTreatment.with_water === "Yes" ? 1 : 0,
    };

    setData((prevData) => ({
      ...prevData,
      treatments: [...(prevData.treatments || []), updatedNewTreatment],
    }));
    handleCloseNewModal();

    toast.success("New medicine added successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleSubmitButtonClick = () => {
    setShowSubmitConfirmModal(true); // Open the confirmation modal
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitConfirmModal(false); // Close the confirmation modal
    setIsLoading(false);

    if (
      !data || // 'data' needs to be defined in the component's scope
      !data.disease_name ||
      !data.treatments ||
      data.treatments.length === 0
    ) {
      toast.warn("No data to submit! Please add at least one medicine.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const doctorAppData = JSON.parse(localStorage.getItem("doctor-app"));
    const authToken = doctorAppData?.token;
    if (!authToken) {
      toast.error("Authentication token not found. Please log in again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return; // Stop the function if no token is found
    }

    const payload = {
      appointment_id: id, // 'id' needs to be defined in the component's scope
      diagnosis: data.disease_name,
      notes: adviceText,
      medicines: data.treatments.map((treatment) => ({
        // medicine_id: treatment.medicine_id,
        medicine_name: treatment.medicine_name,
        dosage: treatment.dosage,
        duration: treatment.duration,
        unit: treatment.unit,
        with_water: treatment.with_water,
        dosage_frequency: String(treatment.dosage_frequency),
        meal_timing: treatment.meal_timing,
        day_time: treatment.day_time,
        remarks: treatment.remarks,
      })),
    };

    // console.log("Submitting data to API:", payload);

    try {
      setIsLoading(true);
      const response = await axios.post(
        // 'await' requires the function to be 'async'
        // "https://awplconnectadmin.tgastaging.com/api/doctor/prescriptions/submit_appointment_prescription",
        `${baseUrl}api/doctor/prescriptions/submit_appointment_prescription`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        toast.success("Prescription data submitted successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(false);
        // navigate("/videocall");

        window.opener = null;
        window.open("", "_self");
        window.close();

        // Optionally, you can perform other actions on success, like redirecting or clearing form
      } else {
        toast.error(response.data.message || "An error occurred.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("API Call Error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data?.message);
        console.error("Error response status:", error.response.status);
        toast.error(
          error.response.data.message || "Server error. Please try again.",
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      } else if (error.request) {
        toast.error(
          "No response from server. Please check your internet connection.",
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setIsLoading(false);
    }
  };
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Spinner animation="border" role="status">
  //         <span className="sr-only">Loading...</span>
  //       </Spinner>
  //     </div>
  //   );
  // }

  if (isloading) {
    return (
      <div className="loader-main">
        <span className="loader"></span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-bold text-lg">
        Error: {error}
      </div>
    );
  }

  const hasTreatments =
    data && Array.isArray(data.treatments) && data.treatments.length > 0;

  // if (loading)
  //   return (
  //     <div className="loader-main">
  //       {" "}
  //       <span className="loader"></span>{" "}
  //     </div>
  //   );

  return (
    <>
      {loading2 ? (
        <div className="loader-main">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="container p-4 mx-auto font-sans bg-white">
          {/* ToastContainer is likely needed here, if not already in a parent component */}
          {/* <ToastContainer /> */}

          <div
            style={{
              width: "200px",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: -40,
            }}
          >
            <h3
              className="text-3xl font-bold text-gray-800 m-0"
              style={{ fontSize: 20 }}
            >
              {data?.disease_name || "N/A"}
            </h3>
          </div>

          <div className="mb-4 text-right">
            <Button
              onClick={handleNewClick}
              style={{ backgroundColor: "#F47820" }}
              className="border-0 px-6 py-2 rounded-lg shadow-md text-white flex items-center gap-2 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75"
            >
              <FaRegPlusSquare style={{ marginBottom: 5, marginRight: 5 }} />
              Add New Medicine
            </Button>
          </div>

          <div className="overflow-x-auto bg-white border-[#199FD9]">
            {hasTreatments ? (
              <Table
                hover
                responsive
                className="min-w-full text-center table-auto rounded-lg overflow-hidden"
              >
                <thead style={{ backgroundColor: "#199FD9", color: "white" }}>
                  <tr>
                    <th
                      className="px-4 py-3 text-sm font-semibold tracking-wider uppercase"
                      style={{
                        borderBottom: "1px solid #199FD9",
                        backgroundColor: "#199FD9",
                        color: "white",
                      }}
                    >
                      S.No.
                    </th>
                    <th
                      className="px-4 py-3 text-sm font-semibold tracking-wider uppercase"
                      style={{
                        borderBottom: "1px solid #199FD9",
                        backgroundColor: "#199FD9",
                        color: "white",
                      }}
                    >
                      Medicine Name
                    </th>
                    <th
                      className="px-4 py-3 text-sm font-semibold tracking-wider uppercase"
                      style={{
                        borderBottom: "1px solid #199FD9",
                        backgroundColor: "#199FD9",
                        color: "white",
                      }}
                    >
                      Dosage
                    </th>
                    <th
                      className="px-4 py-3 text-sm font-semibold tracking-wider uppercase"
                      style={{
                        borderBottom: "1px solid #199FD9",
                        backgroundColor: "#199FD9",
                        color: "white",
                      }}
                    >
                      Duration (For day)
                    </th>
                    <th
                      className="px-4 py-3 text-sm font-semibold tracking-wider uppercase"
                      style={{
                        borderBottom: "1px solid #199FD9",
                        backgroundColor: "#199FD9",
                        color: "white",
                      }}
                    >
                      Unit
                    </th>
                    <th
                      className="px-4 py-3 text-sm font-semibold tracking-wider uppercase"
                      style={{
                        borderBottom: "1px solid #199FD9",
                        backgroundColor: "#199FD9",
                        color: "white",
                      }}
                    >
                      With Water
                    </th>
                    <th
                      className="px-4 py-3 text-sm font-semibold tracking-wider uppercase"
                      style={{
                        borderBottom: "1px solid #199FD9",
                        backgroundColor: "#199FD9",
                        color: "white",
                      }}
                    >
                      Frequency (Times per day)
                    </th>
                    <th
                      className="px-4 py-3 text-sm font-semibold tracking-wider uppercase"
                      style={{
                        borderBottom: "1px solid #199FD9",
                        backgroundColor: "#199FD9",
                        color: "white",
                      }}
                    >
                      Before/After Meal
                    </th>
                    <th
                      className="px-4 py-3 text-sm font-semibold tracking-wider uppercase"
                      style={{
                        borderBottom: "1px solid #199FD9",
                        backgroundColor: "#199FD9",
                        color: "white",
                      }}
                    >
                      Day Time
                    </th>
                    <th
                      className="px-4 py-3 text-sm font-semibold tracking-wider uppercase"
                      style={{
                        borderBottom: "1px solid #199FD9",
                        backgroundColor: "#199FD9",
                        color: "white",
                      }}
                    >
                      Remarks
                    </th>
                    <th
                      className="px-4 py-3"
                      style={{
                        borderBottom: "1px solid #199FD9",
                        backgroundColor: "#199FD9",
                        color: "white",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.treatments.map((treatment, index) => (
                    <tr
                      key={treatment.treatment_id}
                      className="hover:bg-gray-100"
                    >
                      <td
                        className="px-4 py-3"
                        style={{ border: "1px solid #199FD9" }}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ border: "1px solid #199FD9" }}
                      >
                        {treatment.medicine_name}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ border: "1px solid #199FD9" }}
                      >
                        {treatment.dosage}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ border: "1px solid #199FD9" }}
                      >
                        {treatment.duration}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ border: "1px solid #199FD9" }}
                      >
                        {treatment.unit}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ border: "1px solid #199FD9" }}
                      >
                        {treatment.with_water === 1 ? "Yes" : "No"}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ border: "1px solid #199FD9" }}
                      >
                        {treatment.dosage_frequency}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ border: "1px solid #199FD9" }}
                      >
                        {formatMealTimingForDisplay(treatment.meal_timing)}{" "}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ border: "1px solid #199FD9" }}
                      >
                        {formatDayTimeForDisplay(treatment.day_time)}{" "}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ border: "1px solid #199FD9" }}
                      >
                        {treatment.remarks}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ border: "1px solid #199FD9" }}
                      >
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleEditClick(treatment)}
                            style={{
                              border: "none",
                              background: "transparent",
                              padding: "4px",
                            }}
                          >
                            <FaPen style={{ color: "#199FD9" }} />
                          </button>
                          <button
                            onClick={() => handleDelete(treatment.treatment_id)}
                            style={{
                              border: "none",
                              background: "transparent",
                              padding: "4px",
                            }}
                          >
                            <RiDeleteBin5Line style={{ color: "red" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5">
                <p className="text-xl text-gray-600 font-semibold">
                  No Data Found
                </p>
                <p className="text-gray-500 mt-2">
                  Start by adding new medicines using the "Add New Medicine"
                  button above.
                </p>
              </div>
            )}
          </div>
          {hasTreatments && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 10,
                marginBottom: 20,
                position: "relative", // Added for positioning the char count
                width: "60%", // Set width here to contain both textarea and char count
              }}
            >
              <h3>Advice/Suggestion/Investigation.</h3>
              <textarea
                style={{
                  width: "100%", // Changed to 100% to fit parent div's width
                  height: 100,
                  border: "1px solid #199FD9",
                  backgroundColor: "white",
                  maxHeight: "200px",
                  overflowY: "auto",
                  padding: "8px", // Added some padding for better aesthetics
                  boxSizing: "border-box", // Ensures padding is included in width/height
                  resize: "vertical", // Allow vertical resizing by user if desired
                }}
                value={adviceText}
                onChange={(e) => {
                  // Renamed 'txt' to 'e' (common convention for event object)
                  if (e.target.value.length <= MAX_CHARS) {
                    // Check length of the new value
                    setAdviceText(e.target.value); // ONLY set the value if it's within limits
                  }
                  // The second setAdviceText(txt.target.value) here was redundant and problematic.
                  // It's removed to ensure the conditional logic works as intended.
                }}
                rows={4}
                cols={50} // cols becomes less relevant if width is set by CSS
                placeholder="Enter your advice, suggestion, or investigation details here..."
                maxLength={MAX_CHARS} // *** Added: HTML attribute for character limit ***
              ></textarea>

              {/* Character Limit Display */}
              <div
                style={{
                  position: "absolute",
                  bottom: 5, // Adjust as needed for vertical position
                  right: 5, // Adjust as needed for horizontal position
                  fontSize: "0.8em", // Smaller font size
                  color: currentChars === MAX_CHARS ? "red" : "#666", // Red when limit reached
                  backgroundColor: "rgba(255, 255, 255, 0.7)", // Slight translucent background
                  padding: "2px 5px",
                  borderRadius: "3px",
                  pointerEvents: "none", // Allows clicks/interactions to pass through to textarea if needed
                }}
              >
                {currentChars}/{MAX_CHARS}
              </div>
            </div>
          )}
          {hasTreatments && (
            <div className="mt-6 text-center">
              <Button className="orange-btn" onClick={handleSubmitButtonClick}>
                {" "}
                {/* Call the new handler */}
                Submit
              </Button>
            </div>
          )}

          {/* Edit Modal (unchanged) */}
          <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#199FD9", color: "white" }}
              className="add-new-med-close border-b-0 rounded-t-lg"
            >
              <Modal.Title className="text-xl font-bold">
                Update Medicine
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-6 bg-gray-50">
              {currentTreatment && (
                <Form>
                  <Form.Group className="mb-3" controlId="formMedicineName">
                    <Form.Label className="font-semibold text-gray-700">
                      Medicine Name*
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="medicine_name"
                      value={currentTreatment.medicine_name}
                      onChange={handleEditChange}
                      list="medicineSuggestionsList"
                      disabled={true}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <datalist id="medicineSuggestionsList">
                      {medicineSuggestions.map((medicine) => (
                        <option
                          key={medicine.medicine_id}
                          value={medicine.medicine_name}
                        />
                      ))}
                    </datalist>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formUnit">
                    <Form.Label className="font-semibold text-gray-700">
                      Unit*
                    </Form.Label>
                    <Form.Select
                      name="unit"
                      value={currentTreatment.unit}
                      onChange={handleEditChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Unit</option>
                      <option value="mg">Milligram (mg)</option>
                      <option value="g">Gram (g)</option>
                      <option value="tab">Tablet (tab)</option>
                      <option value="cap">Capsule (cap)</option>
                      <option value="ml">Milliliter (mL)</option>
                      <option value="drop">Drop (drop)</option>
                      <option value="tbsp">Tablespoon (tbsp)</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDosage">
                    <Form.Label className="font-semibold text-gray-700">
                      Dosage*
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="dosage"
                      value={currentTreatment.dosage}
                      onChange={handleEditChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="Enter dosage like 5 or 10-20"
                    />
                  </Form.Group>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formWithWater">
                        <Form.Label className="font-semibold text-gray-700">
                          With Water*
                        </Form.Label>
                        <Form.Select
                          name="with_water"
                          value={currentTreatment.with_water}
                          onChange={handleEditChange}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Option</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3"
                        controlId="formDosageFrequency"
                      >
                        <Form.Label className="font-semibold text-gray-700">
                          Frequency (Times per Day)*
                        </Form.Label>
                        <Form.Select
                          name="dosage_frequency"
                          value={currentTreatment.dosage_frequency}
                          onChange={handleEditChange}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Frequency</option>
                          <option value="1">1/day</option>
                          <option value="2">2/day</option>
                          <option value="3">3/day</option>
                          <option value="4">4/day</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formMealTiming">
                        <Form.Label className="font-semibold text-gray-700">
                          Before/After Meal*
                        </Form.Label>
                        <Form.Select
                          name="meal_timing"
                          value={currentTreatment.meal_timing}
                          onChange={handleEditChange}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Timing</option>
                          <option value="before">Before </option>
                          <option value="after">After </option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formDuration">
                        <Form.Label className="font-semibold text-gray-700">
                          Duration*
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="duration"
                          value={currentTreatment.duration}
                          onChange={handleEditChange}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          placeholder="Enter duration like 2 or 3"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="formDayTime">
                    <Form.Label className="font-semibold text-gray-700">
                      Day Time*
                    </Form.Label>
                    <Form.Select
                      name="day_time"
                      value={currentTreatment.day_time}
                      onChange={handleEditChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Time</option>
                      <option value="morning">Morning</option>
                      <option value="morning_afternoon">
                        Morning + Afternoon
                      </option>
                      <option value="morning_evening">Morning + Evening</option>
                      <option value="morning_afternoon_evening">
                        Morning + Afternoon + Evening
                      </option>
                      <option value="morning_night">Morning + Night</option>
                      <option value="night">Night</option>
                      <option value="morning_afternoon_evening_night">
                        Morning + Afternoon + Evening + Night
                      </option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formRemarks">
                    <Form.Label className="font-semibold text-gray-700">
                      Remarks (Optional)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="remarks"
                      value={currentTreatment.remarks}
                      onChange={handleEditChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter remark if any"
                    />
                  </Form.Group>
                </Form>
              )}
            </Modal.Body>
            <Modal.Footer className="bg-gray-100 p-4 border-t-0 rounded-b-lg flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={handleCloseEditModal}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </Button>
              <Button
                style={{ backgroundColor: "#F47820", borderColor: "#F47820" }}
                onClick={handleUpdate}
                className="px-4 py-2 rounded-md text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Update Medicine
              </Button>
            </Modal.Footer>
          </Modal>

          {/* New Medicine Modal (unchanged) */}
          <Modal show={showNewModal} onHide={handleCloseNewModal} centered>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#199FD9", color: "white" }}
              className="add-new-med-close border-b-0 rounded-t-lg"
            >
              <Modal.Title className="text-xl font-bold">
                Add New Medicine
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-6 bg-gray-50">
              <Form>
                {/* <Form.Group className="mb-3" controlId="formNewMedicineName">
                  <Form.Label className="font-semibold text-gray-700">
                    Medicine Name*
                  </Form.Label>
                  <Form.Select
                    name="medicine_name"
                    value={newTreatment.medicine_name}
                    onChange={handleNewChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Medicine</option>
                    {medicineSearchResults &&
                    medicineSearchResults.length > 0 ? (
                      medicineSearchResults.map((medicine) => (
                        <option
                          key={medicine.product_code}
                          value={medicine.product_name}
                        >
                          {medicine.product_name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Loading medicines...
                      </option>
                    )}
                  </Form.Select>
                </Form.Group> */}

                <Form.Group className="mb-3" controlId="formNewMedicineName">
                  <Form.Label className="font-semibold text-gray-700">
                    Medicine Name*
                  </Form.Label>

                  {/* Display the selected medicine name (from newTreatment.medicine_name) */}
                  {newTreatment.medicine_name ? (
                    <div className="mb-2 p-2 border border-blue-500 rounded-md bg-blue-50 flex justify-between items-center">
                      <span> {newTreatment.medicine_name}</span>
                      <Button
                        variant="link"
                        onClick={() => handleSelectMedicine("")}
                        className="p-0 text-red-500 text-sm"
                      >
                        (Change)
                      </Button>
                    </div>
                  ) : null}

                  {/* 1. The Search Box */}
                  {/* The input is only visible if a medicine hasn't been selected or if the user clicks "Change" */}
                  {newTreatment.medicine_name && searchTerm === "" ? null : (
                    <Form.Control
                      type="text"
                      placeholder="Search for a Medicine"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      // Add a small delay for search filtering if your list is huge
                      // onKeyUp={(e) => { if (e.key === 'Enter') setSearchTerm(e.target.value); }}
                    />
                  )}

                  {/* 2. The Search Results Dropdown List */}
                  {/* Show results only if we have a search term and a medicine hasn't been selected */}
                  {searchTerm && newTreatment.medicine_name === "" && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                      {filteredMedicines.length > 0 ? (
                        <ul className="list-none p-0 m-0">
                          {filteredMedicines.slice(0, 10).map((medicine) => (
                            <li
                              key={medicine.product_code}
                              onClick={() =>
                                handleSelectMedicine(medicine.product_name)
                              }
                              className="p-2 cursor-pointer hover:bg-blue-100"
                            >
                              {medicine.product_name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-2 text-gray-500">
                          {searchTerm.length > 0
                            ? "No results found."
                            : "Start typing to search..."}
                        </div>
                      )}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formNewUnit">
                  <Form.Label className="font-semibold text-gray-700">
                    Unit*
                  </Form.Label>
                  <Form.Select
                    name="unit"
                    value={newTreatment.unit}
                    onChange={handleNewChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Unit</option>
                    <option value="mg">Milligram (mg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="tab">Tablet (tab)</option>
                    <option value="cap">Capsule (cap)</option>
                    <option value="ml">Milliliter (mL)</option>
                    <option value="drop">Drop (drop)</option>
                    <option value="tbsp">Tablespoon (tbsp)</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formNewDosage">
                  <Form.Label className="font-semibold text-gray-700">
                    Dosage*
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="dosage"
                    value={newTreatment.dosage}
                    onChange={handleNewChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Enter dosage like 5 or 10-20"
                  />
                </Form.Group>

                <Row className="mb-4">
                  {/* Field 1: With Water */}
                  <Col md={6}>
                    <Form.Group controlId="formNewWithWater">
                      <Form.Label className="font-semibold text-gray-700">
                        With Water*
                      </Form.Label>
                      <Form.Select
                        name="with_water"
                        value={newTreatment.with_water}
                        onChange={handleNewChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Field 2: Dosage Frequency */}
                  <Col md={6}>
                    <Form.Group controlId="formDosageFrequency">
                      <Form.Label className="font-semibold text-gray-700">
                        Frequency (Times per Day)*
                      </Form.Label>
                      <Form.Select
                        name="dosage_frequency"
                        value={newTreatment?.dosage_frequency}
                        onChange={handleNewChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Frequency</option>
                        <option value="1">1/day</option>
                        <option value="2">2/day</option>
                        <option value="3">3/day</option>
                        <option value="4">4/day</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-4">
                  {/* Field 1: Before/After Meal */}
                  <Col md={6}>
                    <Form.Group controlId="formNewMealTiming">
                      <Form.Label className="font-semibold text-gray-700">
                        Before/After Meal*
                      </Form.Label>
                      <Form.Select
                        name="meal_timing"
                        value={newTreatment.meal_timing}
                        onChange={handleNewChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Timing</option>
                        <option value="before">Before</option>
                        <option value="after">After</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Field 2: Duration */}
                  <Col md={6}>
                    <Form.Group controlId="formNewDuration">
                      <Form.Label className="font-semibold text-gray-700">
                        Duration*
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="duration"
                        value={newTreatment.duration}
                        onChange={handleNewChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Enter Duration like 2 or 3"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="formNewDayTime">
                  <Form.Label className="font-semibold text-gray-700">
                    Day Time*
                  </Form.Label>
                  <Form.Select
                    name="day_time"
                    value={newTreatment.day_time}
                    onChange={handleNewChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Time</option>
                    <option value="morning">Morning</option>
                    <option value="morning_afternoon">
                      Morning + Afternoon
                    </option>
                    <option value="morning_evening">Morning + Evening</option>
                    <option value="morning_afternoon_evening">
                      Morning + Afternoon + Evening
                    </option>
                    <option value="morning_night">Morning + Night</option>
                    <option value="night">Night</option>
                    <option value="morning_afternoon_evening_night">
                      Morning + Afternoon + Evening + Night
                    </option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formNewRemarks">
                  <Form.Label className="font-semibold text-gray-700">
                    Remarks (Optional)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="remarks"
                    value={newTreatment.remarks}
                    onChange={handleNewChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter remark if any"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer className="bg-gray-100 p-4 border-t-0 rounded-b-lg flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={handleCloseNewModal}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </Button>
              <Button
                style={{ backgroundColor: "#F47820", borderColor: "#F47820" }}
                onClick={handleAddNew}
                className="px-4 py-2 rounded-md text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Add Medicine
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Submit Confirmation Modal */}
          {/* <Modal
        show={showSubmitConfirmModal}
        onHide={() => setShowSubmitConfirmModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#199FD9", color: "white" }}
        >
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          Are you sure you want to submit this prescription?
        </Modal.Body>
        <Modal.Footer className="justify-content-center p-4 bg-gray-100">
          <Button
            variant="secondary"
            onClick={() => setShowSubmitConfirmModal(false)}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmSubmit}
            className="orange-btn px-4 py-2 ml-3"
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal> */}

          <Modal
            show={showSubmitConfirmModal}
            onHide={() => setShowSubmitConfirmModal(false)}
            centered
            dialogClassName="custom-modal-dialog" // Add a custom class for styling the modal container
          >
            <div
              className="modal-content text-center position-relative shadow" // Added shadow and position-relative for close button
              style={{
                width: "auto", // Adjust width as needed or let it be responsive
                minHeight: "280px", // Adjust height as needed
                // borderRadius: "20px", // More rounded corners
                padding: "30px 20px", // Overall padding inside the modal content
                backgroundColor: "white", // Ensure white background for the whole content area
                overflow: "hidden", // To ensure border-radius clips content
              }}
            >
              {/* Close Button (like in the reminder modal) */}
              <button
                type="button"
                onClick={() => setShowSubmitConfirmModal(false)}
                className="position-absolute top-0 end-0 m-3 border-0 bg-transparent"
                aria-label="Close"
              >
                <img
                  src="./images/cross-blue.png" // Assuming you have a blue cross icon like in the reminder modal
                  alt="Close Icon"
                  style={{ width: "24px", height: "24px" }}
                />
              </button>

              {/* Exclamation Icon */}
              <div className="modal-icon mb-3 mt-4">
                <img
                  src="/images/logout-icon.svg" // Placeholder: You'll need to provide your exact icon path
                  alt="Info Icon"
                  style={{ width: "60px", height: "60px", color: "#199FD9" }} // Adjust size and color as per screenshot
                />
              </div>

              {/* Title and Messages */}
              <div className="modal-header border-0 flex-column align-items-center p-0">
                {" "}
                {/* No border, centered */}
                <h2
                  className="fw-bold mb-2"
                  style={{ fontSize: "22px", color: "#333" }}
                >
                  Confirm Submission
                </h2>
                <p className="m-0" style={{ color: "black", fontSize: "16px" }}>
                  You cannot add more medicine after submission.
                </p>
                <p
                  className="m-0"
                  style={{ color: "black", fontSize: "16px", marginTop: "5px" }}
                >
                  Are you sure you want to submit the prescription?
                </p>
              </div>

              {/* Buttons */}
              <div className="modal-body p-0 mt-5 d-flex justify-content-center gap-3">
                {" "}
                {/* Centered buttons with gap */}
                <Button
                  variant="outline-primary" // Use outline variant for border and text color
                  onClick={() => setShowSubmitConfirmModal(false)}
                  className="px-4 py-2 rounded-md font-semibold"
                  style={{
                    borderColor: "#199FD9", // Custom blue border color
                    color: "#199FD9", // Custom blue text color
                    backgroundColor: "white", // Ensure white background
                    minWidth: "120px", // Give a minimum width for consistent button size
                    fontSize: "16px",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmSubmit}
                  className="orange-btn px-4 py-2 rounded-md font-semibold"
                  style={{
                    backgroundColor: "#FF8C00", // Bright orange from screenshot
                    borderColor: "#FF8C00", // Same color for border
                    color: "white",
                    minWidth: "120px", // Give a minimum width for consistent button size
                    fontSize: "16px",
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export default PrescriptiveDoctor;
