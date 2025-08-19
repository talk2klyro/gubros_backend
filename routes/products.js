import express from 'express';
import { productsController } from '../controllers/products.js';

export const productsRouter = express.Router();

productsRouter.get('/', productsController.getAll);
productsRouter.get('/:id', productsController.getOne);

// Admin-only routes guarded by simple API key middleware provided in server.js
productsRouter.post('/', productsController.create);
productsRouter.put('/:id', productsController.update);
productsRouter.delete('/:id', productsController.remove);
