
import app from './app';
import connectToDB from './db';
import logger from './utils/logger';

const AppInit = async () => {
    const PORT = process.env.PORT;
    if (!PORT) {
        logger.error('PORT not found');
        return;
    }
    await connectToDB();
    try {
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Server error: " + error);
    }
}

AppInit();
export default AppInit;