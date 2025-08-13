import { Link, useNavigate } from "react-router-dom";
import Footer from "../doctorPanel/Footer";
import Header from "./Header";
import PrescriptionModal from "./PrescriptionModal";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  completePrescription,
  medicineSearch,
} from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { getPatientProfileData } from "../../redux/slices/patientProfileSlice";

import PendingPrescpt from "../../pages/PendingPrescpt";

const CompletedAssignedPrescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, patientId } = location.state || {};
  const { medicineSearch } = useSelector((state) => state.user);
  // console.log(medicineSearch, "FHASDFJASHFSDFJSFJSFJFJ");

  console.log(id, "id **********************");

  const suggestionsRefs = useRef([]);
  const dispatch = useDispatch();
  const [choosenItem, setChoosenItem] = useState({});
  console.log(choosenItem, "choosen item get from **********");

  useEffect(() => {
    if (!id || !patientId) {
      navigate("/doctor-home");
    }
  }, [location]);

  const { patientProfileData } = useSelector((state) => state.patientProfile);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientProfileData({ patientId: patientId }));
    }
  }, [dispatch, patientId]);

  const patientInfo = patientProfileData?.basic_information || {};

  const {
    loading,
    loading2,
    error,
    completeAssignedPrescription,
    medicineSearch: medicineSearchResults,
  } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
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
      disease: "",
      unit: "",
      withWater: "", // Changed to string for "Yes/No" dropdown
      beforeAfterMeal: "",
      dayTime: "",
      suggestions: [],
      showSuggestion: false,
      isSelectedFromSuggestions: false,
    },
  ]);

  // console.log(medicines[0]?.suggestions, "**************************");
  // console.log(medicineSearchResults, "hello data comes from here***");

  const addMoreMedicine = () => {
    setMedicines((prevMedicines) => [
      ...prevMedicines,
      {
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        disease: "",
        unit: "",
        withWater: "", // Changed to string
        beforeAfterMeal: "",
        dayTime: "",
        suggestions: [],
        showSuggestion: false,
        isSelectedFromSuggestions: false,
      },
    ]);
    setMedicineErrors((prevErrors) => [...prevErrors, ""]); // Add an empty error string for the new medicine
  };

  const handleMedicineChange = (index, field, value) => {
    setMedicines((prevMedicines) => {
      const updated = [...prevMedicines];
      updated[index][field] = value;

      if (field === "medicineName") {
        updated[index].isSelectedFromSuggestions = false;

        setActiveMedicineIndex(index);
        if (searchTimeouts[index]) clearTimeout(searchTimeouts[index]);

        if (value.trim().length > 0) {
          const timeout = setTimeout(() => {
            dispatch(medicineSearch({ query: value }));
          }, 500);
          setSearchTimeouts((prev) => ({ ...prev, [index]: timeout }));
        } else {
          updated[index].suggestions = [];
        }

        setMedicineErrors((prevErrors) => {
          const errors = [...prevErrors];
          errors[index] = "";
          return errors;
        });
      }
      return updated;
    });
  };

  useEffect(() => {
    if (medicineSearchResults && activeMedicineIndex !== null) {
      setMedicines((prevMedicines) => {
        const updated = [...prevMedicines];
        updated[activeMedicineIndex].suggestions = medicineSearchResults;
        return updated;
      });
    }
  }, [medicineSearchResults, activeMedicineIndex]);

  const handleSuggestionSelect = (index, name) => {
    setMedicines((prevMedicines) => {
      const updated = [...prevMedicines];
      updated[index].medicineName = name;
      updated[index].suggestions = [];
      updated[index].isSelectedFromSuggestions = true;
      return updated;
    });

    setMedicineErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = null;
      return newErrors;
    });

    setActiveMedicineIndex(null);
  };

  const handleSetObj = (item) => {
    console.log(item, "choosen item Get from here***");

    setMedicines((prevMedicines) => {
      const updatedMedicines = [...prevMedicines];
      const targetIndex =
        activeMedicineIndex !== null ? activeMedicineIndex : 0;

      if (updatedMedicines[targetIndex]) {
        updatedMedicines[targetIndex] = {
          ...updatedMedicines[targetIndex],
          // Always set these static default values when an item is selected
          dosage: "2",
          frequency: "3",
          duration: "4 months",
          isSelectedFromSuggestions: true,
          // Set new fields from the selected item, with your specified defaults
          disease: item.disease || "Sunil",
          unit: item.Unit || "Rathod",
          withWater: item.withWater ? "Yes" : "No",
          beforeAfterMeal: "Before", // <--- THE CRUCIAL FIX HERE: Changed to "Before"
          dayTime: item.dayTime || "Rathod",
        };
      }
      return updatedMedicines;
    });
  };

  useEffect(() => {
    function handleClickOutside(event) {
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

  const isValidatemedicine = (medicineName, suggestions) => {
    return suggestions.some((sug) => sug.product_name === medicineName);
  };

  const handleSubmit = async () => {
    if (
      !diagnosis ||
      medicines.some(
        (med) =>
          !med.medicineName || !med.dosage || !med.frequency || !med.duration
      )
    ) {
      toast.error("All fields marked with (*) are required", {
        toastId: "required-fields-toast",
        style: {
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
      });
      return;
    }

    const errors = [...medicineErrors];
    let hasErrors = false;

    medicines.forEach((med, i) => {
      if (!med.isSelectedFromSuggestions) {
        errors[i] = "Please select a valid medicine name from suggestions";
        hasErrors = true;
      } else {
        errors[i] = "";
      }
    });

    setMedicineErrors(errors);
    if (hasErrors) return;

    const formData = {
      symptom_id: id,
      diagnosis,
      notes,
      medicines: medicines.map((med) => ({
        name: med.medicineName,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        disease: med.disease,
        unit: med.unit,
        with_water: med.withWater === "Yes",
        before_after_meal: med.beforeAfterMeal,
        day_time: med.dayTime,
      })),
    };

    try {
      const res = await dispatch(completePrescription(formData)).unwrap();

      if (res.status === true) {
        setShowModal(true);
      } else {
        toast.error(res.message || "Failed to complete prescription");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while submitting the prescription"
      );
      console.error("Submission error:", error);
    }
  };

  return (
    <main className="doctor-panel">
      <div className="container-fluid">
        <div className="doc-panel-inr">
          <Header />
        </div>
        {loading ? (
          <div className="loader-main">
            <span className="loader"></span>
          </div>
        ) : (
          <div className="doc-panel-body cap-pg">
            <div className="vdoclscrn-patient-details-wrp">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="vdoclscrn-patient-details-wrp-inr">
                  <div className="vdoclscrn-patient-details w-100">
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
                            value: patientInfo.gender || "N/A",
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
                          <div key={index} className="vdoclscrnpd-grp">
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

                    <div className="vdoclscrnpd-wrp">
                      <div className="vdoclscrnpd-wrp">
                        <h2>Prescriptions:</h2>
                        <PendingPrescpt id={id} />
                        {/* {medicines.map((medicine, index) => (
                          <div
                            key={`medicine-${index}`}
                            className=""
                            ref={(el) => (suggestionsRefs.current[index] = el)}
                          >
                            <div className="vdoclscrnpd">
                              <div className="formfield search-bar">
                                <label>
                                  Medicine Name<span>*</span>
                                </label>
                                <div className="search-input">
                                  <input
                                    type="text"
                                    placeholder="Ibupro"
                                    value={medicine.medicineName}
                                    onChange={(e) =>
                                      handleMedicineChange(
                                        index,
                                        "medicineName",
                                        e.target.value
                                      )
                                    }
                                    autoComplete="off"
                                  />

                                  <input type="submit" value="search" />
                                  {activeMedicineIndex === index &&
                                    medicine.medicineName &&
                                    !medicineErrors[index] && (
                                      <ul
                                        style={{
                                          position: "absolute",
                                          backgroundColor: "white",
                                          border: "1px solid #ccc",
                                          width: "100%",
                                          maxHeight: "150px",
                                          overflowY: "auto",
                                          zIndex: 10,
                                          marginTop: 0,
                                          paddingLeft: "10px",
                                          listStyle: "none",
                                        }}
                                      >
                                        {medicine.suggestions.length > 0
                                          ? medicine.suggestions.map(
                                              (sug, i) => (
                                                <li
                                                  key={i}
                                                  onClick={() => {
                                                    handleSuggestionSelect(
                                                      index,
                                                      sug.product_name
                                                    );
                                                    handleSetObj(sug);
                                                  }}
                                                  style={{
                                                    cursor: "pointer",
                                                    padding: 5,
                                                  }}
                                                >
                                                  {sug.product_name}
                                                </li>
                                              )
                                            )
                                          : medicine.medicineName.trim()
                                              .length > 0 &&
                                            !medicineErrors[index] && (
                                              <li
                                                style={{
                                                  padding: 5,
                                                  color: "#999",
                                                }}
                                              >
                                                No data found
                                              </li>
                                            )}
                                      </ul>
                                    )}
                                </div>
                              </div>
                              <div className="formfield">
                                <label>
                                  Dosage<span>*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Dosage"
                                  value={medicine.dosage}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      "dosage",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div className="formfield">
                                <label>
                                  Frequency(Times per day)<span>*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Frequency"
                                  value={medicine.frequency}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      "frequency",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </div>

                              <div className="formfield">
                                <label>
                                  Duration(For day)<span>*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Duration"
                                  value={medicine.duration}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      "duration",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </div>

                              <div className="formfield">
                                <label>Disease</label>
                                <input
                                  type="text"
                                  placeholder="Disease"
                                  value={medicine.disease}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      "disease",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>

                              <div className="formfield">
                                <label>Unit</label>
                                <input
                                  type="text"
                                  placeholder="Unit (e.g., capsule, ml)"
                                  value={medicine.unit}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      "unit",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>

                              <div className="formfield">
                                <label>With Water</label>
                                <select
                                  value={medicine.withWater}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      "withWater",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>

                              <div className="formfield">
                                <label>Before/After Meal</label>
                                <select
                                  value={medicine.beforeAfterMeal}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      "beforeAfterMeal",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="Before">Before Meal</option>
                                  <option value="After">After Meal</option>
                                  <option value="N/A">Not Applicable</option>
                                </select>
                              </div>

                              <div className="formfield">
                                <label>Day Time</label>
                                <select
                                  value={medicine.dayTime}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      "dayTime",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="Before">Morning</option>
                                  <option value="After">
                                    Morning + Afternoon
                                  </option>
                                  <option value="N/A">
                                    Morning + Afternoon + Evening
                                  </option>

                                  <option value="N/A">
                                    Morning + Afternoon + Evening + Night
                                  </option>
                                </select>
                              </div>

                              {medicineErrors[index] && (
                                <div
                                  style={{
                                    color: "red",
                                    marginTop: "-5px",
                                    fontSize: "14px",
                                  }}
                                >
                                  {medicineErrors[index]}
                                </div>
                              )}
                            </div>

                            <hr
                              style={{
                                border: "none",
                                height: "3px",
                                backgroundColor: "#333",
                                margin: "10px 0",
                              }}
                            />
                          </div>
                        ))} */}

                        {/* <button
                          type="button"
                          className="orange-btn"
                          onClick={addMoreMedicine}
                          style={{
                            margin: "20px 0",
                            padding: 0,
                            minWidth: "150px",
                          }}
                        >
                          <img
                            src="./images/plus-icon-circle.svg"
                            alt="Icon"
                            style={{
                              marginRight: "8px",
                              verticalAlign: "middle",
                            }}
                          />
                          Add More
                        </button> */}
                      </div>

                      {/* <div className="add-notes-wrp">
                        <div className="formfield">
                          <label>Notes:</label>
                          <textarea
                            placeholder="Notes..."
                            value={notes}
                            onChange={handleNotesChange}
                            rows={4}
                            style={{
                              width: "100%",
                              resize: "vertical",
                              backgroundColor: "#fff",
                              color: "#000",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "8px",
                            }}
                          />
                        </div>
                      </div>

                      <div className="add-notes-wrp vdoclscrnpd">
                        <div className="formfield">
                          <label>
                            Diagnosis <span>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Parasitic disease"
                            value={diagnosis}
                            onChange={handleDiagnosisChange}
                          />
                        </div>
                      </div> */}
                    </div>

                    {/* <button
                      type="button"
                      className="orange-btn"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      Submit
                    </button> */}

                    <PrescriptionModal
                      show={showModal}
                      handleClose={() => setShowModal(false)}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </main>
  );
};

export default CompletedAssignedPrescription;
