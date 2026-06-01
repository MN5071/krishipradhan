const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'agritech.db');
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Small helper to keep a convenient transaction style.
db.transaction = function transaction(callback) {
  return function runTransaction(...args) {
    db.exec('BEGIN');
    try {
      const result = callback(...args);
      db.exec('COMMIT');
      return result;
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  };
};

function hasColumn(table, column) {
  return db.prepare(`PRAGMA table_info(${table})`).all().some((row) => row.name === column);
}

function addColumn(table, column, definition) {
  if (!hasColumn(table, column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
  }
}

function rebuildOffersForWithdrawStatus() {
  const row = db.prepare("SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = 'offers'").get();
  if (!row || String(row.sql || '').includes('Withdrawn')) return;

  db.exec(`
    PRAGMA foreign_keys = OFF;
    ALTER TABLE offers RENAME TO offers_old;
    CREATE TABLE offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user_id INTEGER NOT NULL,
      to_user_id INTEGER NOT NULL,
      item_type TEXT NOT NULL CHECK(item_type IN ('FarmerItem')),
      item_id INTEGER NOT NULL,
      quantity REAL DEFAULT 1,
      offer_price REAL NOT NULL,
      note TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending','Accepted','Declined','Withdrawn')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(from_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(to_user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    INSERT INTO offers (id, from_user_id, to_user_id, item_type, item_id, quantity, offer_price, note, status, created_at)
    SELECT id, from_user_id, to_user_id, item_type, item_id, quantity, offer_price, note, status, created_at
    FROM offers_old;
    DROP TABLE offers_old;
    PRAGMA foreign_keys = ON;
  `);
}

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Farmer','Labour','Consumer')),
      photo TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      whatsapp TEXT DEFAULT '',
      address TEXT DEFAULT '',
      location TEXT DEFAULT '',
      latitude REAL,
      longitude REAL,
      labour_rate REAL DEFAULT 0,
      is_online INTEGER DEFAULT 0,
      profile_completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS labour_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      labour_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Available' CHECK(status IN ('Available','Booked')),
      booked_by INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(labour_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(booked_by) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      labour_id INTEGER NOT NULL,
      booked_by INTEGER NOT NULL,
      slot_id INTEGER NOT NULL UNIQUE,
      total_hours REAL NOT NULL,
      total_cost REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Confirmed' CHECK(status IN ('Confirmed','Cancelled')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(labour_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(booked_by) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(slot_id) REFERENCES labour_slots(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS farmer_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      photo TEXT DEFAULT '',
      expected_price REAL NOT NULL,
      quantity REAL DEFAULT 1,
      harvest_date TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Available' CHECK(status IN ('Available','Sold','Hidden')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(farmer_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user_id INTEGER NOT NULL,
      to_user_id INTEGER NOT NULL,
      item_type TEXT NOT NULL CHECK(item_type IN ('FarmerItem')),
      item_id INTEGER NOT NULL,
      quantity REAL DEFAULT 1,
      offer_price REAL NOT NULL,
      note TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending','Accepted','Declined','Withdrawn')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(from_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(to_user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      note TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(farmer_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Backward-compatible upgrades for users who already created agritech.db in the older version.
  addColumn('users', 'latitude', 'REAL');
  addColumn('users', 'longitude', 'REAL');
  addColumn('users', 'profile_completed', 'INTEGER DEFAULT 0');
  rebuildOffersForWithdrawStatus();
}

function nextDate(daysFromToday) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

function seed() {
  const count = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (count > 0) return;

  const passwordHash = bcrypt.hashSync('123456', 10);
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, phone, whatsapp, address, location, latitude, longitude, labour_rate, is_online, profile_completed, photo)
    VALUES (@name, @email, @password_hash, @role, @phone, @whatsapp, @address, @location, @latitude, @longitude, @labour_rate, @is_online, @profile_completed, @photo)
  `);

  const demoUsers = [
    {
      name: 'Ravi Gowda', email: 'farmer@agri.com', password_hash: passwordHash, role: 'Farmer',
      phone: '9876543210', whatsapp: '', address: '', location: 'Mysuru Farm Belt', latitude: 12.30733, longitude: 76.68945, labour_rate: 0, is_online: 0, profile_completed: 1,
      photo: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Mahesh Labour', email: 'labour@agri.com', password_hash: passwordHash, role: 'Labour',
      phone: '9876500002', whatsapp: '9876500002', address: '', location: 'Hunsur Road, Mysuru', latitude: 12.35201, longitude: 76.60345, labour_rate: 650, is_online: 1, profile_completed: 1,
      photo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Ananya Consumer', email: 'consumer@agri.com', password_hash: passwordHash, role: 'Consumer',
      phone: '9876500003', whatsapp: '', address: 'Vijayanagar, Mysuru', location: 'Mysuru City', latitude: 12.33749, longitude: 76.61886, labour_rate: 0, is_online: 0, profile_completed: 1,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const ids = {};
  const transaction = db.transaction(() => {
    demoUsers.forEach((user) => {
      const result = insertUser.run(user);
      ids[user.role] = result.lastInsertRowid;
    });

    const insertSlot = db.prepare(`
      INSERT INTO labour_slots (labour_id, date, start_time, end_time, status)
      VALUES (?, ?, ?, ?, 'Available')
    `);
    insertSlot.run(ids.Labour, nextDate(1), '08:00', '13:00');
    insertSlot.run(ids.Labour, nextDate(2), '09:00', '17:00');

    const insertItem = db.prepare(`
      INSERT INTO farmer_items (farmer_id, item_name, photo, expected_price, quantity, harvest_date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Available')
    `);
    const tomatoId = insertItem.run(ids.Farmer, 'Organic Tomato', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', 28, 120, nextDate(4)).lastInsertRowid;
    insertItem.run(ids.Farmer, 'Ragi Millet', 'https://images.unsplash.com/photo-1601486140872-7bb7f4cc7b36?auto=format&fit=crop&w=800&q=80', 45, 300, nextDate(8));

    const insertInvestment = db.prepare(`
      INSERT INTO investments (farmer_id, category, amount, note)
      VALUES (?, ?, ?, ?)
    `);
    insertInvestment.run(ids.Farmer, 'Seeds', 3500, 'Hybrid tomato seeds');
    insertInvestment.run(ids.Farmer, 'Fertilizer', 2800, 'Organic manure and nutrients');

    // Seed one consumer-to-farmer order so the Home page immediately shows direct customer demand.
    db.prepare(`
      INSERT INTO offers (from_user_id, to_user_id, item_type, item_id, quantity, offer_price, note)
      VALUES (?, ?, 'FarmerItem', ?, 10, 30, 'Consumer sample order for home dashboard')
    `).run(ids.Consumer, ids.Farmer, tomatoId);
  });

  transaction();
}

function publicUser(row) {
  if (!row) return null;
  const { password_hash, ...safeUser } = row;
  safeUser.is_online = Boolean(safeUser.is_online);
  safeUser.profile_completed = Boolean(safeUser.profile_completed);
  return safeUser;
}

migrate();
seed();

module.exports = { db, publicUser, dbPath };
