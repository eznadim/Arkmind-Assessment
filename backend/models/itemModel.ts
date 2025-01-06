import { z } from 'zod';
import pool from '../database';
import { Item } from '../types/item';
import mysql from 'mysql2/promise';

export const ItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive")
});

export const ItemModel = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM items');
    return rows;
  },

  async getById(id: number) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM items WHERE id = ?', [id]);
    return rows[0];
  },

  async create(item: Item) {
    const [result] = await pool.query(
      'INSERT INTO items (name, description, price) VALUES (?, ?, ?)',
      [item.name, item.description, item.price]
    );
    return result;
  },

  async update(id: number, item: Item) {
    const [result] = await pool.query(
      'UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?',
      [item.name, item.description, item.price, id]
    );
    return result;
  },

  async delete(id: number) {
    const [result] = await pool.query('DELETE FROM items WHERE id = ?', [id]);
    return result;
  }
};