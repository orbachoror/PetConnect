"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
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
const specs = (0, swagger_jsdoc_1.default)(options);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
const AppInit = () => __awaiter(void 0, void 0, void 0, function* () {
    const mongoUrl = process.env.MONGO_URL;
    const PORT = process.env.PORT;
    if (mongoUrl) {
        try {
            yield mongoose_1.default.connect(mongoUrl);
            console.log('Connected to MongoDB');
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
        catch (error) {
            console.log('Server ERROR' + error);
        }
    }
    else {
        console.log('MongoDB URL not found');
    }
});
AppInit();
exports.default = AppInit;
//# sourceMappingURL=server.js.map