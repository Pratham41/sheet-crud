import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

const fetchFiles = createAsyncThunk("files/fetchFiles", async () => {
  const { data } = await axios.get(`${API_URL}/user/files`);
  return data;
});

const selectFile = createAsyncThunk("files/selectFile", (fileID) => {
  return fileID;
});

const initialState = {
  files: [],
  fileSelected: null,
  loadingSelect: false,
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(selectFile.pending, (state, action) => {
        state.loadingSelect = true;
      })
      .addCase(selectFile.fulfilled, (state, action) => {
        state.loadingSelect = false;
        state.fileSelected = action.payload;
      })
      .addCase(selectFile.rejected, (state, action) => {
        state.loadingSelect = false;
      });
  },
});

export default fileSlice.reducer;
export { fetchFiles, selectFile };
