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

beforeAll(async () => {
    logger.info("beforeAll");
    await connectToDB();
    await User.deleteMany({});
    const response = await request(app).post('/auth/register').send(testUser);
    expect(response.status).toBe(200);
    const response2 = await request(app).post('/auth/login').send(testUser);
    expect(response2.status).toBe(200);
    testUser._id = response2.body._id;
    testUser.accessToken = response2.body.accessToken;
    testUser.refreshToken = response2.body.refreshToken;
});

afterAll(async () => {
    logger.info("afterAll");
    mongoose.connection.close();
});

test('get user info', async () => {
    const response = await request(app)
        .get('/user')
        .set({
            authorization: "JWT " + testUser.accessToken,
        });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(testUser.name);
    expect(response.body.email).toBe(testUser.email);
    expect(response.body._id).toBe(testUser._id);
});
test('update user info', async () => {
    const response = await request(app)
        .put('/user')
        .set({
            authorization: "JWT " + testUser.accessToken,
        })
        .send({ name: 'newName' });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('newName');
});

test('get user after logout', async () => {
    const response = await request(app)
        .post('/auth/logout')
        .send({ refreshToken: testUser.refreshToken });
    expect(response.status).toBe(200);
    testUser.accessToken = "";
    const response2 = await request(app)
        .get('/user')
        .set({
            authorization: "JWT " + testUser.accessToken,
        });
    expect(response2.status).not.toBe(200);
});
test('update user info after logout', async () => {
    const response = await request(app)
        .put('/user')
        .set({
            authorization: "JWT " + testUser.accessToken,
        })
        .send({ name: 'newName' });
    expect(response.status).not.toBe(200);
});
