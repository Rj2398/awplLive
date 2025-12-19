// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button } from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";
// import { getDoctorProfile, logout } from "../../redux/slices/userSlice";
// import { CgUnavailable } from "react-icons/cg";
// import { VscSymbolMethod } from "react-icons/vsc";
// import {
//   changeAppointmentNotificaiton,
//   checkToggleNotification,
//   notifyNewChatRes,
//   unreadCount,
// } from "../../redux/slices/notificationSlice";

// const Header = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const loaction = useLocation();

//   const { user } = useSelector((state) => state.user);
//   const baseUrl = import.meta.env.VITE_BACKEND_URL;
//   const { unreadCounts, isNotificationActive } = useSelector(
//     (state) => state.notification
//   );
//   // console.log(isNotificationActive)
//   useEffect(() => {
//     dispatch(unreadCount());
//     dispatch(checkToggleNotification());
//   }, [dispatch]);

//   // Fetch doctor profile if not already fetched
//   useEffect(() => {
//     if (!user?.profile_path) {
//       dispatch(getDoctorProfile());
//     }
//   }, [dispatch, user]);

//   // Confirm logout
//   const handleDeleteConfirm = () => {
//     setShowModal(false);
//     localStorage.removeItem("doctor-app");
//     dispatch(logout());
//     navigate("/");
//   };

//   useEffect(() => {
//     dispatch(notifyNewChatRes());
//   }, [loaction?.pathname]);

//   const handleToggleChange = () => {
//     dispatch(
//       changeAppointmentNotificaiton({ isActive: !isNotificationActive })
//     );
//   };

//   return (
//     <>
//       {isSidebarOpen && (
//         <div
//           onClick={() => setIsSidebarOpen(false)}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0, 0, 0, 0.3)",
//             // backgroundColor: "red",
//             zIndex: 999,
//           }}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className="sidebar"
//         style={{
//           transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
//           transition: "transform 0.3s ease-in-out",
//           position: "fixed",
//           left: 0,
//           top: 0,
//           width: "280px",
//           height: "100%",
//           backgroundColor: "#fff",
//           zIndex: 1000,
//         }}
//       >
//         <div className="sidebar-inr">
//           <div
//             className="sidebar-close"
//             onClick={() => setIsSidebarOpen(false)}
//             style={{ cursor: "pointer", padding: "10px", textAlign: "right" }}
//           >
//             <i className="fa-solid fa-times-circle"></i>
//           </div>
//           <div className="doc-profile-wrp">
//             <div className="doc-img ml-0 ms-0">
//               <img src={`${baseUrl}/${user?.profile_path}`} alt="Doctor" />
//             </div>
//             <div className="doc-profile-body">
//               <p>{user?.name || "Doctor Name"}</p>
//               <Link
//                 to="/UserProfile"
//                 className="view-profile"
//                 onClick={() => setIsSidebarOpen(false)}
//               >
//                 View my profile
//               </Link>
//             </div>
//           </div>

//           <div className="sidebar-nav">
//             <ul>
//               <li>
//                 <img
//                   src="/images/dash.svg"
//                   alt="Icon"
//                   style={{ height: "18px", width: "18px" }}
//                 />
//                 <Link to="/doctor-home" onClick={() => setIsSidebarOpen(false)}>
//                   Dashboard
//                 </Link>
//               </li>
//               <li>
//                 <div className="notification-set">
//                   <div className="not-set-left">
//                     <img
//                       src="/images/notification-icon.svg"
//                       alt="Notification"
//                       style={{ height: "18px", width: "18px" }}
//                     />
//                     <span>Notification</span>
//                   </div>
//                   <div className="not-set-right">
//                     <div className="not-toggler">
//                       <input
//                         type="checkbox"
//                         id="notificationToggle"
//                         checked={isNotificationActive}
//                         onChange={handleToggleChange}
//                       />
//                       <label htmlFor="notificationToggle"></label>
//                     </div>
//                   </div>
//                 </div>
//               </li>

