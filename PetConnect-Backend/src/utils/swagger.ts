import swaggerJsDoc from "swagger-jsdoc";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PetConnect-Backend",
            version: "1.0.0",
            description: "REST server including authentication using JWT",
        },
        servers: [{ url: "http://localhost:" + process.env.PORT, },
        { url: "http://10.10.246.65", },
        { url: "https://10.10.246.65", }],
    },
    apis: ["./src/routes/*.ts"],
};
const swaggerSpecsq = swaggerJsDoc(options);
export default swaggerSpecsq;