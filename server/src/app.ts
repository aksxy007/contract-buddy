import dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import helmet from "helmet";
import morgan from 'morgan';
import mongoose from "mongoose";
import passport from 'passport';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import './config/passport'

//routes
import authRoute from "./routes/auth"
import contractRoute from "./routes/contracts"
import paymentsRoute from './routes/payments'
import { handleWebhook } from './controllers/payment.controller';

dotenv.config()


const app =express();

mongoose.connect(process.env.MONGODB_URI!)
.then(()=>console.log("Connected to MongoDB!"))
.catch((err)=>console.error(err))

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));
app.use(morgan("dev"))
app.use(helmet())
app.post(
    '/payments/webhook',
    express.raw({type:'application/json'}),
    handleWebhook

)
app.use(express.json())

app.use(session({
    secret:process.env.SESSION_SECRET!,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl:process.env.MONGODB_URI!}),
    cookie:{
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV ==='production' ? 'none' : 'lax',
        maxAge:24*60*60*1000 // 24hrs
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/auth",authRoute)
app.use("/contracts",contractRoute)
app.use('/payments',paymentsRoute)

const PORT = 8080
app.listen(PORT,()=>{
    console.log(`Server started on port: ${PORT}`);
})