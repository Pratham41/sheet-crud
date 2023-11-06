import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://sheet-crud.onrender.com';

const fetchItems = createAsyncThunk('items/fetchItems', async (sheetID) => {
  console.log('line 7',sheetID);
  const {data} = await axios.get(`${API_URL}/user/files/read/sheet/${sheetID}`);
  console.log('data---',data);
  return data;
});

const createItem = createAsyncThunk('items/createItem', async (dataToCreate) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const { data } = await axios.post(`${API_URL}/user/files/read/sheet/${dataToCreate.sheetID}`, dataToCreate, config);
  return data;
});

const updateItem = createAsyncThunk('items/updateItem', async (dataToUpdate,{getState}) => {
  const currentState = getState().fileSlice
  console.log('currentState---',currentState);

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const { data } = await axios.put(`${API_URL}/user/files/read/sheet/${dataToUpdate.sheetID}`, dataToUpdate, config);
  return data;
});

const initialState = {
  items: [],
  successAdd : false,
  successUpdate : false,
  loadingAdd: false,
  loadingUpdate: false,
  loading: true,
  error: null,
};

const patientSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createItem.pending, (state) => {
        state.loadingAdd = true;
        state.successAdd = false;
      })
      .addCase(createItem.fulfilled, (state) => {
        state.loadingAdd = false;
        state.successAdd = true;
      })
      .addCase(createItem.rejected, (state) => {
        state.loadingAdd = false;
        state.successAdd = false;
      })
      .addCase(updateItem.pending, (state) => {
        state.loadingUpdate = true;
        state.successUpdate = false
      })
      .addCase(updateItem.fulfilled, (state) => {
        state.loadingUpdate = false;
        state.successUpdate = true
      })
      .addCase(updateItem.rejected, (state) => {
        state.loadingUpdate = false;
        state.successUpdate = false
      });
  },
});

export default patientSlice.reducer;
export { fetchItems, createItem, updateItem };