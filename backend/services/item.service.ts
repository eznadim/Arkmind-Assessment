import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { z } from 'zod';
import pool from '../database';
import { Item } from '../types/item';

// Custom error class for service-specific errors
export class ItemServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ItemServiceError';
  }
}

// Validation schema
export const ItemSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z.string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  price: z.number()
    .positive("Price must be positive")
    .max(999999.99, "Price must be less than 1,000,000")
});

export class ItemService {
  /**
   * Get all items with optional pagination
   */
  async getAllItems(page: number = 1, limit: number = 10): Promise<{
    items: Item[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;
      
      // Get total count
      const [countResult] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM items'
      );
      const total = countResult[0].total;

      // Get paginated items
      const [items] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM items ORDER BY createdAt DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );

      return {
        items: items as Item[],
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new ItemServiceError(
        'Failed to fetch items',
        500,
        error
      );
    }
  }

  /**
   * Get a single item by ID
   */
  async getItemById(id: number): Promise<Item> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM items WHERE id = ?',
        [id]
      );

      if (!rows.length) {
        throw new ItemServiceError(
          `Item with ID ${id} not found`,
          404
        );
      }

      return rows[0] as Item;
    } catch (error) {
      if (error instanceof ItemServiceError) throw error;
      
      throw new ItemServiceError(
        'Failed to fetch item',
        500,
        error
      );
    }
  }

  /**
   * Create a new item
   */
  async createItem(itemData: Omit<Item, 'id'>): Promise<Item> {
    try {
      // Validate item data
      const validatedData = ItemSchema.parse(itemData);

      // Insert item
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO items (name, description, price) VALUES (?, ?, ?)',
        [validatedData.name, validatedData.description, validatedData.price]
      );

      // Fetch and return the created item
      const newItem = await this.getItemById(result.insertId);
      return newItem;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ItemServiceError(
          'Validation failed',
          400,
          error.errors
        );
      }

      throw new ItemServiceError(
        'Failed to create item',
        500,
        error
      );
    }
  }

  /**
   * Update an existing item
   */
  async updateItem(id: number, itemData: Partial<Item>): Promise<Item> {
    try {
      // Check if item exists
      await this.getItemById(id);

      // Validate update data
      const validatedData = ItemSchema.partial().parse(itemData);

      // Build update query dynamically
      const updates: string[] = [];
      const values: any[] = [];

      Object.entries(validatedData).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      });

      if (!updates.length) {
        throw new ItemServiceError(
          'No valid fields to update',
          400
        );
      }

      // Add id to values array
      values.push(id);

      // Execute update
      await pool.query(
        `UPDATE items SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      // Fetch and return updated item
      return await this.getItemById(id);
    } catch (error) {
      if (error instanceof ItemServiceError) throw error;
      if (error instanceof z.ZodError) {
        throw new ItemServiceError(
          'Validation failed',
          400,
          error.errors
        );
      }

      throw new ItemServiceError(
        'Failed to update item',
        500,
        error
      );
    }
  }

  /**
   * Delete an item
   */
  async deleteItem(id: number): Promise<void> {
    try {
      // Check if item exists
      await this.getItemById(id);

      // Delete item
      const [result] = await pool.query<ResultSetHeader>(
        'DELETE FROM items WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new ItemServiceError(
          `Failed to delete item with ID ${id}`,
          500
        );
      }
    } catch (error) {
      if (error instanceof ItemServiceError) throw error;

      throw new ItemServiceError(
        'Failed to delete item',
        500,
        error
      );
    }
  }

  /**
   * Search items by name or description
   */
  async searchItems(query: string, page: number = 1, limit: number = 10): Promise<{
    items: Item[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;
      const searchTerm = `%${query}%`;

      // Get total count
      const [countResult] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM items WHERE name LIKE ? OR description LIKE ?',
        [searchTerm, searchTerm]
      );
      const total = countResult[0].total;

      // Get paginated search results
      const [items] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM items WHERE name LIKE ? OR description LIKE ? ORDER BY createdAt DESC LIMIT ? OFFSET ?',
        [searchTerm, searchTerm, limit, offset]
      );

      return {
        items: items as Item[],
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new ItemServiceError(
        'Failed to search items',
        500,
        error
      );
    }
  }
}

export default new ItemService();