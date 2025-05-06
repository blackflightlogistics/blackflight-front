import { Link, useLocation } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useLanguage } from "../../context/useLanguage";

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
  const { changeLanguage, language, translations: t } = useLanguage();

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Parte de cima */}
      <div>
        {/* Logo */}
        <div className="mb-10">
          <Link to="/">
            <img src="/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Links principais */}
        <nav className="flex flex-col gap-6">
          <SidebarLink to="/admin" label={t.sidebar_dashboard} active={isActive("/admin")} />
          <SidebarLink to="/admin/clientes" label={t.sidebar_clientes} active={isActive("/admin/clientes")} />
          <SidebarLink to="/admin/encomendas" label={t.sidebar_encomendas} active={isActive("/admin/encomendas")} />
          <SidebarLink to="/admin/remessas" label={t.sidebar_remessas} active={isActive("/admin/remessas")} />
          <SidebarLink to="/admin/leitor" label={t.sidebar_leitor} active={isActive("/admin/leitor")} />

          {/* Botões de idioma */}
          <div className="flex flex-col gap-2 mt-6 pl-2">
            <button
              onClick={() => changeLanguage("EN")}
              className={`text-sm text-left ${
                language === "EN" ? "text-orange font-semibold" : "text-white"
              } hover:text-orange`}
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => changeLanguage("FR")}
              className={`text-sm text-left ${
                language === "FR" ? "text-orange font-semibold" : "text-white"
              } hover:text-orange`}
            >
              🇫🇷 Français
            </button>
            <button
              onClick={() => changeLanguage("ES")}
              className={`text-sm text-left ${
                language === "ES" ? "text-orange font-semibold" : "text-white"
              } hover:text-orange`}
            >
              🇪🇸 Español
            </button>
            <button
              onClick={() => changeLanguage("PT")}
              className={`text-sm text-left ${
                language === "PT" ? "text-orange font-semibold" : "text-white"
              } hover:text-orange`}
            >
              🇧🇷 Português
            </button>
          </div>
        </nav>
      </div>

      {/* Parte de baixo */}
      <div className="pt-10">
        <SidebarLink
          to="/admin/configuracoes"
          label={t.sidebar_configuracoes}
          active={isActive("/admin/configuracoes")}
        />
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
