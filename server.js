const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const { db, publicUser, dbPath } = require('./database');
let projectConfig = {};
try { projectConfig = require('./config'); } catch (error) { projectConfig = {}; }

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_PLACES_API_KEY = String(process.env.GOOGLE_PLACES_API_KEY || projectConfig.GOOGLE_PLACES_API_KEY || '').trim();
const WHATSAPP_AGENT_NUMBER = String(process.env.WHATSAPP_AGENT_NUMBER || projectConfig.WHATSAPP_AGENT_NUMBER || '').replace(/\D/g, '');
const DEFAULT_SEARCH_RADIUS_METERS = Number(process.env.DEFAULT_SEARCH_RADIUS_METERS || projectConfig.DEFAULT_SEARCH_RADIUS_METERS || 7000);
const validRoles = new Set(['Farmer', 'Labour', 'Consumer']);

app.use(cors());
app.use(express.json({ limit: '35mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function requireFields(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || String(body[field]).trim() === '');
  if (missing.length) {
    const error = new Error(`Missing required field(s): ${missing.join(', ')}`);
    error.status = 400;
    throw error;
  }
}

function numberValue(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function nowISO() {
  return new Date().toISOString();
}

function slotHours(date, startTime, endTime) {
  const start = new Date(`${date}T${startTime}:00`);
  const end = new Date(`${date}T${endTime}:00`);
  const diff = (end.getTime() - start.getTime()) / 36e5;
  return diff > 0 ? diff : 0;
}

function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id));
}

function getPublicUserById(id) {
  return publicUser(getUserById(id));
}

function offerWithUsers(row) {
  if (!row) return row;
  const fromUser = getPublicUserById(row.from_user_id);
  const toUser = getPublicUserById(row.to_user_id);
  let item = null;
  if (row.item_type === 'FarmerItem') {
    item = db.prepare(`
      SELECT farmer_items.*, users.name AS owner_name, users.phone AS owner_phone, users.location AS owner_location,
             users.latitude AS owner_latitude, users.longitude AS owner_longitude, users.photo AS owner_photo
      FROM farmer_items
      JOIN users ON users.id = farmer_items.farmer_id
      WHERE farmer_items.id = ?
    `).get(row.item_id);
  }
  return { ...row, from_user: fromUser, to_user: toUser, item };
}

function validateOfferStock(itemType, itemId, quantity, toUserId) {
  const qty = numberValue(quantity, 1);
  if (qty <= 0) {
    const error = new Error('Quantity must be greater than zero.');
    error.status = 400;
    throw error;
  }

  if (itemType === 'FarmerItem') {
    const item = db.prepare('SELECT * FROM farmer_items WHERE id = ?').get(Number(itemId));
    if (!item || item.status !== 'Available') {
      const error = new Error('This farmer item is not available now.');
      error.status = 404;
      throw error;
    }
    if (Number(item.farmer_id) !== Number(toUserId)) {
      const error = new Error('Offer receiver does not own this farmer item.');
      error.status = 400;
      throw error;
    }
    if (qty > Number(item.quantity)) {
      const error = new Error(`Only ${item.quantity} quantity is available for ${item.item_name}. Reduce your order quantity.`);
      error.status = 409;
      throw error;
    }
    return item;
  }


  const error = new Error('Invalid item type.');
  error.status = 400;
  throw error;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, database: dbPath, message: 'Agritech SQLite API is running.' });
});

