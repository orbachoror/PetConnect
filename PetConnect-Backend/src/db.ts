import mongoose from 'mongoose';
import logger from './utils/logger';

const connectToDB = async (): Promise<void> => {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl)
        throw new Error('MongoDB URL not found');
    try {
        await mongoose.connect(mongoUrl);
        logger.info('Connected to MongoDB');
    } catch (error) {
        logger.error('DB ERROR' + error);
        throw new Error('DB ERROR' + error);
    }

}

export default connectToDB;