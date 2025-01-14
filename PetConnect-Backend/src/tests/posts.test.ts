import request from "supertest";
import app from '../app';
import connectToDB from '../db';
import Post from '../models/posts_model';
import User from '../models/user_model';
import mongoose from 'mongoose';
import logger from '../utils/logger';


interface Post {
    owner?: string,
    title: string,
    description: string,
    _id?: string
}

const testUser = {
    name: "testUser",
    email: "test@user.com",
    password: "123456",
    accessToken: "",
    id: ""
}

const testPost: Post = {
    title: 'testTitle',
    description: 'testDescription'
}

const invalidPost: Post = {
    title: 'testInvalidTitle',
    description: '',
}

beforeAll(async () => {
    logger.info("beforeAll");
    await connectToDB();
    await Post.deleteMany({});
    await User.deleteMany({});
    const response = await request(app).post('/auth/register').send(testUser);
    expect(response.status).toBe(200);
    const response2 = await request(app).post('/auth/login').send(testUser);
    expect(response2.status).toBe(200);
    testUser.id = response2.body._id;
    testUser.accessToken = response2.body.accessToken;
});

afterAll(async () => {
    logger.info("afterAll");
    mongoose.connection.close();
});

test('Create new post', async () => {
    const response = await request(app).post('/posts')
        .set({
            authorization: "JWT " + testUser.accessToken,
        })
        .send(testPost);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.description).toBe(testPost.description);
    expect(response.body.owner).toBe(testUser.id);
    testPost._id = response.body._id;
    testPost.owner = response.body.owner;
});

test('Create invalid post', async () => {
    const response = await request(app).post('/posts').set({
        authorization: "JWT " + testUser.accessToken,
    }).send(invalidPost);
    expect(response.status).not.toBe(200);
});

test('Get all posts', async () => {
    const response = await request(app).get('/posts');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
});

test('Get post by id', async () => {
    const response = await request(app).get('/posts/' + testPost._id);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.description).toBe(testPost.description);
    expect(response.body.owner).toBe(testPost.owner);
});

test('Get post by invalid id', async () => {
    const response = await request(app).get('/posts/' + testPost._id + 1);
    expect(response.status).not.toBe(200);
});

test('Update post', async () => {
    const response = await request(app).put('/posts/' + testPost._id).set({
        authorization: "JWT " + testUser.accessToken,
    }).send({
        title: 'updatedTitle',
        description: 'updatedDescription'
    });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('updatedTitle');
    expect(response.body.description).toBe('updatedDescription');
});

test('Update post with invalid id', async () => {
    const response = await request(app).put('/posts/' + testPost._id + 1).set({
        authorization: "JWT " + testUser.accessToken,
    }).send({
        title: 'updatedTitle',
        description: 'updatedDescription'
    });
    expect(response.status).not.toBe(200);
});

test('Update post with invalid data', async () => {
    const response = await request(app).put('/posts/' + testPost._id).set({
        authorization: "JWT " + testUser.accessToken,
    }).send({
        title: '',
        description: ''
    });
    expect(response.status).not.toBe(200);
});

test('Delete post with invalid postId', async () => {
    const response = await request(app).delete('/posts/' + testPost._id + 5).set({
        authorization: "JWT " + testUser.accessToken,
    });
    expect(response.status).not.toBe(200);
});

test('Delete post with invalid userId', async () => {
    const response = await request(app).delete('/posts/' + testPost._id).set({
        authorization: "JWT " + testUser.accessToken + 5,
    });
    expect(response.status).not.toBe(200);
});


test('Delete post by correct postId anf userId', async () => {
    const response = await request(app).delete('/posts/' + testPost._id).set({
        authorization: "JWT " + testUser.accessToken,
    });
    expect(response.status).toBe(200);

    const response2 = await request(app).get('/posts/' + testPost._id);
    expect(response2.status).not.toBe(200);
});



