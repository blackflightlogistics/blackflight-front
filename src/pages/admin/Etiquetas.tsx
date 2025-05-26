import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import Sidebar from "../../components/admin/Sidebar";
import { orderService, Order } from "../../services/encomendaService";
import { Country, State } from "country-state-city";

import { useLanguage } from "../../context/useLanguage";
import { Cliente } from "../../services/clienteService";
import {
  adicionarDiasEntrega,
  apresentaDataFormatada,
  pacoteStatusToString,
} from "../../utils/utils";
import { gerarQrBase64PNG } from "../../components/shared/QRCodeComLogo";
import EtiquetaEncomendaComponente from "./EtiquetaEncomendaComponente";

function EtiquetaEncomenda() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { translations: t } = useLanguage();
  const [qrBase64, setQrBase64] = useState<string>("");
  const [encomenda, setEncomenda] = useState<Order | null>(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [dataGeracao, setDataGeracao] = useState<string>("");
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [logoBase64, setLogoBase64] = useState("");
  const pacotesSelecionados: string[] =
    location.state?.pacotesSelecionados ?? [];
  const pacotesParaImprimir = encomenda?.packages.filter((p) =>
    pacotesSelecionados.includes(p.id)
  );
  const etiquetaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!id) return;
    setCarregando(true);
    orderService.buscarPorId(id).then(async (dados) => {
      setEncomenda(dados);
      setDataGeracao(dados.inserted_at.split("T")[0]);
      const qr = await gerarQrBase64PNG(`E-${dados.id}`);
      const logo = await carregarImagemComoBase64("/minimal_logo_black.png");
      setQrBase64(qr);
      setLogoBase64(logo);
      setCarregando(false);
    });
  }, [id]);
  const formatarEndereco = (cliente: Cliente) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const endereco = (cliente.adresses || (cliente as any).adresses)?.[0];

    return {
      street: endereco?.street || "-",
      number: endereco?.number || "-",
      city: endereco?.city || "-",
      state: endereco?.state || "-",
      cep: endereco?.cep || "-",
      country: endereco?.country || "-",
    };
  };
  const carregarImagemComoBase64 = (caminho: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      fetch(caminho)
        .then((res) => res.blob())
        .then((blob) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  const getCountryAbbr = (countryName: string) => {
    const country = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    return country?.isoCode || countryName;
  };

  const getStateAbbr = (countryName: string, stateName: string) => {
    const country = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    if (!country) return stateName;

    const state = State.getStatesOfCountry(country.isoCode).find(
      (s) => s.name.toLowerCase() === stateName.toLowerCase()
    );
    return state?.isoCode || stateName;
  };

  const imprimirEtiqueta = () => {
    if (!encomenda || !qrBase64 || !logoBase64) return;

    const pesoTotal = encomenda.packages
      .reduce((acc, p) => acc + parseFloat(p.weight), 0)
      .toFixed(2);

    const from = encomenda.from_account.adresses[0];
    const to = encomenda.to_account.adresses[0];

    const janela = window.open("", "_blank");
    if (!janela) return;

    janela.document.write(`
    <html>
      <head>
        <title>Etiqueta</title>
        <style>
          @page {
            size: 100mm 150mm;
            margin: 0;
          }
          html, body {
            width: 100mm;
            height: 150mm;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: monospace;
            display: flex;
            flex-direction: column;
            padding: 10mm;
            box-sizing: border-box;
          }
          .topo {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .linha {
            display: flex;
            justify-content: space-between;
          }
          .center {
            text-align: center;
          }
          .qr {
            margin: 12px 0;
            text-align: center;
          }
          .bold {
            font-weight: bold;
          }
          hr {
            margin: 12px 0;
          }
          .rodape {
            margin-top: 10px;
            text-align: center;
            font-size: 13px;
          }
          .rodape img {
            width: 50px;
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="topo">
          <div class="linha">
            <div>
              <span class="bold">${t.remetente}:</span><br/>
              ${encomenda.from_account.name}<br/>
              <span class="bold">${t.pais_origem}:</span><br/>
              ${getCountryAbbr(from.country)} - ${getStateAbbr(
      from.country,
      from.city
    )}
            </div>
            <div style="text-align: left;">
              <span class="bold">${t.destinatario}:</span><br/>
              ${encomenda.to_account.name}<br/>
              <span class="bold">${t.pais_destino}:</span><br/>
              ${getCountryAbbr(to.country)} - ${getStateAbbr(
      to.country,
      to.city
    )}
            </div>
          </div>

          <div class="center">
            <img src="${logoBase64}" alt="Logo" width="50" />
          </div>

          <hr />

          <div class="linha">
            <div>
              <span class="bold">${t.peso}:</span> ${pesoTotal} kg<br/>
              <span class="bold">${t.encomenda_expressa}:</span> ${
      encomenda.is_express ? `${t.express}` : `${t.standard}`
    }
            </div>
            <div>
              <span class="bold">${t.data}:</span> ${apresentaDataFormatada(
      dataGeracao
    )}<br/>
     <span class="bold">${t.tracking_estimated_delivery}</span> ${adicionarDiasEntrega(
      dataGeracao,encomenda.is_express
    )}
            </div>
          </div>
        </div>

        <div class="rodape">
          <div class="qr">
          <img src="${qrBase64}" style="width: 100px; height: 100px; display: block; margin: 0 auto;" />



            <div><small>ID: E-${encomenda.id.split("-")[0]}</small></div>
          </div>
          <p>${t.endereco_centro_distribuicao}:</p>
          <p><strong>FRANCE – 11 CITÉ RIVERIN, PARIS</strong></p>
          <p>WWW.SEU-SITE.COM</p>
        </div>
      </body>
    </html>
  `);

    janela.document.close();

    const img = janela.document.querySelector("img");
    if (img && !img.complete) {
      img.onload = () => {
        janela.focus();
        janela.print();
        janela.close();
      };
    } else {
      janela.focus();
      janela.print();
      janela.close();
    }
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
              onClick={imprimirEtiqueta}
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

                <section
                  ref={etiquetaRef}
                  className="print-area  border p-4 rounded bg-white shadow text-sm font-mono space-y-2 w-full max-w-[600px] mx-auto"
                >
                  <EtiquetaEncomendaComponente
                    encomenda={encomenda}
                    logoBase64={logoBase64}
                    qrBase64={qrBase64}
                    dataGeracao={dataGeracao}
                  />
                </section>

                {/* seção de impressão de etiquetas para pacotes 
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
                )} */}
              </div>
            );
          })()
        )}
      </main>
    </div>
  );
}

export default EtiquetaEncomenda;
