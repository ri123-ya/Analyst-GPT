import prisma from "../lib/prisma.js";
import { supabase } from "../lib/supabaseClient.js";
import { indexTheDocument } from "./ragController.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fileUpload = async (req, res) => {
  let tempFilePath = null;
  
  try {
    const userId = req.user.id;
    const { email, company, parentCompany } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("balance-sheet")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      return res.status(500).json({ error: "Upload failed" });
    }

    // Public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("balance-sheet").getPublicUrl(fileName);

    // Save metadata to Prisma
    const saved = await prisma.fileUpload.create({
      data: {
        userId: userId,
        email,
        company,
        parentCompany,
        fileUrl: publicUrl,
      },
    });
    
    // Extract pdfId
    const pdfId = saved.id;

    // Save buffer to temporary file
    const tempDir = path.join(__dirname, '../temp');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    tempFilePath = path.join(tempDir, fileName);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // Now pass the actual file path
    await indexTheDocument(tempFilePath, {
      userId,
      pdfId,
      email,
      company,
      parentCompany,
    });

    // Clean up temp file after indexing
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    return res.json({
      message: "Uploaded and saved successfully",
      file: saved,
      url: publicUrl,
    });
  } catch (err) {
    console.log("ERROR:", err);
    
    // Clean up temp file on error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getUserFiles = async (req, res) => {
  try {
    const { id } = req.user;

    const files = await prisma.fileUpload.findMany({
      where: { userId: id },
      orderBy: { uploadedAt: "desc" },
    });

    res.status(200).json(files);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};