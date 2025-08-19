import { pool } from '../config/db.js';

export async function createProductTableIfNotExists() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC(12,2) NOT NULL DEFAULT 0,
      short_notes TEXT,
      description TEXT,
      image_url TEXT,
      checkout_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
    CREATE TRIGGER trg_products_updated_at
      BEFORE UPDATE ON products
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  `);
}

export const Product = {
  async create(data) {
    const { name, price, shortNotes, description, imageUrl, checkoutUrl } = data;
    const res = await pool.query(
      `INSERT INTO products(name, price, short_notes, description, image_url, checkout_url)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, price, shortNotes ?? null, description ?? null, imageUrl ?? null, checkoutUrl ?? null]
    );
    return res.rows[0];
  },

  async findAll() {
    const res = await pool.query(`SELECT * FROM products ORDER BY created_at DESC`);
    return res.rows;
  },

  async findById(id) {
    const res = await pool.query(`SELECT * FROM products WHERE id=$1`, [id]);
    return res.rows[0] || null;
  },

  async update(id, data) {
    const { name, price, shortNotes, description, imageUrl, checkoutUrl } = data;
    const res = await pool.query(
      `UPDATE products
       SET name=$1, price=$2, short_notes=$3, description=$4, image_url=$5, checkout_url=$6
       WHERE id=$7
       RETURNING *`,
      [name, price, shortNotes ?? null, description ?? null, imageUrl ?? null, checkoutUrl ?? null, id]
    );
    return res.rows[0] || null;
  },

  async remove(id) {
    await pool.query(`DELETE FROM products WHERE id=$1`, [id]);
    return true;
  }
};
