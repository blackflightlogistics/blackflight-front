// src/components/admin/PagamentoPendenteModal.tsx
import { useState } from "react";
import { useLanguage } from "../../context/useLanguage";
import DecimalMoneyInput from "../form/DecimalMoneyInput";

interface Props {
  aberto: boolean;
  valorTotal: number;
  valorPago: number;
  onFechar: () => void;
  onConfirmar: (valorRestante: number) => void;
}

const PagamentoPendenteModal = ({
  aberto,
  valorTotal,
  valorPago,
  onFechar,
  onConfirmar,
}: Props) => {
  const { translations: t } = useLanguage();
  const [valorRestante, setValorRestante] = useState(valorTotal - valorPago);

  if (!aberto) return null;

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

        <button
          onClick={() => onConfirmar(valorRestante)}
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
