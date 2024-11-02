import mongoose from "mongoose";

export function isValidMongoID(id:string):boolean{
    return mongoose.Types.ObjectId.isValid(id);
}