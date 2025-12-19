import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";

//for unauthenticated user
function logouterror() {
  // toast.error("Token Expired");
  // localStorage.removeItem("doctor-app");
  // setTimeout(() => {
  //   // window.location.href = "/";
  // }, 1000);

  const toastMsg = localStorage.removeItem("doctor-app");
  const anyoneJoin = localStorage.getItem("anyoneJoin");
  if (!anyoneJoin && !toastMsg) {
    toast.error("Token Expired");
  }

  localStorage.removeItem("nfc-admin");
  setTimeout(() => {
    !anyoneJoin ? (window.location.href = "/") : null;
  }, 1000);
}

//Get All Notifications
export const getAllNotifications = createAsyncThunk(
  "notification/getAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllNotifications();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
//Delete Notification API
export const deleteNotification = createAsyncThunk(
  "doctor/deleteNotification",
  async (notification_ids, { rejectWithValue }) => {
    try {
      const response = await api.deleteNotification(notification_ids);
      return { deletedIds: notification_ids }; // We'll use this in reducer
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// 9.Mark all Read API
export const markAllRead = createAsyncThunk(
  "doctor/markAllRead",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.markAllRead(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const unreadCount = createAsyncThunk(
  "/doctor/unreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.unreadCount();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//notification toggle

export const checkToggleNotification = createAsyncThunk(
  "/doctor/checkToggleNotification",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.checkToggleNotification();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeAppointmentNotificaiton = createAsyncThunk(
  "/doctor/changeAppointmentNotificaiton",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.changeAppointmentNotificaiton(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const notifyNewChatRes = createAsyncThunk(
  "/getChat",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.notifyNewChatRes(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// notifyNewChat

export const toggleNotifications = createAsyncThunk(
  "/doctor/toggleNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.toggleNotifications();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//Notification Reminder Popup
export const reminderPopup = createAsyncThunk(
  "/doctor/reminderPopup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.reminderPopup(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//Slice

const notificationSlice = createSlice({
  name: "Notification",
  initialState: {
    doctorNotifications: [],
    unreadCounts: [],
    isNotificationActive: false,
    reminderPopupData: [],
    loading: false,
    error: null,
    newNotificaion: null,
    // message: null,
  },
  reducer: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorNotifications = action.payload.data;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      //Delete Notification extraReducer
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedIds = action.payload.deletedIds;
        const removeDeleted = (group) =>
          group?.filter((n) => !deletedIds.includes(n.id)) ?? [];

        state.doctorNotifications.today = removeDeleted(
          state.doctorNotifications.today
        );
        state.doctorNotifications.yesterday = removeDeleted(
          state.doctorNotifications.yesterday
        );
        state.doctorNotifications.older = removeDeleted(
          state.doctorNotifications.older
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Mark all Read
      .addCase(markAllRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllRead.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(markAllRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      .addCase(unreadCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unreadCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCounts = action.payload.data.count;
      })
      .addCase(unreadCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch unread count";
      })

      // notification toggle
      .addCase(checkToggleNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkToggleNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.isNotificationActive = action.payload.data.isActive;
      })
      .addCase(checkToggleNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to Get Notification Status";
      })
      //newnotification comes

      .addCase(notifyNewChatRes.pending, (state) => {
        state.loading = true;
      })
      .addCase(notifyNewChatRes.fulfilled, (state, action) => {
        state.loading = false;
        state.newNotificaion = action.payload.data;
        // console.log(action.payload.data, "ashdkfahsdfjhksahfks");

        if (action.payload.data?.notification_count == 0) {
          // toast.success("No notification from chat.");
        } else if (action.payload.data?.notification_message) {
          toast.success(action.payload.data?.notification_message);
        }
      })
      .addCase(notifyNewChatRes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to Get Notification Status";
      })

      //newnotification comes

      // notification toggle
      .addCase(changeAppointmentNotificaiton.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeAppointmentNotificaiton.fulfilled, (state, action) => {
        state.loading = false;
        state.isNotificationActive = action.payload.data.isActive;
        // action.payload.data.isActive ? toast.success("Notification Turned On") : toast.error("Notification Turned off")
        // sir told to remove the toast from notification.
      })
      .addCase(changeAppointmentNotificaiton.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to Update Notification Status";
      })

      // notification Reminder Popup
      .addCase(reminderPopup.pending, (state) => {
        state.loading = true;
      })
      .addCase(reminderPopup.fulfilled, (state, action) => {
        state.loading = false;
        state.reminderPopupData = action.payload.data;
        // action.payload.data.isActive ? toast.success("Notification Turned On") : toast.error("Notification Turned off")
      })
      .addCase(reminderPopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to Update Notification Status";
      });
  },
});

export default notificationSlice.reducer;
