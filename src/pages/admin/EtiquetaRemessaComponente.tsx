import React from "react";
import { apresentaDataFormatada } from "../../utils/utils";
import { useLanguage } from "../../context/useLanguage";

interface EtiquetaRemessaProps {
  remessa: {
    id: number | string;
    country: string;
    total_weight: number | string;
    inserted_at: string;
  };
  qrBase64: string;
  logoBase64: string;
}

const EtiquetaRemessaComponente: React.FC<EtiquetaRemessaProps> = ({
  remessa,
  qrBase64,
  logoBase64,
}) => {
  const dataFormatada = remessa.inserted_at.split("T")[0];

  const { translations: t } = useLanguage();
  return (
    <div
      className=" p-[10mm] flex flex-col font-mono"
      style={{ pageBreakAfter: "always" }}
    >
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between">
          {/* <div>
            <span className="font-bold">REMESSA:</span>
            <br />
            R-{remessa.id}
          </div> */}
          <div className="text-left">
            <span className="font-bold">{t.destino}</span>
            <br />
            {remessa.country}
          </div>
        </div>

        <div className="my-3 text-center flex flex-col items-center">
          <img src={qrBase64} width={120} height={120} alt="QR Code" />
          <div>
            <small>ID: R-{remessa.id}</small>
          </div>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between">
          <div>
            <span className="font-bold">{t.peso}:</span> {remessa.total_weight}kg 
          </div>
          <div>
            <span className="font-bold"> {t.data}:</span> {apresentaDataFormatada(dataFormatada)}
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

export default EtiquetaRemessaComponente;
