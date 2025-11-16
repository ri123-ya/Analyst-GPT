import { useState } from "react";
import { Building2, MessageSquare, ChevronRight } from "lucide-react";

const Dashboard = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Example child companies (replace with API data)
  const companies = [
    { id: 1, name: "Alpha Technologies", emails: 12 },
    { id: 2, name: "BlueCom Pvt Ltd", emails: 5 },
    { id: 3, name: "FutureSoft Infotech", emails: 18 },
  ];

  // Example summary (replace with API chat summary)
  const chatSummary = {
    overall: "The uploaded documents mainly cover financial statements for FY 2023–24.",
    keyPoints: [
      "Revenue up by 18%",
      "Operating cost increased due to hiring",
      "Net profit margin slightly improved",
      "High dependency on 2 major clients",
    ],
    lastAsked: "Explain the increase in operational cost",
  };

  return (
    <div className="flex h-screen bg-gray-100 font-montserrat">
      
      {/* LEFT SIDEBAR */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage company chats
          </p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Child Companies</h3>

          <div className="space-y-3">
            {companies.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCompany(c)}
                className={`w-full flex items-center justify-between p-3 rounded-lg shadow-sm
                border transition 
                ${selectedCompany?.id === c.id 
                  ? "bg-purple-100 border-purple-400" 
                  : "bg-gray-50 border-gray-200 hover:bg-purple-50"}`
                }
              >
                <div className="flex items-center gap-3">
                  <Building2 className="text-purple-600" size={20} />
                  <span className="font-medium text-gray-700">{c.name}</span>
                </div>

                <ChevronRight size={18} className="text-gray-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - CHAT SUMMARY */}
      <div className="flex-1 p-8 overflow-y-auto">

        {!selectedCompany ? (
          <div className="h-full flex flex-col justify-center items-center text-gray-500">
            <MessageSquare size={60} className="text-purple-400 mb-4" />
            <p className="text-xl font-medium">Select a company to view chat summary</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {selectedCompany.name}
            </h2>
            <p className="text-sm text-gray-500">Chat Summary</p>

            {/* Summary Card */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-purple-700">Overall Summary</h3>
              <p className="mt-2 text-gray-700">{chatSummary.overall}</p>
            </div>

            {/* Key Points */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-purple-700">Key Points Identified</h3>
              <ul className="mt-3 list-disc ml-5 space-y-1 text-gray-700">
                {chatSummary.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            {/* Last Question */}
            <div className="mt-6 bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-700">
                Last User Question
              </h3>
              <p className="mt-2 text-gray-700">{chatSummary.lastAsked}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
