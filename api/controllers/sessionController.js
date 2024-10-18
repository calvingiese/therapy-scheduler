const User = require('../models/User');
const Session = require('../models/Session');
const { Op } = require('sequelize');

const createSession = async (req, res) => {
  const userId = req.user.id; 
  const { title, description, clientId } = req.body;
  try {
    const session = await Session.create({ title: title, description: description, status: 'open', clientId: clientId, therapistId: userId });
    res.status(201).json({ message: 'Session created successfully', session });
  } catch (err) {
    res.status(422).json({ message: 'Error creating session', err });
  }
};

const getSessions = async (req, res) => {
    try {
      const userId = req.user.id; 
      const role = req.user.role;
      const { date, therapistId, clientId } = req.query;

      let roleCondition = {};

      if (role === 'therapist') {
        roleCondition.therapistId = userId;
      } else if (role === 'client') {
        roleCondition.clientId = userId;
      }

      let filterCondition = {};
      if (date || therapistId || clientId) {
        filterCondition = {
          [Op.and]: [
            date ? { date } : null,
            therapistId ? { therapistId } : null,
            clientId ? { clientId } : null,
          ].filter(Boolean),
        };
      }
    
      const whereCondition = {
        ...roleCondition,
        ...filterCondition,
      };
      
      const sessions = await Session.findAll({
        where: whereCondition,
      });  
  
      const sessionsWithNames = await Promise.all(
        sessions.map(async (session) => {
          const therapist = await User.findByPk(session.therapistId, {
            attributes: ['id', 'username'],
          });
          const client = session.clientId
            ? await User.findByPk(session.clientId, {
                attributes: ['id', 'username'],
              })
            : null;
  
          return {
            ...session.get(),
            therapistName: therapist ? therapist.username : null,
            clientName: client ? client.username : null,
          };
        })
      );

      sessionsWithNames.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
  
      res.json(sessionsWithNames);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving sessions' });
    }
};

const updateSession = async (req, res) => {
  const { sessionId } = req.params;
  const { title, description, date, time, status, feedback } = req.body;

  try {
    const [updated] = await Session.update(
      { title, description, date, time, status, feedback },
      {
        where: { id: sessionId },
      }
    );

    if (updated) {
      const updatedSession = await Session.findOne({ where: { id: sessionId } });
      res.status(200).json(updatedSession);
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating session', err: error });
  }
};

const deleteSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const deleted = await Session.destroy({
      where: { id: sessionId },
    });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session', err: error });
  }
};

module.exports = { createSession, deleteSession, getSessions, updateSession };
