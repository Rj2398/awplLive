import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";

// for unauthenticated user
function logouterror() {
  toast.error("Token Expired");
  localStorage.removeItem("doctor-app");
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
}

//Get Patient Profile data

export const getPatientProfileData = createAsyncThunk(
  "doctor/getPatientProfileData",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.getPatientProfileData(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//doctor unavailability new changes

// export const unavailabilityRequest = createAsyncThunk("doctor/unavailabilityRequest",async (formData, { rejectWithValue }) => {
//         try {
//             const response = await api.unavailabilityRequest(formData);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || error.message);
//         }
//     }
// );

export const unavailabilityRequest = createAsyncThunk(
  "doctor/unavailabilityRequest",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.unavailabilityRequest(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
//mark unavailability screen
export const doctorUnavailability = createAsyncThunk(
  "doctor/doctorUnavailability",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.doctorUnavailability();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
//HOD SCREEN REQUESTS
export const hodScreenRequestsList = createAsyncThunk(
  "doctor/hodScreenRequestsList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.hodScreenRequestsList();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const hodRequestsConfirmButton = createAsyncThunk(
  "doctor/hodRequestsConfirmButton",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.hodRequestsConfirmButton(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const hodRequestsRespondButton = createAsyncThunk(
  "doctor/hodRequestsRespondButton",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.hodRequestsRespondButton(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const hodScreenDoctorsList = createAsyncThunk(
  "doctor/hodScreenDoctorsList",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.hodScreenDoctorsList(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markDoctorAvailable = createAsyncThunk(
  "doctor/markDoctorAvailable",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.markDoctorAvailable(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unavailabilitySubmitByHod = createAsyncThunk(
  "doctor/unavailabilitySubmitByHod",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.unavailabilitySubmitByHod(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const feedbackapi = createAsyncThunk(
  "doctor/feedbackapi",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.feedbackapi(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const patientProfileSlice = createSlice({
  name: "patientProfile",
  initialState: {
    patientProfileData: [],
    unavailabilityrequest: null,
    unavailabilityLoading: false,
    doctorUnavailabilityList: [],
    doctorUnavailabilityLoading: false,
    hodScreenRequests: [],
    hodScreenRequestsLoading: false,
    hodRequestsConfirmButtonLoading: false,
    hodRequestsRespondButtonLoading: false,
    hodRequestsRespond: [],
    hodRequestsConfirm: [],
    hodScreenDoctorsListLoading: false,
    hodScreenDoctors: [],
    confirmDoctorAvailable: [],
    markDoctorAvailableLoading: false,
    unavailabilitySubmitByHodLoading: false,
    doctorUnavailabilitySubmit: [],
    loading: false,
    error: null,
    feedbackLoading: false,
    feedbackSubmit: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getPatientProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.patientProfileData = action.payload?.data;
      })
      .addCase(getPatientProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      .addCase(unavailabilityRequest.pending, (state) => {
        state.unavailabilityLoading = true;
        state.error = null;
      })
      .addCase(unavailabilityRequest.fulfilled, (state, action) => {
        state.unavailabilityLoading = false;
        state.patientProfileData = action.payload;
      })
      .addCase(unavailabilityRequest.rejected, (state, action) => {
        state.unavailabilityLoading = false;
        state.error = action.payload;
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      //mark unavailability screen
      .addCase(doctorUnavailability.pending, (state) => {
        state.doctorUnavailabilityLoading = true;
        state.error = null;
      })
      .addCase(doctorUnavailability.fulfilled, (state, action) => {
        state.doctorUnavailabilityLoading = false;
        state.doctorUnavailabilityList = action.payload?.data;
      })
      .addCase(doctorUnavailability.rejected, (state, action) => {
        state.doctorUnavailabilityLoading = false;
        state.error = action.payload;
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      //HOD SCREEN REQUESTS
      .addCase(hodScreenRequestsList.pending, (state) => {
        state.hodScreenRequestsListLoading = true;
        state.error = null;
      })
      .addCase(hodScreenRequestsList.fulfilled, (state, action) => {
        state.hodScreenRequestsListLoading = false;
        state.hodScreenRequests = action.payload?.data;
      })
      .addCase(hodScreenRequestsList.rejected, (state, action) => {
        state.hodScreenRequestsListLoading = false;
        state.error = action.payload;
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      .addCase(hodRequestsConfirmButton.pending, (state) => {
        state.hodRequestsConfirmButtonLoading = true;
        state.error = null;
      })
      .addCase(hodRequestsConfirmButton.fulfilled, (state, action) => {
        state.hodRequestsConfirmButtonLoading = false;
        state.hodRequestsConfirm = action.payload;
      })
      .addCase(hodRequestsConfirmButton.rejected, (state, action) => {
        state.hodRequestsConfirmButtonLoading = false;
        state.error = action.payload;
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      .addCase(hodRequestsRespondButton.pending, (state) => {
        state.hodRequestsRespondButtonLoading = true;
        state.error = null;
      })
      .addCase(hodRequestsRespondButton.fulfilled, (state, action) => {
        state.hodRequestsRespondButtonLoading = false;
        state.hodRequestsRespond = action.payload;
      })
      .addCase(hodRequestsRespondButton.rejected, (state, action) => {
        state.hodRequestsRespondButtonLoading = false;
        state.error = action.payload;
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      .addCase(hodScreenDoctorsList.pending, (state) => {
        state.hodScreenDoctorsListLoading = true;
        state.error = null;
      })
      .addCase(hodScreenDoctorsList.fulfilled, (state, action) => {
        state.hodScreenDoctorsListLoading = false;
        state.hodScreenDoctors = action.payload?.data;
      })
      .addCase(hodScreenDoctorsList.rejected, (state, action) => {
        state.hodScreenDoctorsListLoading = false;
        state.error = action.payload;
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      .addCase(markDoctorAvailable.pending, (state) => {
        state.markDoctorAvailableLoading = true;
        state.error = null;
      })
      .addCase(markDoctorAvailable.fulfilled, (state, action) => {
        state.markDoctorAvailableLoading = false;
        state.confirmDoctorAvailable = action.payload;
      })
      .addCase(markDoctorAvailable.rejected, (state, action) => {
        state.markDoctorAvailableLoading = false;
        state.error = action.payload;
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      .addCase(unavailabilitySubmitByHod.pending, (state) => {
        state.unavailabilitySubmitByHodLoading = true;
        state.error = null;
      })
      .addCase(unavailabilitySubmitByHod.fulfilled, (state, action) => {
        state.unavailabilitySubmitByHodLoading = false;
        state.doctorUnavailabilitySubmit = action.payload;
      })
      .addCase(unavailabilitySubmitByHod.rejected, (state, action) => {
        state.unavailabilitySubmitByHodLoading = false;
        state.error = action.payload;
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      .addCase(feedbackapi.pending, (state) => {
        state.feedbackLoading = true;
        state.error = null;
      })
      .addCase(feedbackapi.fulfilled, (state, action) => {
        state.feedbackLoading = false;
        state.feedbackSubmit = action.payload;
        localStorage.setItem("feedbackPopup", "1");
      })
      .addCase(feedbackapi.rejected, (state, action) => {
        state.feedbackLoading = false;
        state.error = action.payload;
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      });
  },
});

export default patientProfileSlice.reducer;
