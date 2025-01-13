const isLoggerEnabled = process.env.LOGGER_ENABLED?.toLocaleLowerCase() === 'true';

const logger = {
    info: (message: string) => {
        if (isLoggerEnabled) {
            console.log(`[INFO] ${message}`);
        }
    },
    error: (message: string) => {
        if (isLoggerEnabled) {
            console.error(`[ERROR] ${message}`);
        }
    }
};

export default logger;