//               <li>
//                 <img
//                   src="/images/appointment-icon.svg"
//                   alt="Icon"
//                   style={{ height: "18px", width: "18px" }}
//                 />
//                 <Link
//                   to="/my-appointments"
//                   onClick={() => setIsSidebarOpen(false)}
//                 >
//                   My Appointments
//                 </Link>
//               </li>
//               <li>
//                 <img
//                   src="/images/pending-prescription-icon.svg"
//                   alt="Icon"
//                   style={{ height: "18px", width: "18px" }}
//                 />
//                 <Link
//                   to="/pendingprescription"
//                   onClick={() => setIsSidebarOpen(false)}
//                 >
//                   Pending prescriptions
//                 </Link>
//               </li>
//               <li>
//                 <img
//                   src="/images/past-patients-icon.svg"
//                   alt="Icon"
//                   style={{ height: "18px", width: "18px" }}
//                 />
//                 <Link to="/pastpatient" onClick={() => setIsSidebarOpen(false)}>
//                   My Past Patients
//                 </Link>
//               </li>
//               {/* <li>
//                 <img src="/images/terms-of-service-icon.svg" alt="Icon" />
//                 <Link to="/terms">Terms of services</Link>
//               </li>
//               <li>
//                 <img src="/images/sidebar-nav-link-icon.svg" alt="Icon" />
//                 <Link to="/privacy">Privacy Policy</Link>
//               </li> */}

//               <li>
//                   <img
//                     src="https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/database-delete-icon.png"
//                     alt="Icon"
//                     style={{ height: "18px", width: "18px" }}
//                   />
//                 {/* <CgUnavailable style={{ height: "20px", width: "20px" }}/> */}
//                 <Link to="/doctorUnavailibility" onClick={() => setIsSidebarOpen(false)}>
//                  Mark Unavailability
//                 </Link>
//               </li>

//               <li>
//                   <img
//                     src="https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/database-delete-icon.png"
//                     alt="Icon"
//                     style={{ height: "18px", width: "18px" }}
//                   />

//                 <Link to="/hod" onClick={() => setIsSidebarOpen(false)}>
//                  H.O.D
//                 </Link>
//               </li>

//               <li className="logout">
//                 <img
//                   src="/images/menu-logout-icon.svg"
//                   alt="Icon"
//                   style={{ height: "18px", width: "18px" }}
//                 />
//                 <Button
//                   variant="link"
//                   style={{
//                     textDecoration: "none",
//                     color: "black",
//                     fontWeight: "600",
//                     textTransform: "none",
//                   }}
//                   onClick={() => setShowModal(true)}
//                 >
//                   Logout <i className="fa-solid fa-chevron-right"></i>
//                 </Button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Top Header */}
//       <div
//         className="doc-panel-header"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "15px 10px",
//           background: "#fff",
//           justifyContent: "space-between",
//         }}
//       >
//         <button
//           type="button"
//           className="docpnl-hdr-toggler"
//           onClick={() => setIsSidebarOpen(true)}
//           style={{
//             background: "transparent",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           <img src="/images/bars.svg" alt="Menu" />
//         </button>
//         <div className="logo">
//           <Link to="/doctor-home">
//             <img src="/images/logo.png" alt="Logo" />
//           </Link>
//         </div>
//         <div className="notifications">
//           <Link to="/notifications">
//             <img src="/images/notification-icon-2.svg" alt="Notification" />
//           </Link>
//           {unreadCounts > 0 && <span></span>}
//         </div>
//       </div>

