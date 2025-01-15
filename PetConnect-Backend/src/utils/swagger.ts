import swaggerJsDoc from "swagger-jsdoc";
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
const swaggerSpecsq = swaggerJsDoc(options);
export default swaggerSpecsq;