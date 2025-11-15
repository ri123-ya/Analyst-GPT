import express from "express";
import dotenv from "dotenv";
import handleAuth from "./routes/authRoute.js";

dotenv.config();

const app = express();

app.use("/api/auth", handleAuth);

app.get("/health",(req,res)=>{
    res.json({message:"Server is healthy"});
})


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port : ${process.env.PORT}`);
})

