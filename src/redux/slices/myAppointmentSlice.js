import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";

// For Unauthenticated User
function logouterror() {
  toast.error("Token Expired");
  localStorage.removeItem("doctor-app");
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
}

// Get All Upcoming Appointments
export const getAllUpcomingAppointment = createAsyncThunk(
  "user/getAllUpcomingAppointment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllUpcomingAppointment();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllIncompletedAppointment = createAsyncThunk(
  "user/getAllIncompletedAppointment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllIncompletedAppointment();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllMissedAppointment = createAsyncThunk(
  "user/getAllMissedAppointment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllMissedAppointment();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//
// export const getJoinVideoCall = createAsyncThunk(
//   "doctor/appointments/upcoming",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.getAllUpcomingAppointment();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const getJoinVideoCall = createAsyncThunk(
  "create-channel",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.getVideoCall(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendPushNotification = createAsyncThunk(
  "/call-notification",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.sendPush(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//sendPush
// Get All Complete Appointments
// export const getAllCompletedAppointment = createAsyncThunk("user/getAllCompletedAppointment", async (formData, { rejectWithValue }) => {
//   try {
//     const response = await api.getAllCompletedAppointment(formData);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data || error.message);
//   }
// });
export const getAllCompletedAppointment = createAsyncThunk(
  "user/getAllCompletedAppointment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllCompletedAppointment();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Get All cancelled Appointments
export const getAllCanceledAppointment = createAsyncThunk(
  "user/getAllCanceledAppointment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllCanceledAppointment();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Doctor Canceled Appointments API
export const doctorCanceledAppointment = createAsyncThunk(
  "user/doctorCanceledAppointment",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.doctorCanceledAppointment(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Patient Appointment Details API
export const patientAppointmentDetails = createAsyncThunk(
  "user/patientAppointmentDetails",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.patientAppointmentDetails(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create User
export const getUserId = createAsyncThunk(
  "user/userId",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getUserId();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  "user/delete",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.deleteUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice

const myAppointmentSlice = createSlice({
  name: "Appointment",
  initialState: {
    upcommingAppointment: [],
    upcomingLoading: false,
    completedAppointment: [],
    completedLoading: false,
    cancelledAppointment: [],
    cancelledLoading: false,
    incompletedAppointment: [],
    missedAppointment: [],
    incompletedLoading: false,
    missedLoading: false,
    doctorCancelledAppointment: [],
    doctorcancelledLoading: false,
    patientAppointmentsDetail: [],
    patientAppointmentsDetailLoading: false,
    channelDetails: null,
    channelDetailsLoading: false,
    pushNotificationLoading: false,
    pushnotification: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllUpcomingAppointment.pending, (state) => {
        state.upcomingLoading = true;
        state.error = null;
      })
      .addCase(getAllUpcomingAppointment.fulfilled, (state, action) => {
        state.upcomingLoading = false;
        state.upcommingAppointment = action.payload?.data?.upcomingAppointments;
      })
      .addCase(getAllUpcomingAppointment.rejected, (state, action) => {
        state.upcomingLoading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      .addCase(getAllCompletedAppointment.pending, (state) => {
        state.completedLoading = true;
        state.error = null;
      })
      .addCase(getAllCompletedAppointment.fulfilled, (state, action) => {
        state.completedLoading = false;
        state.completedAppointment = action.payload.data.completed_appointments;
      })
      .addCase(getAllCompletedAppointment.rejected, (state, action) => {
        state.completedLoading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      .addCase(getAllCanceledAppointment.pending, (state) => {
        state.cancelledLoading = true;
        state.error = null;
      })
      .addCase(getAllCanceledAppointment.fulfilled, (state, action) => {
        state.cancelledLoading = false;
        state.cancelledAppointment = action.payload.data.cancelled_appointments;
      })
      .addCase(getAllCanceledAppointment.rejected, (state, action) => {
        state.cancelledLoading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      .addCase(getAllIncompletedAppointment.pending, (state) => {
        state.incompletedLoading = true;
        state.error = null;
      })
      .addCase(getAllIncompletedAppointment.fulfilled, (state, action) => {
        state.incompletedLoading = false;
        state.incompletedAppointment =
          action.payload?.data?.incomplete_appointments;
      })
      .addCase(getAllIncompletedAppointment.rejected, (state, action) => {
        state.incompletedLoading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      .addCase(getAllMissedAppointment.pending, (state) => {
        state.missedLoading = true;
        state.error = null;
      })
      .addCase(getAllMissedAppointment.fulfilled, (state, action) => {
        state.missedLoading = false;
        state.missedAppointment = action.payload?.data?.missed_appointments;
      })
      .addCase(getAllMissedAppointment.rejected, (state, action) => {
        state.missedLoading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Doctor Canceled Appointments API
      .addCase(doctorCanceledAppointment.pending, (state) => {
        state.doctorcancelledLoading = true;
        state.error = null;
      })
      .addCase(doctorCanceledAppointment.fulfilled, (state, action) => {
        state.doctorcancelledLoading = false;
        state.doctorcancelledAppointment = action.payload;
      })
      .addCase(doctorCanceledAppointment.rejected, (state, action) => {
        state.doctorcancelledLoading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Patient Appointment Details API
      .addCase(patientAppointmentDetails.pending, (state) => {
        state.patientAppointmentsDetailLoading = true;
        state.error = null;
      })
      .addCase(patientAppointmentDetails.fulfilled, (state, action) => {
        state.patientAppointmentsDetailLoading = false;
        state.patientAppointmentsDetail = action.payload.data;
      })
      .addCase(patientAppointmentDetails.rejected, (state, action) => {
        state.patientAppointmentsDetailLoading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      //for notificaiton
      .addCase(sendPushNotification.pending, (state) => {
        state.pushNotificationLoading = true;
        state.error = null;
      })
      .addCase(sendPushNotification.fulfilled, (state, action) => {
        state.pushNotificationLoading = false;
        state.pushnotification = action.payload.data;
      })
      .addCase(sendPushNotification.rejected, (state, action) => {
        state.pushNotificationLoading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // for join video call
      .addCase(getJoinVideoCall.pending, (state) => {
        state.channelDetailsLoading = true;
        state.error = null;
      })
      .addCase(getJoinVideoCall.fulfilled, (state, action) => {
        state.channelDetailsLoading = false;
        state.channelDetails = action.payload.data;
      })
      .addCase(getJoinVideoCall.rejected, (state, action) => {
        state.channelDetailsLoading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "User Deleted successfully";
        toast.success(action.payload.message || "User deleted successfully");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
        toast.error(action.payload.message || "Failed to delete user");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      });
  },
});

export default myAppointmentSlice.reducer;
