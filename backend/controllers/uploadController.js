import prisma from "../lib/prisma.js";
import { supabase } from "../lib/supabaseClient.js";

export const fileUpload = async (req, res) => {
  try {
    const { userId, email, company, parentCompany } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;

    // Upload to Supabase (use the real bucket name)
    const { data, error } = await supabase.storage
      .from("balance-sheet")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      console.log("Upload Error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }

    // Generate public URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("balance-sheet")
      .getPublicUrl(fileName);

    // Save metadata to MongoDB
    const saved = await prisma.fileUpload.create({
      data: {
        userId,
        email,
        company,
        parentCompany,
        fileUrl: publicUrl,
      },
    });

    return res.json({
      message: "Uploaded and saved successfully",
      file: saved,
      url: publicUrl,
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
