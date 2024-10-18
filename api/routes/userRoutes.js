const express = require('express');
const { getAllClients, getAllTherapists } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.get('/clients', authenticateToken, getAllClients);
router.get('/therapists', authenticateToken, getAllTherapists);

module.exports = router;
