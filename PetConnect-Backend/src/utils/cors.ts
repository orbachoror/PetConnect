const corsOptions = {
    origin: '*', // Allow everyone to access the server - need to change in the future
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
export default corsOptions;