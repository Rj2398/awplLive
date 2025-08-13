import axios from "axios";
import baseUrl from "../config/BaseUrl";

const API = axios.create({
  // baseURL: "https://awplconnectadmin.tgastaging.com/api",
  baseURL: `${baseUrl}api`,
});

export const emailCheck = (formData) => API.post("/email-valid", formData);

export const login = (formData) => API.post("/login-password", formData);

export const forgotPassword = (formData) =>
  API.post("/forgot-password", formData);

export const otpVerification = (formData) =>
  API.post("/otp-verfication", formData);

export const resendOtp = (formData) => API.post("/resend-otp", formData);

export const resetPassword = (formData) =>
  API.post("/reset-password", formData);

export const firstLogin = (formData) => API.post("/first-login", formData);

export const getDoctorProfile = () =>
  API.get(`/doctor/profile`, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

export const doctorProfileUpdate = (formData) =>
  API.post("/doctor/profile/update", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const doctorPhotoUpdate = (formData) =>
  API.post("/doctor/profile/photo", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteDoctorPhoto = () =>
  API.delete("/doctor/profile/photo", {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

export const doctorPendingPrescriptions = () =>
  API.get("/doctor/prescriptions/pending", {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

export const doctorCompletedPrescriptions = () =>
  API.get("/doctor/prescriptions/completed", {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

export const getScheduleTime = (formData) =>
  API.post("/getScheduleTime", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

export const symptomUploadDetails = (formData) =>
  API.post("/get_symptom", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const completePrescription = (formData) =>
  API.post("/doctor/prescriptions/submit", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "application/json",
    },
  });

//
//code for join call
export const getVideoCall = (formData) =>
  API.post("/create-channel", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "application/json",
    },
  });
//code for push notification
export const sendPush = (formData) =>
  API.post("/call-joined", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "application/json",
    },
  });

export const doctorHomeDashboard = (formData) =>
  API.post("/doctor-home", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const logout = (id) =>
  API.post("/api/logout", id, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

// --------------------------------------- My Appointments Page Api ---------------------------------------------

export const getAllUpcomingAppointment = () =>
  API.post(
    `/doctor/appointments/upcoming`,
    {},
    {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("doctor-app"))?.token
        }`,
      },
    }
  );

// export const getAllCompletedAppointment = () => API.post(`/doctor/appointments/completed`,formData,  {
//   headers: {
//     'Authorization': `Bearer ${JSON.parse(localStorage.getItem("doctor-app"))?.token}`,
//     "Content-Type": "multipart/form-data",
//   },
// });
export const getAllCompletedAppointment = () =>
  API.post(
    `/doctor/appointments/completed`,
    {},
    {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("doctor-app"))?.token
        }`,
      },
    }
  );

export const getAllCanceledAppointment = () =>
  API.post(
    `/doctor/appointments/cancelled`,
    {},
    {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("doctor-app"))?.token
        }`,
      },
    }
  );

export const getAllIncompletedAppointment = () =>
  API.post(
    `/doctor/appointments/incomplete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("doctor-app"))?.token
        }`,
      },
    }
  );

export const getAllMissedAppointment = () =>
  API.post(
    `/doctor/appointments/missed`,
    {},
    {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("doctor-app"))?.token
        }`,
      },
    }
  );
export const doctorCanceledAppointment = (formData) =>
  API.post("/doctor/appointments/cancel", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const patientAppointmentDetails = (formData) =>
  API.post("/doctor/appointments/details", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const completeAppointmentPatientDetails = (formData) =>
  API.post("/doctor/prescriptions/details", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const getPatientProfileData = (formData) =>
  API.post("/doctor/patients/profile", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

//Download Pdf
export const prescriptionDownload = (formData) =>
  API.post("/doctor/prescriptions/download", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob", // important for file download
  });

export const getAllNotifications = () =>
  API.get("/doctor/notifications", {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

export const deleteNotification = (notification_ids) =>
  API.delete("/doctor/notifications/delete", {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "application/json",
    },
    data: { notification_ids },
  });

export const markAllRead = (formData) =>
  API.patch("/doctor/notifications/read", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "application/json",
    },
  });

export const medicineSearch = (formData) =>
  API.post("/doctor/medicines/search", null, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });
export const unreadCount = () =>
  API.get("/doctor/notifications/unread-count", {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

export const checkToggleNotification = () =>
  API.get("/doctor/appointment-notifications-status", {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

export const changeAppointmentNotificaiton = (formData) =>
  API.patch("/doctor/appointment-notifications-toggle", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

export const pastPatient = (formData) =>
  API.post("/doctor/patients/past", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const reminderPopup = (formData) =>
  API.post("/doctor/appointments/reminders", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

export const bookAppointment = (formData) =>
  API.post("/doctor/appointments/scheduleAppointmentByDoctor", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const videoCallSubmit = (formData) =>
  API.post("/doctor/prescriptions/submit_appointment_prescription", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "application/json",
    },
  });

export const getPrscriveMedicine = (formData) =>
  API.post("/doctor/treatments", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

//

export const notifyNewChatRes = (formData) =>
  API.post("/getChat", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

//new changes by client

export const unavailabilityRequest = (formData) =>
  API.post("/doctor/unavailability/submit", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

//mark unavailability screen
export const doctorUnavailability = () =>
  API.get("/doctor/unavailability/list", {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

//HOD SCREEN REQUESTS
export const hodScreenRequestsList = () =>
  API.get("/doctor/unavailability/all-list", {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
    },
  });

export const hodRequestsConfirmButton = (formData) =>
  API.post("/doctor/unavailability/confirm", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const hodRequestsRespondButton = (formData) =>
  API.post("/doctor/unavailability/respond", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const hodScreenDoctorsList = (formData) =>
  API.post("/doctor/unavailability/doctors", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const markDoctorAvailable = (formData) =>
  API.post("/doctor/unavailability/mark-doctor-available", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

export const unavailabilitySubmitByHod = (formData) =>
  API.post("/doctor/unavailability/submit-by-hod", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

//

export const feedbackapi = (formData) =>
  API.post("/submitFeedback", formData, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("doctor-app"))?.token
      }`,
      "Content-Type": "multipart/form-data",
    },
  });

// export const logout = (id) => API.post('/api/logout', id, {
//   headers: {
//     'Authorization': `Bearer ${JSON.parse(localStorage.getItem("doctor-app"))?.token}`,
//   }
// });