app.post('/api/auth/signup', async (req, res, next) => {
  try {
    requireFields(req.body, ['name', 'email', 'password', 'role']);
    const role = String(req.body.role).trim();
    if (!validRoles.has(role)) return res.status(400).json({ error: 'Invalid role selected.' });
    const email = String(req.body.email).trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'An account already exists with this email.' });
    const passwordHash = await bcrypt.hash(String(req.body.password), 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, profile_completed)
      VALUES (?, ?, ?, ?, 0)
    `).run(String(req.body.name).trim(), email, passwordHash, role);
    res.status(201).json({ user: getPublicUserById(result.lastInsertRowid) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    requireFields(req.body, ['email', 'password']);
    const email = String(req.body.email).trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });
    const ok = await bcrypt.compare(String(req.body.password), user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/users', (req, res) => {
  const role = req.query.role;
  const except = Number(req.query.except || 0);
  let rows;
  if (role && validRoles.has(role)) {
    rows = db.prepare('SELECT * FROM users WHERE role = ? AND id != ? ORDER BY created_at DESC').all(role, except);
  } else {
    rows = db.prepare('SELECT * FROM users WHERE id != ? ORDER BY created_at DESC').all(except);
  }
  res.json({ users: rows.map(publicUser) });
});

app.get('/api/users/:id', (req, res) => {
  const user = getPublicUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user });
});

app.put('/api/users/:id/profile', (req, res, next) => {
  try {
    const existing = getUserById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'User not found.' });
    const fields = {
      name: req.body.name ?? existing.name,
      photo: req.body.photo ?? existing.photo,
      phone: req.body.phone ?? existing.phone,
      whatsapp: req.body.whatsapp ?? existing.whatsapp,
      address: req.body.address ?? existing.address,
      location: req.body.location ?? existing.location,
      latitude: req.body.latitude !== undefined && req.body.latitude !== '' ? numberValue(req.body.latitude, existing.latitude) : existing.latitude,
      longitude: req.body.longitude !== undefined && req.body.longitude !== '' ? numberValue(req.body.longitude, existing.longitude) : existing.longitude,
      labour_rate: req.body.labour_rate !== undefined ? numberValue(req.body.labour_rate, existing.labour_rate) : existing.labour_rate,
      profile_completed: 1,
      id: existing.id
    };
    db.prepare(`
      UPDATE users
      SET name = @name, photo = @photo, phone = @phone, whatsapp = @whatsapp,
          address = @address, location = @location, latitude = @latitude, longitude = @longitude,
          labour_rate = @labour_rate, profile_completed = @profile_completed
      WHERE id = @id
    `).run(fields);
    res.json({ user: getPublicUserById(existing.id) });
  } catch (error) {
    next(error);
  }
});

app.put('/api/labour/:id/status', (req, res) => {
  const user = getUserById(req.params.id);
  if (!user || user.role !== 'Labour') return res.status(404).json({ error: 'Labour profile not found.' });
  const isOnline = req.body.is_online ? 1 : 0;
  db.prepare('UPDATE users SET is_online = ? WHERE id = ?').run(isOnline, user.id);
  res.json({ user: getPublicUserById(user.id) });
});

app.post('/api/labour/:id/slots', (req, res, next) => {
  try {
    requireFields(req.body, ['date', 'start_time', 'end_time']);
    const user = getUserById(req.params.id);
    if (!user || user.role !== 'Labour') return res.status(404).json({ error: 'Labour profile not found.' });
    const hours = slotHours(req.body.date, req.body.start_time, req.body.end_time);
    if (hours <= 0) return res.status(400).json({ error: 'End time must be later than start time.' });
    const result = db.prepare(`
      INSERT INTO labour_slots (labour_id, date, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `).run(user.id, String(req.body.date), String(req.body.start_time), String(req.body.end_time));
    res.status(201).json({ slot: db.prepare('SELECT * FROM labour_slots WHERE id = ?').get(result.lastInsertRowid) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/labour/:id/slots', (req, res) => {
  const rows = db.prepare(`
    SELECT labour_slots.*,
           bookings.id AS booking_id,
           bookings.status AS booking_status,
           users.name AS booked_by_name,
           users.phone AS booked_by_phone,
           users.role AS booked_by_role
    FROM labour_slots
    LEFT JOIN bookings ON bookings.slot_id = labour_slots.id AND bookings.status = 'Confirmed'
    LEFT JOIN users ON users.id = bookings.booked_by
    WHERE labour_slots.labour_id = ?
    ORDER BY labour_slots.date, labour_slots.start_time
  `).all(req.params.id);
  res.json({ slots: rows });
});

app.get('/api/labour/online/list', (req, res) => {
  const rows = db.prepare(`
    SELECT * FROM users
    WHERE role = 'Labour' AND is_online = 1
    ORDER BY labour_rate ASC, name ASC
  `).all();
  const labours = rows.map((labour) => {
    const slots = db.prepare(`
      SELECT * FROM labour_slots
      WHERE labour_id = ? AND status = 'Available'
      ORDER BY date, start_time
    `).all(labour.id);
    return { ...publicUser(labour), slots };
  });
  res.json({ labours });
});

app.post('/api/bookings', (req, res, next) => {
  try {
    requireFields(req.body, ['slot_id', 'booked_by']);
    const slot = db.prepare('SELECT * FROM labour_slots WHERE id = ?').get(req.body.slot_id);
    if (!slot) return res.status(404).json({ error: 'Labour slot not found.' });
    if (slot.status !== 'Available') return res.status(409).json({ error: 'This slot is already booked.' });
    const labour = getUserById(slot.labour_id);
    const bookedBy = getUserById(req.body.booked_by);
    if (!labour || labour.role !== 'Labour') return res.status(404).json({ error: 'Labour profile not found.' });
    if (!bookedBy) return res.status(404).json({ error: 'Booking user not found.' });
    if (bookedBy.role !== 'Farmer') return res.status(403).json({ error: 'Only farmers can book labour in this version.' });
    const hours = slotHours(slot.date, slot.start_time, slot.end_time);
    const totalCost = Math.round(hours * (numberValue(labour.labour_rate, 0) / 8) * 100) / 100;
    const transaction = db.transaction(() => {
      db.prepare('UPDATE labour_slots SET status = ?, booked_by = ? WHERE id = ?').run('Booked', bookedBy.id, slot.id);
      const result = db.prepare(`
        INSERT INTO bookings (labour_id, booked_by, slot_id, total_hours, total_cost)
        VALUES (?, ?, ?, ?, ?)
      `).run(labour.id, bookedBy.id, slot.id, hours, totalCost);
      return result.lastInsertRowid;
    });
    const bookingId = transaction();
    res.status(201).json({ booking: db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/bookings', (req, res) => {
  const userId = Number(req.query.user_id || 0);
  const labourId = Number(req.query.labour_id || 0);
  let query = `
    SELECT bookings.*, labour_slots.date, labour_slots.start_time, labour_slots.end_time,
           labour.name AS labour_name, labour.phone AS labour_phone, labour.whatsapp AS labour_whatsapp,
           labour.location AS labour_location, labour.latitude AS labour_latitude, labour.longitude AS labour_longitude,
           customer.name AS customer_name, customer.phone AS customer_phone, customer.role AS customer_role,
           customer.location AS customer_location, customer.latitude AS customer_latitude, customer.longitude AS customer_longitude
    FROM bookings
    JOIN labour_slots ON labour_slots.id = bookings.slot_id
    JOIN users AS labour ON labour.id = bookings.labour_id
    JOIN users AS customer ON customer.id = bookings.booked_by
  `;
  const params = [];
  if (userId) { query += ' WHERE bookings.booked_by = ?'; params.push(userId); }
  if (labourId) { query += userId ? ' AND bookings.labour_id = ?' : ' WHERE bookings.labour_id = ?'; params.push(labourId); }
  query += ' ORDER BY labour_slots.date DESC, labour_slots.start_time DESC';
  res.json({ bookings: db.prepare(query).all(...params) });
});

app.put('/api/bookings/:id/cancel', (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  if (booking.status === 'Cancelled') return res.json({ booking });
  const requesterId = Number(req.body.requester_id || 0);
  if (requesterId && requesterId !== Number(booking.labour_id) && requesterId !== Number(booking.booked_by)) {
    return res.status(403).json({ error: 'Only the labourer or booking owner can revoke this booking.' });
  }
  const transaction = db.transaction(() => {
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run('Cancelled', booking.id);
    db.prepare('UPDATE labour_slots SET status = ?, booked_by = NULL WHERE id = ?').run('Available', booking.slot_id);
  });
  transaction();
  res.json({ booking: db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id) });
});

app.get('/api/stats/labour/:id', (req, res) => {
  const stats = db.prepare(`
    SELECT COALESCE(SUM(total_hours), 0) AS total_hours,
           COALESCE(SUM(total_cost), 0) AS earnings,
           COUNT(*) AS bookings_count
    FROM bookings
    WHERE labour_id = ? AND status = 'Confirmed'
  `).get(req.params.id);
  res.json({ stats });
});

app.post('/api/farmer/items', (req, res, next) => {
  try {
    requireFields(req.body, ['farmer_id', 'item_name', 'expected_price']);
    const farmer = getUserById(req.body.farmer_id);
    if (!farmer || farmer.role !== 'Farmer') return res.status(404).json({ error: 'Farmer profile not found.' });
    const quantity = numberValue(req.body.quantity, 1);
    if (quantity <= 0) return res.status(400).json({ error: 'Quantity must be greater than zero.' });
    const result = db.prepare(`
      INSERT INTO farmer_items (farmer_id, item_name, photo, expected_price, quantity, harvest_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(farmer.id, String(req.body.item_name), req.body.photo || '', numberValue(req.body.expected_price), quantity, req.body.harvest_date || '');
    res.status(201).json({ item: db.prepare('SELECT * FROM farmer_items WHERE id = ?').get(result.lastInsertRowid) });
  } catch (error) {
    next(error);
  }
});

