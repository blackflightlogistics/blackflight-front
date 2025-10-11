import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLanguage } from "../../context/useLanguage";
import { gerarMensagemWhatsappPorStatus } from "../../utils/formatarLinkWhatsapp";
import { Order } from "../../services/encomendaService";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  encomenda: Order | null;
}

const AvisoClienteModal = ({ aberto, onFechar, encomenda }: Props) => {
  const { translations: t } = useLanguage();

  if (!encomenda) return null;

  const msgRemetente = gerarMensagemWhatsappPorStatus(
    encomenda.status || "",
    "remetente",
    encomenda.tracking_code || "",
    encomenda.security_code || "",
  );

  const msgDestinatario = gerarMensagemWhatsappPorStatus(
    encomenda.status || "",
    "destinatario",
    encomenda.tracking_code || "",
    encomenda.security_code || "",
  );

  const numeroRemetente = encomenda.from_account.phone_number;
  const numeroDestinatario = encomenda.to_account.phone_number;

  const linkRemetente = `https://api.whatsapp.com/send?phone=${numeroRemetente}&text=${encodeURIComponent(msgRemetente)}`;
  const linkDestinatario = `https://api.whatsapp.com/send?phone=${numeroDestinatario}&text=${encodeURIComponent(msgDestinatario)}`;

  return (
    <Dialog open={aberto} onClose={onFechar} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {t.aviso_clientes_titulo || "Avise os clientes da alteração"}
        <IconButton onClick={onFechar} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <p>{t.aviso_clientes_texto || "Escolha quem você deseja notificar sobre a alteração de status:"}</p>
      </DialogContent>

      <DialogActions sx={{ display: "flex", justifyContent: "space-between", px: 2, pb: 2 }}>
        <Box sx={{ flex: 1, pr: 1 }}>
          <a
            href={linkRemetente}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              width: "100%",
              padding: "8px 16px",
              backgroundColor: "#FF8C00",
              color: "white",
              textAlign: "center",
              borderRadius: 4,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            {t.aviso_clientes_remetente || "Avisar Remetente"}
          </a>
        </Box>

        <Box sx={{ flex: 1, pl: 1 }}>
          <a
            href={linkDestinatario}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              width: "100%",
              padding: "8px 16px",
              backgroundColor: "#FF8C00",
              color: "white",
              textAlign: "center",
              borderRadius: 4,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            {t.aviso_clientes_destinatario || "Avisar Destinatário"}
          </a>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AvisoClienteModal;
