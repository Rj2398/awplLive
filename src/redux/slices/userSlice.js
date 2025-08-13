import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";

// For Unauthenticated User
function logouterror() {
  toast.error("Token Expired");
  localStorage.removeItem("nfc-admin");
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
}

// 1.email-valid API
export const emailCheck = createAsyncThunk(
  "doctor/emailCheck",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.emailCheck(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2.login-password API
export const login = createAsyncThunk(
  "doctor/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.login(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3.forgot-password API
export const forgotPassword = createAsyncThunk(
  "doctor/forgotPassword",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.forgotPassword(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 4.otp-verfication API
export const otpVerification = createAsyncThunk(
  "doctor/otpVerification",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.otpVerification(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 5.otp-verfication API
export const resendOtp = createAsyncThunk(
  "doctor/resendOtp",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.resendOtp(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 6.reset-password API
export const resetPassword = createAsyncThunk(
  "doctor/resetPassword",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.resetPassword(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 7.first-login API
export const firstLogin = createAsyncThunk(
  "doctor/firstLogin",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.firstLogin(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  8.Get Doctor profile Data API
export const getDoctorProfile = createAsyncThunk(
  "doctor/getDoctorProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getDoctorProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 9.Doctor Profile Update API
export const doctorProfileUpdate = createAsyncThunk(
  "doctor/doctorProfileUpdate",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.doctorProfileUpdate(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 10.Doctor Photo Update API
export const doctorPhotoUpdate = createAsyncThunk(
  "doctor/doctorPhotoUpdate",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.doctorPhotoUpdate(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 11.Delete Doctor Photo Update API
export const deleteDoctorPhoto = createAsyncThunk(
  "doctor/deleteDoctorPhoto",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.deleteDoctorPhoto();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 12.Doctor Pending Prescriptions Update API
export const doctorPendingPrescriptions = createAsyncThunk(
  "doctor/doctorPendingPrescriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.doctorPendingPrescriptions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 13.Doctor Completed Prescriptions Update API
export const doctorCompletedPrescriptions = createAsyncThunk(
  "doctor/doctorCompletedPrescriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.doctorCompletedPrescriptions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 14.symptom Upload Details API
export const symptomUploadDetails = createAsyncThunk(
  "doctor/symptomUploadDetails",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.symptomUploadDetails(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 15.complete Assigned Prescription submit API
export const completePrescription = createAsyncThunk(
  "doctor/completePrescription",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.completePrescription(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//16 Logout by soni
export const logout = createAsyncThunk(
  "doctor/logout",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.logout(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//medicine
export const medicineSearch = createAsyncThunk(
  "user/medicineSearch",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.medicineSearch(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// // 16.Doctor Home Dashboard API
// export const doctorHomeDashboard = createAsyncThunk("doctor/doctorHomeDashboard", async (formData, { rejectWithValue }) => {
//   try {
//       const response = await api.doctorHomeDashboard(formData);
//       return response.data;
//   } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//   }
// })

// Get All Users
export const getAllUser = createAsyncThunk(
  "user/getAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllUser();
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

export const createUser = createAsyncThunk(
  "user/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.createUser(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Edit User
export const editUser = createAsyncThunk(
  "user/editUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.editUser(formData);
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

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [],
    pendingPrescription: [],
    completedPrescription: [],
    symptomUploadDetail: [],
    medicineSearch: [],
    completeAssignedPrescription: null,
    loading: false,
    loading2: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 1.email-valid API extraReducer
      .addCase(emailCheck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(emailCheck.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(emailCheck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 2.login-password API extraReducer
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        localStorage.setItem(
          "doctor-app",
          JSON.stringify({
            doctorData: action.payload.data?.doctor,
            token: action.payload.data?.token,
          })
        );
        //we are saving token and id in localStorage after login successful.
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        toast.error(action.payload.message);
      })

      // 3.forgot-password API extraReducer
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 4.otp-verfication API extraReducer
      .addCase(otpVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(otpVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(otpVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 5.resend-otp API extraReducer
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 6.resetPassword API extraReducer
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        // localStorage.setItem("doctor-app", JSON.stringify({ id: action.payload.data?.id, token: action.payload.data?.token }))
        //we are saving token and id in localStorage after login successful.
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 7.firstLogin API extraReducer
      .addCase(firstLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(firstLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        localStorage.setItem(
          "doctor-app",
          JSON.stringify({
            doctorData: action.payload.data?.doctor,
            token: action.payload.data?.token,
          })
        );
        //we are saving token and id in localStorage after login successful.
      })
      .addCase(firstLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //8. Get Single Doctor Profile Data
      .addCase(getDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.doctor;
      })
      .addCase(getDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 9.Doctor Profile Update API extraReducer
      .addCase(doctorProfileUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doctorProfileUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(doctorProfileUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        toast.error(
          action.payload?.data?.experience?.[0] ||
            action.payload?.data?.contact_no?.[0]
        );
      })

      // 10.Doctor Photo Update API extraReducer
      .addCase(doctorPhotoUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doctorPhotoUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(doctorPhotoUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 11.Delete Doctor Photo API extraReducer
      .addCase(deleteDoctorPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDoctorPhoto.fulfilled, (state, action) => {
        state.loading = false;
        // Update the user profile in state (remove photo)
        if (state.user) {
          state.user.profile_path = null; // or your default image path
        }
      })
      .addCase(deleteDoctorPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 12.Doctor Pending Prescriptions Update API
      .addCase(doctorPendingPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doctorPendingPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingPrescription = action.payload.data?.pending_prescriptions;
      })
      .addCase(doctorPendingPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 13.Doctor Completed Prescriptions Update API
      .addCase(doctorCompletedPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doctorCompletedPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.completedPrescription =
          action.payload.data?.completed_prescriptions;
      })
      .addCase(doctorCompletedPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 14.symptom Upload Details API
      .addCase(symptomUploadDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(symptomUploadDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.symptomUploadDetail = action.payload.data;
      })
      .addCase(symptomUploadDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 15.complete Assigned Prescription API
      .addCase(completePrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completePrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.completeAssignedPrescription = action.payload;
      })
      .addCase(completePrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 16 Logout

      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null; // Clear user data on successful logout

        // Remove authentication data from localStorage
        localStorage.removeItem("doctor-app");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //   // 16.complete Assigned Prescription API
      //   .addCase(doctorHomeDashboard.pending, (state) => {
      //     state.loading = true;
      //     state.error = null;
      // })
      // .addCase(doctorHomeDashboard.fulfilled, (state, action) => {
      //     state.loading = false;
      //     state.user = action.payload;
      // })
      // .addCase(doctorHomeDashboard.rejected, (state, action) => {
      //     state.loading = false;
      //     state.error = action.payload;
      // })

      .addCase(medicineSearch.pending, (state) => {
        state.loading2 = true;
        state.error = null;
      })
      .addCase(medicineSearch.fulfilled, (state, action) => {
        state.loading2 = false;
        state.medicineSearch = action.payload?.data?.results;
      })
      .addCase(medicineSearch.rejected, (state, action) => {
        state.loading2 = false;
        state.error = action.payload || "Failed to search medicine";
        toast.error(action.payload.message || "Failed to search medicine");
      })

      // Get all users
      .addCase(getAllUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "User created successfully";
        toast.success(action.payload.message || "User created successfully");
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors || "User creation failed";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Edit user
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "User updated successfully";
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
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

export default userSlice.reducer;
