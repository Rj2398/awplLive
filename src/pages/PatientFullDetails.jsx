import React from "react";
import { Link } from "react-router-dom";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";

const PatientFullDetails = () => {
  return (
    <>
      <main className="doctor-panel">
        <div className="container-fluid">
          <div className="doc-panel-inr">
            <Header />
          </div>

          <div className="doc-panel-body appoint-details-pg has-texture">
            <div className="texture only-img">
              <img src="./images/doctor-symbol.png" alt="Image" />
            </div>
            <div className="appointments">
              <div className="start-appointment cmn-mb">
                <div className="docpnl-sec-head">
                  <h1 className="h2-title">Appointment Details</h1>
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
                    <img src="./images/client-img-5.png" alt="Client" />
                  </div>
                  <div className="appoint-dtl-content">
                    <div className="appoint-dtl-left">
                      <div className="appoint-dtl-head">
                        <h2 className="h3-title">Patient’s name</h2>
                      </div>
                      <div className="appoint-btm">
                        <p>
                          <img src="./images/clock-icon.svg" alt="Icon" />
                          Thu May 14
                        </p>
                        <p className="appoint-time">10:00 - 10:15 AM</p>
                      </div>
                    </div>
                    <Link to="/patient-profile" className="cmn-btn">
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
                            <input type="text" placeholder="Name" />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="formfield">
                            <label>Enter Your Height</label>
                            <input type="text" placeholder="26" />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="formfield">
                            <label>Enter Your Weight</label>
                            <input type="text" placeholder="50kg" />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="formfield">
                            <label>Gender</label>
                            <input type="text" placeholder="Male" />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="formfield">
                            <label>Enter Age</label>
                            <input type="text" placeholder="26" />
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

                    <div className="scheduled-call-consultations cmn-mb2">
                      <h2>Scheduled Call Consultations</h2>
                      <div className="row">
                        {[1, 2, 3].map((i) => (
                          <div className="col-lg-12" key={i}>
                            <div className="formfield">
                              <label>
                                {i}. Lorem ipsum dolor sit amet, consectetur
                              </label>
                              <input type="text" placeholder="Answer" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="view-uploaded-images-wrp">
                      <h2>View Uploaded Images</h2>
                      <div className="view-uploaded-img">
                        {[1, 2, 3].map((i) => (
                          <div className="img-wrp" key={i}>
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
                        ))}
                      </div>
                    </div>

                    <div className="btn-wrp">
                      <a href="#url" className="orange-btn">
                        Cancel
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </main>

      {/* Logout Modal */}
      {/* <div className="modal fade popup-wrp small-pop dash-pop" id="logOut" tabIndex="-1" role="dialog">
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
              <button type="button" className="cmn-btn" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
              <Link to="/login" className="cmn-btn orange-btn">Logout</Link>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default PatientFullDetails;
