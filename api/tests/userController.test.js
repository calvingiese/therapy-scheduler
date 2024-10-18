const httpMocks = require('node-mocks-http');
const userController = require('../controllers/userController');

const User = require('../models/User');

jest.mock('../models/Session', () => {
  const SequelizeMock = require('sequelize-mock');
  const DBConnectionMock = new SequelizeMock();

  return DBConnectionMock.define('User', {
    username: 'test',
    email: 'test@example.com',
    password: 'password',
  });
});

describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllClients', () => {
        it('should fetch all clients', async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();

            const clients = [{ id: 1, email: 'user1@example.com' }, { id: 2, email: 'user2@example.com' }];
            User.findAll = jest.fn().mockResolvedValue(clients);

            await userController.getAllClients(req, res);

            expect(res.statusCode).toBe(200);
        });

        it('should fetch all therapists', async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();

            const therapists = [{ id: 1, email: 'user1@example.com' }, { id: 2, email: 'user2@example.com' }];
            User.findAll = jest.fn().mockResolvedValue(therapists);

            await userController.getAllTherapists(req, res);

            expect(res.statusCode).toBe(200);
        });

        it('should handle errors', async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            User.findAll = jest.fn().mockRejectedValue(new Error('Error fetching users'));

            await userController.getAllClients(req, res);

            expect(res.statusCode).toBe(500);
        });
    });
});
