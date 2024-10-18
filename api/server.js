const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const userRoutes = require('./routes/userRoutes')

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/sessions', sessionRoutes);
app.use('/users', userRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
