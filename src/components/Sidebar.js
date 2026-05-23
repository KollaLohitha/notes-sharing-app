import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Upload Notes",
      path: "/upload",
    },
    {
      name: "My Notes",
      path: "/my-notes",
    },
    {
      name: "Saved Notes",
      path: "/saved-notes",
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-10">
        NotesHub
      </h1>

      <div className="flex flex-col gap-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-3 rounded-xl transition duration-200 ${
              location.pathname === item.path
                ? "bg-blue-600"
                : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;