import { API_URL } from "../../config";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    loading: false,
    messages: [],
    error: null,
    message: null,
  },
  reducers: {
    getAllMessagesRequest(state) {
      state.messages = [];
      state.error = null;
      state.loading = true;
    },
    getAllMessagesSuccess(state, action) {
      state.messages = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllMessagesFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    replyMessageRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    replyMessageSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.message;
      state.lastReplyResult =
        typeof action.payload === "object" ? action.payload : null;
    },
    replyMessageFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
      state.lastReplyResult = null;
    },
    deleteMessageRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteMessageSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deleteMessageFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetMessageSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
      state.lastReplyResult = null;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const getAllMessages = () => async (dispatch) => {
  dispatch(messageSlice.actions.getAllMessagesRequest());
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/message/getall`,
      { withCredentials: true }
    );
    dispatch(
      messageSlice.actions.getAllMessagesSuccess(response.data.messages)
    );
    dispatch(messageSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      messageSlice.actions.getAllMessagesFailed(
        error.response?.data?.message || "Failed to fetch messages"
      )
    );
  }
};

export const replyMessage = (id, replyData) => async (dispatch) => {
  dispatch(messageSlice.actions.replyMessageRequest());
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/message/reply/${id}`,
      replyData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(messageSlice.actions.replyMessageSuccess(response.data));
    dispatch(messageSlice.actions.clearAllErrors());
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      (error.message?.includes("ECONNREFUSED")
        ? "SMTP server connection failed. Please ensure SMTP_PASSWORD is set on Render."
        : error.message) ||
      "Failed to send email reply";
    dispatch(messageSlice.actions.replyMessageFailed(errorMsg));
  }
};

export const deleteMessage = (id) => async (dispatch) => {
  dispatch(messageSlice.actions.deleteMessageRequest());
  try {
    const response = await axios.delete(
      `${API_URL}/api/v1/message/delete/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(messageSlice.actions.deleteMessageSuccess(response.data.message));
    dispatch(messageSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      messageSlice.actions.deleteMessageFailed(
        error.response?.data?.message || "Failed to delete message"
      )
    );
  }
};

export const clearAllMessageErrors = () => (dispatch) => {
  dispatch(messageSlice.actions.clearAllErrors());
};

export const resetMessagesSlice = () => (dispatch) => {
  dispatch(messageSlice.actions.resetMessageSlice());
};

export default messageSlice.reducer;
