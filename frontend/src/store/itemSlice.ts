import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { itemsApi } from '../services/api';
import { Item } from '../types/item';

interface ItemState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  const response = await itemsApi.getAll();
  return response.data.items;
});

export const createItem = createAsyncThunk(
  'items/createItem',
  async (item: Omit<Item, 'id'>) => {
    const response = await itemsApi.create(item);
    return response.data;
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, item }: { id: number; item: Omit<Item, 'id'> }) => {
    const response = await itemsApi.update(id, item);
    return response.data;
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: number) => {
    await itemsApi.delete(id);
    return id;
  }
);

const itemSlice = createSlice({
  
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      // Create Item
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create item';
      })
      // Delete Item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete item';
      })
      // Update Item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update item';
      });
  },
});

export default itemSlice.reducer;