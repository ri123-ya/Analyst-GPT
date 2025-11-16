import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";

dotenv.config();

/**
 * filePath = physical path of uploaded PDF (local temp file)
 * metadata = {
 *   userId,
 *   pdfId,
 *   email,
 *   company,
 *   parentCompany
 * }
 */

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
    separators: ["\n\n", "\n", " ", ""],
  });

  let chunks = await textsplitter.splitDocuments(docs);

  console.log(`Created ${chunks.length} chunks`);
  
  // Attach metadata to each chunk
  chunks = chunks.map((chunk) => ({
    ...chunk,
    metadata: {
      ...chunk.metadata,
      userId,
      pdfId, 
      email,
      company,
      parentCompany,
    },
  }));
  console.log("Chunks : ", chunks);


}
