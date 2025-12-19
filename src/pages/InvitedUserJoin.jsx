import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import baseUrl from "../config/BaseUrl";
import { useDispatch } from "react-redux";
import { setInvitedUserData } from "../redux/slices/infoSlice";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

function InvitedUserJoin() {
  const doctorData = localStorage.getItem("doctor-app");
  const TempStopApi = localStorage.getItem("anyoneJoin");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ongoing, setOngoingCall] = useState(null);
  const [showButton, setShowButton] = useState(false);

  const { id } = useParams();
  // const id = 489;
  const [loadingText, setLoadingText] = useState(
    "Please wait, we will connect you to the video call..."
  );

  useEffect(() => {
    joinAsAdmin();
  }, []);

  //

  //

  useEffect(() => {
    if (ongoing === false) {
      // Wait 2 seconds, then show Back button
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [ongoing]);

  const joinAsAdmin = async () => {
    try {
      const formData = new FormData();
      formData.append("appointmentId", id);
      formData.append("role", "admin");

      const response = await axios.post(
        `${baseUrl}api/call/admin-join`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        //

        setOngoingCall(response?.data?.data?.ongoing);
        dispatch(setInvitedUserData(response.data));
        if (!doctorData) {
          localStorage.setItem("doctor-app", true);
          localStorage.setItem("anyoneJoin", "true");
        }
        //

        if (response?.data?.data?.ongoing == true) {
          navigate("/VideoCall", {
            state: {
              id: response?.data?.data?.appointmentId,
              // patientId: response?.data?.data?.appointmentId,
              patientId: response?.data?.data?.basic_information?.id,
              name: response?.data?.data?.basic_information?.name,
              time_period: response?.data?.data?.slot,
              userRole: response?.data?.data?.type,

              ObjNavigate: {
                ChName: response?.data?.data?.channelName,
                UDID: response?.data?.data?.uid,
                AppID: response?.data?.data?.appId,
                Token: response?.data?.data?.token,
              },
            },
          });
        } else if (response?.data?.data?.ongoing == false) {
          toast.success("Sorry there is no ongoing call", {
            duration: 10000, // 10000 milliseconds = 10 seconds
          });
        }
      }

      // Navigate after success (optional)
      // navigate(`/call/${response.data.data.channelName}`);
    } catch (error) {
      console.error("Error joining admin:", error);
      setLoadingText("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loader}></div>

      {/* Text always shows first */}
      {!showButton && <p style={styles.text}>{loadingText}</p>}

      {/* Button shows after 2 seconds when ongoing is false */}
      {showButton && <Button onClick={() => navigate(-1)}>Go Back</Button>}
    </div>
  );
}

export default InvitedUserJoin;

// ---- Inline CSS styles ----
const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "500",
    gap: "20px",
  },

  loader: {
    width: "50px",
    height: "50px",
    border: "6px solid #ddd",
    borderTop: "6px solid #4A90E2",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  text: {
    textAlign: "center",
    color: "#333",
  },
};
