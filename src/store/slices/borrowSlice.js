import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleRecordBookPopup } from "./popUpSlice";

// ✅ Use correct Vite env syntax
// const API_URL = import.meta.env.VITE_API_URL;

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    userBorrowedBooks: [],
    allBorrowedBooks: [],
    message: null,
  },
  reducers: {
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    recordBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    recordBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    resetBorrowSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
  try {
    const res = await axios.get("https://bookworm-backend-n7ja.onrender.com/api/v1/borrow/my-borrowed-books", {
      withCredentials: true,
    });
    dispatch(
      borrowSlice.actions.fetchUserBorrowedBooksSuccess(
        res.data.borrowedBooks
      )
    );
  } catch (err) {
    dispatch(
      borrowSlice.actions.fetchUserBorrowedBooksFailed(
        err.response?.data?.message || "Failed to fetch user books"
      )
    );
  }
};

export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
  try {
    const res = await axios.get(
      "https://bookworm-backend-n7ja.onrender.com/api/v1/borrow/borrowed-books-by-users",
      {
        withCredentials: true,
      }
    );
    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksSuccess(
        res.data.borrowedBooks
      )
    );
  } catch (err) {
    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksFailed(
        err.response?.data?.message || "Failed to fetch all borrowed books"
      )
    );
  }
};

export const recordBorrowBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBookRequest());
  try {
    const res = await axios.post(
      `https://bookworm-backend-n7ja.onrender.com/api/v1/borrow/record-borrow-book/${id}`,
      { email },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
    dispatch(toggleRecordBookPopup());
  } catch (err) {
    dispatch(
      borrowSlice.actions.recordBookFailed(
        err.response?.data?.message || "Failed to record book"
      )
    );
  }
};

export const returnBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBookRequest());
  try {
    const res = await axios.put(
      `https://bookworm-backend-n7ja.onrender.com/api/v1/borrow/return-borrowed-book/${id}`,
      { email },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));
  } catch (err) {
    dispatch(
      borrowSlice.actions.returnBookFailed(
        err.response?.data?.message || "Failed to return book"
      )
    );
  }
};

export const resetBorrowSlice = () => (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};

export default borrowSlice.reducer;
