// src/components/admin/ConfirmarCodigoModal.tsx
import { useState } from "react";
import { useLanguage } from "../../context/useLanguage";

interface Props {
  aberto: boolean;
  onConfirmar: (codigo: string) => void;
  onFechar: () => void;
}

export default function ConfirmarCodigoModal({
  aberto,
  onConfirmar,
  onFechar,
}: Props) {
  const { translations: t } = useLanguage();
  const [codigo, setCodigo] = useState("");

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-orange shadow-lg p-6 w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">{t.confirmar_entrega}</h2>
        <p className="text-sm">{t.digite_codigo_seguranca}</p>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              onFechar();
              setCodigo("");
            }}
            className="text-sm text-gray-600 hover:underline"
          >
            {t.cancelar}
          </button>
          <button
            onClick={() => onConfirmar(codigo)}
            className="px-4 py-2 bg-orange text-white rounded hover:opacity-90 text-sm"
          >
            {t.confirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
