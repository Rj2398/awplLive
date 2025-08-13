import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";

// 16.Doctor Home Dashboard API
export const doctorHomeDashboard = createAsyncThunk(
  "doctor/doctorHomeDashboard",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.doctorHomeDashboard(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const pastPatient = createAsyncThunk(
  "/doctor/patients/past",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.pastPatient(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const presciveMedicine = createAsyncThunk(
  "/doctor/treatments",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.getPrscriveMedicine(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// video Call submit API
export const videoCallSubmit = createAsyncThunk(
  "doctor/videoCallSubmit",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.videoCallSubmit(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice

const dataSlice = createSlice({
  name: "dataSlice",
  initialState: {
    userdata: [],
    pastPatients: [],
    videoSubmit: null,
    // data: null,  // Changed from userdata to data to match API response
    loading: false,
    error: null,
    message: null,

    allMedicine: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 16.complete Assigned Prescription API
      .addCase(doctorHomeDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doctorHomeDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.userdata = action.payload.data; // Store the data part of the response
      })
      .addCase(doctorHomeDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      .addCase(presciveMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(presciveMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.allMedicine = action.payload.data; // Store the data part of the response
      })
      .addCase(presciveMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //presciveMedicine

      .addCase(pastPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pastPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.pastPatients = action.payload?.data?.past_patients;
      })
      .addCase(pastPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // video Call Submit API
      .addCase(videoCallSubmit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(videoCallSubmit.fulfilled, (state, action) => {
        state.loading = false;
        state.videoSubmit = action.payload;
      })
      .addCase(videoCallSubmit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dataSlice.reducer;
