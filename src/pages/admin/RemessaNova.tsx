// src/pages/admin/RemessaNova.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { orderService, Order } from "../../services/encomendaService";
import { remessaService } from "../../services/remessaService";

const RemessaNova = () => {
  const [encomendas, setEncomendas] = useState<Order[]>([]);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [pais, setPais] = useState("");
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    orderService.listar().then(setEncomendas);
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
    // const encomendasSelecionadas = encomendas.filter((e) =>
    //   selecionadas.includes(e.id)
    // );
    // const pesoTotal = encomendasSelecionadas.reduce(
    //   (soma, e) => soma + e.packages.reduce((s, p) => s + Number(p.weight), 0),
    //   0
    // );

    await remessaService.adicionar({
      country: pais,
      orders:[...selecionadas],
      
    });

    navigate("/admin/remessas");
  };

  return (
    <div className="flex">
      <Sidebar mobileAberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Nova Remessa Manual</h1>

        <label className="block">
          País:
          <input
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            className="p-2 border rounded w-full mt-1"
          />
        </label>

        <div className="mt-4">
          <button
            onClick={toggleTodas}
            className="text-blue-600 text-sm hover:underline mb-2"
          >
            {selecionadas.length === encomendas.length
              ? "Desmarcar todas"
              : "Selecionar todas"}
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
                    <p>
                      <strong>#{e.id}</strong> – {e.status} – {e.packages.length} pacote(s)
                    </p>
                    <p className="text-sm text-gray-600">
                      Peso:{" "}
                      {e.packages.reduce((s, p) => s + Number(p.weight), 0).toFixed(2)} kg
                    </p>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={salvar}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Criar Remessa
        </button>
      </main>
    </div>
  );
};

export default RemessaNova;
