import request from "supertest";
import app from '../app';
import connectToDB from '../db';
import Post from '../models/posts_model';
import User from '../models/user_model';
import mongoose from 'mongoose';
import logger from '../utils/logger';


interface Post{
    owner: string,
    title: string,
    description: string,
    _id?: string
}

const testUser = {
    name: "testUser",
    email: "test@user.com",
    password: "123456",
    accessToken:""
}

const testPost: Post = {
    owner: "testPostOwner",
    title: 'testTitle',
    description: 'testDescription'
}

const invalidPost: Post = {
    owner: '',
    title: 'testInvalidTitle',
    description: '',
    _id:""
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
    testUser.accessToken = response2.body.accessToken;
    testPost.owner = response2.body.email;

});

afterAll(async () => {
    logger.info("afterAll");
    mongoose.connection.close();
});

test('Create new post', async () => {
    const response = await request(app).post('/posts')
    .set({
        authorization:"JWT " + testUser.accessToken,
        })
        .send(testPost);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.description).toBe(testPost.description);
    expect (response.body.owner).toBe(testPost.owner);
    testPost._id = response.body._id;
    });

test ('Create invalid post', async () => {
    const response = await request(app).post('/posts').set({
        authorization:"JWT " + testUser.accessToken,
        }).send(invalidPost);
    expect(response.status).toBe(400);
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
    expect(response.status).toBe(400);
    });

test('Update post', async () => {
    const response = await request(app).put('/posts/' + testPost._id).set({
        authorization:"JWT " + testUser.accessToken,
        }).send({
            title: 'updatedTitle',
            description: 'updatedDescription'});
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('updatedTitle');
    expect(response.body.description).toBe('updatedDescription');
    });

test('Update post with invalid id', async () => {
    const response = await request(app).put('/posts/' + testPost._id + 1).set({
        authorization:"JWT " + testUser.accessToken,
        }).send({
            title: 'updatedTitle',
            description: 'updatedDescription'});
    expect(response.status).toBe(400);
    });

test('Update post with invalid data', async () => {
    const response = await request(app).put('/posts/' + testPost._id).set({
        authorization:"JWT " + testUser.accessToken,
        }).send({
            title: '',
            description: ''});
    expect(response.status).toBe(400);
    });

test('Delete post by postId', async () => {
    const response = await request(app).delete('/posts/' + testPost._id).set({
        authorization:"JWT " + testUser.accessToken,
        });
    expect(response.status).toBe(200);

    const response2 = await request(app).get('/posts/' + testPost._id);
    expect(response2.status).not.toBe(200);
    });

