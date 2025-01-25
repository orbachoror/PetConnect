import { AnyExpression, Model } from "mongoose";
import { Request } from "express";

const getAll = async <T>(model: Model<T>, req: Request, populateOptions?: { path: string, select: string }) => {
    const filter = { ...req.query };
    const data = populateOptions ? await model.find(filter as Partial<T>).populate(populateOptions) :
        await model.find(filter as Partial<T>);
    if (!data) {
        throw new Error('The Item Not Found');
    }
    return data;
};


const getById = async <T>(model: Model<T>, id: string, populateOptions?: { path: string, select: string }) => {

    const data = populateOptions ? await model.findById(id).populate(populateOptions) :
        await model.findById(id);
    if (!data) {
        throw new Error(`The item Not Found`);
    }
    return data;
}

const createItem = async <T>(model: Model<T>, req: Request, populateOptions?: { path: string, select: string }) => {
    const owner = req.query.userId;
    let data = await model.create({
        ...req.body,
        owner: owner
    });
    data = populateOptions ? await (data as AnyExpression).populate(populateOptions) : data;
    if (!data) {
        throw new Error('The Item Not Found');
    }
    return data;
}

const updateItem = async <T>(model: Model<T>, id: string, updateData: AnyExpression, populateOptions?: { path: string, select: string }) => {
    const data = populateOptions ? await model.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).populate(populateOptions) : await model.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    })
    if (!data) {
        throw new Error('The Item Not Found');
    }
    return data;
};

const deleteItem = async <T>(model: Model<T>, id: string) => {
    const deleteItem = await model.deleteOne({ _id: id });
    if (deleteItem.deletedCount === 0)
        throw new Error('The Item Not Found');
};


export default { updateItem, deleteItem, createItem, getById, getAll };