import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData, ensureSeed } from './db.js';
import { createToken, authMiddleware, adminMiddleware } from './auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

const corsOrigins = (process.env.CORS_ALLOWED_ORIGINS || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: corsOrigins.includes('*') ? '*' : corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/assets', express.static(path.join(__dirname, '..', '..', 'frontend', 'src', 'assets')));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Rashfa Express API' });
});

// Auth
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(422).json({
      status: 'error',
      message: 'Validation error',
      errors: { name: !name ? ['Name is required'] : undefined, email: !email ? ['Email is required'] : undefined, password: !password ? ['Password is required'] : undefined }
    });
  }

  const data = readData();
  const exists = data.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (exists) {
    return res.status(422).json({
      status: 'error',
      message: 'Validation error',
      errors: { email: ['Email already taken'] }
    });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    password: hashed,
    is_admin: false,
    created_at: new Date().toISOString()
  };
  data.users.push(user);
  writeData(data);

  const token = createToken(user);
  return res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: { user: { ...user, password: undefined }, access_token: token, token_type: 'Bearer' }
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(422).json({
      status: 'error',
      message: 'Validation error',
      errors: { email: !email ? ['Email is required'] : undefined, password: !password ? ['Password is required'] : undefined }
    });
  }

  const data = readData();
  const user = data.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Invalid login details' });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ status: 'error', message: 'Invalid login details' });
  }

  const token = createToken(user);
  return res.json({
    status: 'success',
    message: 'Login successful',
    data: { user: { ...user, password: undefined }, access_token: token, token_type: 'Bearer' }
  });
});

app.post('/api/logout', authMiddleware, (req, res) => {
  return res.json({ status: 'success', message: 'Logged out successfully' });
});

app.get('/api/user', authMiddleware, (req, res) => {
  const user = { ...req.user, password: undefined };
  return res.json(user);
});

// Products
app.get('/api/products', (req, res) => {
  const data = readData();
  return res.json({ status: 'success', data: data.products || [] });
});

// Orders (auth)
app.get('/api/orders', authMiddleware, (req, res) => {
  const data = readData();
  const orders = req.user.is_admin ? data.orders : data.orders.filter((o) => o.user_id === req.user.id);
  return res.json({ status: 'success', data: orders });
});

app.post('/api/orders', authMiddleware, (req, res) => {
  const { name, email, phone, address, payment_method, wants_receipt, total_amount, items } = req.body || {};
  if (!name || !email || !phone || !address || !payment_method || !Array.isArray(items)) {
    return res.status(422).json({ status: 'error', message: 'Validation error' });
  }

  const data = readData();
  const order = {
    id: uuidv4(),
    order_number: `RSH-${Date.now()}`,
    user_id: req.user.id,
    name,
    email,
    phone,
    address,
    payment_method,
    wants_receipt: wants_receipt === true,
    total_amount: total_amount || 0,
    status: 'pending',
    items,
    created_at: new Date().toISOString()
  };

  data.orders.push(order);
  writeData(data);

  return res.status(201).json({ status: 'success', data: order });
});

// Admin
app.get('/api/admin/orders', authMiddleware, adminMiddleware, (req, res) => {
  const data = readData();
  return res.json({ status: 'success', data: data.orders || [] });
});

app.patch('/api/admin/orders/:orderId/status', authMiddleware, adminMiddleware, (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body || {};
  const data = readData();
  const order = data.orders.find((o) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ status: 'error', message: 'Order not found' });
  }
  order.status = status || order.status;
  writeData(data);
  return res.json({ status: 'success', data: order });
});

app.get('/api/admin/products/best-sellers', authMiddleware, adminMiddleware, (req, res) => {
  const data = readData();
  const counts = {};
  data.orders.forEach((o) => {
    (o.items || []).forEach((it) => {
      const key = it.product_id || it.id || it.name;
      counts[key] = (counts[key] || 0) + (it.quantity || 1);
    });
  });
  const best = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, qty]) => {
      const product = data.products.find(p => 
        p.id === key || 
        p.id === String(key) ||
        p.name.toLowerCase() === String(key).toLowerCase()
      );
      return {
        id: key,
        name: product ? product.name : key,
        image: product ? product.image : null,
        total_sales: qty,
        stock: product ? product.stock : 0
      };
    });
  return res.json({ status: 'success', data: best });
});

const crud = (collectionName) => ({
  list: (req, res) => {
    const data = readData();
    return res.json({ status: 'success', data: data[collectionName] || [] });
  },
  create: (req, res) => {
    const data = readData();
    const items = (req.body.items || []).map(it => {
      const product = data.products.find(p => p.id === it.product_id || p.name === it.name);
      return {
        ...it,
        image: product ? product.image : null
      };
    });
    const item = { 
      id: uuidv4(), 
      ...req.body, 
      items,
      created_at: new Date().toISOString() 
    };
    data[collectionName] = data[collectionName] || [];
    data[collectionName].push(item);
    writeData(data);
    return res.json({ status: 'success', data: item });
  },
  update: (req, res) => {
    const data = readData();
    const { id } = req.params;
    const item = (data[collectionName] || []).find((i) => i.id === id);
    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }
    Object.assign(item, req.body);
    writeData(data);
    return res.json({ status: 'success', data: item });
  },
  remove: (req, res) => {
    const data = readData();
    const { id } = req.params;
    const list = data[collectionName] || [];
    const next = list.filter((i) => i.id !== id);
    data[collectionName] = next;
    writeData(data);
    return res.json({ status: 'success' });
  }
});

const productsCrud = crud('products');
const promotionsCrud = crud('promotions');
const employeesCrud = crud('employees');

app.get('/api/admin/products', authMiddleware, adminMiddleware, productsCrud.list);
app.post('/api/admin/products', authMiddleware, adminMiddleware, productsCrud.create);
app.put('/api/admin/products/:id', authMiddleware, adminMiddleware, productsCrud.update);
app.delete('/api/admin/products/:id', authMiddleware, adminMiddleware, productsCrud.remove);

app.get('/api/admin/promotions', authMiddleware, adminMiddleware, promotionsCrud.list);
app.post('/api/admin/promotions', authMiddleware, adminMiddleware, promotionsCrud.create);
app.put('/api/admin/promotions/:id', authMiddleware, adminMiddleware, promotionsCrud.update);
app.delete('/api/admin/promotions/:id', authMiddleware, adminMiddleware, promotionsCrud.remove);

app.get('/api/admin/employees', authMiddleware, adminMiddleware, employeesCrud.list);
app.post('/api/admin/employees', authMiddleware, adminMiddleware, employeesCrud.create);
app.put('/api/admin/employees/:id', authMiddleware, adminMiddleware, employeesCrud.update);
app.delete('/api/admin/employees/:id', authMiddleware, adminMiddleware, employeesCrud.remove);

app.get('/api/admin/clients', authMiddleware, adminMiddleware, (req, res) => {
  const data = readData();
  const clients = (data.users || []).map((u) => ({ ...u, password: undefined }));
  return res.json({ status: 'success', data: clients });
});

ensureSeed().then(() => {
  app.listen(port, () => {
    console.log(`Rashfa Express API running on :${port}`);
  });
});
