import { Request, Response } from "express";
import { Model } from "mongoose";
import baseServices from "../services/base_services";
import logger from "../utils/logger";

export class BaseController<T> {
    model: Model<T>;
    constructor(model: Model<T>) {
        this.model = model;
    }

    async getAll(req: Request, res: Response) {
        try {
            const data =  await baseServices.getAll(this.model, req);
            logger.info("BaseController Get all data success " + data);
            res.status(200).send(data);
        } catch (error) {
            logger.error("BaseController Get all data failed " + error);
            res.status(500).send(error);
        }
    };
   

    async getById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const data = await baseServices.getById(this.model,id); 
            if (data) {
                logger.info("BaseController Get by id success ");
                res.send(data);
            } else {
                logger.error("BaseController Get by id failed ");
                res.status(404).send("Not Found");
            }
        } catch (err) {
            logger.error("BaseController Get by id failed ");
            res.status(500).send(err);
        }
    };

    async createItem(req: Request, res: Response) {
        try {
            const data = await baseServices.createItem(this.model,req);
            logger.info("BaseController Create Item success");
            res.status(200).send(data);
        } catch (err) {
            logger.error("BaseController Create Item failed ");
            res.status(500).send(err);
        }
    };

    async updateItem(req: Request, res: Response) {
        const id = req.params.id;
        const updateData = req.body;
        if (!updateData || id === undefined) {
            logger.error("Bad Request id = " + id + " updateData = " + updateData);
            res.status(400).send("Bad Request");
            return;
        }
        try {
            const data = await baseServices.updateItem(this.model, id, updateData);
            if (!data) {
                res.status(404).send("Not Found");
            }
            logger.info("BaseController Update Item success ");
            res.status(200).json(data);
        } catch (err) {
            logger.error("BaseController Update Item failed ");
            res.status(500).json({ error: err });
        }
    }

    async deleteItem(req: Request, res: Response) {
        const id = req.params.id;
        if (id === undefined) {
            res.status(400).send("Bad Request");
            return;
        }
        try {
            await baseServices.deleteItem(this.model, id);
            res.status(200).send("Item Deleted");
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

};

const createController =
    <T>(model: Model<T>) => {
        return new BaseController(model);
    }
export default createController;