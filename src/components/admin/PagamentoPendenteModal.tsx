import { useState } from "react";
import { useLanguage } from "../../context/useLanguage";
import DecimalMoneyInput from "../form/DecimalMoneyInput";

interface Props {
  aberto: boolean;
  valorTotal: number;
  valorPago: number;
  onFechar: () => void;
  onConfirmar: (valorRestante: number) => void | Promise<void>;
  dollarValue: number;
  cafValue: number;
}

const PagamentoPendenteModal = ({
  aberto,
  valorTotal,
  valorPago,
  onFechar,
  onConfirmar,
  cafValue,
}: Props) => {
  const { translations: t } = useLanguage();
  const [valorRestante, setValorRestante] = useState(valorTotal - valorPago);
  const [moeda, setMoeda] = useState<"euro" | "caf">("euro");
  const [confirmando, setConfirmando] = useState(false);

  if (!aberto) return null;

  const valorASerPago = valorTotal - valorPago;
  const valorCorreto = Math.round(valorRestante * 100) === Math.round(valorASerPago * 100);
  const valorConvertidoCAF = () => valorRestante * cafValue;

  const handleConfirmar = async () => {
    setConfirmando(true);
    try {
      await Promise.resolve(
        onConfirmar(moeda === "euro" ? valorRestante : valorConvertidoCAF())
      );
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-orange shadow-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold font-primary text-black">
          {t.pagamento_pendente_titulo}
        </h2>

        <p className="text-sm text-gray-700 font-secondary">
          {t.pagamento_valor_total}: <strong>€ {valorTotal.toFixed(2)}</strong>
        </p>

        <p className="text-sm text-gray-700 font-secondary">
          {t.pagamento_valor_pago}: <strong>€ {valorPago.toFixed(2)}</strong>
        </p>

        <p className="text-sm text-gray-700 font-secondary">
          {t.pagamento_valor_a_ser_pago}:{" "}
          <strong>€ {(valorTotal - valorPago).toFixed(2)}</strong>
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
            onChange={(e) => setMoeda(e.target.value as "euro" | "caf")}
          >
            <option value="euro">EUR (€)</option>
            <option value="caf">CAF</option>
          </select>
        </div>

        {moeda === "caf" && (
          <p className="text-sm text-blue-700 font-secondary">
            {t.pagamento_total_em_caf} (1 € = {cafValue} CAF):{" "}
            <strong>CAF {valorConvertidoCAF().toFixed(2)}</strong>
          </p>
        )}

        <button
          onClick={handleConfirmar}
          disabled={!valorCorreto || confirmando}
          className={`w-full px-4 py-2 rounded-md font-secondary text-sm flex items-center justify-center gap-2 ${
            valorCorreto && !confirmando
              ? "bg-orange text-white hover:opacity-90"
              : confirmando
                ? "bg-orange text-white opacity-80 cursor-wait"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
          }`}
        >
          {confirmando ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
              {t.confirmando}
            </>
          ) : (
            t.confirmar
          )}
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
