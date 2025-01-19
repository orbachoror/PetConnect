import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import logger from '../utils/logger';
export const createUploadMiddleware = (type: string) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, '../uploads', type);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        }
    })

    const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
        if (file.mimetype.startsWith('image/')) {
            logger.info("Image file uploaded");
            cb(null, true);
        } else {
            logger.error("Only image files are allowed");
            cb(new Error("Only image files are allowed"), false);
        }
    };

    return multer({ storage: storage, fileFilter: fileFilter }).single('image');
}