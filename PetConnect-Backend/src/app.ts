import express from 'express';
import { Request, Response, NextFunction } from 'express';
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));


const blockBrowserRequests = (req: Request, res: Response, next: NextFunction): void => {
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
        res.status(403).json({ message: "Forbidden: API requests must be made from an API client." });
        return;
    }
    next();
};

/*routes*/
app.use("/api", blockBrowserRequests);// block client from see json files in browser
app.use('/api/auth', authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/posts/:postId/comments", commentsRoutes);
app.use("/api/user", usersRoutes);
app.use('/uploads', express.static('uploads'));
app.use(express.static("front"));
app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "front", "index.html"));
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

export default app;