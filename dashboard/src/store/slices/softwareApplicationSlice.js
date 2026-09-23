import { API_URL } from "../../config";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const softwareApplicationSlice = createSlice({
  name: "softwareApplications",
  initialState: {
    loading: false,
    softwareApplications: [],
    error: null,
    message: null,
  },
  reducers: {
    getAllsoftwareApplicationsRequest(state) {
      state.softwareApplications = [];
      state.error = null;
      state.loading = true;
    },
    getAllsoftwareApplicationsSuccess(state, action) {
      state.softwareApplications = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllsoftwareApplicationsFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addNewsoftwareApplicationsRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewsoftwareApplicationsSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    addNewsoftwareApplicationsFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    deletesoftwareApplicationsRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deletesoftwareApplicationsSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deletesoftwareApplicationsFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetSoftwareApplicationSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const getAllSoftwareApplications = () => async (dispatch) => {
  dispatch(
    softwareApplicationSlice.actions.getAllsoftwareApplicationsRequest()
  );
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/softwareapplication/getall`,
      { withCredentials: true }
    );
    dispatch(
      softwareApplicationSlice.actions.getAllsoftwareApplicationsSuccess(
        response.data.softwareApplications
      )
    );
    dispatch(softwareApplicationSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      softwareApplicationSlice.actions.getAllsoftwareApplicationsFailed(
        error.response?.data?.message || "Failed to fetch software applications"
      )
    );
  }
};

export const addNewSoftwareApplication = (data) => async (dispatch) => {
  dispatch(
    softwareApplicationSlice.actions.addNewsoftwareApplicationsRequest()
  );
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.post(
      `${API_URL}/api/v1/softwareapplication/add`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    dispatch(
      softwareApplicationSlice.actions.addNewsoftwareApplicationsSuccess(
        response.data.message
      )
    );
    dispatch(softwareApplicationSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      softwareApplicationSlice.actions.addNewsoftwareApplicationsFailed(
        error.response?.data?.message || "Failed to add application"
      )
    );
  }
};

export const deleteSoftwareApplication = (id) => async (dispatch) => {
  dispatch(
    softwareApplicationSlice.actions.deletesoftwareApplicationsRequest()
  );
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.delete(
      `${API_URL}/api/v1/softwareapplication/delete/${id}`,
      {
        withCredentials: true,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    dispatch(
      softwareApplicationSlice.actions.deletesoftwareApplicationsSuccess(
        response.data.message
      )
    );
    dispatch(softwareApplicationSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      softwareApplicationSlice.actions.deletesoftwareApplicationsFailed(
        error.response?.data?.message || "Failed to delete application"
      )
    );
  }
};

export const clearAllSoftwareAppErrors = () => (dispatch) => {
  dispatch(softwareApplicationSlice.actions.clearAllErrors());
};

export const resetSoftwareApplicationSlice = () => (dispatch) => {
  dispatch(softwareApplicationSlice.actions.resetSoftwareApplicationSlice());
};

export default softwareApplicationSlice.reducer;
