import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import Sidebar from "../../components/admin/Sidebar";
import { orderService, Order } from "../../services/encomendaService";
import QRCodeComLogo from "../../components/shared/QRCodeComLogo";
import { useLanguage } from "../../context/useLanguage";
import { Cliente } from "../../services/clienteService";
import { pacoteStatusToString } from "../../utils/utils";

function EtiquetaEncomenda() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { translations: t } = useLanguage();

  const [encomenda, setEncomenda] = useState<Order | null>(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [dataGeracao, setDataGeracao] = useState<string>("");
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const [carregando, setCarregando] = useState(true);

  const pacotesSelecionados: string[] =
    location.state?.pacotesSelecionados ?? [];
  const pacotesParaImprimir = encomenda?.packages.filter((p) =>
    pacotesSelecionados.includes(p.id)
  );

  useEffect(() => {
    if (!id) return;
    setCarregando(true);
    orderService.buscarPorId(id).then((dados) => {
      setEncomenda(dados);
      setDataGeracao(dados.inserted_at.split("T")[0]);
      setCarregando(false);
    });
  }, [id]);
  const formatarEndereco = (cliente: Cliente) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const endereco = (cliente.addresses || (cliente as any).adresses)?.[0];

    return {
      street: endereco?.street || "-",
      number: endereco?.number || "-",
      city: endereco?.city || "-",
      state: endereco?.state || "-",
      cep: endereco?.cep || "-",
      country: endereco?.country || "-",
    };
  };

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
  const exportarPdfEntrega = async () => {
    if (!encomenda) return;

    const pdf = new jsPDF();
    const margem = 15;
    let posY = 20;

    // Título
    pdf.setFontSize(16);
    pdf.text(t.comprovante_entrega_titulo, margem, posY);
    posY += 6;

    // Tracking code (se existir)
    if (encomenda.tracking_code) {
      pdf.setFontSize(12);
      pdf.text(`${t.tracking_code}: ${encomenda.tracking_code}`, margem, posY);
      posY += 8;
    }

    // Remetente
    pdf.setFontSize(12);
    pdf.text(t.comprovante_entrega_remetente_label, margem, posY);
    posY += 6;
    pdf.text(
      `${t.comprovante_entrega_nome} ${encomenda.from_account.name}`,
      margem,
      posY
    );
    posY += 6;
    const enderecoRemetente = formatarEndereco(encomenda.from_account);
    pdf.text(
      `${t.comprovante_entrega_endereco} ${enderecoRemetente.street}, ${enderecoRemetente.number}, ${enderecoRemetente.city} - ${enderecoRemetente.state}, ${enderecoRemetente.cep}, ${enderecoRemetente.country}`,
      margem,
      posY,
      { maxWidth: 180 }
    );
    posY += 14;

    // Destinatário
    pdf.text(t.comprovante_entrega_destinatario_label, margem, posY);
    posY += 6;
    pdf.text(
      `${t.comprovante_entrega_nome} ${encomenda.to_account.name}`,
      margem,
      posY
    );
    posY += 6;
    const enderecoDestinatario = formatarEndereco(encomenda.to_account);
    pdf.text(
      `${t.comprovante_entrega_endereco} ${enderecoDestinatario.street}, ${enderecoDestinatario.number}, ${enderecoDestinatario.city} - ${enderecoDestinatario.state}, ${enderecoDestinatario.cep}, ${enderecoDestinatario.country}`,
      margem,
      posY,
      { maxWidth: 180 }
    );
    posY += 16;

    // Pacotes
    const pacotes = pacotesParaImprimir ?? [];

    if (pacotes.length > 0) {
      pdf.text(t.pacotes + ":", margem, posY);
      posY += 6;

      autoTable(pdf, {
        startY: posY,
        head: [
          [
            t.comprovante_col_descricao,
            t.comprovante_col_peso,
            t.comprovante_col_valor,
            t.comprovante_col_status,
          ],
        ],
        body: pacotes.map((p) => [
          p.description,
          p.weight,
          parseFloat(p.declared_value).toFixed(2),
          pacoteStatusToString(p.status, t),
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [255, 102, 0] },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 25 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
        },
      });
    } else {
      pdf.text(
        t.nenhum_pacote_selecionado || "Nenhum pacote selecionado.",
        margem,
        posY
      );
    }

    pdf.save(`comprovante-entrega-encomenda-${encomenda.id}.pdf`);
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-64 bg-black text-white border-r z-10">
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
          onClick={() => setSidebarAberta(true)}
        >
          ☰ {t.menu}
        </button>
        <Sidebar
          mobileAberta={sidebarAberta}
          onFechar={() => setSidebarAberta(false)}
        />
      </div>

      <main className="md:ml-64 h-full overflow-y-auto bg-[#fcf8f5] p-6 space-y-6 pt-16 md:pt-6 print:p-4 print:overflow-visible">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 print:hidden">
          <h1 className="text-2xl font-bold font-primary text-black">
            {t.etiqueta_titulo}
          </h1>
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button
              onClick={exportarPDF}
              className="px-4 py-2 bg-orange text-white rounded hover:opacity-90 text-sm font-secondary"
            >
              {t.etiqueta_exportar_pdf}
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-black text-white rounded hover:opacity-80 text-sm font-secondary"
            >
              {t.etiqueta_imprimir}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 text-sm font-secondary"
            >
              {t.voltar}
            </button>
          </div>
        </div>
        {carregando || !encomenda ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : (
          (() => {
            const endTo = formatarEndereco(encomenda.to_account);
            const endFrom = formatarEndereco(encomenda.from_account);
            return (
              <div ref={pdfRef} className="space-y-6">
                <section className="border p-4 rounded bg-white shadow">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">
                        {t.etiqueta_remetente}
                      </h2>
                      <p>{encomenda.from_account.name}</p>

                      <p className="text-sm text-gray-600">
                        {endFrom.city} - {endFrom.state} - {endFrom.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold mt-4 mb-2">
                        {t.etiqueta_destinatario}
                      </h2>
                      <p>{encomenda.to_account.name}</p>
                      <p className="text-sm text-gray-600">
                        {endTo.city} - {endTo.state} - {endTo.country}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={exportarPdfEntrega}
                        className="px-4 py-2 bg-orange text-white rounded hover:opacity-90 text-sm font-secondary"
                      >
                        {t.gerar_documento_entrega}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    {t.etiqueta_data_geracao}: {dataGeracao}
                  </p>
                </section>

                {/* <section className="border p-6 rounded bg-white shadow flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-4">
            {t.etiqueta_codigo_encomenda}
          </h2>
          <QRCodeComLogo value={`E-${encomenda.id}`} size={128} />
          <p className="text-sm text-gray-600 mt-2">ID: E-{encomenda.id}</p>
        </section> */}
                <section className="border p-4 rounded bg-white shadow text-sm font-mono space-y-2 w-full max-w-[600px] mx-auto">
                  <div className=" justify-between">
                    <div>
                      <p>
                        <strong>{t.destinatario}</strong>:{" "}
                        {encomenda.to_account.name}
                      </p>
                      <p>
                        {endTo.street}, {endTo.number}
                      </p>
                      <p>
                        {endTo.city} - {endTo.state} - {endTo.cep}
                      </p>
                      <p>{endTo.country}</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <QRCodeComLogo value={`E-${encomenda.id}`} size={80} />
                      <p className="mt-1 text-center">ID: E-{encomenda.id}</p>
                    </div>
                  </div>

                  <hr className="my-2 border-gray-300" />

                  <div className="grid grid-cols-2 gap-2">
                    <p>
                      <strong>Peso total</strong>:{" "}
                      {encomenda.packages
                        .reduce((acc, p) => acc + parseFloat(p.weight), 0)
                        .toFixed(2)}{" "}
                      kg
                    </p>
                    <p>
                      <strong>Data</strong>: {dataGeracao}
                    </p>
                    <p>
                      <strong>Remetente</strong>: {encomenda.from_account.name}
                    </p>
                    <p>
                      <strong>País</strong>: {endTo.country}
                    </p>
                  </div>

                  <div className="text-center border-t pt-2 border-gray-300">
                    <p className="text-xs text-gray-500">
                      https://www.seusite.com/rastreio/E-{encomenda.id}
                    </p>
                  </div>
                </section>

                {(pacotesParaImprimir ?? []).length > 0 && (
                  <section className="border p-4 rounded bg-white shadow print:break-before-page">
                    <h2 className="text-lg font-semibold mb-4">
                      {t.etiqueta_codigos_pacotes}
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
            );
          })()
        )}
      </main>
    </div>
  );
}

export default EtiquetaEncomenda;
