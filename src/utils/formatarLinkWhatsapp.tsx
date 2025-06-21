// src/utils/formatarLinkWhatsapp.tsx
import { JSX } from "react";
import { FaWhatsapp } from "react-icons/fa";

type Options = {
  icon?: boolean;
};

export function formatarLinkWhatsapp(
  numero: string,
  options?: Options
): JSX.Element | null {
  if (!numero) return null;

  const cleaned = numero.replace(/\D/g, "");

  if (cleaned.length < 10) return <span>{numero}</span>;

  // const possuiCodigoPais = cleaned.length > 11;

  const codigoPais = cleaned.slice(0, cleaned.length - 11);
  const ddd = cleaned.slice(-11, -9);
  const telefone = cleaned.slice(-9);

  const numeroFinal = `+${codigoPais}${ddd}${telefone}`;
  const url = `https://api.whatsapp.com/send/?phone=${encodeURIComponent(
    numeroFinal
  )}&text&type=phone_number&app_absent=0`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-600 inline-flex items-center gap-2"
    >
      {options?.icon && <FaWhatsapp />}
      {numero}
    </a>
  );
}
function gerarLinkWhatsapp(
  numero: string,
  mensagem: string,
  options?: Options
): JSX.Element | null {
  if (!numero) return null;

  const cleaned = numero.replace(/\D/g, "");
  if (cleaned.length < 10) return <span>{numero}</span>;

  const possuiCodigoPais = cleaned.length > 11;
  const codigoPais = possuiCodigoPais
    ? cleaned.slice(0, cleaned.length - 11)
    : "55";
  const ddd = cleaned.slice(-11, -9);
  const telefone = cleaned.slice(-9);

  const numeroFinal = `+${codigoPais}${ddd}${telefone}`;
  const url = `https://api.whatsapp.com/send/?phone=${encodeURIComponent(
    numeroFinal
  )}&text=${encodeURIComponent(mensagem)}&type=phone_number&app_absent=0`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-600 inline-flex items-center gap-2"
    >
      {options?.icon && <FaWhatsapp />}
      {`(${ddd}) ${telefone.slice(0, 5)}-${telefone.slice(5)}`}
    </a>
  );
}
export function whatsappRemetenteLink(
  numero: string,
  tracking_code: string
): JSX.Element | null {
  const mensagem = `Sua encomenda foi recebida. Seu código de rastreio é ${tracking_code}.`;
  return gerarLinkWhatsapp(numero, mensagem);
}
export function whatsappDestinatarioLink(
  numero: string,
  tracking_code: string,
  security_code: string
): JSX.Element | null {
  const mensagem = `Sua encomenda está a caminho. Seu código de rastreio é ${tracking_code}. Para retirar sua encomenda, tenha em mãos um documento com foto e o código de segurança ${security_code}.`;
  return gerarLinkWhatsapp(numero, mensagem);
}

export function gerarMensagemWhatsappPorStatus(
  status: string,
  destinatario: "remetente" | "destinatario",
  trackingCode: string,
  securityCode?: string
): string {
  const mensagens: Record<string, { remetente: string; destinatario: string }> =
    {
      em_preparacao: {
        remetente: `Votre commande avec le code de suivi ${trackingCode} est maintenant en préparation.`,
        destinatario: `Votre commande avec le code de suivi ${trackingCode} est en cours de préparation.`,
      },
      em_transito: {
        remetente: `Votre commande avec le code de suivi ${trackingCode} a été expédiée.`,
        destinatario: `Votre commande avec le code de suivi ${trackingCode} est en route.`,
      },
      aguardando_retirada: {
        remetente: `Votre commande avec le code de suivi ${trackingCode} est en attente de retrait à notre adresse.`,
        destinatario: `Votre commande avec le code de suivi ${trackingCode} est prête à être retirée. Veuillez apporter une pièce d'identité et le code de sécurité ${securityCode}.`,
      },
      cancelada: {
        remetente: `Votre commande avec le code de suivi ${trackingCode} a été annulée.`,
        destinatario: `Nous sommes désolés de vous informer que votre commande avec le code de suivi ${trackingCode} a été annulée.`,
      },
      entregue: {
        remetente: `Votre commande avec le code de suivi ${trackingCode} a été livrée avec succès.`,
        destinatario: `Votre commande avec le code de suivi ${trackingCode} a été livrée. Merci pour votre confiance !`,
      },
    };

  const template = mensagens[status];

  if (!template) {
    return `Your order with tracking code ${trackingCode} has been updated.`;
  }

  return destinatario === "remetente"
    ? template.remetente
    : template.destinatario;
}
