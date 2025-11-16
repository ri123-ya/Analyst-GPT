import prisma from "../lib/prisma.js";


export const handleCompanyList = async (req, res) => {
  try {
    const adminCompany = req.user.parentCompany; // from verifyToken

    const companies = await prisma.user.findMany({
      where: {
        parentCompany: adminCompany,
        userType: "User",
      },
      distinct: ["company"],
      select: {
        company: true,
      }
    });

    res.json({
      success: true,
      companies: companies.map(c => c.company),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch companies" });
  }
};


export const getCompanyChatSummary = async (req, res) => {
  try {
    const { company } = req.params;

    const sessions = await prisma.chatSession.findMany({
      where: { company },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1 // last assistant reply
        }
      }
    });

    const formatted = sessions.map(s => ({
      sessionId: s.id,
      pdfId: s.pdfId,
      lastMessage: s.messages[0]?.content || "No messages yet",
      createdAt: s.createdAt
    }));

    res.json({
      success: true,
      company,
      chatSummary: formatted
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch chat summary" });
  }
};

