import React from "react";
import { Link } from "react-router-dom";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";

const PatientProfileFullDetails = () => {
  return (
    <div className="doctor-panel">
      <div className="container-fluid">
        <div className="doc-panel-inr">
          <Header />
        </div>

        {/* Panel Body Begin */}
        <div className="doc-panel-body has-texture">
          <div className="start-appointment cmn-mb">
            <div className="docpnl-sec-head text-center">
              <h1 className="h2-title">Patient Profile</h1>
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

            <div className="patient-details-wrp">
              <div className="patient-profile-wrp cmn-mb2">
                <div className="patient-profile">
                  <div className="patient-profile-inr">
                    <div className="patient-profile-left">
                      <div className="patient-profile-img-cover">
                        <div className="patient-profile-cover-inr">
                          <div className="patient-profile-img">
                            <img
                              src="./images/patient-profile-img.png"
                              alt="Patinet Profile Image"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="patient-profile-right">
                      <div className="patient-id">
                        <h2>Patient Name</h2>
                        <p className="dscode">(DS Code:xxxx)</p>
                        <div className="appoint-btm">
                          <p>
                            <img src="./images/clock-icon.svg" alt="Icon" />
                            Thu May 14
                          </p>
                          <p className="appoint-time">10:00 - 10:15 AM</p>
                        </div>
                      </div>
                      <div className="patient-info between">
                        <div className="patient-info-card">
                          <h3>Gender</h3>
                          <p>Female</p>
                        </div>
                        <div className="patient-info-card">
                          <h3>Age</h3>
                          <p>25</p>
                        </div>
                        <div className="patient-info-card">
                          <h3>Height</h3>
                          <p>160cm</p>
                        </div>
                        <div className="patient-info-card">
                          <h3>Weight</h3>
                          <p>55kg</p>
                        </div>
                      </div>
                      <div className="patient-info">
                        <div className="patient-info-card">
                          <h3>Phone number</h3>
                          <a href="tel:3195550115">(319) 555-0115</a>
                        </div>
                        <div className="patient-info-card">
                          <h3>Email ID</h3>
                          <a href="mailto:patientname@gmail.com">
                            patientname@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="patient-basic-info cmn-mb2">
                <h2>Appointment Date & Time</h2>
                <div className="appointment-timing">
                  <div className="appointment-date">Thu May 14</div>
                  <div className="appointment-time">10:00 - 10:15 AM</div>
                </div>
              </div>
              <form>
                <div className="patient-dtl-form">
                  <div className="health-issues-symptoms cmn-mb2">
                    <h2>Appointment Details</h2>
                    <div className="health-symptoms-inr">
                      <div className="health-symptoms-content">
                        <div className="formfield white-input">
                          <label>
                            What symptoms are you facing? Please describe your
                            symptoms in brief.
                          </label>
                          <input type="text" placeholder="Answer" />
                        </div>
                        <div className="formfield white-input">
                          <label>
                            How long have you been experiencing these symptoms?
                          </label>
                          <input type="text" placeholder="Answer" />
                        </div>
                        <div className="formfield white-input">
                          <label>
                            Any knows Diseases / Health Conditions you are
                            facing?
                          </label>
                          <input
                            type="text"
                            placeholder="Parasitic diseases       Parasitic diseases       Parasitic diseases"
                          />
                        </div>
                        <div className="formfield white-input">
                          <label>Any past medical conditions?</label>
                          <input type="text" placeholder="Answer" />
                        </div>
                      </div>
                      <div className="view-uploaded-images-wrp">
                        <h2 className="h5-title">View Uploaded Images</h2>
                        <div className="view-uploaded-img">
                          <div className="img-wrp">
                            <a
                              href="./images/symptom-img.png"
                              data-fancybox="symptoms"
                            >
                              <img
                                src="./images/symptom-img.png"
                                alt="Symptoms Image"
                              />
                            </a>
                          </div>
                          <div className="img-wrp">
                            <a
                              href="./images/symptom-img.png"
                              data-fancybox="symptoms"
                            >
                              <img
                                src="./images/symptom-img.png"
                                alt="Symptoms Image"
                              />
                            </a>
                          </div>
                          <div className="img-wrp">
                            <a
                              href="./images/symptom-img.png"
                              data-fancybox="symptoms"
                            >
                              <img
                                src="./images/symptom-img.png"
                                alt="Symptoms Image"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="health-issues-symptoms cmn-mb2">
                    <h2>Health Issues & Symptoms</h2>
                    <div className="health-symptoms-inr">
                      <div className="formfield white-input">
                        <label>
                          What symptoms are you facing? Please describe your
                          symptoms in brief.
                        </label>
                        <input type="text" placeholder="Answer" />
                      </div>
                      <div className="formfield white-input">
                        <label>
                          How long have you been experiencing these symptoms?
                        </label>
                        <input type="text" placeholder="Answer" />
                      </div>
                      <div className="formfield white-input">
                        <label>
                          Any knows Diseases / Health Conditions you are facing?
                        </label>
                        <input
                          type="text"
                          placeholder="Parasitic diseases       Parasitic diseases       Parasitic diseases"
                        />
                      </div>
                      <div className="formfield white-input">
                        <label>Any past medical conditions?</label>
                        <input type="text" placeholder="Answer" />
                      </div>
                      <div className="formfield white-input">
                        <label>Any past medications?</label>
                        <input type="text" placeholder="Answer" />
                      </div>
                      <div className="formfield white-input">
                        <label>Any Past known allergies?</label>
                        <input type="text" placeholder="Answer" />
                      </div>
                    </div>
                  </div>

                  <div className="pending-prescriptions cmn-mb2 bg-blue">
                    <h2>Appointment History</h2>
                    <div className="pending-presc-table">
                      <table>
                        <thead>
                          <tr>
                            <th>S.no.</th>
                            <th>Appointment Date</th>
                            <th>Diagnosis</th>
                            <th>View Prescription</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>22-Dec-2024</td>
                            <td>Malaria</td>
                            <td>
                              <a href="#url">View</a>
                            </td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>18-Sept-2024</td>
                            <td>Viral Fever</td>
                            <td>
                              <a href="#url">View</a>
                            </td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>10-Aug-2024</td>
                            <td>Covid</td>
                            <td>
                              <a href="#url">View</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pending-prescriptions">
                    <h2>Referred Patient list</h2>
                    <div className="pending-presc-table">
                      <table>
                        <thead>
                          <tr>
                            <th>S.no.</th>
                            <th>Patient Name</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Weight (kg)</th>
                            <th>Height</th>
                            <th>View Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Patient Name</td>
                            <td>Male</td>
                            <td>28</td>
                            <td>55kg</td>
                            <td>26</td>
                            <td>
                              <Link to="/referred-patient-profile">
                                View Details
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Patient Name</td>
                            <td>Female</td>
                            <td>26</td>
                            <td>63kg</td>
                            <td>55</td>
                            <td>
                              <Link to="/referred-patient-profile">
                                View Details
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Patient Name</td>
                            <td>Female</td>
                            <td>33</td>
                            <td>80kg</td>
                            <td>43</td>
                            <td>
                              <Link to="/referred-patient-profile">
                                View Details
                              </Link>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* End Of Panel Body */}

        {/* Panel Footer Begin */}
        <Footer />
        {/* End Of Panel Footer */}
      </div>

      {/* Logout Pop-Up */}
      {/* <div className="modal fade popup-wrp small-pop dash-pop" id="logOut" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-icon">
                            <img src="./images/logout-icon.svg" alt="Icon" />
                        </div>
                        <div className="modal-header">
                            <h2>Logout</h2>
                            <p>Are you sure you want to logout?</p>
                        </div>
                        <div className="modal-footer btn-wrp">
                            <button type="submit" className="cmn-btn" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                            <Link to="/login" className="cmn-btn orange-btn">Logout</Link>
                        </div>
                    </div>
                </div>
            </div> */}
    </div>
  );
};

export default PatientProfileFullDetails;
