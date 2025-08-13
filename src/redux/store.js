"use client";
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice.js";
import faqSlice from "./slices/faqSlice.js";
import dataSlice from "./slices/dataSlice.js";
import myAppointmentSlice from "./slices/myAppointmentSlice.js";
import prescriptionSlice from "./slices/prescriptionSlice.js";
import patientProfileSlice from "./slices/patientProfileSlice.js";
import notificationSlice from "./slices/notificationSlice.js";
import infoSlice from "./slices/infoSlice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    faqs: faqSlice,
    userdata: dataSlice,
    appointments: myAppointmentSlice,
    prescriptions: prescriptionSlice,
    patientProfile: patientProfileSlice,
    notification: notificationSlice,
    info: infoSlice,

    // patientprofile: patientProfileSlice,
  },
  devTools: true,
});

export default store;
