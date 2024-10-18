const request = require('supertest');
const express = require('express');
const cors = require('cors');
const sequelize = require('../config/database');
require('dotenv').config();

const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('API Tests', () => {
    describe('Authentication Routes', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    username: 'nobody',
                    email: 'nobody@example.com',
                    password: 'testpassword',
                    role: 'client',
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
        });

        it('should login a user', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'nobody@example.com',
                    password: 'testpassword',
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });
    });
});
