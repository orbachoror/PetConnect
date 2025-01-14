import request from "supertest";
import app from '../app';
import connectToDB from '../db';
import Event, { IEvent } from '../models/event_model';
import User from '../models/user_model';
import mongoose from 'mongoose';
import logger from '../utils/logger';

const testUser = {
    name: "testUser",
    email: "testemail@gmail.com",
    password: "123456",
    accessToken: "",
    refreshToken: ""

}
const testUser2 = {
    name: "testUser",
    email: "testemail2@gmail.com",
    password: "123456",
    accessToken: "",
}
const testEvent: IEvent = {
    title: "testEventTitle",
    description: "testEventDescription",
    date: new Date("2025-01-15"),
    location: "testEventLocation"

}
beforeAll(async () => {
    logger.info("beforeAll");
    await connectToDB();
    await User.deleteMany({});
    await Event.deleteMany({});
    const response = await request(app).post('/auth/register').send(testUser);
    expect(response.status).toBe(200);
    const response2 = await request(app).post('/auth/login').send(testUser);
    expect(response2.status).toBe(200);
    testUser.accessToken = response2.body.accessToken;
    testUser.accessToken = response2.body.refreshToken;
    testEvent.owner = response2.body.email;
});
afterAll(async () => {
    logger.info("afterAll");
    mongoose.connection.close();
});
test('Create new event', async () => {
    const response = await request(app).post('/events')
        .set({
            authorization: "JWT " + testUser.accessToken,
        })
        .send(testEvent);
    expect(response.status).toBe(200);
    testEvent._id = response.body._id;
});
test('Get all events', async () => {
    const response = await request(app).get('/events');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
});
test('Get event by id', async () => {
    const response = await request(app).get('/events/' + testEvent._id);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(testEvent.title);
});
test('Update event', async () => {
    const response = await request(app).put('/events/' + testEvent._id)
        .set({
            authorization: "JWT " + testUser.accessToken,
        })
        .send({ title: "newTitle" });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("newTitle");
});

test('update event with different user', async () => {
    const response = await request(app).post('/auth/register').send(testUser2);
    expect(response.status).toBe(200);
    const response2 = await request(app).post('/auth/login').send(testUser2);
    expect(response2.status).toBe(200);
    testUser2.accessToken = response2.body.accessToken;
    const response3 = await request(app).put('/events/' + testEvent._id)
        .set({
            authorization: "JWT " + testUser2.accessToken,
        })
        .send({ title: "newTitle" });
    expect(response3.status).not.toBe(200);
});
test('Delete event with different user', async () => {
    const response = await request(app).delete('/events/' + testEvent._id)
        .set({
            authorization: "JWT " + testUser2.accessToken,
        });
    expect(response.status).not.toBe(200);
});

test('Delete event', async () => {
    const response = await request(app).delete('/events/' + testEvent._id)
        .set({
            authorization: "JWT " + testUser.accessToken,
        });
    expect(response.status).toBe(200);
    const response2 = await request(app).get('/events');
    expect(response2.status).toBe(200);
    expect(response2.body.length).toBe(0);
});

