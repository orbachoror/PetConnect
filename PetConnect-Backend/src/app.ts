import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import authRoutes from './routes/auth_routes';

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*routes*/
app.use('/auth', authRoutes);

//************ acces from diffrenet server **************** */
// app.use((req:Request,res:Response,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
//     res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
// });

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PetConnect-Backend",
            version: "1.0.0",
            description: "REST server including authentication using JWT",
        },
        servers: [{ url: "http://localhost:3000/", },],
    },
    apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

export default app;