//       {/* Logout Modal */}
//       {showModal && (
//         <div
//           className="modal fade show popup-wrp small-pop dash-pop"
//           tabIndex="-1"
//           style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-dialog-centered" role="document">
//             <div className="modal-content">
//               <button
//                 type="button"
//                 className="close"
//                 onClick={() => setShowModal(false)}
//                 aria-label="Close"
//               >
//                 <span aria-hidden="true">
//                   <img src="/images/cross-blue.png" alt="Close" />
//                 </span>
//               </button>
//               <div className="modal-icon">
//                 <img src="/images/logout-icon.svg" alt="Icon" />
//               </div>
//               <div className="modal-header">
//                 <h2>Logout</h2>
//                 <p>Are you sure you want to logout?</p>
//               </div>
//               <div className="modal-footer btn-wrp">
//                 <button
//                   type="button"
//                   className="cmn-btn"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="cmn-btn orange-btn"
//                   onClick={handleDeleteConfirm}
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Header;
//
//
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getDoctorProfile, logout } from "../../redux/slices/userSlice";
import { CgUnavailable } from "react-icons/cg";
import { VscSymbolMethod } from "react-icons/vsc";
import {
  changeAppointmentNotificaiton,
  checkToggleNotification,
  getAllNotifications,
  notifyNewChatRes,
  unreadCount,
} from "../../redux/slices/notificationSlice";
import baseUrl from "../../config/BaseUrl";
import BaseUrl from "../../config/Constant";

