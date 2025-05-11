import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddBookPopup } from "./popUpSlice";
import { toast } from "react-toastify";

// ✅ Correct Vite syntax for environment variable
// const API_URL = import.meta.env.VITE_API_URL;

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
  },
  reducers: {
    fetchBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    addBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetBookSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

// ✅ Fetch all books
export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());
  try {
    const res = await axios.get("https://library-management-system-backend-lhbc.onrender.com/api/v1/book/all", {
      withCredentials: true,
    });
    dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books));
  } catch (err) {
    dispatch(
      bookSlice.actions.fetchBooksFailed(
        err.response?.data?.message || "Failed to fetch books"
      )
    );
  }
};

// ✅ Add a new book
export const addBook = (data) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());
  try {
    const res = await axios.post("https://library-management-system-backend-lhbc.onrender.com/api/v1/book/admin/add", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(bookSlice.actions.addBookSuccess(res.data.message));
    toast.success(res.data.message);
    dispatch(toggleAddBookPopup());
    dispatch(fetchAllBooks());
  } catch (err) {
    dispatch(
      bookSlice.actions.addBookFailed(
        err.response?.data?.message || "Failed to add book"
      )
    );
  }
};

// ✅ Reset slice
export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
};

export default bookSlice.reducer;