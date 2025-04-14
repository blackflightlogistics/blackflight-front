import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import QrScanner from "qr-scanner";
import { encomendaService, } from "../../services/encomendaService";
import ConfirmacaoCheckinModal from "../../components/admin/ConfirmacaoCheckinModal";
import { isEncomendaStatus, isPacoteStatus } from "../../utils/utils";

function Leitor() {
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [codigoLido, setCodigoLido] = useState<string>("");
  const [cameraAtiva, setCameraAtiva] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"encomenda" | "pacote" | null>(null);
  const [modalCodigo, setModalCodigo] = useState<string>("");

//   const navigate = useNavigate();

  useEffect(() => {
    if (!videoRef || !cameraAtiva) return;

    const scanner = new QrScanner(
      videoRef,
      (result) => {
        console.log("Código lido:", result);
        const codigo = result.data;
        setCodigoLido(codigo);
        setCameraAtiva(false);
        processarCodigo(codigo);
      },
      {
        highlightScanRegion: true,
        preferredCamera: "environment",
      }
    );

    scanner.start();

    return () => {
      scanner.stop();
    };
  }, [videoRef, cameraAtiva]);

  const processarCodigo = async (codigo: string) => {
    if (codigo.startsWith("E-")) {
      setModalTipo("encomenda");
      setModalCodigo(codigo);
      setModalAberto(true);
    } else if (codigo.startsWith("P-")) {
      setModalTipo("pacote");
      setModalCodigo(codigo);
      setModalAberto(true);
    } else {
      alert("Código inválido");
      setCameraAtiva(true);
    }
  };

  const atualizarStatus = async (status: string) => {
    if (modalTipo === "encomenda" && isEncomendaStatus(status)) {
      const id = Number(modalCodigo.replace("E-", ""));
      const encomenda = await encomendaService.buscarPorId(id);

      // Atualizar status da encomenda e pacotes se necessário
      encomenda.status = status;
      if (status === "em preparação" || status === "em transito") {
        encomenda.pacotes = encomenda.pacotes.map((p) => ({
          ...p,
          status,
        }));
      } else if (status === "cancelada") {
        encomenda.pacotes = encomenda.pacotes.map((p) =>
          p.status !== "entregue" ? { ...p, status: "cancelada" } : p
        );
      }

      await encomendaService.atualizar(encomenda);
      alert("Status da encomenda atualizado com sucesso.");
    }

    if (modalTipo === "pacote" && isPacoteStatus(status)) {
      const pacoteId = Number(modalCodigo.replace("P-", ""));
      const todas = await encomendaService.listar();
      const encomenda = todas.find((e) =>
        e.pacotes.some((p) => p.id === pacoteId)
      );
      if (!encomenda) return;

      encomenda.pacotes = encomenda.pacotes.map((p) =>
        p.id === pacoteId ? { ...p, status } : p
      );

      await encomendaService.atualizar(encomenda);
      alert("Status do pacote atualizado com sucesso.");
    }

    // Resetar estado
    setModalAberto(false);
    setModalTipo(null);
    setModalCodigo("");
    setCodigoLido("");
    setCameraAtiva(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold">Leitor de Códigos</h1>

        {cameraAtiva ? (
          <video
            ref={setVideoRef}
            className="w-full max-w-md rounded shadow border"
          />
        ) : (
          <div>
            <p className="text-green-600 font-semibold">
              Código lido: {codigoLido}
            </p>
            <button
              onClick={() => {
                setCodigoLido("");
                setCameraAtiva(true);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ler outro código
            </button>
          </div>
        )}
      </main>

      <ConfirmacaoCheckinModal
        aberto={modalAberto}
        tipo={modalTipo || "encomenda"}
        codigo={modalCodigo}
        onFechar={() => {
          setModalAberto(false);
          setCameraAtiva(true);
        }}
        onConfirmar={atualizarStatus}
      />
    </div>
  );
}

export default Leitor;
