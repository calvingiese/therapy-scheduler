const { createSession, updateSession, deleteSession, getSessions } = require('../controllers/sessionController');
const httpMocks = require('node-mocks-http');
const SequelizeMock = require('sequelize-mock');

// Mock Sequelize model inside jest.mock
jest.mock('../models/Session', () => {
  const SequelizeMock = require('sequelize-mock');
  const DBConnectionMock = new SequelizeMock();

  return DBConnectionMock.define('Session', {
    title: 'Mock Session',
    description: 'This is a mock session',
    date: '2024-10-20',
    time: '10:00 AM',
    therapistId: 1,
    clientId: 2,
    status: 'open',
  });
});

// Load mocked Session model
const Session = require('../models/Session');

describe('Session Controller - Unit Tests', () => {
    describe('getSessions', () => {
        it('should get an array of sessions', async () => {
            const req = httpMocks.createRequest({
                method: 'GET'
            });
            req.user = {id: 1, role: 'client'}
            const res = httpMocks.createResponse();
            
            Session.findAll = jest.fn().mockResolvedValue([]);
            await getSessions(req, res);
            
            expect(res.statusCode).toBe(200);
        });
    });

    describe('createSession', () => {
        it('should create a new session and return it with status 201', async () => {
            const req = httpMocks.createRequest({
                method: 'POST',
                body: {
                    title: 'New Session',
                    description: 'This is a new session',
                    date: '2024-11-05',
                    time: '11:00 AM',
                    therapistId: 1,
                    clientId: 2,
                }
            });
            req.user = {id:1}
            const res = httpMocks.createResponse();
            
            await createSession(req, res);
            
            expect(res.statusCode).toBe(201);
        });
    });
   
    describe('updateSession', () => {
        it('should update an existing session', async () => {
            const req = httpMocks.createRequest({
                method: 'PUT',
                params: { id: 1 },
                body: {
                    title: 'Updated Session',
                    description: 'This session has been updated',
                }
            });
            const res = httpMocks.createResponse();
           
            Session.findByPk = jest.fn().mockResolvedValue({
                id: 1,
                title: 'Old Session',
                description: 'Old description',
                date: '2024-10-20',
                time: '10:00 AM',
                therapistId: 1,
                clientId: 2,
                save: jest.fn().mockResolvedValue(true),
            });

            await updateSession(req, res);
            
            expect(res.statusCode).toBe(200);
        });

        it('should return 404 if session not found', async () => {
            const req = httpMocks.createRequest({
                method: 'PUT',
                params: { id: 999 },
                body: {
                    title: 'Updated Session',
                }
            });
            const res = httpMocks.createResponse();
           
            Session.update = jest.fn().mockResolvedValue([null]);

            await updateSession(req, res);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('deleteSession', () => {
      it('should delete an existing session', async () => {
          const req = httpMocks.createRequest({
              method: 'DELETE',
              params: { id: 1 },
              body: {
                  title: 'Updated Session',
                  description: 'This session has been updated',
              }
          });
          const res = httpMocks.createResponse();
         
          Session.destroy = jest.fn().mockResolvedValue(true);

          await deleteSession(req, res);
          
          expect(res.statusCode).toBe(204);
      });
  });
});
