import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storePath = path.join(__dirname, 'data', 'store.json');

const readData = () => {
  const raw = fs.readFileSync(storePath, 'utf-8');
  return JSON.parse(raw);
};

const writeData = (data) => {
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
};

const ensureSeed = async () => {
  const data = readData();

  if (!data.users || data.users.length === 0) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rashfa.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashed = await bcrypt.hash(adminPassword, 10);

    data.users = [
      {
        id: uuidv4(),
        name: 'Admin',
        email: adminEmail,
        password: hashed,
        is_admin: true,
        created_at: new Date().toISOString()
      }
    ];
  }

  if (!data.products) data.products = [];
  if (!data.promotions) data.promotions = [];
  if (!data.employees) data.employees = [];
  if (!data.orders) data.orders = [];

  writeData(data);
};

export { readData, writeData, ensureSeed };
