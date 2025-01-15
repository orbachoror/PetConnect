import bodyParser from 'body-parser';
import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import authRoutes from './routes/auth_routes';
import postsRoutes from './routes/posts_routes';
import eventsRoutes from './routes/events_routes';
import commentsRoutes from './routes/comments_routes';
import swaggerSpecs from './utils/swagger';

app.use(express.json()); //************************we can remove this line****************************//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*routes*/
app.use('/auth', authRoutes);
app.use("/posts", postsRoutes);
app.use("/events", eventsRoutes);
app.use("/posts/:postId/comments", commentsRoutes);


//************ acces from diffrenet server **************** */
// app.use((req:Request,res:Response,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
//     res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
// });


app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

export default app;