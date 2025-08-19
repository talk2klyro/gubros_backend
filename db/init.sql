CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL NOT NULL,
  short_notes VARCHAR(255),
  description TEXT,
  image_url TEXT,
  checkout_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
