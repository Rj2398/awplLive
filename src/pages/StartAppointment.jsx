import React from "react";
import { Link } from "react-router-dom";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";

const StartAppointment = () => {
  return (
    <>
      {/* <Header /> */}

      <main className="doctor-panel">
        <div className="container-fluid">
          <div className="doc-panel-inr">
            <Header />
          </div>
          {/* Panel Body Begin */}
          <div className="doc-panel-body">
            <div className="appointments">
              {/* Start Appointment */}
              <div className="start-appointment cmn-mb">
                <div className="docpnl-sec-head">
                  <h1 className="h2-title">Start Appointment</h1>
                </div>
                <div className="apointment-detail-card">
                  <div className="apoint-dtl-img">
                    <img src="/images/client-img-5.png" alt="Client" />
                  </div>
                  <div className="appoint-dtl-content">
                    <div className="appoint-dtl-left">
                      <div className="appoint-dtl-head">
                        <h2 className="h3-title">Patient’s name</h2>
                        <p>Referred by DS User Patient Name</p>
                      </div>
                      <div className="appoint-btm">
                        <p>
                          <img src="/images/clock-icon.svg" alt="Icon" />
                          Thu May 14
                        </p>
                        <p className="appoint-time">10:00 - 10:15 AM</p>
                        <Link to="/VideoCall" className="orange-btn">
                          Start now
                        </Link>
                      </div>
                    </div>
                    <Link to="/patient-details" className="cmn-btn">
                      View profile
                    </Link>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="upcoming-apoints cmn-mb">
                <div className="docpnl-sec-head">
                  <h2>Upcoming Appointments</h2>
                  <Link to="#" className="cmn-btn">
                    See all
                  </Link>
                </div>
                <div className="appointments-row-wrp cmn-mb">
                  <div className="appointments-row row">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        className="appointment-card-wrp col-lg-3 col-md-4 col-sm-6"
                        key={item}
                      >
                        <div className="appointment-card">
                          <div className="card-img">
                            <img
                              src={`/images/client-img-${item}.png`}
                              alt="Client"
                            />
                          </div>
                          <div className="card-body">
                            <div className="card-btm">
                              <Link to="/patient-details" className="cmn-btn">
                                View full detail
                              </Link>
                              <div className="card-ftr-inr-wrp">
                                <div className="appointment-datetime">
                                  <p className="date">Thu May 14</p>
                                  <p className="time">10:00 - 10:15 AM</p>
                                </div>
                                <h3>Client’s Name</h3>
                              </div>
                              <input
                                type="submit"
                                value="Cancel"
                                className="w-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pending Prescriptions */}
              <div className="pending-prescriptions">
                <div className="docpnl-sec-head">
                  <h2>Pending Prescriptions</h2>
                  <Link to="#" className="cmn-btn">
                    See all
                  </Link>
                </div>
                <div className="pending-presc-table">
                  <table>
                    <thead>
                      <tr>
                        <th>S.no.</th>
                        <th>Patient Name</th>
                        <th>Upload Date</th>
                        <th>View Symptoms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((num) => (
                        <tr key={num}>
                          <td>{num}</td>
                          <td>Patient Name</td>
                          <td>
                            <div className="date">21/12/2024</div>
                            <div className="time">10:40 PM</div>
                          </td>
                          <td>
                            <Link to="/pendingprescription">View</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </main>

      {/* Logout Modal */}
      {/* <div className="modal fade popup-wrp small-pop dash-pop" id="logOut" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-icon">
              <img src="/images/logout-icon.svg" alt="Logout Icon" />
            </div>
            <div className="modal-header">
              <h2>Logout</h2>
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-footer btn-wrp">
              <button type="button" className="cmn-btn" data-bs-dismiss="modal">Cancel</button>
              <Link to="/login" className="cmn-btn orange-btn">Logout</Link>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default StartAppointment;
