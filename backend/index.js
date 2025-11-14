import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/health",(req,res)=>{
    res.json({message:"Server is healthy"});
})

