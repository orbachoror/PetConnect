import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/auth_service'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) {
            res.status(400).json({ message: "Unauthorized" })
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            res.status(400).json({ message: "Token secret is not defined" })
            return;
        }
        const payload = await verifyToken(token, process.env.TOKEN_SECRET);
        req.query.userId = payload._id;
        req.query.email = payload.email;
        next();
    } catch (error) {
        res.status(500).json({ message: "Error while verifying token", error })
    }
}

