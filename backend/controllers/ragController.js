import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";

dotenv.config();

function detectCompanyRegex(text) {
  const lower = text.toLowerCase();

  // --- JIO / DIGITAL SERVICES ---
  if (
    /(jio\b|jio fiber|jiofiber|jio cinema|jio platforms|reliance jio|jio 5g|jio airfiber)/i.test(
      text
    )
  ) {
    return "Jio";
  }

  // --- RELIANCE RETAIL ---
  if (
    /(reliance retail|reliance trends|rel\.? retail|smart bazaar|smart point|ajio|jiomart)/i.test(
      text
    )
  ) {
    return "Reliance Retail";
  }

  // --- OIL & GAS / ENERGY / RIL CORE ---
  if (
    /(oil.?&.?gas|refining|petrochemicals|exploration|production|e&p|fuel retailing|crude|jamnagar|gas marketing)/i.test(
      text
    )
  ) {
    return "RIL - Energy";
  }

  // --- FINANCIAL SERVICES ---
  if (
    /(financial services|jio financial|ril financial|nbfc|lending|digital finance)/i.test(
      text
    )
  ) {
    return "RIL - Finance";
  }

  // --- DIGITAL SERVICES (Non-Jio) ---
  if (
    /(digital services|platforms|cloud|ai|data center|enterprise services)/i.test(
      text
    )
  ) {
    return "RIL - Digital";
  }

  // --- RELIANCE INDUSTRIES (GENERAL) ---
  if (
    /(reliance industries|ril|r\.i\.l|ambani|conglomerate|group overview)/i.test(
      text
    )
  ) {
    return "RIL";
  }

  // Fallback default
  return "RIL";
}

export async function indexTheDocument(filePath, metadata) {
  const { userId, pdfId, email, company, parentCompany } = metadata;

  console.log("📄 Loading PDF:", filePath);

  // Load the Pdf
  const loader = new PDFLoader(filePath, { splitPages: false });
  const docs = await loader.load();

  console.log("✔ PDF Loaded");

  //   // Chunking
  const textsplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 700,
    chunkOverlap: 200,
    separators: ["\n\n", "\n", " ", "","."],
  });

  let chunks = await textsplitter.splitDocuments(docs);

  console.log(`Created ${chunks.length} chunks`);

  // Attach metadata to each chunk
  chunks = chunks.map((chunk) => {
    const detectedCompany = detectCompanyRegex(chunk.pageContent);
    return {
      ...chunk,
      metadata: {
        ...chunk.metadata,
        userId,
        pdfId,
        email,
        company: detectedCompany,
        parentCompany,
      },
    };
  });
    // console.log("Chunks : ", chunks);

  // Initialize embedding model
  console.log("Initializing embeddings...");
  const embeddingModel = new GoogleGenerativeAIEmbeddings({
    modelName: "text-embedding-004",
  });

  // Store in Vector DB
  const vectorStore = await QdrantVectorStore.fromDocuments(
    chunks,
    embeddingModel,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: process.env.COLLECTION_NAME,
    }
  );

  console.log(`Stored ${chunks.length} vectors for PDF ${pdfId}`);

  return {
    message: "Embedding completed",
    vectors: chunks.length,
    collection: process.env.COLLECTION_NAME,
  };
}
