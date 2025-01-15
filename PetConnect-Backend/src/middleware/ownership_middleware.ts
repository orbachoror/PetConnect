
import { Request, Response, NextFunction } from 'express';
import { AnyExpression, Model } from 'mongoose';
import logger from '../utils/logger';


export const ownershipMiddleware = (model: Model<AnyExpression>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const connectedUserId = req.query.userId;
            const resourceId = req.params.id;
            const resource = await model.findById(resourceId);
            if (!resource) {
                logger.error("Resource not found");
                res.status(400).json({ message: "Resource not found" });
                return;
            }
            if (resource.owner != connectedUserId) {
                logger.error("You cant modify other users resources !");
                res.status(400).json({ message: "You cant modify other users resources !" });
                return;
            }
            next();
        } catch (error) {
            logger.error("Error while verifying ownership");
            res.status(500).json({ message: "Error while verifying ownership", error });

        }
    }
}