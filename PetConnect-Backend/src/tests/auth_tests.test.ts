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

beforeAll(async () => {
    logger.info("beforeAll");
    await connectToDB();
    await User.deleteMany({});

});
afterAll(async () => {
    logger.info("afterAll");
    mongoose.connection.close();
});

test('Register user', async () => {
    const response = await request(app)
        .post('/auth/register')
        .send(testUser);
    expect(response.status).toBe(200);
});

