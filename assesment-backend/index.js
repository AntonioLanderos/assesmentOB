const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const { handleStripe } = require('./controllers/webhooks.controller');

app.post('/webhooks/stripe', bodyParser.raw({ type: 'application/json' }), handleStripe);
const ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// 1) CORS para todas las rutas
app.use(cors({
  origin: ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// 2) Preflight manual (evita path-to-regexp)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ORIGIN);
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json());

const db = require('./utils/database');

// Test database connection
db.testConnection()
  .then((connected) => {
    if (connected) {
      console.log('Database connection successful');
    } else {
      console.error('Database connection failed');
    }
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

app.use((req, res, next) => {
  const _json = res.json.bind(res);
  res.json = (data) => {
    const safe = JSON.parse(JSON.stringify(data, (k, v) =>
      typeof v === 'bigint' ? Number(v) : v
    ));
    return _json(safe);
  };
  next();
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const billingRoutes = require('./routes/billing.routes');
const adminRoutes = require('./routes/admin.routes');
const doctorRoutes = require('./routes/doctor.routes');
const filesRoutes = require('./routes/files.routes');

// Use routes
app.use('/auth', authRoutes);
app.use('/billing', billingRoutes);
app.use('/admin', adminRoutes);
app.use('/doctor', doctorRoutes);
app.use('/files', filesRoutes);

// base endpoint
app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});
  
/* Start server */
const port = process.env.PORT || 4000;
app.listen(port, () => {
console.log(`Server running on:  http://localhost:${port}`);
});
  
