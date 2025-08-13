import React, { useEffect, useState } from "react";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  deleteNotification,
  getAllNotifications,
  markAllRead,
  unreadCount,
} from "../redux/slices/notificationSlice";
import sucessIcon from "/images/calendar-tick-success.svg";
import CancelIcon from "/images/calendar-cancelled.svg";
import ScheduleIcon from "/images/calendar-changes.svg";
// import Chat_Icon from "/images/login/chat_icon.png";
import Chat_Icon from "/images/login/chat_icon_2.png";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctorNotifications, loading, error } = useSelector(
    (state) => state.notification
  );

  // const [readNotificationOneByone, setReadNotificationOneByone] = useState([]);
  // console.log(readNotificationOneByone, "Read notification one by one****");
  // console.log("older data",doctorNotifications?.older)
  // console.log("older data",doctorNotifications?.today)
  // console.log("older data",doctorNotifications?.yesterday)

  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [finalNotification, setFinalNotification] = useState([]);

  // console.log(finalNotification, "********final data comes from");

  // const todayNotfication = doctorNotifications?.today?.map(n => n.id) ?? [];
  // const yesterdayNotfication = doctorNotifications?.yesterday?.map(n => n.id) ?? [];
  // const olderNotfication = doctorNotifications?.older?.map(n => n.id) ?? [];

  // const finalNotification = [...todayNotfication, ...yesterdayNotfication, ...olderNotfication];

  useEffect(() => {
    const todayNotfication = doctorNotifications?.today?.map((n) => n.id) ?? [];
    const yesterdayNotfication =
      doctorNotifications?.yesterday?.map((n) => n.id) ?? [];
    const olderNotfication = doctorNotifications?.older?.map((n) => n.id) ?? [];
    setFinalNotification([
      ...todayNotfication,
      ...yesterdayNotfication,
      ...olderNotfication,
    ]);
  }, [doctorNotifications]);

  const handleSelectAll = () => {
    if (selectedIds.length === finalNotification.length) {
      setSelectedIds([]);
    } else {
      console.log(finalNotification, "fff");
      setSelectedIds(finalNotification);
    }
  };

  // console.log("selectedIds", selectedIds);

  // const handleDeleteAll = () => {
  //   if (selectedIds.length === 0) return;
  //   dispatch(deleteNotification(selectedIds));
  //   // setNotifications(notifications.filter(n => !selectedIds.includes(n?.id)));
  //   setSelectedIds([]);
  // };
  // console.log("selectedIds.length", selectedIds.length);
  const handleDeleteAll = () => {
    // console.log("hello...................");
    // console.log("selectedIds.length1111111111", selectedIds.length);
    // console.log("finalNotification.length1111111111", finalNotification.length);

    if (selectedIds.length === 0) {
      toast.error("Please select atleast one notification");
      // console.log("why notification toast is not coming");
      return;
    }
    dispatch(deleteNotification(selectedIds)).then(() => {
      setSelectedIds([]);
      dispatch(unreadCount());

      dispatch(getAllNotifications()); // Refresh the list
    });
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllRead({ notification_ids: finalNotification }));
    dispatch(getAllNotifications());
    dispatch(unreadCount());
  };

  //notification read one by one

  const handleMarkOneByOne = async (id) => {
    if (!id) return;
    // console.log(id, "hello user*********");

    try {
      const read = [String(id)]; // Convert id to string and store in array
      dispatch(markAllRead({ notification_ids: read }));
      // deleteOnByOne(id);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // const deleteOnByOne = async (id) => {
  //   console.log("delete api call");
  //   if (!id) return;
  //   try {
  //     const read = [id];
  //     await dispatch(deleteNotification({ notification_ids: read }));
  //   } catch (error) {
  //     console.error("deleting api from error:", error);
  //   }
  // };

  const renderNotifications = (group) => {
    // const groupItems = notifications.filter(n => n.group === group);
    const groupItems = doctorNotifications[group];
    if (groupItems?.length == 0) return null;

    return (
      <div className="notifications-group">
        <div className="group-header">
          <h2>{group?.charAt(0).toUpperCase() + group?.slice(1)}</h2>
          {/* <button className="mark-all-btn" onClick={() => handleMarkAllAsRead(group)}>
            Mark all as read
          </button> */}
        </div>
        <ul className="notifications-list">
          {groupItems?.map((n) => (
            <li
              key={n.id}
              className="notification-item"
              onClick={() => {
                if (n?.type === "new_message") {
                  // Use strict equality (===)
                  // navigate("/completed-appointment-screen", {
                  //   state: {
                  //     // This is the 'state' object
                  //     id: n?.notification_data?.prescription_id,
                  //     patientId: n?.notification_data?.patient_id,
                  //     chat_id: n?.notification_data?.chat_channel,
                  //     ds_code: n?.notification_data?.ds_code,
                  //     referred: n?.notification_data?.referred,
                  //   }, // Close the 'state' object here
                  // }); // Close the navigate function call and end the statement
                } else {
                  toggleSelect(n?.id);
                }
              }}
              style={{
                backgroundColor: selectedIds.includes(n?.id)
                  ? "#c0c0c0" // Darker gray for selected
                  : n.is_read === "true" //yha data backend se fetch hoga
                  ? "#f0f0f0" // Light gray for read
                  : "#ffffff", // White for unread
                borderLeft: selectedIds.includes(n?.id)
                  ? "3px solid #d0d0d0" // Slightly darker border for selected
                  : "none",
                color: selectedIds.includes(n?.id) ? "black" : "black",
                cursor: "pointer",
              }}
            >
              <div className="notif-left">
                <div
                  className={`notif-icon ${
                    n?.icon?.includes("success")
                      ? "success"
                      : n?.type?.includes("appointment_cancelled")
                      ? "cancelled"
                      : "changed"
                  }`}
                >
                  <img
                    src={
                      n?.type?.includes("appointment_cancelled")
                        ? CancelIcon
                        : n?.type?.includes("appointment_success")
                        ? sucessIcon
                        : n?.type?.includes("new_message")
                        ? Chat_Icon
                        : ScheduleIcon
                    }
                    alt="Icon"
                  />
                </div>

                {n?.type == "new_message" ? (
                  <div className="notif-text">
                    <h3
                      style={{
                        fontWeight: n.is_read === "true" ? "normal" : "bold",
                      }}
                      onClick={() => {
                        navigate("/completed-appointment-screen", {
                          state: {
                            id: n?.notification_data?.appointment_id,
                            patientId: n?.notification_data?.patient_id,
                            chat_id: n?.notification_data?.chat_channel,
                            ds_code: n?.notification_data?.ds_code,
                            referred: n?.notification_data?.referred,
                            prescription_id:
                              n?.notification_data?.prescription_id,
                          },
                        });

                        // setReadNotificationOneByone(n?.id);

                        // deleteOneByOne(n?.id);
                        handleMarkOneByOne(n?.id);
                      }}
                    >
                      {n.title}
                    </h3>
                    {/* <p>{n?.message}</p> */}
                    <p
                      onClick={() => {
                        navigate("/completed-appointment-screen", {
                          state: {
                            id: n?.notification_data?.appointment_id,
                            patientId: n?.notification_data?.patient_id,
                            chat_id: n?.notification_data?.chat_channel,
                            ds_code: n?.notification_data?.ds_code,
                            referred: n?.notification_data?.referred,
                            prescription_id:
                              n?.notification_data?.prescription_id,
                          },
                        });

                        // setReadNotificationOneByone(n?.id);

                        // deleteOneByOne(n?.id);
                        handleMarkOneByOne(n?.id);
                      }}
                    >
                      {n?.message?.trim()}
                      {n?.message?.trim().endsWith(".") ? "" : "."}
                    </p>
                  </div>
                ) : (
                  <div className="notif-text">
                    <h3
                      style={{
                        fontWeight: n.is_read === "true" ? "normal" : "bold",
                      }}
                    >
                      {n.title}
                    </h3>
                    {/* <p>{n?.message}</p> */}
                    <p>
                      {n?.message?.trim()}
                      {n?.message?.trim().endsWith(".") ? "" : "."}
                    </p>
                  </div>
                )}
              </div>
              {/* <div className="notif-time">{n.created_at}</div> */}

              <div style={{}}>
                <div
                  className="notif-time"
                  style={
                    formatNotificationTime(n.created_at) === "Just now"
                      ? { width: "69px" }
                      : {}
                  }
                >
                  {formatNotificationTime(n.created_at)}
                </div>

                {n?.type == "new_message" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "10px",
                    }}
                  >
                    {/* <label htmlFor={`delete-notification-${n.id}`}>
                      Delete
                    </label> */}
                    <input
                      type="checkbox"
                      id={`delete-notification-${n.id}`} // Unique ID for each checkbox
                      name="delete-notification"
                      value={n.id} // The value should be the notification's ID
                      onChange={() => toggleSelect(n?.id)} // This is the key change!
                      checked={selectedIds.includes(n?.id)} // This ensures the checkbox reflects the state
                      style={{ transform: "scale(1.5)", marginLeft: 5 }} // Increase size by 50%
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // function for notification timing.
  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    }
    // For today's notifications (less than 24 hours)
    else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    }
    // For yesterday's notifications (24-48 hours)
    else if (diffInSeconds < 172800) {
      return "1d";
    }
    // For older notifications (more than 48 hours)
    else {
      const days = Math.floor(diffInSeconds / 86400);
      if (days < 7) {
        return `${days}d`;
      } else {
        const weeks = Math.floor(days / 7);
        return `${weeks}w`;
      }
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
          <div className="doc-panel-body" style={{ minHeight: "450px" }}>
            <div className="notifications-section">
              <div className="docpnl-sec-head text-center">
                <h1 className="h2-title px-5">Notifications</h1>
                <div className="back-btn" onClick={() => window.history.back()}>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <img src="./images/left-arrow.svg" alt="Back" />
                  </a>
                </div>
              </div>

              {/* Bulk Actions */}
              {(doctorNotifications?.today?.length > 0 ||
                doctorNotifications?.yesterday?.length > 0 ||
                doctorNotifications?.older?.length > 0) && (
                <div className="bulk-actions">
                  <button className="select-all-btn" onClick={handleSelectAll}>
                    <label htmlFor="selectAll">Select all</label>
                    <div className="radio-btn-wrp">
                      <input
                        type="radio"
                        name="selectAction"
                        id="selectAll"
                        checked={
                          finalNotification.length > 0 &&
                          selectedIds.length === finalNotification.length
                        }
                        readOnly
                      />

                      <span></span>
                    </div>
                  </button>
                  <button className="delete-all-btn" onClick={handleDeleteAll}>
                    <label htmlFor="deleteAll">Delete</label>
                    <div className="radio-btn-wrp">
                      <input
                        type="radio"
                        name="selectAction"
                        id="deleteAll"
                        disabled={selectedIds.length === 0}
                      />
                      <span></span>
                    </div>
                  </button>
                </div>
              )}

              {/* <div className="group-header">
              <button className="mark-all-btn" onClick={() => handleMarkAllAsRead(group)}>
              Mark all as read
            </button>
            </div> */}

              {/* Show "Mark all as read" only if any notifications exist */}
              {(doctorNotifications?.today?.length > 0 ||
                doctorNotifications?.yesterday?.length > 0 ||
                doctorNotifications?.older?.length > 0) && (
                <div
                  className="group-header"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <button
                    className="mark-all-btn"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
              )}

              {/* Notification Lists */}
              {/* {renderNotifications(doctorNotifications?.data?.older)}
            {renderNotifications(doctorNotifications?.data?.today)} */}
              {/* {renderNotifications('yesterday')} */}
              {/* {renderNotifications('today')}
            {renderNotifications('yesterday')}
            {renderNotifications('older')} */}
              {doctorNotifications?.today?.length === 0 &&
              doctorNotifications?.yesterday?.length === 0 &&
              doctorNotifications?.older?.length === 0 ? (
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "500",
                    color: "#6b7280",
                    textAlign: "center",
                    margin: "2rem 0",
                    padding: "1.5rem",
                    // backgroundColor: '#f9fafb',
                    borderRadius: "0.5rem",
                    // boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    width: "100%",
                    maxWidth: "600px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {loading ? "Loading..." : "No Notifications found"}
                </p>
              ) : (
                <>
                  {renderNotifications("today")}
                  {renderNotifications("yesterday")}
                  {renderNotifications("older")}
                </>
              )}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </main>
  );
};

export default Notifications;
