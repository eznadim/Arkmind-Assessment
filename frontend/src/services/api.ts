import axios from 'axios';
import { Item } from '../types/item';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

interface ItemResponse {
  items: Item[];
  page: number;
  total: number;
  totalPages: number;
}

export const itemsApi = {
  getAll: () => api.get<ItemResponse>('/items'),
  getById: (id: number) => api.get<Item>(`/items/${id}`),
  create: (item: Omit<Item, 'id'>) => api.post<Item>('/items', item),
  update: (id: number, item: Omit<Item, 'id'>) => api.put<Item>(`/items/${id}`, item),
  delete: (id: number) => api.delete(`/items/${id}`),
};