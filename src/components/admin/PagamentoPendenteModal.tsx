import { useState } from "react";
import { useLanguage } from "../../context/useLanguage";
import DecimalMoneyInput from "../form/DecimalMoneyInput";

interface Props {
  aberto: boolean;
  valorTotal: number;
  valorPago: number;
  onFechar: () => void;
  onConfirmar: (valorRestante: number) => void;
  dollarValue: number;
  cambioTax: number;
  cafValue: number;
}

const PagamentoPendenteModal = ({
  aberto,
  valorTotal,
  valorPago,
  onFechar,
  onConfirmar,
  cambioTax,
    cafValue,
}: Props) => {
  const { translations: t } = useLanguage();
  const [valorRestante, setValorRestante] = useState(valorTotal - valorPago);
  const [moeda, setMoeda] = useState<"dollar" | "caf">("dollar");

  if (!aberto) return null;

  const valorConvertidoCAF = () => {
    const emCaf = valorRestante * cafValue;
    const comTaxa = emCaf + (emCaf * cambioTax) / 100;
    return comTaxa;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-orange shadow-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold font-primary text-black">
          {t.pagamento_pendente_titulo}
        </h2>

        <p className="text-sm text-gray-700 font-secondary">
          {t.pagamento_valor_total}: <strong>US$ {valorTotal.toFixed(2)}</strong>
        </p>

        <p className="text-sm text-gray-700 font-secondary">
          {t.pagamento_valor_pago}: <strong>US$ {valorPago.toFixed(2)}</strong>
        </p>

        <div className="space-y-1">
          <label className="block text-sm text-gray-600">
            {t.pagamento_informar_faltante}
          </label>
          <DecimalMoneyInput
            value={valorRestante.toString()}
            onChange={(val) => setValorRestante(Number(val))}
            placeholder={t.valor_declarado}
            decimalPlaces={2}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">{t.moeda}</label>
          <select
            className="p-2 border rounded w-full"
            value={moeda}
            onChange={(e) => setMoeda(e.target.value as "dollar" | "caf")}
          >
            <option value="dollar">USD ($)</option>
            <option value="caf">CAF</option>
          </select>
        </div>

        {moeda === "caf" && (
          <p className="text-sm text-blue-700 font-secondary">
            Total em CAF (com {cambioTax}% de taxa):{" "}
            <strong>CAF {valorConvertidoCAF().toFixed(2)}</strong>
          </p>
        )}

        <button
          onClick={() =>
            onConfirmar(moeda === "dollar" ? valorRestante : valorConvertidoCAF())
          }
          className="w-full px-4 py-2 bg-orange text-white rounded-md hover:opacity-90 font-secondary text-sm"
        >
          {t.confirmar}
        </button>

        <button
          onClick={onFechar}
          className="mt-2 text-sm text-gray-600 hover:underline w-full text-center"
        >
          {t.cancelar}
        </button>
      </div>
    </div>
  );
};

export default PagamentoPendenteModal;
