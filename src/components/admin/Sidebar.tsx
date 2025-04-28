import { Link, useLocation } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

interface SidebarProps {
  mobileAberta?: boolean;
  onFechar?: () => void;
}

const Sidebar = ({ mobileAberta = false, onFechar }: SidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-black h-screen p-6 justify-between">
        <SidebarContent isActive={isActive} />
      </aside>

      {/* Mobile */}
      {mobileAberta && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 h-full bg-black shadow-lg p-6 flex flex-col justify-between">
            <SidebarContent isActive={isActive} />
          </div>
          <div className="flex-1 bg-black bg-opacity-30" onClick={onFechar} />
        </div>
      )}
    </>
  );
};

const SidebarContent = ({
  isActive,
}: {
  isActive: (path: string) => boolean;
}) => {
  return (
    <div className="flex flex-col justify-between h-full">
      {/* Parte de cima */}
      <div>
        {/* Logo */}
        <div className="mb-10">
          <Link to="/">
            <img src="/image.png" alt="Logo" className="w-[3rem] h-[2rem]" />
          </Link>
        </div>

        {/* Links principais */}
        <nav className="flex flex-col gap-6">
          <SidebarLink to="/admin" label="Dashboard" active={isActive("/admin")} />
          <SidebarLink to="/admin/clientes" label="Clientes" active={isActive("/admin/clientes")} />
          <SidebarLink to="/admin/encomendas" label="Encomendas" active={isActive("/admin/encomendas")} />
          <SidebarLink to="/admin/remessas" label="Remessas" active={isActive("/admin/remessas")} />
          <SidebarLink to="/admin/leitor" label="Leitor de Código" active={isActive("/admin/leitor")} />
        </nav>
      </div>

      {/* Parte de baixo */}
      <div className="pt-10">
        <SidebarLink to="/admin/configuracoes" label="⚙️ Configurações" active={isActive("/admin/configuracoes")} />
      </div>
    </div>
  );
};

const SidebarLink = ({
  to,
  label,
  active,
}: {
  to: string;
  label: string;
  active: boolean;
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between px-2 text-sm font-secondary ${
        active ? "text-orange font-semibold" : "text-white"
      } hover:text-orange transition`}
    >
      <span>{label}</span>
      <FaChevronRight
        className={`text-xs ${active ? "text-orange" : "text-white"}`}
      />
    </Link>
  );
};

export default Sidebar;
