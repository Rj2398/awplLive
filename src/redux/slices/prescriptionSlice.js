import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";

// For Unauthenticated User
function logouterror() {
  // toast.error("Token Expired");
  // localStorage.removeItem("doctor-app");
  // setTimeout(() => {
  //   // window.location.href = "/";
  // }, 1000);

  const anyoneJoin = localStorage.getItem("anyoneJoin");
  localStorage.removeItem("doctor-app");
  if (!anyoneJoin) {
    // toast.error("Token Expired");
  } else {
    toast.error("Token Expired");
  }

  localStorage.removeItem("nfc-admin");
  setTimeout(() => {
    !anyoneJoin ? (window.location.href = "/") : null;
  }, 1000);
}

// Get All Upcoming Appointments
export const getScheduleTime = createAsyncThunk(
  "doctor/getScheduleTime",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.getScheduleTime(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// completed appointment screen /doctor/prescriptions/details API
export const completeAppointmentPatientDetails = createAsyncThunk(
  "doctor/completeAppointmentPatientDetails",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.completeAppointmentPatientDetails(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// download
export const prescriptionDownload = createAsyncThunk(
  "doctor/prescriptionDownload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.prescriptionDownload(formData);
      // console.log(response, 'dddd')
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// book Appointment
export const bookAppointment = createAsyncThunk(
  "doctor/bookAppointment",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.bookAppointment(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState: {
    scheduleTime: [],
    bookAppointments: [],
    prescription_Download: [],
    completeAppointmentPatientDetail: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getScheduleTime.pending, (state) => {
        state.upcomingLoading = true;
        state.error = null;
      })
      .addCase(getScheduleTime.fulfilled, (state, action) => {
        state.upcomingLoading = false;
        state.scheduleTime = action.payload?.data?.available_time_slots;
      })
      .addCase(getScheduleTime.rejected, (state, action) => {
        state.upcomingLoading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      // completed appointment screen /doctor/prescriptions/details API extra reducer
      .addCase(completeAppointmentPatientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeAppointmentPatientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.completeAppointmentPatientDetail = action.payload?.data;
      })
      .addCase(completeAppointmentPatientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      //download pdf
      .addCase(prescriptionDownload.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(prescriptionDownload.fulfilled, (state, action) => {
        state.loading = false;
        // state.prescription_Download = action.payload;
      })
      .addCase(prescriptionDownload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Book Appointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.bookAppointments = action.payload;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      });
  },
});

export default prescriptionSlice.reducer;
