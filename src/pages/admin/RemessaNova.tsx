import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { orderService, Order } from "../../services/encomendaService";
import { remessaService } from "../../services/remessaService";
import { toast } from "react-toastify";
import { pacoteStatusToString } from "../../utils/utils";
import { useLanguage } from "../../context/useLanguage";

const RemessaNova = () => {
  const [encomendas, setEncomendas] = useState<Order[]>([]);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [pais, setPais] = useState("");
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const navigate = useNavigate();
  const { translations: t } = useLanguage();

  useEffect(() => {
    orderService.listar(true).then(setEncomendas);
  }, []);

  const toggleEncomenda = (id: string) => {
    setSelecionadas((atual) =>
      atual.includes(id) ? atual.filter((e) => e !== id) : [...atual, id]
    );
  };

  const toggleTodas = () => {
    if (selecionadas.length === encomendas.length) {
      setSelecionadas([]);
    } else {
      setSelecionadas(encomendas.map((e) => e.id));
    }
  };
  const salvar = async () => {
    if (!pais.trim()) {
      toast.error(t.erro_pais);
      return;
    }

    if (selecionadas.length === 0) {
      toast.error(t.erro_selecione_uma_encomenda);
      return;
    }

    try {
      await remessaService.adicionar({
        country: pais,
        orders: [...selecionadas],
      });
      toast.success(t.sucesso_remessa_criada);
      navigate("/admin/remessas");
    } catch (error) {
      console.error("Erro ao criar remessa:", error);
      toast.error(t.erro_criar_remessa);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        mobileAberta={sidebarAberta}
        onFechar={() => setSidebarAberta(false)}
      />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#fcf8f5]">
        <div className="flex flex-col md:flex-row md:items-end md:gap-4">
          <label className="block w-full md:w-auto">
            {t.pais_label}
            <input
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              className="p-2 border rounded w-full mt-1"
            />
          </label>

          <button
            onClick={salvar}
            className="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {t.criar_remessa}
          </button>
        </div>

        <h1 className="text-2xl font-bold">Nova Remessa Manual</h1>

        <div className="mt-2">
          <button
            onClick={toggleTodas}
            className="text-blue-600 text-sm hover:underline mb-2"
          >
            {selecionadas.length === encomendas.length
              ? t.desmarcar_todos
              : t.selecionar_todos}
          </button>

          <ul className="space-y-2">
            {encomendas.map((e) => (
              <li key={e.id} className="p-3 border rounded bg-white">
                <label className="flex gap-2 items-start">
                  <input
                    type="checkbox"
                    checked={selecionadas.includes(e.id)}
                    onChange={() => toggleEncomenda(e.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm text-gray-600">
                      Pais: <strong>{e.country}</strong>{" "}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.remetente}:{" "}
                      <strong>{e.from_account.name.toLocaleLowerCase()}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.destinatario}:{" "}
                      <strong>{e.to_account.name.toLocaleLowerCase()}</strong>{" "}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.tracking_code}:{" "}
                      <strong>
                        {t.tracking_code ?? "Sem código de rastreio"}
                      </strong>
                    </p>
                    <p>
                      <strong>{t.status}</strong>:{" "}
                      {pacoteStatusToString(e.status ?? "", t)} –{" "}
                      {e.packages.length} {t.pacotes}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.peso}:{" "}
                      {e.packages
                        .reduce((s, p) => s + Number(p.weight), 0)
                        .toFixed(2)}{" "}
                      kg
                    </p>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default RemessaNova;
