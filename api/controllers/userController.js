const User = require('../models/User');

const getAllClients = async (req, res) => {
    try {
      const clients = await User.findAll({
        where: { role: 'client' }
      })

      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllTherapists = async (req, res) => {
  try {
    const therapists = await User.findAll({
      where: { role: 'therapist' }
    })

    res.json(therapists);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllClients, getAllTherapists };
