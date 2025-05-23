import { useLanguage } from "../../context/useLanguage";

interface Props {
  aberto: boolean;
  tipo: "encomenda" | "pacote" | "remessa";
  codigo: string;
  onFechar: () => void;
  onConfirmar: (status: string) => void;
}

const ConfirmacaoCheckinModal = ({
  aberto,
  tipo,
  codigo,
  onFechar,
  onConfirmar,
}: Props) => {
  const { translations: t } = useLanguage();

  if (!aberto) return null;

  const opcoesStatus =
    tipo === "encomenda"
      ? [
          "em_preparacao",
          "em_transito",
          "aguardando_retirada",
          "entregue",
          "cancelada",
        ]
      : tipo === "remessa"
      ? [
          "em_preparacao",
          "em_transito",
          "aguardando_retirada",
          "cancelada",
        ]
      : [
          "em_preparacao",
          
        ];

  const formatarStatus = (status: string) => {
    const mapa: Record<string, string> = {
      em_preparacao: t.status_em_preparacao,
      em_transito: t.status_em_transito,
      aguardando_retirada: t.status_aguardando_retirada,
      entregue: t.status_entregue,
      cancelada: t.status_cancelada,
    };
    return mapa[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-orange shadow-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold font-primary text-black">
          {t.confirmar_checkin}
        </h2>
        <p className="text-gray-700 font-secondary text-sm">
          {t.deseja_atualizar_status} <strong>{tipo}</strong>{" "}
          <strong>{codigo}</strong>?
        </p>

        <div className="space-y-2">
          {opcoesStatus.map((status) => (
            <button
              key={status}
              onClick={() => onConfirmar(status)}
              className="w-full px-4 py-2 bg-orange text-white rounded-md hover:opacity-90 font-secondary text-sm"
            >
              {t.marcar_como}: "{formatarStatus(status)}"
            </button>
          ))}
        </div>

        <button
          onClick={onFechar}
          className="mt-4 text-sm text-gray-600 hover:underline font-secondary w-full text-center"
        >
          {t.cancelar}
        </button>
      </div>
    </div>
  );
};

export default ConfirmacaoCheckinModal;
