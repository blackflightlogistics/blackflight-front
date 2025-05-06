import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import QrScanner from "qr-scanner";
import { orderService } from "../../services/encomendaService";
import ConfirmacaoCheckinModal from "../../components/admin/ConfirmacaoCheckinModal";
import { isEncomendaStatus, isPacoteStatus } from "../../utils/utils";
import { useLanguage } from "../../context/useLanguage";

function Leitor() {
  const { translations: t } = useLanguage();
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [codigoLido, setCodigoLido] = useState<string>("");
  const [cameraAtiva, setCameraAtiva] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"encomenda" | "pacote" | null>(null);
  const [modalCodigo, setModalCodigo] = useState<string>("");
  const [sidebarAberta, setSidebarAberta] = useState(false);

  useEffect(() => {
    if (!videoRef || !cameraAtiva) return;

    const scanner = new QrScanner(
      videoRef,
      (result) => {
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
      alert(t.alerta_codigo_invalido);
      setCameraAtiva(true);
    }
  };

  const atualizarStatus = async (status: string) => {
    if (modalTipo === "encomenda" && isEncomendaStatus(status)) {
      const id = modalCodigo.replace("E-", "");
      const encomenda = await orderService.buscarPorId(id);

      encomenda.status = status;
      if (status === "em_preparacao" || status === "em_transito") {
        encomenda.packages = encomenda.packages.map((p) => ({
          ...p,
          status,
        }));
      } else if (status === "cancelada") {
        encomenda.packages = encomenda.packages.map((p) =>
          p.status !== "entregue" ? { ...p, status: "cancelada" } : p
        );
      }

      // await orderService.atualizar(encomenda);
      alert(t.status_encomenda_atualizado);
    }

    if (modalTipo === "pacote" && isPacoteStatus(status)) {
      const pacoteId = modalCodigo.replace("P-", "");
      const todas = await orderService.listar();
      const encomenda = todas.find((e) =>
        e.packages.some((p) => p.id === pacoteId)
      );
      if (!encomenda) return;

      encomenda.packages = encomenda.packages.map((p) =>
        p.id === pacoteId ? { ...p, status } : p
      );

      // await orderService.atualizar(encomenda);
      alert(t.status_pacote_atualizado);
    }

    setModalAberto(false);
    setModalTipo(null);
    setModalCodigo("");
    setCodigoLido("");
    setCameraAtiva(true);
  };

  return (
    <div className="flex h-screen">
      <div className="md:top-0 md:left-0 md:h-screen md:w-64 bg-black text-white z-10">
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
      <main className="flex-1 p-4 space-y-6 pt-16 overflow-y-auto">
        <h1 className="text-2xl font-bold">{t.leitor_titulo}</h1>

        {cameraAtiva ? (
          <video
            ref={setVideoRef}
            className="w-full max-w-md rounded shadow border"
          />
        ) : (
          <div>
            <p className="text-green-600 font-semibold">
              {t.codigo_lido}: {codigoLido}
            </p>
            <button
              onClick={() => {
                setCodigoLido("");
                setCameraAtiva(true);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t.ler_outro_codigo}
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
