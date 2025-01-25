import { BaseController } from "./base_controller";
import User, { IUser } from "../models/user_model";
import { Request, Response } from "express";
import base_services from "../services/base_services";

const userUploadPath = 'uploads/users_pictures/';

class UsersController extends BaseController<IUser> {
    constructor() {
        super(User)
    }
    async updateItem(req: Request, res: Response): Promise<void> {
        if (req.file) {
            req.body.profilePicture = `${userUploadPath}${req.file.filename}`;
        }
        const id = req.query.userId;
        const updateData = req.body;
        if (!updateData || !id) {
            res.status(400).send("missing data or user id");
            return;
        }
        try {
            const updatedUser = await base_services.updateItem(this.model, id.toString(), updateData);
            if (updatedUser) {
                res.status(200).send(updatedUser);
            } else {
                res.status(404).send("User not found");
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }
}
export default new UsersController();