import React from "react";
import { Link } from "react-router-dom";
import Header from "../doctorPanel/Header";
import Footer from "../doctorPanel/Footer";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { symptomUploadDetails } from "../../redux/slices/userSlice";
import baseUrl from "../../config/BaseUrl";

const PendingAssignedPrescriptionDetails = () => {
  const location = useLocation();
  const { id, patientId } = location.state || {};

  const dispatch = useDispatch();
  const { symptomUploadDetail, loading } = useSelector((state) => state.user);
  // const baseUrl = import.meta.env.VITE_BACKEND_URL

  const [formData, setFormData] = useState({
    patient_name: "",
    dayDate: "",
    time: "",
    name: "",
    height: "",
    weight: "",
    age: "",
    gender: "",
    contactno: "",
    questions: "",
    files: [],
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(symptomUploadDetails({ symptom_id: id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (symptomUploadDetail?.basicInformation) {
      setFormData({
        patient_name: symptomUploadDetail.patientData.patient_name || "",
        dayDate: symptomUploadDetail.patientData.dayDate || "",
        time: symptomUploadDetail.patientData.time || "",
        name: symptomUploadDetail.basicInformation.name || "",
        height: symptomUploadDetail.basicInformation.height || "",
        weight: symptomUploadDetail.basicInformation.weight || "",
        age: symptomUploadDetail.basicInformation.age || "",
        gender: symptomUploadDetail.basicInformation.gender || "",
        // contactno: symptomUploadDetail.basicInformation.contact || '',
        questions: symptomUploadDetail.symptomAnswers || "",
        files: symptomUploadDetail.symptomFiles || [],
      });
    }
  }, [symptomUploadDetail]);

  // Helper function to check if any files of a specific type exist
  const hasFilesOfType = (files, types) => {
    return files.some((file) =>
      types.some((type) => file.file_type.toLowerCase().includes(type))
    );
  };
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
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
          <div className="doc-panel-body appoint-details-pg has-texture papd-pg">
            <div className="texture only-img">
              <img src="./images/doctor-symbol.png" alt="Image" />
            </div>
            <div className="appointments">
              <div className="start-appointment cmn-mb">
                <div className="docpnl-sec-head">
                  <h1 className="h2-title">Symptom Upload Details</h1>
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
                <div className="apointment-detail-card">
                  <div className="apoint-dtl-img">
                    <img
                      src={`${baseUrl}/${symptomUploadDetail?.patientData?.patient_profile}`}
                      alt="Client Image"
                    />
                  </div>
                  <div className="appoint-dtl-content">
                    <div className="appoint-dtl-left">
                      <div className="appoint-dtl-head">
                        <h2 className="h4-title">{formData.patient_name}</h2>
                      </div>
                      <div className="date h3-title">{formData.dayDate}</div>
                      <div className="time">{formData.time}</div>
                    </div>

                    <Link
                      to="/patient-profile"
                      state={{
                        patientId: patientId,
                        source: "prescription",
                        hideSchedule: true,
                      }}
                      className="cmn-btn"
                    >
                      View profile
                    </Link>
                  </div>
                </div>
              </div>

              <div className="patient-details-wrp">
                <form>
                  <div className="patient-dtl-form">
                    <div className="patient-basic-info cmn-mb2">
                      <h2>Basic Information</h2>
                      <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="formfield">
                            <label>Full Name</label>
                            <input
                              type="text"
                              placeholder="Name"
                              value={formData.name}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="formfield">
                            <label>Enter Your Height</label>
                            <input
                              type="text"
                              placeholder="175"
                              value={formData.height}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="formfield">
                            <label>Enter Your Weight</label>
                            <input
                              type="text"
                              placeholder="70kg"
                              value={formData.weight}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="formfield">
                            <label>Gender</label>
                            <input
                              type="text"
                              placeholder="Male"
                              value={formData.gender}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="formfield">
                            <label>Enter Age</label>
                            <input
                              type="text"
                              placeholder="32"
                              value={formData.age}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="scheduled-call-consultations cmn-mb2">
                      <h2>Uploaded Symptoms</h2>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="formfield">
                            <label style={{ fontSize: "16px" }}>
                              1. How long are you suffering from this disease?
                            </label>
                            <input
                              type="text"
                              placeholder="Answer"
                              value={formData.questions?.answer1}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="formfield">
                            <label style={{ fontSize: "16px" }}>
                              2. Any other problem which you would like to share
                              related to your problem?
                            </label>
                            <input
                              type="text"
                              placeholder="Answer"
                              value={formData.questions?.answer2}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="formfield">
                            <label style={{ fontSize: "16px" }}>
                              3. Do you have any history of this disease?
                            </label>
                            <input
                              type="text"
                              placeholder="Answer"
                              value={formData.questions?.answer3}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="formfield">
                            <label style={{ fontSize: "16px" }}>
                              4. Are you taking any medicines? If yes, please
                              share the name of medicine and since how long you
                              are taking this medicine?
                            </label>
                            <input
                              type="text"
                              placeholder="Answer"
                              value={formData.questions?.answer4}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Images */}
                    {/* Uploaded Images */}
                    {hasFilesOfType(formData.files, [
                      "jpg",
                      "jpeg",
                      "png",
                      "gif",
                    ]) && (
                      <div className="view-uploaded-images-wrp">
                        <h2>View Uploaded Images</h2>
                        <div className="view-uploaded-img">
                          {formData.files
                            .filter((file) =>
                              ["jpg", "jpeg", "png", "gif"].some((type) =>
                                file.file_type.toLowerCase().includes(type)
                              )
                            )
                            .map((file, index) => (
                              <div className="img-wrp" key={index}>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedImage(file);
                                    setShowModal(true);
                                  }}
                                >
                                  <img
                                    src={`${baseUrl}/${file.file_path}`}
                                    alt={`Symptom Image ${index + 1}`}
                                  />
                                </a>
                              </div>
                            ))}
                        </div>

                        {/* Image Modal */}
                        {showModal && selectedImage && (
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.9)",
                              zIndex: 1050,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {/* Close button - fixed at top right corner of screen */}
                            <button
                              onClick={() => setShowModal(false)}
                              style={{
                                position: "fixed",
                                right: "30px",
                                top: "30px",
                                zIndex: 1060,
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                              }}
                              aria-label="Close"
                            >
                              <img
                                src="/images/cross-blue.png"
                                alt="Close"
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  filter: "brightness(0) invert(1)",
                                }}
                              />
                            </button>

                            {/* Image container - centered */}
                            <div
                              style={{
                                maxWidth: "90vw",
                                maxHeight: "90vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <img
                                src={`${baseUrl}/${selectedImage.file_path}`}
                                alt="Enlarged view"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {hasFilesOfType(formData.files, ["mp4", "webm", "ogg"]) && (
                      <div className="view-uploaded-images-wrp uploaded-vdo-wrp">
                        <h2>View Uploaded Videos</h2>
                        <div className="view-uploaded-img">
                          {formData.files
                            .filter((file) =>
                              ["mp4", "webm", "ogg"].some((type) =>
                                file.file_type.toLowerCase().includes(type)
                              )
                            )
                            .map((file, index) => (
                              <div className="img-wrp" key={index}>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleVideoClick(file);
                                  }}
                                >
                                  <video width="100%">
                                    <source
                                      src={`${baseUrl}/${file.file_path}`}
                                      type={`video/${file.file_type
                                        .split(".")
                                        .pop()}`}
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                </a>
                              </div>
                            ))}
                        </div>

                        {/* Video Modal */}
                        {showVideoModal && selectedVideo && (
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.9)",
                              zIndex: 1050,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {/* Close button - fixed at top right corner of screen */}
                            <button
                              onClick={() => setShowVideoModal(false)}
                              style={{
                                position: "fixed",
                                right: "30px",
                                top: "30px",
                                zIndex: 1060,
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                              }}
                              aria-label="Close"
                            >
                              <img
                                src="/images/cross-blue.png"
                                alt="Close"
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  filter: "brightness(0) invert(1)",
                                }}
                              />
                            </button>

                            {/* Video container - centered */}
                            <div
                              style={{
                                width: "80vw",
                                maxWidth: "800px",
                                maxHeight: "80vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <video
                                controls
                                autoPlay
                                style={{
                                  width: "100%",
                                  maxHeight: "100%",
                                  objectFit: "contain",
                                }}
                              >
                                <source
                                  src={`${baseUrl}/${selectedVideo.file_path}`}
                                  type={`video/${selectedVideo.file_type
                                    .split(".")
                                    .pop()}`}
                                />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Uploaded Files */}
                    {hasFilesOfType(formData.files, ["pdf", "doc", "docx"]) && (
                      <div className="view-uploaded-images-wrp upload-file-wrp">
                        <h2>View Uploaded Files</h2>
                        <div className="view-uploaded-img">
                          {formData.files
                            .filter((file) =>
                              ["pdf", "doc", "docx"].some((type) =>
                                file.file_type.toLowerCase().includes(type)
                              )
                            )
                            .map((file, index) => (
                              <div className="img-wrp" key={index}>
                                <a
                                  href={`${baseUrl}/${file.file_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src="./images/file-icon.svg"
                                    alt="File Icon"
                                  />
                                  <span className="file-size">
                                    Click to view
                                  </span>
                                </a>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="btn-wrp">
                      <Link
                        to="/CompletedAssignedPrescription"
                        state={{
                          id: id,
                          patientId: patientId,
                          // name: formData.name,
                          // height: formData.height,
                          // weight: formData.weight,
                          // age: formData.age,
                          // gender: formData.gender,
                          // contactno: formData.contactno,
                        }}
                      >
                        <button type="button" className="orange-btn">
                          Respond
                        </button>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </main>
  );
};

export default PendingAssignedPrescriptionDetails;
