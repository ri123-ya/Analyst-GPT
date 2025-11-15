import prisma from "../lib/prisma.js";
import { supabase } from "../lib/supabaseClient.js";

export const fileUpload = async (req, res) => {
  try {

    const userId = req.user.id;  // FIXED
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
    const { data: { publicUrl } } =
      supabase.storage.from("balance-sheet").getPublicUrl(fileName);

    // Save metadata to Prisma
    const saved = await prisma.fileUpload.create({
      data: {
        userId: userId,   // FIXED
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
