import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const prisma = new PrismaClient();

// ---- inside userQuery, after you have the answer --------------------
export const userQuery = async (req, res) => {
  try {
    const { message, pdfId, companyName } = req.body;
    const userId = req.user.id;

    if (!message || !pdfId) {
      return res.status(400).json({ error: "message and pdfId are required" });
    }

    // 1. Fetch parentCompany from the authenticated user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { parentCompany: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    const parentCompany = user.parentCompany;

    // 2. Get (or create) a session for this interaction
    let session = await prisma.chatSession.findFirst({
      where: {
        userId,
        pdfId,
        companyName,
        parentCompany,
      },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId,
          pdfId,
          companyName,
          parentCompany,
        },
      });
    }

    // 3. Save the user message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: "user",
        content: message,
      },
    });

    // 4. retrieve context & call LLM
    const context = await getRelevantChunks(
      message,
      userId,
      pdfId,
      companyName
    );

    let answer = "No relevant information found in your uploaded PDF.";
    if (context) {
      answer = await callLLM(context, message);
    }

    // 5. Save the assistant answer
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: "assistant",
        content: answer,
      },
    });

    // 6. Respond
    return res.json({ answer });
  } catch (err) {
    console.error("userQuery error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// FETCH CONTEXT FROM QDRANT
async function getRelevantChunks(query, userId, pdfId, companyName) {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
  });

  // Connect to existing Qdrant collection
  const qdrant = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName: process.env.COLLECTION_NAME,
  });

  const filter = {
    must: [
      { key: "userId", match: { value: userId } },
      { key: "pdfId", match: { value: pdfId } },
      { key: "companyName", match: { value: companyName } },
    ],
  };

  // similaritySearch with filter 
  const results = await qdrant.similaritySearch(query, 5, { filter });

  if (!results || results.length === 0) return null;

  // Join page content
  return results.map((doc) => doc.pageContent).join("\n\n");
}

// LLM CALL (Groq)
async function callLLM(context, query) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `Answer ONLY using the PDF content below. If the answer is not present, say "Not in PDF."\n\n${context}`,
      },
      { role: "user", content: query },
    ],
  });

  return response?.choices?.[0]?.message?.content;
}
