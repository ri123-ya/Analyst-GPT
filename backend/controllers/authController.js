import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
 
export const register = async(req,res)=>{
    const { email, password, parentCompany } = req.body;
    try {
        
        const hashedPassword = bcrypt.hashSync(password, 10);
        console.log(hashedPassword);

        const newUser = await prisma.user.create({
            data:{
                email,
                password: hashedPassword,
                parentCompany,
            }
        })

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
}


export const login = (req,res) =>{

}

export const logout = (req,res) =>{

}