const Header = () => {
  const { invitedUser } = useSelector(({ info }) => info);

  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHod, setIsHod] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loaction = useLocation();

  const { user } = useSelector((state) => state.user);
  // const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const { unreadCounts, isNotificationActive } = useSelector(
    (state) => state.notification
  );

  //

  const { doctorNotifications, loading, error } = useSelector(
    (state) => state.notification
  );

  const count = doctorNotifications?.unread_new_message_count;
  // console.log(isNotificationActive)
  useEffect(() => {
    dispatch(unreadCount());
    dispatch(checkToggleNotification());
  }, [dispatch]);

  // Fetch doctor profile if not already fetched
  useEffect(() => {
    if (!user?.profile_path) {
      dispatch(getDoctorProfile());
    }
  }, [dispatch, user]);

  // Confirm logout
  const handleDeleteConfirm = () => {
    setShowModal(false);
    localStorage.removeItem("doctor-app");
    dispatch(logout());
    navigate("/");
    localStorage.removeItem("feedbackPopup");
  };

  useEffect(() => {
    const doctorData = JSON.parse(
      localStorage.getItem("doctor-app")
    ).doctorData;
    // const isHod = doctorData.is_hod;
    // console.log("isHodlocalStorage@@@@", isHod);
    if (doctorData) {
      setIsHod(doctorData.is_hod);
    }
  }, []);

  useEffect(() => {
    dispatch(notifyNewChatRes());

    dispatch(getAllNotifications());
  }, [loaction?.pathname]);

  const handleToggleChange = () => {
    dispatch(
      changeAppointmentNotificaiton({ isActive: !isNotificationActive })
    );
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            // backgroundColor: "red",
            zIndex: 999,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          position: "fixed",
          left: 0,
          top: 0,
          width: "280px",
          height: "100%",
          backgroundColor: "#fff",
          zIndex: 1000,
        }}
      >
        <div className="sidebar-inr">
          <div
            className="sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
            style={{ cursor: "pointer", padding: "10px", textAlign: "right" }}
          >
            <i className="fa-solid fa-times-circle"></i>
          </div>
          <div className="doc-profile-wrp">
            <div className="doc-img ml-0 ms-0">
              <img
                src={`${BaseUrl?.BaseUrl}${user?.profile_path}`}
                alt="Doctor"
              />
            </div>
            <div className="doc-profile-body">
              <p>{user?.prefixed_name || "Doctor Name"}</p>
              <Link
                to="/UserProfile"
                className="view-profile"
                onClick={() => setIsSidebarOpen(false)}
              >
                View my profile
              </Link>
            </div>
          </div>

          <div className="sidebar-nav">
            <ul>
              <li>
                <img
                  src="/images/dash.svg"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                <Link to="/doctor-home" onClick={() => setIsSidebarOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="notification-set">
                  <div className="not-set-left">
                    <img
                      src="/images/notification-icon.svg"
                      alt="Notification"
                      style={{ height: "18px", width: "18px" }}
                    />
                    <span>Notification</span>
                  </div>
                  <div className="not-set-right">
                    <div className="not-toggler">
                      <input
                        type="checkbox"
                        id="notificationToggle"
                        checked={isNotificationActive}
                        onChange={handleToggleChange}
                      />
                      <label htmlFor="notificationToggle"></label>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <img
                  src="/images/appointment-icon.svg"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                <Link
                  to="/my-appointments"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  My Appointments
                </Link>
              </li>
              <li>
                <img
                  src="/images/pending-prescription-icon.svg"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                <Link
                  to="/pendingprescription"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Pending prescriptions
                </Link>
              </li>
              <li>
                <img
                  src="/images/past-patients-icon.svg"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                <Link to="/pastpatient" onClick={() => setIsSidebarOpen(false)}>
                  My Past Patients
                </Link>
              </li>
              {/* <li>
                <img src="/images/terms-of-service-icon.svg" alt="Icon" />
                <Link to="/terms">Terms of services</Link>
              </li>
              <li>
                <img src="/images/sidebar-nav-link-icon.svg" alt="Icon" />
                <Link to="/privacy">Privacy Policy</Link>
              </li> */}

              <li>
                <img
                  src="https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/database-delete-icon.png"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                {/* <CgUnavailable style={{ height: "20px", width: "20px" }}/> */}
                <Link
                  to="/doctorUnavailibility"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Mark Unavailability
                </Link>
              </li>

              {isHod && user?.is_hod && (
                <li>
                  <img
                    // src="data:image/png;base64,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"
                    src="/images/user-tie.com.svg"
                    alt="Icon"
                    style={{ height: "18px", width: "18px" }}
                  />

                  <Link to="/hod" onClick={() => setIsSidebarOpen(false)}>
                    Unavailability Management
                  </Link>
                </li>
              )}

              <li className="logout">
                <img
                  src="/images/menu-logout-icon.svg"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                <Button
                  variant="link"
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "600",
                    textTransform: "none",
                  }}
                  onClick={() => setShowModal(true)}
                >
                  Logout <i className="fa-solid fa-chevron-right"></i>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Top Header */}
      <div
        className="doc-panel-header"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "15px 10px",
          background: "#fff",
          justifyContent: "space-between",
        }}
      >
        <button
          type="button"
          className="docpnl-hdr-toggler"
          onClick={() => setIsSidebarOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          {invitedUser?.data?.type === "admin" ? null : (
            <img src="/images/bars.svg" alt="Menu" />
          )}
        </button>
        <div className="logo">
          <Link to="/doctor-home">
            <img src="/images/logo.png" alt="Logo" />
          </Link>
        </div>
        <div className="notifications">
          {invitedUser?.data?.type === "admin" ? null : (
            <Link to="/notifications">
              <img src="/images/notification-icon-2.svg" alt="Notification" />
            </Link>
          )}

          {/* {unreadCounts > 0 && <span></span>} */}
          {invitedUser?.data?.type === "admin"
            ? null
            : count > 0 && (
                <div
                  style={{
                    backgroundColor: "red",
                    width: count > 9 ? "25px" : "20px",
                    height: "20px",
                    borderRadius: "10px",
                    color: "white",
                    position: "absolute",
                    top: -10,
                    right: 0,
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      marginLeft: 5,
                    }}
                  >
                    {count > 9 ? "9+" : count}
                  </p>
                </div>
              )}

          {/* If count is 0, then check unreadCounts */}
          {count === 0 && unreadCounts > 0 && (
            <span></span> // An empty span will render as nothing visible
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showModal && (
        <div
          className="modal fade show popup-wrp small-pop dash-pop"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <button
                type="button"
                className="close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <span aria-hidden="true">
                  <img src="/images/cross-blue.png" alt="Close" />
                </span>
              </button>
              <div className="modal-icon">
                <img src="/images/logout-icon.svg" alt="Icon" />
              </div>
              <div className="modal-header">
                <h2>Logout</h2>
                <p>Are you sure you want to logout?</p>
              </div>
              <div className="modal-footer btn-wrp">
                <button
                  type="button"
                  className="cmn-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="cmn-btn orange-btn"
                  onClick={handleDeleteConfirm}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
