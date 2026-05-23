import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import UploadBox from "../components/UploadBox";
import NotesSection from "../components/NotesSection";

export default function Dashboard() {

  // ✅ Refresh notes after upload
  const [refresh, setRefresh] = useState(false);

  // ✅ Search text
  const [searchTerm, setSearchTerm] = useState("");

  return (

    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        {/* Topbar */}
        <Topbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="p-6">

          {/* Upload Box */}
          <UploadBox setRefresh={setRefresh} />

          {/* Notes Feed */}
          <NotesSection
            refresh={refresh}
            searchTerm={searchTerm}
          />

        </div>

      </div>

    </div>
  );
}