import { AnyExpression, Model } from "mongoose";


const updateIteam =async <T>(model:Model<T>, id: string, updateData:AnyExpression) => {
    const data=await model.findByIdAndUpdate(id,updateData,{
        new:true,
        runValidators:true});
        if(!data){
            throw new Error('The Item Not Found');
        }
        return data;
};

const deleteIteam = async <T>(model:Model<T>, id: string) => {
    const deleteItem= await model.deleteOne({_id:id});
    if(deleteItem.deletedCount === 0)
        throw new Error('The Item Not Found');
};

export default {updateIteam,deleteIteam};