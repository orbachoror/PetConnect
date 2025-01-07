import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const app = express();
dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

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

const AppInit = async () => {
    const mongoUrl= process.env.MONGO_URL;
    const PORT = process.env.PORT;
    if(mongoUrl){
        try {
            await mongoose.connect(mongoUrl);
            console.log('Connected to MongoDB');
            
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        } catch (error) {
            console.log('Server ERROR' + error);
        }
    }else{
        console.log('MongoDB URL not found');
    }
};

AppInit();
export default AppInit;