import bodyParser from 'body-parser';
import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import swaggerUI from 'swagger-ui-express';
import authRoutes from './routes/auth_routes';
import postsRoutes from './routes/posts_routes';
import eventsRoutes from './routes/events_routes';
import commentsRoutes from './routes/comments_routes';
import usersRoutes from './routes/users_routes';
import swaggerSpecs from './utils/swagger';
import cors from 'cors';
import corsOptions from './utils/cors';
import path from 'path';

app.use(express.json()); //************************we can remove this line****************************//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*routes*/
app.use('/auth', authRoutes);
app.use("/posts", postsRoutes);
app.use("/events", eventsRoutes);
app.use("/posts/:postId/comments", commentsRoutes);
app.use("/user/", usersRoutes);
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use(cors(corsOptions));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

export default app;