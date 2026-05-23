import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const MainLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex bg-gray-950 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Topbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <Outlet context={{ searchTerm }} />

      </div>

    </div>
  );
};

export default MainLayout;