import request from "supertest";
import app from '../app';
import connectToDB from '../db';
import Post, { IPost } from '../models/posts_model';
import User from '../models/user_model';
import mongoose from 'mongoose';
import logger from '../utils/logger';
import path from "path";



const testUser = {
    name: "testUser",
    email: "test@user.com",
    password: "123456",
    accessToken: "",
    id: ""
}

const testUser2 = {
    name: "testUser2",
    email: "test@user.com2",
    password: "1234562",
    accessToken: "",
    id: ""
}
const testPost: IPost = {
    title: 'testTitle',
    description: 'testDescription',
    likes: 0,
    likedBy: []
}
const testPost2: IPost = {
    title: 'testTitle2',
    description: 'testDescription2',
    likes: 0,
    likedBy: []
}
const invalidPost: IPost = {
    title: 'testInvalidTitle',
    description: '',
    likes: 0,
    likedBy: []
}
const imagePath = path.join(__dirname, 'test_image.png')
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

test('Create new post without image', async () => {
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

test('Create new post with image', async () => {
    logger.info("image path is " + imagePath);
    const response = await request(app).post('/posts')
        .set({
            authorization: "JWT " + testUser.accessToken,
        })
        .field({ 'title': 'testTitle2' })
        .field({ 'description': 'testDescription2' })
        .attach('image', imagePath);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('testTitle2');
    expect(response.body.description).toBe('testDescription2');
    expect(response.body.owner).toBe(testUser.id);
    expect(response.body.postPicture).toBeDefined();
    expect(response.body.postPicture).toContain('uploads/posts_pictures/');
    testPost2._id = response.body._id;
    testPost2.owner = response.body.owner;
    testPost2.postPicture = response.body.postPicture;
    testPost2.title = response.body.title;
    testPost2.description = response.body.description;
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
    expect(response.body.length).toBe(2);
});

test('Get post by id', async () => {
    const response = await request(app).get('/posts/' + testPost._id);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.description).toBe(testPost.description);
    expect(response.body.owner._id).toBe(testUser.id);
});

test('Get post by invalid id', async () => {
    const response = await request(app).get('/posts/' + testPost._id + 1);
    expect(response.status).not.toBe(200);
});

test('Update post with include image', async () => {
    const response = await request(app).put('/posts/' + testPost._id).set({
        authorization: "JWT " + testUser.accessToken,
    }).field({ 'title': 'updatedTitle', })
        .attach('image', imagePath);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('updatedTitle');
    expect(response.body.postPicture).toBeDefined();
    expect(response.body.postPicture).toContain('uploads/posts_pictures/');
    testPost.title = response.body.title;
    testPost.postPicture = response.body.postPicture;
});

test('Get posts pictures ', async () => {
    const response = await request(app).get(`/${testPost.postPicture}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/^image\//);

    const response2 = await request(app).get(`/${testPost2.postPicture}`);
    expect(response2.status).toBe(200);
    expect(response2.headers['content-type']).toMatch(/^image\//);
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


/*--------------------------------
        Tests for likes
----------------------------------*/

test('Like to post', async () => {
    const response = await request(app)
        .put(`/posts/${testPost._id}/like`)
        .set({ authorization: "JWT " + testUser.accessToken })
    expect(response.status).toBe(200);
    expect(response.body.likes).toBe(1);
});

test('Unlike to post', async () => {
    const response = await request(app)
        .put(`/posts/${testPost._id}/like`)
        .set({ authorization: "JWT " + testUser.accessToken })
    expect(response.status).toBe(200);
    expect(response.body.likes).toBe(0);
});

test('Like to post with invalid postId', async () => {
    const postId = testUser.id;
    const response = await request(app)
        .put('/posts/' + postId + '/like')
        .set({ authorization: "JWT " + testUser.accessToken })
    expect(response.status).not.toBe(200);
});

test('Like to post with two different users', async () => {
    const response = await request(app)
        .put(`/posts/${testPost._id}/like`)
        .set({ authorization: "JWT " + testUser.accessToken })

    expect(response.status).toBe(200);
    expect(response.body.likes).toBe(1);

    const response3 = await request(app).post('/auth/register').send(testUser2);
    expect(response3.status).toBe(200);
    const response4 = await request(app).post('/auth/login').send(testUser2);
    expect(response4.status).toBe(200);

    testUser2.id = response4.body._id;
    testUser2.accessToken = response4.body.accessToken;

    const response5 = await request(app)
        .put(`/posts/${testPost._id}/like`)
        .set({ authorization: "JWT " + testUser2.accessToken })
    expect(response5.status).toBe(200);
    expect(response5.body.likes).toBe(2);
});

/*--------------------------------
        End of tests for likes
----------------------------------*/


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

