import React from "react";

interface Props {
  aberto: boolean;
  tipo: "encomenda" | "pacote";
  codigo: string;
  onFechar: () => void;
  onConfirmar: (status: string) => void;
}

const ConfirmacaoCheckinModal = ({ aberto, tipo, codigo, onFechar, onConfirmar }: Props) => {
  if (!aberto) return null;

  const opcoesStatus =
    tipo === "encomenda"
      ? ["em preparação", "em transito", "cancelada"]
      : ["em preparação", "em transito", "aguardando retirada", "entregue", "cancelada"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">Confirmar Check-in</h2>
        <p className="text-gray-700">
          Deseja atualizar o status do <strong>{tipo}</strong> <strong>{codigo}</strong>?
        </p>

        <div className="space-y-2">
          {opcoesStatus.map((status) => (
            <button
              key={status}
              onClick={() => onConfirmar(status)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Marcar como "{status}"
            </button>
          ))}
        </div>

        <button
          onClick={onFechar}
          className="mt-4 text-sm text-gray-600 hover:underline w-full"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ConfirmacaoCheckinModal;
