import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popUpSlice";

// ✅ Correct Vite syntax
// const API_URL = import.meta.env.VITE_API_URL;

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
  },
  reducers: {
    fetchAllUsersRequest(state) {
      state.loading = true;
    },
    fetchAllUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    fetchAllUsersFailed(state) {
      state.loading = false;
    },
    addNewAdminRequest(state) {
      state.loading = true;
    },
    addNewAdminSuccess(state) {
      state.loading = false;
    },
    addNewAdminFailed(state) {
      state.loading = false;
    },
  },
});

export const fetchAllUsers = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchAllUsersRequest());
  try {
    const res = await axios.get("https://bookworm-backend-n7ja.onrender.com/api/v1/user/all", {
      withCredentials: true,
    });
    dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
  } catch (err) {
    dispatch(userSlice.actions.fetchAllUsersFailed());
    toast.error(err.response?.data?.message || "Failed to fetch users.");
  }
};

export const addNewAdmin = (data) => async (dispatch) => {
  dispatch(userSlice.actions.addNewAdminRequest());
  try {
    const res = await axios.post("https://bookworm-backend-n7ja.onrender.com/api/v1/user/add/new-admin", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(userSlice.actions.addNewAdminSuccess());
    toast.success(res.data.message);
    dispatch(toggleAddNewAdminPopup());
  } catch (err) {
    dispatch(userSlice.actions.addNewAdminFailed());
    toast.error(err.response?.data?.message || "Failed to add new admin.");
  }
};

export default userSlice.reducer;
