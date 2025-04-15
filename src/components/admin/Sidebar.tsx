import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  mobileAberta?: boolean;
  onFechar?: () => void;
}

const Sidebar = ({ mobileAberta = false, onFechar }: SidebarProps) => {
  const location = useLocation();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded hover:bg-gray-200 ${
      location.pathname === path ? "bg-gray-300 font-bold" : ""
    }`;

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-gray-100 h-screen p-4 border-r border-gray-300">
        <SidebarContent linkClass={linkClass} />
      </aside>

      {/* Mobile */}
      {mobileAberta && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 h-full bg-white shadow-lg border-r p-4 flex flex-col justify-between">
            <SidebarContent linkClass={linkClass} />
          </div>
          <div className="flex-1 bg-black bg-opacity-30" onClick={onFechar} />
        </div>
      )}
    </>
  );
};

const SidebarContent = ({
  linkClass,
}: {
  linkClass: (path: string) => string;
}) => {
  return (
    <>
      {/* Parte de cima */}
      <div>
        <h2 className="text-xl font-bold mb-6">Admin</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/admin" className={linkClass("/admin")}>
            Dashboard
          </Link>
          <Link to="/admin/clientes" className={linkClass("/admin/clientes")}>
            Clientes
          </Link>
          <Link
            to="/admin/encomendas"
            className={linkClass("/admin/encomendas")}
          >
            Encomendas
          </Link>
          <Link to="/admin/remessas" className={linkClass("/admin/remessas")}>
            Remessas
          </Link>
          <Link to="/admin/leitor" className={linkClass("/admin/leitor")}>
            Leitor de Códigos
          </Link>
        </nav>
      </div>

      {/* Parte de baixo - sempre fixa no fim */}
      <div className="pt-4 border-t mt-6">
        <Link
          to="/admin/configuracoes"
          className={linkClass("/admin/configuracoes")}
        >
          ⚙️ Configurações
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
