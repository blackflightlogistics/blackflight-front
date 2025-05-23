import React from "react";
import { Order, Package } from "../../services/encomendaService";
import { apresentaDataFormatada } from "../../utils/utils";
import { useLanguage } from "../../context/useLanguage";

interface EtiquetaProps {
  encomenda: Order;
  qrBase64: string;
  dataGeracao: string;
  logoBase64: string;
}

const EtiquetaEncomendaComponente: React.FC<EtiquetaProps> = ({
  encomenda,
  qrBase64,
  dataGeracao,
  logoBase64,
}) => {
    const { translations: t } = useLanguage();

  const pesoTotal = encomenda?.packages
    ?.reduce((acc: number, p: Package) => acc + parseFloat(p.weight), 0)
    .toFixed(2);

  return (
    <div
      className=" p-[10mm] flex flex-col font-mono"
      style={{ pageBreakAfter: "always" }}
    >
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between">
          <div>
            <span className="font-bold">{t.remetente}</span>
            <br />
            {encomenda?.from_account.name}<br/>
            <span className="font-bold">{t.pais_origem}</span>
            <br />
            {encomenda?.from_account.adresses[0].country}
          </div>
          <div className="text-left">
            <span className="font-bold">{t.destinatario}</span>
            <br />
            {encomenda?.to_account.name}<br/>
            <span className="font-bold">{t.pais_destino}</span>
            <br />
            {encomenda?.to_account.adresses[0].country}
          </div>
        </div>

        <div className="my-3 text-center flex flex-col items-center">
          <img src={qrBase64} width={120} height={120} alt="QR Code" />
          <div>
            <small>ID: E-{encomenda?.id}</small>
          </div>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between">
          <div>
            <span className="font-bold">{t.peso}:</span> {pesoTotal} kg<br />
            <span className="font-bold">{t.encomenda_expressa}:</span> {encomenda?.is_express ? "Sim" : "Não"}
          </div>
          <div>
            <span className="font-bold">{t.data}:</span> {apresentaDataFormatada(dataGeracao)}
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-[13px]">
        <img src={logoBase64} alt="Logo" className="w-[50px] mx-auto mb-2" />
        <p>{t.endereco_centro_distribuicao}:</p>
        <p className="font-bold">FRANCE – 11 CITÉ RIVERIN, PARIS</p>
      </div>
    </div>
  );
};

export default EtiquetaEncomendaComponente;
