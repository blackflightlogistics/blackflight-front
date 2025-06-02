import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Sidebar from "../../components/admin/Sidebar";
import { remessaService, Shipment } from "../../services/remessaService";
import { useLanguage } from "../../context/useLanguage";
// import QRCodeComLogo from "../../components/shared/QRCodeComLogo";
import { gerarQrBase64PNG } from "../../components/shared/QRCodeComLogo";
import EtiquetaRemessaComponente from "./EtiquetaRemessaComponente";
import { apresentaDataFormatada } from "../../utils/utils";

function EtiquetaRemessa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translations: t } = useLanguage();

  const [remessa, setRemessa] = useState<Shipment | null>(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const [qrBase64, setQrBase64] = useState<string>("");
  const [logoBase64, setLogoBase64] = useState<string>("");
  const [dataGeracao, setDataGeracao] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    remessaService.buscarPorId(id).then(async (dados) => {
      setRemessa(dados);
      const qr = await gerarQrBase64PNG(`R-${dados.id}`);
      const logo = await carregarImagemComoBase64("/minimal_logo_black.png");
      setDataGeracao(dados.inserted_at.split("T")[0]);
      setQrBase64(qr);
      setLogoBase64(logo);
    });
  }, [id]);
  const imprimirEtiqueta = () => {
    if (!qrBase64 || !remessa) return;

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
            }
            .linha {
              display: flex;
              justify-content: space-between;
            }
            .center {
              text-align: center;
            }
            .qr {
              text-align: center;
            }
            .bold {
              font-weight: bold;
            }
            hr {
              margin: 12px 0;
            }
            .rodape {
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
                <div className="text-left">
                  <span className="font-bold">${t.destino}</span>
                  <br />
                   ${remessa.country}
                </div>
              </div>
             
            </div>
  
            <div class="center">
              <img src="${logoBase64}" alt="Logo" width="50" />
            </div>
  
            <hr />
  
            <div class="linha">
             
              <div>
                <span class="bold">${t.data}:</span> ${apresentaDataFormatada(
                  dataGeracao
                )}<br/>
      
              </div>
            </div>
          </div>
  
          <div class="rodape">
            <div class="qr">
            <img src="${qrBase64}" style="width: 100px; height: 100px; display: block; margin: 0 auto;" />
  
  
  
              <div><p>ID: R-${remessa.id.split("-")[0]}</p></div>
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
  const exportarPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`etiquetas-remessa-${id}.pdf`);
  };

  if (!remessa) {
    return <p className="p-6">{t.carregando || "Carregando..."}</p>;
  }

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
            {t.etiqueta_titulo || "Etiqueta de Remessa"}
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
        <section className="border p-4 rounded bg-white shadow">
          <h2 className="text-xl font-bold mb-2">
            {t.etiqueta_titulo || "Etiqueta de Remessa"}
          </h2>
          <p className="text-sm text-gray-700">
            <strong>{t.etiqueta_data_geracao || "Data"}:</strong>{" "}
            {remessa.inserted_at.split("T")[0]}
          </p>
          <p className="text-sm text-gray-700">
            <strong>{"País de destino"}:</strong> {remessa.country}
          </p>
          <p className="text-sm text-gray-700">
            <strong>{"ID da Remessa"}:</strong> R-
            {remessa.id.split("-")[0]}
          </p>
        </section>
        <div
          ref={pdfRef}
          className="space-y-6 flex items-center justify-center"
        >
          <section className="border p-6 max-w-[600px]  rounded bg-white shadow flex flex-col items-center justify-center">
            <EtiquetaRemessaComponente
              remessa={remessa}
              qrBase64={qrBase64}
              logoBase64={logoBase64}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default EtiquetaRemessa;
