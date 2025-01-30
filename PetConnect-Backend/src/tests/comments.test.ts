import request from "supertest";
import app from '../app';
import connectToDB from '../db';
import User from '../models/user_model';
import Comment, { IComment } from '../models/comment_model';
import Post, { IPost } from '../models/posts_model';
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
const testUser2: UserInfo = {
    name: 'testName2',
    email: 'testMail2',
    password: 'testPassword2',
}
const testPost: IPost = {
    title: 'testTitle',
    description: 'testDescription',
    likes: 0,
    likedBy: []
}
const testComment: IComment = {
    content: 'testContent',

}
const invalidComment: IComment = {
    content: '',
}

beforeAll(async () => {
    logger.info("beforeAll");
    await connectToDB();
    await User.deleteMany({});
    await Comment.deleteMany({});
    await Post.deleteMany({});
    const response = await request(app)
        .post('/auth/register')
        .send(testUser);
    expect(response.status).toBe(200);
    const response2 = await request(app)
        .post('/auth/login')
        .send(testUser);
    expect(response2.status).toBe(200);
    testUser._id = response2.body.user._id;
    testUser.accessToken = response2.body.accessToken;
    const response3 = await request(app)
        .post('/posts')
        .set({ authorization: "JWT " + testUser.accessToken })
        .send(testPost);
    expect(response3.status).toBe(200);
    await request(app)
        .post('/posts')
        .set({ authorization: "JWT " + testUser.accessToken })
        .send(testPost);
    testPost._id = response3.body._id;
    testPost.owner = response3.body.owner._id;

});

afterAll(async () => {
    logger.info("afterAll");
    mongoose.connection.close();
});

test('Create new comment', async () => {
    logger.info("post id is " + testPost._id);
    const response = await request(app)
        .post(`/posts/${testPost._id}/comments`)
        .set({ authorization: "JWT " + testUser.accessToken })
        .send(testComment);
    expect(response.status).toBe(200);
    expect(response.body.content).toBe(testComment.content);
    expect(response.body.postId).toBe(testPost._id);
    expect(response.body.owner._id).toBe(testUser._id);
    const response2 = await request(app)
        .post(`/posts/${testPost._id}/comments`)
        .set({ authorization: "JWT " + testUser.accessToken })
        .send(testComment);
    expect(response2.status).toBe(200);
    testComment._id = response.body._id;
    testComment.owner = response.body.owner;
    testComment.postId = response.body.postId;

});
test('Create invalid comment', async () => {
    const response = await request(app)
        .post(`/posts/${testPost._id}/comments`)
        .set({ authorization: "JWT " + testUser.accessToken })
        .send(invalidComment);
    expect(response.status).not.toBe(200);
});
test('Get all comments by postsId', async () => {
    const response = await request(app)
        .get(`/posts/${testPost._id}/comments`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
});
test('Get all comments by invalid postsId', async () => {
    const invalidPostId = "678734b0078f83eb933bea44"
    const response = await request(app)
        .get(`/posts/${invalidPostId}/comments`);
    expect(response.status).not.toBe(200);
});
test('Update comment', async () => {
    const response = await request(app)
        .put(`/posts/${testPost._id}/comments/${testComment._id}`)
        .set({ authorization: "JWT " + testUser.accessToken })
        .send({ content: 'newContent' });
    expect(response.status).toBe(200);
    expect(response.body.content).toBe('newContent');
});
test('Update comment with postId', async () => {
    const response = await request(app)
        .put(`/posts/${testPost._id}/comments/${testComment._id}`)
        .set({ authorization: "JWT " + testUser.accessToken })
        .send({ content: '', postId: testPost._id });
    expect(response.status).not.toBe(200);
});
test('Update other user comment', async () => {
    const response = await request(app)
        .post('/auth/register')
        .send(testUser2);
    expect(response.status).toBe(200);
    const response2 = await request(app)
        .post('/auth/login')
        .send(testUser2);
    expect(response2.status).toBe(200);
    testUser2.accessToken = response2.body.accessToken;
    const response3 = await request(app)
        .put(`/posts/${testPost._id}/comments/${testComment._id}`)
        .set({ authorization: "JWT " + testUser2.accessToken })
        .send({ content: 'newContent' });
    expect(response3.status).not.toBe(200);
});
test('delete other user comment', async () => {
    const response = await request(app)
        .delete(`/posts/${testPost._id}/comments/${testComment._id}`)
        .set({ authorization: "JWT " + testUser2.accessToken });
    expect(response.status).not.toBe(200);
});
test('Delete comment', async () => {
    const response = await request(app)
        .delete(`/posts/${testPost._id}/comments/${testComment._id}`)
        .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.status).toBe(200);
    const response2 = await request(app)
        .get(`/posts/${testPost._id}/comments`);
    expect(response2.status).toBe(200);
    expect(response2.body.length).toBe(1);
});
test('Delete comment that already deleted', async () => {
    const response = await request(app)
        .delete(`/posts/${testPost._id}/comments/${testComment._id}`)
        .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.status).not.toBe(200);
});


