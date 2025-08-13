import React from 'react';
import Header from '../component/doctorPanel/Header';
import Footer from '../component/doctorPanel/Footer';
import { Link } from 'react-router-dom';

const ReferredPatientProfile = () => {
  return (
    <>

      <main className="doctor-panel">
        <div className="container-fluid">
          <div className="doc-panel-inr">
          <Header />
          </div>

          <div className="doc-panel-body has-texture rfrdptint-profile-pg">
            <div className="start-appointment cmn-mb">
              <div className="docpnl-sec-head text-center">
                <h1 className="h2-title">Patient Profile</h1>
                <div className="back-btn">
  <Link to="#" onClick={(e) => {
    e.preventDefault();
    window.history.back();
  }}>
    <img src="./images/left-arrow.svg" alt="Back" />
  </Link>
</div>
              </div>

              <div className="patient-details-wrp">
                <div className="patient-profile-wrp cmn-mb2">
                  <div className="patient-profile">
                    <div className="patient-profile-inr">
                      <div className="patient-profile-right">
                        <div className="patient-id">
                          <h2>Patient Name</h2>
                          <p className="h5-title d-flex">
                            Referred by <Link to="/completed-appointments-profile">Patient Name</Link>
                          </p>
                        </div>
                        <div className="patient-info">
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
                            <Link to="/completed-appointment-screen">View</Link>
                          </td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>18-Sept-2024</td>
                          <td>Viral Fever</td>
                          <td>
                            <Link to="/completed-appointment-screen">View</Link>
                          </td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>10-Aug-2024</td>
                          <td>Covid</td>
                          <td>
                            <Link to="/completed-appointment-screen">View</Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Modal */}
          <div
            className="modal fade popup-wrp small-pop dash-pop"
            id="logOut"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
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
                  <button
                    type="submit"
                    className="cmn-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Cancel
                  </button>
                  <Link to="/login" className="cmn-btn orange-btn">
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
      <Footer />

        </div>
      </main>

    </>
  );
};

export default ReferredPatientProfile;
