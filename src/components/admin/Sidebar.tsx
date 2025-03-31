import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded hover:bg-gray-200 ${
      location.pathname === path ? "bg-gray-300 font-bold" : ""
    }`;

  return (
    <aside className="w-64 bg-gray-100 h-screen p-4 border-r border-gray-300">
      <h2 className="text-xl font-bold mb-6">Admin</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/admin" className={linkClass("/admin")}>
          Dashboard
        </Link>
        <Link to="/admin/clientes" className={linkClass("/admin/clientes")}>
          Clientes
        </Link>
        <Link to="/admin/encomendas" className={linkClass("/admin/encomendas")}>
          Encomendas
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
