const request = require('supertest');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
require('dotenv').config();

const authRoutes = require('../routes/authRoutes');
const sessionRoutes = require('../routes/sessionRoutes');
const userRoutes = require('../routes/userRoutes');
const User = require('../models/User');
const Session = require('../models/Session');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/sessions', sessionRoutes);
app.use('/users', userRoutes);

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
    describe('Protected Routes', () => {
        let token;

        beforeAll(async () => {
            const hashedPassword = await bcrypt.hash('password', 10);
            await User.create({ username: 'testuser', email: 'testuser@example.com', password: hashedPassword, role: 'therapist' });
        
            const response = await request(app).post('/auth/login').send({ email: 'testuser@example.com', password: 'password'});
            token = response.body.token;
        });
        
        afterAll(async () => {
            await User.destroy({ where: { username: 'testuser' } });
        });
        
        describe('User Routes', () => {
            it('should fetch all clients', async () => {
                const response = await request(app).get('/users/clients').set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            });

            it('should fetch all therapists', async () => {
                const response = await request(app).get('/users/therapists').set('Authorization', `Bearer ${token}`);
                
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            });
        });
    });
});
