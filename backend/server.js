const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const ordersRouter = require('./routes/orders');
const menuRouter = require('./routes/menu');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/orders', ordersRouter);
app.use('/api/menu', menuRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Casa Misu API running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
