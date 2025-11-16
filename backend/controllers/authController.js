import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const registerUser = async (req, res) => {
  const { email, password, company, parentCompany } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        company,
        parentCompany,
        userType: "User",
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const registerAdmin = async (req, res) => {
  const { email, password, parentCompany } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        parentCompany,
        userType: "Admin",
      },
    });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create Admin!" });
  }
};

export const login = async (req, res) => {
  const { email, password, company, parentCompany, userType } = req.body;

  try {
    // CHECK IF THE USER EXISTS

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    // CHECK IF THE PASSWORD IS CORRECT

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    if (user.company !== company) {
      return res.status(401).json({ message: "Incorrect company selected" });
    }

    // Validate selected parentCompany
    if (user.parentCompany !== parentCompany) {
      return res
        .status(401)
        .json({ message: "Incorrect Parent company selected" });
    }

    if (user.userType !== userType) {
      return res.status(401).json({ message: "Not authenticated " });
    }

    // GENERATE COOKIE TOKEN AND SEND TO THE USER

    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        company: user.company,
        parentCompany: user.parentCompany,
        userType: user.userType,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure:true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
};
