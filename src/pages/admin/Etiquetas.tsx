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
      (c) => c.name?.toLowerCase() === countryName?.toLowerCase()
    );
    return country?.isoCode || countryName;
  };

  const getStateAbbr = (countryName: string, stateName: string) => {
    const country = Country.getAllCountries().find(
      (c) => c.name?.toLowerCase() === countryName?.toLowerCase()
    );
    if (!country) return stateName;

    const state = State.getStatesOfCountry(country.isoCode).find(
      (s) => s.name?.toLowerCase() === stateName?.toLowerCase()
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
            gap: 4px;
          }
          .linha {
            display: flex;
            justify-content: space-between;
          }
          .center {
            text-align: center;
          }
          .qr {
            margin: 6px 0;
            text-align: center;
          }
          .bold {
            font-weight: bold;
          }
          hr {
            margin: 12px 0;
          }
          .rodape {
            margin-top: 5px;
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
      from.city || ""
    )}
            </div>
            <div style="text-align: left;">
              <span class="bold">${t.destinatario}:</span><br/>
              ${encomenda.to_account.name}<br/>
              <span class="bold">${t.pais_destino}:</span><br/>
              ${getCountryAbbr(to.country)} - ${getStateAbbr(
      to.country,
      to.city || ""
    )}
            </div>
          </div>

          <div class="center">
            <img src="${logoBase64}" alt="Logo" width="50" />
          </div>

          <hr />

          <div class="linha">
            <div>
             <span class="bold">${t.form_telefone}: </span>
                 ${encomenda.to_account.phone_number}<br/>
              <span class="bold">${t.peso}:</span> ${pesoTotal} kg<br/>
              <span class="bold">${t.encomenda_expressa}:</span> ${
      encomenda.is_express ? `${t.express}` : `${t.standard}`
    }
            </div>
            <div>
              <span class="bold">${t.data}:</span> ${apresentaDataFormatada(
      dataGeracao
    )}<br/>
              <span class="bold">${
                t.tracking_estimated_delivery
              }</span> ${adicionarDiasEntrega(
      dataGeracao,
      encomenda.is_express
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
          <p>https://www.blackflightlogistics.com/</p>
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
    posY = 10;
    //adicione outra pagina
    pdf.addPage();
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    posY += 6;

    posY += 10;

    pdf.text(
      "Conditions Générales de Transport – Black Flight Logistics",
      margem,
      posY
    );

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    posY += 14;
    pdf.text("Article 1 – Douane et marchandises périssables\n", margem, posY);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    posY += 5;
    pdf.text(
      "Black Flight Logistics ne peut être tenu responsable des colis saisis ou détruits par les autorités \n douanières à l’arrivée, ni des colis contenant des produits périssables.",
      margem,
      posY
    );
    posY += 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 2 – Délai de responsabilité et stockage\n", margem, posY);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;

    pdf.text(
      "5 jours Passé après l’acheminement des colis dans nos locaux respectifs , la responsabilité de\nBlack Flight Logistics ne saurait être engagée, sauf accord exceptionnel préalable.\nLes colis contenant des liquides et les marchandises mises en stockage sont pris en charge\nsans garantie. Un délai de 78 heures est accordé à partir de la notification de disponibilité.\nAu-delà, des frais de gardiennage à partir de 3 000 FCFA seront facturés.",
      margem,
      posY
    );

    posY += 30;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 3 – Vérification à la réception\n", margem, posY);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;
    pdf.text(
      "Le client est tenu de vérifier l’état et le contenu de son colis au moment de son retrait dans les\nlocaux de Black Flight Logistics. Une fois le colis récupéré, l’entreprise décline toute\nresponsabilité.",

      margem,
      posY
    );
    posY += 20;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(
      "Article 4 – Indemnisation en cas de perte ou détérioration\n",
      margem,
      posY
    );
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "En cas de perte ou de dommage, Black Flight Logistics indemnise à hauteur de 30 % de la\nvaleur déclarée, à condition que la facture d’achat originale soit fournie au moment du dépôt.\nUne évaluation de la vétusté sera également effectuée. Le montant d’indemnisation est\nplafonné à 300 euros.",
      margem,
      posY
    );
    posY += 25;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 5 – Déclaration des articles de valeur\n", margem, posY);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;
    pdf.text(
      "Tout objet de valeur doit être déclaré et justifié par le client lors de l’expédition. Le coût du\nservice sera ajusté selon le prix d’achat déclaré.",
      margem,
      posY
    );
    posY += 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 6 – Enlèvements et livraisons\n", margem, posY);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;

    pdf.text(
      "Les enlèvements et livraisons sont réalisés sur devis, en fonction de la localisation\n géographique du client.",
      margem,
      posY
    );
    posY += 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 7 – Tarifs et délais de livraison\n", margem, posY);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;

    pdf.text(
      "* Paris → Cameroun : 12 euros/kg pour les colis ordinaires\n* Cameroun → Paris : 10 euros/kg pour les colis ordinaires\nLes délais de livraison varient entre 1 a 3 jours à partir de la date de départ. Ces délais\npeuvent être prolongés pour des raisons indépendantes de notre volonté (procédures\ndouanières, retards aériens, etc.).",
      margem,
      posY
    );
    posY += 30;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text(
      "Article 8 – Évolution des tarifs et réexpédition \n",
      margem,
      posY
    );
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    pdf.text(
      "Les tarifs peuvent être révisés en fonction des conditions du marché. Le client sera informé \n par message ou affichage en agence. En cas de demande de réexpédition (vers d'autres régions d’Europe, de France ou à l’intérieur \n du Cameroun), les frais appliqués dépendront des tarifs du transporteur choisi. En cas de perte, de retard ou de dommage survenu chez ce dernier, le client devra engager lui-même les \n démarches. Black Flight Logistics ne saurait être tenu responsable.",
      margem,
      posY
    );

    pdf.addPage();
    posY = 10;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text(
      "Article 9 – Responsabilité en cas de perte ou de dommage \n",
      margem,
      posY
    );
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;

    pdf.text(
      "En cas de perte, de vol ou de détérioration du colis, la responsabilité de Black Flight Logistics \n ne pourra être engagée au-delà du montant des frais de transport acquittés par le client.",
      margem,
      posY
    );
    posY += 15;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 10 – Litiges \n", margem, posY);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;

    pdf.text(
      "En cas de litige, le client s'engage à contacter Black Flight Logistics dans un délai de 7 jours à \n compter de la date de livraison. Passé ce délai, aucune réclamation ne pourra être acceptée.",
      margem,
      posY
    );
    posY += 15;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text(
      "Article 11 – Produits spécifiques : délais de livraison \n",
      margem,
      posY
    );
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;

    pdf.text(
      "Les délais de livraison pour les produits cosmétiques, objets d’art et articles de marque sont estimés\n entre trois (3) et quatre (4) semaines à compter de la date de départ prévue. Ces délais peuvent être \n rallongés en cas de circonstances exceptionnelles.",
      margem,
      posY
    );
    posY += 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 12 – Tarifs d’expédition spécifiques \n", margem, posY);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;

    pdf.text(
      "L’envoi de produits cosmétiques, objets d’art ou articles de marque depuis le Cameroun vers la France \n est facturé à 15 euros.",
      margem,
      posY
    );
    posY += 15;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 13 – Paiement à l’arrivée \n", margem, posY);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;

    pdf.text(
      "Les colis réglés à l’arrivée en France sont soumis à une majoration de 2 euros.",
      margem,
      posY
    );
    posY += 10;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 14 – Commandes en ligne \n", margem, posY);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;

    pdf.text(
      "Black Flight Logistics décline toute responsabilité pour les colis achetés en ligne et livrés à\n une adresse différente de celle recommandée par nos services.",
      margem,
      posY
    );
    posY += 15;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 15 – Preuve de livraison \n", margem, posY);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;

    pdf.text(
      "Une preuve de livraison émise par un transporteur tiers ne constitue pas une preuve\n irréfutable de bonne réception du colis.",
      margem,
      posY
    );
    posY += 15;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 16 – Colis non payés au départ \n", margem, posY);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    posY += 5;

    pdf.text(
      "Tout colis expédié depuis le Cameroun vers l’Europe sans paiement préalable fera l’objet\nd’une majoration de 2 à 5 euros à l’arrivée.",
      margem,
      posY
    );
    posY += 20;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text(
      "General Terms of Transport – Black Flight Logistics",
      margem,
      posY
    );

    posY += 10;
    pdf.text("Article 1 – Customs and Perishable Goods", margem, posY);
    posY += 5;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      "Black Flight Logistics cannot be held liable for parcels seized or destroyed by customs \n authorities upon arrival, nor for parcels containing perishable goods.",
      margem,
      posY
    );
    posY += 15;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("Article 2 – Liability Period and Storage", margem, posY);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    posY += 5;
    pdf.text(
      "5 days after the arrival of parcels at our respective facilities, Black Flight Logistics shall \n no longer be held responsible, unless prior exceptional agreement has been made.\n Parcels containing liquids and goods placed in storage are handled without guarantee.\n A period of 78 hours is granted from the notification of availability. Beyond that, storage fees starting \n at 3,000 FCFA will be charged.",
      margem,
      posY
    );
    posY += 35;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 3 – Inspection Upon Collection", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    pdf.text(
      "The customer must check the condition and contents of their parcel upon collection from\nBlack Flight Logistics premises. Once collected, the company declines all responsibility.",
      margem,
      posY
    );
    posY += 15;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 4 – Compensation for Loss or Damage", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "In the event of loss or damage, Black Flight Logistics will compensate up to 30% of the\n" +
        "declared value, provided the original purchase invoice is submitted at drop-off. Depreciation\n" +
        "of value will also be assessed. Compensation is capped at €300.",
      margem,
      posY
    );
    posY += 20;
    
    pdf.addPage();
    posY = 20;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 5 – Declaration of Valuable Items", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "All valuable items must be declared and justified by the customer at the time of shipping. The\n" +
        "service cost will be adjusted based on the declared purchase price.",
      margem,
      posY
    );
    posY += 15;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 6 – Pick-ups and Deliveries", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "Pick-up and delivery services are available on request and are quoted based on the customer's\n" +
        "location.",
      margem,
      posY
    );
    posY += 15;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 7 – Shipping Rates and Delivery Times", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    pdf.text(
      "• Paris → Cameroon: €12/kg for standard parcels\n" +
        "• Cameroon → Paris: €10/kg for standard parcels\n" +
        "Delivery times range from 1 to 3 days after departure. These may be extended due to\n" +
        "circumstances beyond our control (customs processing, flight delays, etc.).",
      margem,
      posY
    );
    posY += 25;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 8 – Rate Changes and Reshipment", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "Rates may be adjusted based on market conditions. Customers will be notified via message or\n" +
        "posted notice at our offices.\n" +
        "In the event of a request for reshipment (to other regions in Europe, France, or within\n" +
        "Cameroon), applicable fees will depend on the chosen carrier   ’s rates. In case of loss, delay, or\n" +
        "damage caused by the carrier, the client must handle the claims process directly. Black Flight\n" +
        "Logistics cannot be held liable.",
      margem,
      posY
    );
    posY += 35;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 9 – Claims Conditions", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "No claim or compensation request will be processed if the customer has not fully paid for the\n" +
        "service, and no receipt has been issued.",
      margem,
      posY
    );
    posY += 15;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 10 – Mail and Oversized Parcel Rates", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "The base rate for sending mail is 32€. This may vary depending on the nature of the\n" +
        "documents and number of pages.\n" +
        "Oversized parcels (non-standard dimensions) are charged between 70€ and 150€, depending\n" +
        "on volume.",
      margem,
      posY
    );
    posY += 25;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 11 – Delivery Times for Specific Products", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "Delivery times for cosmetics, artworks, and branded items are estimated between 3 and 4\n" +
        "weeks from the scheduled departure date. These times may be extended under exceptional\n" +
        "circumstances.",
      margem,
      posY
    );
    posY += 20;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 12 – Specific Shipping Rates", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "Shipping of cosmetics, artworks, or branded items from Cameroon to France is billed at\n€15.",
      margem,
      posY
    );
    posY += 20;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 13 – Payment on Arrival", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "Parcels paid upon arrival in France are subject to a 2€ surcharge.",
      margem,
      posY
    );
    posY += 10;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 14 – Online Orders", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "Black Flight Logistics disclaims all responsibility for online orders delivered to an address\n" +
        "other than the one recommended by our services.",
      margem,
      posY
    );
    posY += 20;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Article 15 – Proof of Delivery", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "Proof of delivery issued by a third-party carrier does not constitute irrefutable evidence of\n" +
        "proper parcel reception.",
      margem,
      posY
    );
    posY += 10;
    pdf.setFont("helvetica", "bold");
    pdf.addPage();
    posY = 20;
    pdf.setFontSize(16);
    pdf.text("Article 16 – Unpaid Parcels at Departure", margem, posY);
    posY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "Any parcel shipped from Cameroon to Europe without prior payment will incur a surcharge\n" +
        "of 2€ to 5€ upon arrival.",
      margem,
      posY
    );

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

                {/* seção de impressão de etiquetas para pacotes  sera mantida comentada
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
