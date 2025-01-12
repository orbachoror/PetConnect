
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';

export const ownershipMiddleware = (model: Model<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.query.userId;
            const resourceId = req.params.id;
            const resource = await model.findById(resourceId);
            if (!resource) {
                res.status(400).json({ message: "Resource not found" });
                return;
            }
            if (resource.userId.toString() !== userId) {
                res.status(400).json({ message: "You cant modify other users resources !" });
                return;
            }
            next();
        } catch (error) {
            res.status(500).json({ message: "Error while verifying ownership", error });
        }
    }
}