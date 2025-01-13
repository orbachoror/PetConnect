import { Request,Response } from "express";
import { Model } from "mongoose";
import baseServices from "../services/base_services";

export class BaseController<T>{
    model: Model<T>;
    constructor(model: Model<T>){
        this.model = model;
    }

    async getAll (req:Request , res:Response){
        const filter = {...req.query};
        try {
            const data = await this.model.find(filter as Partial<T>);
            res.status(200).send(data);
        } catch (error) {
          res.status(500).send(error);
        }
    };

    
    async getById (req: Request, res: Response) {
        const id = req.params.id;
        try{
            const data = await this.model.findById(id);
            if(data){
                res.send(data);
            }else{
                res.status(404).send("Not Found");
            }
        }catch(err){
            res.status(500).send(err);
        }
    };

    async createIteam (req: Request, res: Response) {
        const owner = req.body.owner;
        try{
            const data = await this.model.create({
                ...req.body,
                owner: owner
            });
            res.status(200).send(data);
        }catch(err){
            res.status(500).send(err);
        }
    };

    async updateIteam (req: Request, res: Response) {
        const id = req.params.id;
        const updateData= req.body;
        if(!updateData || id === undefined){
            res.status(400).send("Bad Request");
            return;
        }
        try{
            const data =await baseServices.updateIteam(this.model,id,updateData);
            if(!data){
                res.status(404).send("Not Found");
            }
            res.status(200).json(data);
        }catch(err){    
            res.status(500).json({error:err});
        }
    }

    async deleteIteam (req: Request, res: Response) {
        const id = req.params.id;
        if(id === undefined){
            res.status(400).send("Bad Request");
            return;
        }
        try{
            await baseServices.deleteIteam(this.model,id);
            res.status(200).send("Item Deleted");
        }catch(err){
            res.status(500).json({error:err});
        }
    }

};
  
const createController = 
<T> (model:Model<T>) => { 
    return new BaseController(model);
}
export default createController;