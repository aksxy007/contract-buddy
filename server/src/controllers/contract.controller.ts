import { Response,Request } from "express";
import multer from "multer";
import { IUser } from "../models/user.model";
import { redis } from "../config/redis";
import { analyzeContractWithAI, detectContractType, extractPDFText } from "../services/ai.services";
import { error } from "console";
import ContractAnalysisSchema, { IContractAnalysis } from "../models/contract.model";
import { L } from "@upstash/redis/zmscore-Dc6Llqgr";
import mongoose, { FilterQuery } from "mongoose";
import {isValidMongoID} from '../utils/mongoUtils' 

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Only pdf files are allowed"));
    }
  },
}).single("contract");

export const detectAndConfirmContractType = async (
  req: Request,
  res: Response
) => {
    const user = req.user as IUser

    if(!req.file){
        return res.status(400).json({error:"No file uplaoded"})
    }

    try {
        const fileKey = `file:${user._id}:${Date.now()}`
        await redis.set(fileKey, req.file.buffer)

        await redis.expire(fileKey,3600) //1 hour it will delete
        const pdfText = await extractPDFText(fileKey);
        const detectedType = await detectContractType(pdfText)

        await redis.del(fileKey);

        res.json({detectedType});
    } catch (error) {
        
    }
};

export const analyzeContract = async (req:Request,res:Response)=>{
    const user = req.user as IUser
    const {contractType} = req.body

    if(!req.file){
        return res.status(400).json({errpr:"No file uploaded!"})
    }

    if(!contractType){
        return res.status(400).json({error:"No contract type provided"});
    }

    try {
        const fileKey = `file:${user._id}:${Date.now()}`
        await redis.set(fileKey,req.file.buffer)
        await redis.expire(fileKey,3600);
        const tier  = user.isPremium? "premium":"free"
        const pdfText = await extractPDFText(fileKey);

        let analysis:IContractAnalysis;

        analysis = await analyzeContractWithAI(pdfText,tier,contractType)
        // console.log(analysis)
        //@ts-ignore
        // if(!analysis.summary || !analysis.risks || !analysis.opportunities){
        //     throw new Error("Failed to analyze contract")
        // }
        let savedAnalysis;
        try {
            savedAnalysis = await ContractAnalysisSchema.create({
                userId: user._id, 
                contractText:pdfText,
                contractType,
                ...(analysis as Partial<IContractAnalysis>),
                language:"en",
                aiModel:"gemini-pro"
            })
    
        } catch (error) {
            
            console.error(error)
        }
        
        res.json(savedAnalysis)

    } catch (error) {
        
    }
}


export const getUserContract= async (req:Request,res:Response)=>{
  const user = req.user as IUser;

  try {
    interface QueryType{
      userId:mongoose.Types.ObjectId;
    }

    const query:QueryType = {userId:user._id as mongoose.Types.ObjectId}
    const contracts = await ContractAnalysisSchema.find(query as FilterQuery<IContractAnalysis>).sort({createdAt:-1})

    res.json(contracts)
  } catch (error) {
    console.error(error)
    return res.status(500).json({error:"Failed to fetch user contracts"})
  }
}

export const getContractByID = async (req:Request,res:Response)=>{
  const {id} = req.params;
  const user = req.user as IUser;
  if (!isValidMongoID(id)){
    return res.status(400).json({error:"Invalid Contract Id"})
  }

  try {
    const cachedContracts = await redis.get(`contract:${id}`);
    if(cachedContracts){
      return res.json(cachedContracts)
    }

    const contract = await ContractAnalysisSchema.findOne({
      _id:id,
      userId:user._id,
    })

    if(!contract){
      return res.status(404).json({error:"Contract not found"})
    }

    await redis.set(`contract:${id}`,contract,{ex:3600})

    res.json(contract)

  } catch (error) {
    console.error(error)
    return res.status(400).json({error:"Contract fetching failed!"})
  }

}

export const deleteContractById = async (req:Request,res:Response)=>{
  const {id} = req.params;
  const user = req.user as IUser;
  if (!isValidMongoID(id)){
    return res.status(400).json({error:"Invalid Contract Id"})
  }

  try {
    await ContractAnalysisSchema.findByIdAndDelete({_id:id,userId:user._id})
    res.status(200).json({message:"Contract deleted successfully!"})
  } catch (error) {
    console.log(`Failed to delete contract: ${error}`)
    res.status(500).json("Error in deleting the contract")
  }
}