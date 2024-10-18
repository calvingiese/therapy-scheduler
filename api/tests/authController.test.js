const { register, login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const httpMocks = require('node-mocks-http');
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

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Auth Controller - Register & Login (with email)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully with email', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    req.body = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'therapist',
    };

    User.create = jest.fn().mockResolvedValue({
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      role: 'therapist',
    });
    bcrypt.hash = jest.fn().mockResolvedValue('password');

    await register(req, res, next);

    expect(User.create).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'testuser@example.com',
      password: expect.any(String),
      role: 'therapist',
    });

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: 'User registered successfully',
      user: { id: 1, username: 'testuser', email: 'testuser@example.com', role: 'therapist' },
    });
  });

  it('should return 400 if required fields (email) are missing during registration', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    req.body = {
      username: 'testuser',
      password: 'password123',
    };

    await register(req, res, next);

    expect(res.statusCode).toBe(422);
    expect(res._getJSONData().message).toBe('Error registering user');
  });

  it('should log in a user successfully and return a JWT token (with email)', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    req.body = {
      email: 'testuser@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      password: '$2b$10$123hashedpassword',
      role: 'therapist',
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);

    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const mockToken = 'mocked.jwt.token';
    jwt.sign.mockReturnValue(mockToken);

    await login(req, res, next);

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, role: mockUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    expect(res.statusCode).toBe(200);
  });

  it('should return 401 if the password is incorrect', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    req.body = {
      email: 'testuser@example.com',
      password: 'wrongpassword',
    };

    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      password: '$2b$10$123hashedpassword',
      role: 'therapist',
    };
    User.findOne.mockResolvedValue(mockUser);

    bcrypt.compare.mockResolvedValue(false);

    await login(req, res, next);

    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData().message).toBe('Invalid credentials');
  });

  it('should return 404 if the user (email) is not found', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    req.body = {
      email: 'nonexistentuser@example.com',
      password: 'password123',
    };

    User.findOne.mockResolvedValue(null);

    await login(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData().message).toBe('User not found');
  });
});