app.put('/api/farmer/items/:id', (req, res, next) => {
  try {
    const item = db.prepare('SELECT * FROM farmer_items WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Farmer item not found.' });
    const requesterId = Number(req.body.farmer_id || req.body.user_id || 0);
    if (!requesterId || requesterId !== Number(item.farmer_id)) return res.status(403).json({ error: 'Only the owner farmer can edit this crop.' });
    requireFields(req.body, ['item_name', 'expected_price', 'quantity']);
    const quantity = numberValue(req.body.quantity, item.quantity);
    if (quantity < 0) return res.status(400).json({ error: 'Quantity cannot be negative.' });
    const status = quantity <= 0 ? 'Sold' : (req.body.status === 'Sold' ? 'Sold' : 'Available');
    db.prepare(`
      UPDATE farmer_items
      SET item_name = ?, photo = ?, expected_price = ?, quantity = ?, harvest_date = ?, status = ?
      WHERE id = ?
    `).run(
      String(req.body.item_name).trim(),
      req.body.photo || '',
      numberValue(req.body.expected_price),
      quantity,
      req.body.harvest_date || '',
      status,
      item.id
    );
    res.json({ item: db.prepare('SELECT * FROM farmer_items WHERE id = ?').get(item.id) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/farmer/items', (req, res) => {
  const farmerId = Number(req.query.farmer_id || 0);
  const rows = farmerId
    ? db.prepare("SELECT * FROM farmer_items WHERE farmer_id = ? AND status != 'Hidden' ORDER BY created_at DESC").all(farmerId)
    : db.prepare("SELECT * FROM farmer_items WHERE status != 'Hidden' ORDER BY created_at DESC").all();
  res.json({ items: rows });
});

app.delete('/api/farmer/items/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM farmer_items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Farmer item not found.' });
  const requesterId = Number(req.query.user_id || req.body?.user_id || 0);
  if (requesterId && requesterId !== Number(item.farmer_id)) return res.status(403).json({ error: 'Only the owner farmer can delete this item.' });
  db.prepare("UPDATE farmer_items SET status = 'Hidden' WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

app.get('/api/market/farmer-items', (req, res) => {
  const rows = db.prepare(`
    SELECT farmer_items.*, users.name AS farmer_name, users.phone AS farmer_phone, users.location AS farmer_location,
           users.latitude AS farmer_latitude, users.longitude AS farmer_longitude, users.photo AS farmer_photo
    FROM farmer_items
    JOIN users ON users.id = farmer_items.farmer_id
    WHERE farmer_items.status = 'Available' AND farmer_items.quantity > 0
    ORDER BY farmer_items.created_at DESC
  `).all();
  res.json({ items: rows });
});

app.post('/api/offers', (req, res, next) => {
  try {
    requireFields(req.body, ['from_user_id', 'to_user_id', 'item_type', 'item_id', 'offer_price']);
    const itemType = req.body.item_type;
    if (itemType !== 'FarmerItem') return res.status(400).json({ error: 'Only farmer crop offers are allowed in this version.' });
    const fromUser = getUserById(req.body.from_user_id);
    const toUser = getUserById(req.body.to_user_id);
    if (!fromUser || !toUser) return res.status(404).json({ error: 'Offer sender or receiver not found.' });
    const quantity = numberValue(req.body.quantity, 1);
    validateOfferStock(itemType, req.body.item_id, quantity, toUser.id);
    const result = db.prepare(`
      INSERT INTO offers (from_user_id, to_user_id, item_type, item_id, quantity, offer_price, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(fromUser.id, toUser.id, itemType, Number(req.body.item_id), quantity, numberValue(req.body.offer_price), req.body.note || '');
    res.status(201).json({ offer: offerWithUsers(db.prepare('SELECT * FROM offers WHERE id = ?').get(result.lastInsertRowid)) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/offers', (req, res) => {
  const userId = Number(req.query.user_id || 0);
  const box = req.query.box || 'all';
  let query = 'SELECT * FROM offers';
  const params = [];
  if (userId && box === 'sent') { query += ' WHERE from_user_id = ?'; params.push(userId); }
  else if (userId && box === 'received') { query += ' WHERE to_user_id = ?'; params.push(userId); }
  else if (userId) { query += ' WHERE from_user_id = ? OR to_user_id = ?'; params.push(userId, userId); }
  query += ' ORDER BY created_at DESC';
  const offers = db.prepare(query).all(...params).map(offerWithUsers);
  res.json({ offers });
});


app.put('/api/offers/:id/withdraw', (req, res, next) => {
  try {
    const requesterId = Number(req.body.requester_id || 0);
    const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Offer not found.' });
    if (!requesterId || requesterId !== Number(offer.from_user_id)) return res.status(403).json({ error: 'Only the customer who placed this order can withdraw it.' });
    if (offer.status !== 'Pending') return res.status(409).json({ error: `Only pending orders can be withdrawn. Current status: ${offer.status}.` });
    db.prepare('UPDATE offers SET status = ? WHERE id = ?').run('Withdrawn', offer.id);
    res.json({ offer: offerWithUsers(db.prepare('SELECT * FROM offers WHERE id = ?').get(offer.id)) });
  } catch (error) {
    next(error);
  }
});

app.put('/api/offers/:id/status', (req, res, next) => {
  try {
    const status = req.body.status;
    if (!['Accepted', 'Declined', 'Pending', 'Withdrawn'].includes(status)) return res.status(400).json({ error: 'Invalid offer status.' });
    const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Offer not found.' });
    if (status === 'Withdrawn') return res.status(400).json({ error: 'Use withdraw order action for customer withdrawals.' });
    if (offer.status !== 'Pending' && status === 'Accepted') return res.status(409).json({ error: `This offer is already ${offer.status}.` });

    if (status !== 'Accepted') {
      db.prepare('UPDATE offers SET status = ? WHERE id = ?').run(status, req.params.id);
      return res.json({ offer: offerWithUsers(db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id)) });
    }

    const item = validateOfferStock(offer.item_type, offer.item_id, offer.quantity, offer.to_user_id);
    const fromUser = getUserById(offer.from_user_id);
    const transaction = db.transaction(() => {
      if (offer.item_type === 'FarmerItem') {
        const remaining = Number(item.quantity) - Number(offer.quantity);
        db.prepare('UPDATE farmer_items SET quantity = ?, status = ? WHERE id = ?').run(Math.max(remaining, 0), remaining <= 0 ? 'Sold' : 'Available', item.id);
      }
      db.prepare('UPDATE offers SET status = ? WHERE id = ?').run('Accepted', offer.id);
    });
    transaction();
    res.json({ offer: offerWithUsers(db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id)) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/investments', (req, res, next) => {
  try {
    requireFields(req.body, ['farmer_id', 'category', 'amount']);
    const farmer = getUserById(req.body.farmer_id);
    if (!farmer || farmer.role !== 'Farmer') return res.status(404).json({ error: 'Farmer profile not found.' });
    const result = db.prepare(`
      INSERT INTO investments (farmer_id, category, amount, note, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(farmer.id, String(req.body.category), numberValue(req.body.amount), req.body.note || '', nowISO());
    res.status(201).json({ investment: db.prepare('SELECT * FROM investments WHERE id = ?').get(result.lastInsertRowid) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/investments', (req, res) => {
  const farmerId = Number(req.query.farmer_id || 0);
  if (!farmerId) return res.status(400).json({ error: 'farmer_id is required.' });
  res.json({ investments: db.prepare('SELECT * FROM investments WHERE farmer_id = ? ORDER BY created_at DESC').all(farmerId) });
});

app.put('/api/investments/:id', (req, res, next) => {
  try {
    requireFields(req.body, ['farmer_id', 'category', 'amount']);
    const investment = db.prepare('SELECT * FROM investments WHERE id = ?').get(req.params.id);
    if (!investment) return res.status(404).json({ error: 'Investment not found.' });
    if (Number(investment.farmer_id) !== Number(req.body.farmer_id)) return res.status(403).json({ error: 'Only the owner farmer can edit this investment.' });
    db.prepare(`
      UPDATE investments
      SET category = ?, amount = ?, note = ?
      WHERE id = ?
    `).run(String(req.body.category), numberValue(req.body.amount), req.body.note || '', investment.id);
    res.json({ investment: db.prepare('SELECT * FROM investments WHERE id = ?').get(investment.id) });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/investments/:id', (req, res) => {
  const investment = db.prepare('SELECT * FROM investments WHERE id = ?').get(req.params.id);
  if (!investment) return res.status(404).json({ error: 'Investment not found.' });
  const farmerId = Number(req.query.farmer_id || req.body?.farmer_id || 0);
  if (!farmerId || farmerId !== Number(investment.farmer_id)) return res.status(403).json({ error: 'Only the owner farmer can delete this investment.' });
  db.prepare('DELETE FROM investments WHERE id = ?').run(investment.id);
  res.json({ ok: true });
});

app.get('/api/stats/farmer/:id', (req, res) => {
  const revenue = db.prepare(`
    SELECT COALESCE(SUM(offer_price * quantity), 0) AS total_revenue,
           COUNT(*) AS accepted_deals
    FROM offers
    WHERE to_user_id = ? AND item_type = 'FarmerItem' AND status = 'Accepted'
  `).get(req.params.id);
  const investments = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total_investments,
           COUNT(*) AS investment_count
    FROM investments
    WHERE farmer_id = ?
  `).get(req.params.id);
  const netProfit = numberValue(revenue.total_revenue) - numberValue(investments.total_investments);
  res.json({ stats: { ...revenue, ...investments, net_profit: netProfit } });
});


function normalizeStoreResult(raw) {
  const phone = raw.phone || raw.nationalPhoneNumber || raw.internationalPhoneNumber || raw.tags?.phone || raw.tags?.['contact:phone'] || 'Phone not available';
  const lat = raw.lat ?? raw.location?.latitude;
  const lng = raw.lng ?? raw.lon ?? raw.location?.longitude;
  return {
    id: raw.id || raw.placeId || `${raw.name || 'store'}-${lat}-${lng}`,
    name: raw.name || raw.displayName?.text || raw.tags?.name || 'Agriculture Store',
    category: raw.category || raw.primaryTypeDisplayName?.text || 'Agri Store',
    phone,
    address: raw.address || raw.formattedAddress || raw.tags?.['addr:full'] || raw.tags?.['addr:street'] || projectConfig.DEFAULT_STORE_SEARCH_ADDRESS || 'Open map for address',
    opening_hours: raw.opening_hours || raw.currentOpeningHours?.weekdayDescriptions?.join(' | ') || raw.tags?.opening_hours || 'Opening time not available',
    availability: raw.availability || (raw.currentOpeningHours?.openNow === true ? 'Open now' : raw.currentOpeningHours?.openNow === false ? 'Closed now' : 'Call to confirm'),
    lat,
    lng,
    map_url: raw.map_url || raw.googleMapsUri || (lat && lng ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : '')
  };
}

async function searchGooglePlacesAgriStores(lat, lng, radius) {
  const queries = [
    'agro chemicals store',
    'krishi kendra',
    'fertilizer shop',
    'pesticide shop',
    'seed shop',
    'farm supply shop',
    'agriculture essentials shop'
  ];
  const found = new Map();
  for (const textQuery of queries) {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.nationalPhoneNumber,places.internationalPhoneNumber,places.currentOpeningHours,places.googleMapsUri,places.businessStatus'
      },
      body: JSON.stringify({
        textQuery,
        languageCode: 'en',
        regionCode: 'IN',
        maxResultCount: 8,
        locationBias: {
          circle: {
            center: { latitude: Number(lat), longitude: Number(lng) },
            radius: Number(radius)
          }
        }
      })
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Google Places error: ${response.status} ${message}`);
    }
    const data = await response.json();
    (data.places || []).forEach((place) => {
      const store = normalizeStoreResult({
        ...place,
        category: textQuery,
        placeId: place.id,
        name: place.displayName?.text,
        address: place.formattedAddress
      });
      if (!found.has(store.id)) found.set(store.id, store);
    });
  }
  return [...found.values()].slice(0, 24);
}

async function searchOverpassAgriStores(lat, lng, radius) {
  const query = `
    [out:json][timeout:25];
    (
      node["shop"~"agrarian|garden_centre|farm|hardware|supermarket"](around:${radius},${lat},${lng});
      node["name"~"Krishi|Agro|Agri|Seeds|Seed|Fertilizer|Fertiliser|Pesticide|Farm",i](around:${radius},${lat},${lng});
      way["shop"~"agrarian|garden_centre|farm|hardware"](around:${radius},${lat},${lng});
      way["name"~"Krishi|Agro|Agri|Seeds|Seed|Fertilizer|Fertiliser|Pesticide|Farm",i](around:${radius},${lat},${lng});
    );
    out center tags 30;
  `;
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: query
  });
  if (!response.ok) throw new Error(`OpenStreetMap Overpass error: ${response.status}`);
  const data = await response.json();
  return (data.elements || []).map((element) => normalizeStoreResult({
    id: element.id,
    tags: element.tags || {},
    name: element.tags?.name,
    category: element.tags?.shop || 'Agri Store',
    lat: element.lat || element.center?.lat,
    lng: element.lon || element.center?.lon
  })).filter((store) => store.lat && store.lng).slice(0, 24);
}

app.get('/api/agri-stores/nearby', async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Math.min(Number(req.query.radius || DEFAULT_SEARCH_RADIUS_METERS), 20000);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: 'Valid lat and lng query parameters are required.' });
    }
    if (GOOGLE_PLACES_API_KEY) {
      try {
        const stores = await searchGooglePlacesAgriStores(lat, lng, radius);
        return res.json({ source: 'Google Places API', stores });
      } catch (placesError) {
        console.warn(placesError.message);
      }
    }
    const stores = await searchOverpassAgriStores(lat, lng, radius);
    res.json({
      source: 'OpenStreetMap Overpass API',
      warning: GOOGLE_PLACES_API_KEY ? 'Google Places failed, so free OpenStreetMap fallback was used.' : 'No Google Places API key found, so free OpenStreetMap fallback was used. Phone/opening time may be missing.',
      stores
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/whatsapp-agent', (req, res) => {
  if (!WHATSAPP_AGENT_NUMBER || WHATSAPP_AGENT_NUMBER.length < 10) {
    return res.status(400).json({ error: 'WhatsApp agent number is not configured in config.js.' });
  }
  const message = req.query.message || 'Hello, I need help with Farming Hub.';
  res.json({
    number: WHATSAPP_AGENT_NUMBER,
    url: `https://wa.me/${WHATSAPP_AGENT_NUMBER}?text=${encodeURIComponent(message)}`
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({ error: error.message || 'Something went wrong.' });
});

function startServer(port, attempts = 0) {
  const server = app.listen(port, () => {
    console.log('Farming Hub running successfully.');
    console.log(`Open this URL: http://localhost:${port}`);
    console.log(`SQLite database file: ${dbPath}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempts < 10) {
      const nextPort = Number(port) + 1;
      console.log(`Port ${port} is already in use. Trying port ${nextPort}...`);
      startServer(nextPort, attempts + 1);
      return;
    }
    console.error(error);
    process.exit(1);
  });
}

startServer(Number(PORT));
