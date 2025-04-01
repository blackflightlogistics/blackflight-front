// src/pages/admin/Etiquetas.tsx
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import JsBarcode from "jsbarcode";
import Sidebar from "../../components/admin/Sidebar";
import { encomendaService, Encomenda } from "../../services/encomendaService";
import { useState } from "react";

function Etiquetas() {
  const { id } = useParams();
  const [encomenda, setEncomenda] = useState<Encomenda | null>(null);

  const encomendaRef = useRef<SVGSVGElement>(null);
  const pacoteRefs = useRef<Record<number, SVGSVGElement>>({});

  useEffect(() => {
    if (!id) return;

    encomendaService.buscarPorId(Number(id)).then((dados) => {
      setEncomenda(dados);
    });
  }, [id]);

  useEffect(() => {
    if (encomenda && encomendaRef.current) {
      JsBarcode(encomendaRef.current, `ENCOM-${encomenda.id}`, {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: true,
      });
    }

    if (encomenda?.pacotes) {
      encomenda.pacotes.forEach((p) => {
        const ref = pacoteRefs.current[p.id];
        if (ref) {
          JsBarcode(ref, `PKT-${p.id}`, {
            format: "CODE128",
            width: 2,
            height: 40,
            displayValue: true,
          });
        }
      });
    }
  }, [encomenda]);

  if (!encomenda) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">Carregando...</main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-8">
        <h1 className="text-2xl font-bold">
          Etiquetas da Encomenda #{encomenda.id}
        </h1>

        {/* Código da encomenda */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Etiqueta da Encomenda</h2>
          <div className="bg-white border p-4 w-fit">
            <svg ref={encomendaRef}></svg>
          </div>
        </section>

        {/* Códigos dos pacotes */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Etiquetas dos Pacotes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {encomenda.pacotes.map((p) => (
              <div key={p.id} className="p-4 border bg-white space-y-2 w-fit">
                <svg
                  ref={(el) => {
                    if (el) pacoteRefs.current[p.id] = el;
                  }}
                ></svg>
                <p className="text-sm">
                  <strong>{p.descricao}</strong> – {p.peso}kg
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Etiquetas;
