import request from 'supertest';
import app from '../app';
import connectToDB from '../db';
import User from '../models/user_model';
import mongoose from 'mongoose';
import logger from '../utils/logger';

interface UserInfo {
    name: string,
    email: string,
    password: string,
    accessToken?: string,
    refreshToken?: string,
    _id?: string
}
const testUser: UserInfo = {
    name: 'testName',
    email: 'testMail',
    password: 'testPassword',
}
const invalidUser: UserInfo = {
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
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    const _id = response.body.user._id;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(_id).toBeDefined();
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser._id = _id;
});
test('Login with not existent user', async () => {
    const response = await request(app)
        .post('/auth/login')
        .send(invalidUser);
    expect(response.status).not.toBe(200);
});
test('Logout', async () => {
    const response = await request(app)
        .post('/auth/logout')
        .send({ refreshToken: testUser.refreshToken });
    expect(response.status).toBe(200);
});
test('Refresh token multiple times valid and invalid', async () => {
    const response = await request(app)
        .post('/auth/login')
        .send(testUser);
    expect(response.status).toBe(200);
    const refreshToken = response.body.refreshToken;
    const response2 = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: refreshToken });
    expect(response2.status).toBe(200);
    const refreshToken2 = response2.body.refreshToken;
    expect(refreshToken2).toBeDefined();
    expect(refreshToken).not.toBe(refreshToken2);
    const response3 = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: refreshToken });
    expect(response3.status).not.toBe(200);
    const response4 = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: refreshToken2 });
    expect(response4.status).not.toBe(200);

});



