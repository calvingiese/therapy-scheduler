const express = require('express');
const { createSession, deleteSession, getSessions, updateSession } = require('../controllers/sessionController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, createSession);
router.get('/', authenticateToken, getSessions);
router.put('/:sessionId', authenticateToken, updateSession);
router.delete('/:sessionId', authenticateToken, deleteSession);

module.exports = router;
