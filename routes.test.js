// __tests__/controllers/userController.test.js

const request = require('supertest');
const db = require('./app/models');
const User = db.user
const app = require('./server');
const { describe, it, expect } = require('jest');

describe('UserController', () => {
    let user;
    let token = null;

    // beforeEach(async () => {
    //     user = await User.create({
    //         username: 'Test',
    //         email: 'test@example.com',
    //         password: 'password123',
    //     });
    // });

    // afterEach(async () => {
    //     await User.destroy({ where: {} });
    // });

    describe('POST /api/auth/signup', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    username: 'Test',
                    email: 'janedoe@example.com',
                    password: 'password123',
                })
            expect(res.statusCode).toEqual(200);
            expect(res.body.firstName).toEqual('Jane');
        });

        it('should return a 400 if there is a validation error', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    username: 'Test',
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body[0].message).toEqual('user.email cannot be null');
        });
    });

    
    describe('POST /api/auth/signin', () => {
        it('should login', async () => {
            const res = await request(app)
                .post('/api/auth/signin')
                .send({
                    username: 'Test',
                    password: 'password123',
                })
                .end(function(err, res) {
                    token = res.body.accessToken;
                    done();
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.firstName).toEqual('Jane');
        });

        it('should return a 400 if there is a validation error', async () => {
            const res = await request(app)
                .post('/api/auth/signin')
                .send({
                    username: 'Test',
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body[0].message).toEqual('user.email cannot be null');
        });
    });


    describe('GET /api/users', () => {
        it('should return a list of users', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('x-access-token', token);
            expect(res.statusCode).toEqual(200);
            expect(res.body[0].username).toEqual('Test');
        });
    });
});

afterEach(async () => {
    await User.destroy({ where: {} });
});



describe('GET /users/:id', () => {
    it('should return a specific user', async () => {
        const res = await request(app).get(`/users/${ user.id }`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.firstName).toEqual('John');
    });

    it('should return a 404 if the user is not found', async () => {
        const res = await request(app).get('/users/999');

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('User Not Found');
    });
});

describe('POST /users', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'janedoe@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.firstName).toEqual('Jane');
    });

    it('should return a 400 if there is a validation error', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                firstName: 'Jane',
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body[0].message).toEqual('user.email cannot be null');
    });
});