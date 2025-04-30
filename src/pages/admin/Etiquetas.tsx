import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Sidebar from "../../components/admin/Sidebar";
import { orderService, Order } from "../../services/encomendaService";
import { clienteService, Cliente } from "../../services/clienteService";
import QRCodeComLogo from "../../components/shared/QRCodeComLogo";

function EtiquetaEncomenda() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encomenda, setEncomenda] = useState<Order | null>(null);
  const [remetente, setRemetente] = useState<Cliente | null>(null);
  const [destinatario, setDestinatario] = useState<Cliente | null>(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const [dataGeracao, setDataGeracao] = useState<string>("");

  const pacotesSelecionados: string[] =
    location.state?.pacotesSelecionados ?? [];
  const pacotesParaImprimir = encomenda?.packages.filter((p) =>
    pacotesSelecionados.includes(p.id)
  );

  useEffect(() => {
    if (!id) return;
    orderService.buscarPorId(id).then((dados) => {
      setEncomenda(dados);
      clienteService.buscarPorId(dados.from_account_id).then(setRemetente);
      clienteService.buscarPorId(dados.to_account_id).then(setDestinatario);
      setDataGeracao(dados.inserted_at.split("T")[0]);
    });
  }, [id]);

  const exportarPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`etiquetas-encomenda-${id}.pdf`);
  };

  if (!encomenda || !remetente || !destinatario) {
    return <p className="p-6">Carregando...</p>;
  }

  return (
    <div className="h-screen overflow-hidden">
      {/* Sidebar fixa */}
      <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-64 bg-black text-white border-r z-10">
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
          onClick={() => setSidebarAberta(true)}
        >
          ☰ Menu
        </button>
        <Sidebar
          mobileAberta={sidebarAberta}
          onFechar={() => setSidebarAberta(false)}
        />
      </div>

      {/* Conteúdo principal */}
      <main className="md:ml-64 h-full overflow-y-auto bg-[#fcf8f5] p-6 space-y-6 pt-16 md:pt-6 print:p-4 print:overflow-visible">
        {/* Topo - Título e Botões */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 print:hidden">
          <h1 className="text-2xl font-bold font-primary text-black">
            Etiquetas da Encomenda
          </h1>
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button
              onClick={exportarPDF}
              className="px-4 py-2 bg-orange text-white rounded hover:opacity-90 text-sm font-secondary"
            >
              Exportar PDF
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-black text-white rounded hover:opacity-80 text-sm font-secondary"
            >
              Imprimir
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 text-sm font-secondary"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Área das etiquetas */}
        <div ref={pdfRef} className="space-y-6">
          {/* Info geral */}
          <section className="border p-4 rounded bg-white shadow">
            <h2 className="text-lg font-semibold mb-2">Remetente</h2>
            <p>{remetente.name}</p>
            <p className="text-sm text-gray-600">{remetente.address.city} - {remetente.address.state} - {remetente.address.country}</p>

            <h2 className="text-lg font-semibold mt-4 mb-2">Destinatário</h2>
            <p>{destinatario.name}</p>
            <p className="text-sm text-gray-600">{destinatario.address.city} - {destinatario.address.state} - {destinatario.address.country}</p>

            <p className="text-sm text-gray-500 mt-2">
              Data de geração: {dataGeracao}
            </p>
          </section>

          {/* QRCode da encomenda */}
          <section className="border p-6 rounded bg-white shadow flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-4">Código da Encomenda</h2>
            <QRCodeComLogo value={`E-${encomenda.id}`} size={128} />
            <p className="text-sm text-gray-600 mt-2">ID: E-{encomenda.id}</p>
          </section>

          {/* QRCode dos pacotes */}
          {(pacotesParaImprimir ?? []).length > 0 && (
            <section className="border p-4 rounded bg-white  shadow print:break-before-page">
              <h2 className="text-lg font-semibold mb-4">
                Códigos dos Pacotes
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {pacotesParaImprimir?.map((pacote) => (
                  <div
                    key={pacote.id}
                    className="border p-4 rounded bg-gray-50 flex flex-col items-center"
                  >
                    <QRCodeComLogo value={`P-${pacote.id}`} size={128} />
                    <p className="mt-2 text-sm font-medium text-center">
                      {pacote.description} - {pacote.weight}kg
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default EtiquetaEncomenda;
