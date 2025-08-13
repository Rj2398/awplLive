// export default GlobalReminderModal;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reminderPopup } from "../../redux/slices/notificationSlice";

const GlobalReminderModal = () => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { reminderPopupData, loading } = useSelector(
    (state) => state.notification
  );
  // console.log(reminderPopupData, "123");
  const normalizeISOString = (isoString) => {
    // Normalize to 3 fractional digits for compatibility
    return isoString.replace(/(\.\d{3})\d*(Z)/, "$1$2");
  };

  useEffect(() => {
    dispatch(reminderPopup());
  }, [dispatch]);

  // const reminderPopupData = {
  //   // Set this 2–3 minutes ahead of your current time in UTC
  //   appointment_datetime: "2025-06-16T06:45:00.000000Z", // 12:15 PM IST
  //   patient_name: "Test Patient"
  // };

  useEffect(() => {
    if (!reminderPopupData?.[0]?.appointment_datetime) return;

    const normalizedDateTimeStr = normalizeISOString(
      reminderPopupData[0].appointment_datetime
    );
    const appointmentDateTime = new Date(normalizedDateTimeStr);

    if (isNaN(appointmentDateTime)) {
      console.error(
        "Invalid appointment datetime:",
        reminderPopupData[0].appointment_datetime
      );
      return;
    }

    const now = new Date();
    const diffInMs = appointmentDateTime.getTime() - now.getTime();

    const reminders = [{ minutesBefore: 10 }, { minutesBefore: 2 }];
    const timers = [];

    reminders.forEach(({ minutesBefore }) => {
      const reminderTime = diffInMs - minutesBefore * 60 * 1000;
      if (reminderTime > 0) {
        const timer = setTimeout(() => {
          const msg = `Your Appointment Starts in ${minutesBefore} Minutes!`;
          setReminderMessage(msg);
          setShowReminderModal(true);
        }, reminderTime);
        timers.push(timer);
      }
    });

    if (diffInMs > 0) {
      const logTimer = setTimeout(() => {
        // console.log("Timer is completed: Appointment time reached.");
      }, diffInMs);
      timers.push(logTimer);
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [reminderPopupData]);

  const formatDateTime = (isoString) => {
    const normalized = normalizeISOString(isoString);
    const date = new Date(normalized);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <>
      {showReminderModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div
              className="modal-content text-center position-relative shadow"
              style={{
                width: "400px",
                minHeight: "280px",
                borderRadius: "20px",
                padding: "30px 20px",
              }}
            >
              <button
                type="button"
                onClick={() => setShowReminderModal(false)}
                className="position-absolute top-0 end-0 m-3 border-0 bg-transparent"
                aria-label="Close"
              >
                <img
                  src="./images/cross-blue.png"
                  alt="Close Icon"
                  style={{ width: "24px", height: "24px" }}
                />
              </button>

              <div className="modal-icon mb-3">
                <img
                  src="./images/bell-icon.svg"
                  alt="Reminder Icon"
                  style={{ width: "40px", height: "40px" }}
                />
              </div>

              <div className="modal-header border-0 flex-column align-items-center p-0">
                <h2
                  className="fw-bold mb-2"
                  style={{ fontSize: "22px", color: "#333" }}
                >
                  Reminder:
                </h2>
                <p
                  className="m-0"
                  style={{ color: "#009CDE", fontWeight: "500" }}
                >
                  {reminderMessage}
                </p>
              </div>

              <div className="modal-body p-0 mt-4">
                <div className="text-muted mb-2">
                  Patient's Name:{" "}
                  <span className="fw-medium" style={{ color: "#356598" }}>
                    {reminderPopupData?.[0]?.patient_name || "Sunil"}
                  </span>
                </div>

                <div className="text-muted">
                  Date and Time:{" "}
                  <span className="fw-medium" style={{ color: "#356598" }}>
                    {formatDateTime(
                      reminderPopupData?.[0]?.appointment_datetime
                    )}
                  </span>
                </div>

                <button
                  // className="orange-btn"
                  style={{
                    backgroundColor: "#F47820",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: 20,
                  }}
                  onClick={() => setShowReminderModal(false)} // Assuming you want to close the modal on "Okay"
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalReminderModal;
