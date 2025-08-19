import { Product } from '../models/product.js';

function badRequest(res, msg) {
  return res.status(400).json({ error: msg });
}

export const productsController = {
  // GET /api/products
  async getAll(req, res) {
    const items = await Product.findAll();
    res.json({ items });
  },

  // GET /api/products/:id
  async getOne(req, res) {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  },

  // POST /api/products  (admin only)
  async create(req, res) {
    const { name, price } = req.body;
    if (!name) return badRequest(res, 'name is required');
    if (price == null || isNaN(price)) return badRequest(res, 'price must be a number');

    const created = await Product.create(req.body);
    res.status(201).json(created);
  },

  // PUT /api/products/:id  (admin only)
  async update(req, res) {
    const { name, price } = req.body;
    if (!name) return badRequest(res, 'name is required');
    if (price == null || isNaN(price)) return badRequest(res, 'price must be a number');

    const updated = await Product.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  },

  // DELETE /api/products/:id  (admin only)
  async remove(req, res) {
    const existed = await Product.findById(req.params.id);
    if (!existed) return res.status(404).json({ error: 'Not found' });
    await Product.remove(req.params.id);
    res.json({ ok: true });
  }
};
