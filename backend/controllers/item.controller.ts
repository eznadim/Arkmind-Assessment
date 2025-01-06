import { Request, Response, NextFunction } from 'express';
import itemService, { ItemServiceError } from '../services/item.service';

export const ItemController = {
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await itemService.getAllItems(page, limit);
      res.json(result);
    } catch (error) {
      if (error instanceof ItemServiceError) {
        res.status(error.statusCode).json({ 
          error: error.message,
          details: error.details 
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const item = await itemService.getItemById(id);
      res.json(item);
    } catch (error) {
      if (error instanceof ItemServiceError) {
        res.status(error.statusCode).json({ 
          error: error.message,
          details: error.details 
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await itemService.createItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof ItemServiceError) {
        res.status(error.statusCode).json({ 
          error: error.message,
          details: error.details 
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const item = await itemService.updateItem(id, req.body);
      res.json(item);
    } catch (error) {
      if (error instanceof ItemServiceError) {
        res.status(error.statusCode).json({ 
          error: error.message,
          details: error.details 
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await itemService.deleteItem(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ItemServiceError) {
        res.status(error.statusCode).json({ 
          error: error.message,
          details: error.details 
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
};