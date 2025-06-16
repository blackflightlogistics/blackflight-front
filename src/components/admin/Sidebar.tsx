import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useLanguage } from "../../context/useLanguage";
import { useState } from "react";


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
  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmitPassword = () => {
    if (password === "1234") {
      setShowPasswordModal(false);
      setPassword("");
      navigate("/admin-full");
    } else {
      alert("Senha incorreta!");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full relative">
      {/* Parte de cima */}
      <div>
        {/* Logo */}
        <div className="mb-10">
          <Link to="/">
            <img src="/logo3.png" alt="Logo" />
          </Link>
        </div>

        {/* Links principais */}
        <nav className="flex flex-col gap-6">
          <SidebarLink to="/admin" label={t.sidebar_dashboard} active={isActive("/admin")} />
          
          {/* Link protegido por senha */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className={`flex items-center justify-between px-2 text-sm font-secondary ${
              isActive("/admin-full") ? "text-orange font-semibold" : "text-white"
            } hover:text-orange transition w-full text-left`}
          >
            <span>{t.sidebar_dashboard_completo}</span>
            <FaChevronRight
              className={`text-xs ${isActive("/admin-full") ? "text-orange" : "text-white"}`}
            />
          </button>

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

      {/* Modal de senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg flex flex-col gap-4 w-80">
            <h2 className="text-lg text-orange font-bold">{t.digite_senha}</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border text-orange px-3 py-2 rounded"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-orange  rounded"
              >
                {t.cancelar}
              </button>
              <button
                onClick={handleSubmitPassword}
                className="px-4 py-2  text-orange rounded"
              >
                {t.confirmar}
              </button>
            </div>
          </div>
        </div>
      )}
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
