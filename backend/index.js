import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import handleAuth from "./routes/authRoute.js";
import handleUploade from "./routes/uploadRoute.js";
import handleQuery from "./routes/chatRoute.js";
import handleCompany from "./routes/companyRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", handleAuth);
app.use("/api/upload", handleUploade);
app.use("/api/chat",handleQuery);
app.use("/api/company",handleCompany);

app.get("/health",(req,res)=>{
    res.json({message:"Server is healthy"});
})


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port : ${process.env.PORT}`);
})

