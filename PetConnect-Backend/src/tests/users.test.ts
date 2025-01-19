import request from 'supertest';
import app from '../app';
import connectToDB from '../db';
import User from '../models/user_model';
import mongoose from 'mongoose';
import logger from '../utils/logger';
import path from 'path';
import fs from 'fs';

interface UserInfo {
    name: string,
    email: string,
    password: string,
    accessToken?: string,
    refreshToken?: string,
    _id?: string,
    profilePicture?: string
}
const testUser: UserInfo = {
    name: 'testName',
    email: 'testMail',
    password: 'testPassword',
}

const imagePath = path.join(__dirname, 'test_image.png')
const uploadsDir = path.join(__dirname, '../uploads');


beforeAll(async () => {
    logger.info("beforeAll");
    logger.info('Cleaning up uploads directory...');
    if (fs.existsSync(uploadsDir)) {
        // Read all files and folders inside the uploads directory
        const files = fs.readdirSync(uploadsDir);
        files.forEach((file) => {
            const filePath = path.join(uploadsDir, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                // Recursively delete subdirectory
                fs.rmdirSync(filePath, { recursive: true });
            } else {
                // Delete file
                fs.unlinkSync(filePath);
            }
        });
        logger.info('Uploads directory cleaned.');
    } else {
        logger.info('Uploads directory does not exist, skipping cleanup.');
    }

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
test('update user info with image png file', async () => {
    const response = await request(app)
        .put('/user')
        .set({
            authorization: "JWT " + testUser.accessToken,
        })
        .field({ 'name': 'newName' }).attach('image', imagePath);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('newName');
    expect(response.body.profilePicture).toBeDefined();
    expect(response.body.profilePicture).toContain('uploads/users_pictures/');
    testUser.profilePicture = response.body.profilePicture;
});
test('upload file that not image type fail', async () => {
    const response = await request(app)
        .put('/user')
        .set({
            authorization: "JWT " + testUser.accessToken,
        })
        .attach('image', path.join(__dirname, 'test_file.txt'));
    expect(response.status).not.toBe(200);
});
test('upload another image but jpg type file', async () => {
    const response = await request(app)
        .put('/user')
        .set({
            authorization: "JWT " + testUser.accessToken,
        })
        .attach('image', path.join(__dirname, 'test_image2.jpg'));
    expect(response.status).toBe(200);
});
test('update user info without image', async () => {
    const response = await request(app)
        .put('/user')
        .set({
            authorization: "JWT " + testUser.accessToken,
        }).send({ name: 'newName' });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('newName');
});
test('get user profile picture', async () => {
    logger.info("test user profile picture path = " + testUser.profilePicture);
    const response = await request(app).get(`/${testUser.profilePicture}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/^image\//);
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
