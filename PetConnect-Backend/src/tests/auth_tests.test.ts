import request from 'supertest';
import app from '../app';
import connectToDB from '../db';
import User, { IUser } from '../models/user_model';
import mongoose from 'mongoose';
import logger from '../utils/logger';

const testUser: IUser = {
    name: 'testName',
    email: 'testMail',
    password: 'testPassword'
}
const invalidUser: IUser = {
    name: 'testName',
    email: 'fakeMail',
    password: ''
}

beforeAll(async () => {
    logger.info("beforeAll");
    await connectToDB();
    await User.deleteMany({});

});
afterAll(async () => {
    logger.info("afterAll");
    mongoose.connection.close();
});

test('Register new user', async () => {
    const response = await request(app)
        .post('/auth/register')
        .send(testUser);
    expect(response.status).toBe(200);
});
test('Register user with missing fileds or same email', async () => {
    const invalidUserResponse = await request(app)
        .post('/auth/register')
        .send(invalidUser);
    expect(invalidUserResponse.status).not.toBe(200);
    const existingUserResponse = await request(app)
        .post('/auth/register')
        .send(testUser);
    expect(existingUserResponse.status).not.toBe(200);
});
test('Login with exist user', async () => {
    const response = await request(app)
        .post('/auth/login')
        .send(testUser);
    expect(response.status).toBe(200);
});
test('Login with not existent user', async () => {
    const response = await request(app)
        .post('/auth/login')
        .send(invalidUser);
    expect(response.status).not.toBe(200);
});
