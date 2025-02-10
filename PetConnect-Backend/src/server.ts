
import app from './app';
import connectToDB from './db';
import logger from './utils/logger';
import https from "https"
import fs from 'fs'
const AppInit = async () => {
    const PORT = process.env.PORT;
    if (!PORT) {
        logger.error('PORT not found');
        return;
    }
    try {
        await connectToDB();
        if (process.env.NODE_ENV !== "production") {
            app.listen(PORT, () => {
                logger.info(`Server is running on port ${PORT}`);
            });
        }
        else {
            const prop = {
                key: fs.readFileSync('../../client-key.pem'),
                cert: fs.readFileSync('../../client-cert.pem')
            };
            https.createServer(prop, app).listen(PORT, () => {
                logger.info(`Server is running on port ${PORT}`);
            });


        }
    } catch (error) {
        logger.error("Server error: " + error);
    }
}

AppInit();
export default AppInit;