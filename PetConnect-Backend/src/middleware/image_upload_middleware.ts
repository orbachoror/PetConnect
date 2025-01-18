import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
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

    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    return multer({ storage: storage, fileFilter: fileFilter }).single('image');
}