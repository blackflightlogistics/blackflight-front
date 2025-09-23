// src/utils/formatarLinkWhatsapp.tsx
import { JSX } from "react";
import { FaWhatsapp } from "react-icons/fa";

type Options = {
  icon?: boolean;
};

export function formatarLinkWhatsapp(
  numero: string,
  isGreen?: boolean,
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
      className={`${
        isGreen ? "text-green-600" : "text-white"
      } inline-flex items-center gap-2`}
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
        remetente: `🟡 Commande en cours de préparation Bonjour, Nous vous informons que votre commande, identifiée par le code de suivi ${trackingCode}, est actuellement en cours de préparation et sera expédiée dans les plus brefs délais. 📦 Vous pouvez suivre son avancement à tout moment en visitant notre site : 👉 www.blackflightlogistics.com 📲 Pour ne rien manquer de nos départs, actualités, offres et nouveautés, enregistrez notre numéro dès maintenant en cliquant ici : 👉 https://wa.me/33628258414 Nous restons à votre disposition pour toute question ou information complémentaire. Cordialement, Black Flight Logistics`,
        destinatario: `🟡 Commande en cours de préparation Bonjour, Nous vous informons que votre commande, identifiée par le code de suivi ${trackingCode}, est actuellement en cours de préparation et sera expédiée dans les plus brefs délais. 📦 Vous pouvez suivre son avancement à tout moment en visitant notre site : 👉 www.blackflightlogistics.com 📲 Pour ne rien manquer de nos départs, actualités, offres et nouveautés, enregistrez notre numéro dès maintenant en cliquant ici : 👉 https://wa.me/33628258414 Nous restons à votre disposition pour toute question ou information complémentaire. Cordialement, Black Flight Logistics`,
      },
      em_transito: {
        remetente: `🚚 Commande en route Bonjour, Votre commande, identifiée par le code de suivi  ${trackingCode}, est en route. 🚚 📦 Vous pouvez suivre son avancement à tout moment en visitant notre site : 👉 www.blackflightlogistics.com 📲 Pour ne rien manquer de nos départs, actualités, offres et nouveautés, enregistrez notre numéro dès maintenant en cliquant ici : 👉 https://wa.me/33628258414 Nous restons à votre disposition pour toute question ou information complémentaire. Cordialement, Black Flight Logistics`,
        destinatario: `🚚 Commande en route Bonjour, Votre commande, identifiée par le code de suivi  ${trackingCode}, est en route. 🚚 📦 Vous pouvez suivre son avancement à tout moment en visitant notre site : 👉 www.blackflightlogistics.com 📲 Pour ne rien manquer de nos départs, actualités, offres et nouveautés, enregistrez notre numéro dès maintenant en cliquant ici : 👉 https://wa.me/33628258414 Nous restons à votre disposition pour toute question ou information complémentaire. Cordialement, Black Flight Logistics`,
      },
      aguardando_retirada: {
        remetente: `📍 Commande prête à être retirée Bonjour, Votre commande, identifiée par le code de suivi ${trackingCode}, est prête à être retirée. ✅ Pour le retrait, merci de vous munir de : •	Une pièce d’identité en cours de validité •	Le code de sécurité : ${securityCode} 📍 Nos agences sont situées à : 🇫🇷 FRANCE – PARIS 11 Cité Riverin, 75010 Paris 🕒 Du lundi au samedi : 9h30 – 19h30 🇨🇲 CAMEROUN – DOUALA Feu Rouge Bessengue, en face de la Pharmacie Mondial, à l’Imprimerie NUMERIX 🕒 Du lundi au samedi : 10h00 – 16h30 🇨🇲 CAMEROUN – YAOUNDÉ Avenue Kennedy, au niveau du restaurant Le Challenge 📞 Une fois sur place, veuillez appeler Christine au +237 6 56 64 91 86 🕒 Du lundi au samedi : 10h00 – 16h30 📦 Vous pouvez suivre le statut de votre commande à tout moment en visitant notre site : 👉 www.blackflightlogistics.com 📲 Pour ne rien manquer de nos départs, actualités, offres et nouveautés, enregistrez notre numéro dès maintenant en cliquant ici : 👉 https://wa.me/33628258414 Nous restons à votre disposition pour toute question ou information complémentaire. Cordialement, Black Flight Logistics`,
        destinatario: `📍 Commande prête à être retirée Bonjour, Votre commande, identifiée par le code de suivi ${trackingCode}, est prête à être retirée. ✅ Pour le retrait, merci de vous munir de : •	Une pièce d’identité en cours de validité •	Le code de sécurité : ${securityCode} 📍 Nos agences sont situées à : 🇫🇷 FRANCE – PARIS 11 Cité Riverin, 75010 Paris 🕒 Du lundi au samedi : 9h30 – 19h30 🇨🇲 CAMEROUN – DOUALA Feu Rouge Bessengue, en face de la Pharmacie Mondial, à l’Imprimerie NUMERIX 🕒 Du lundi au samedi : 10h00 – 16h30 🇨🇲 CAMEROUN – YAOUNDÉ Avenue Kennedy, au niveau du restaurant Le Challenge 📞 Une fois sur place, veuillez appeler Christine au +237 6 56 64 91 86 🕒 Du lundi au samedi : 10h00 – 16h30 📦 Vous pouvez suivre le statut de votre commande à tout moment en visitant notre site : 👉 www.blackflightlogistics.com 📲 Pour ne rien manquer de nos départs, actualités, offres et nouveautés, enregistrez notre numéro dès maintenant en cliquant ici : 👉 https://wa.me/33628258414 Nous restons à votre disposition pour toute question ou information complémentaire. Cordialement, Black Flight Logistics`,
      },
      cancelada: {
        remetente: `⏳ Commande en attente de retrait Bonjour, Votre commande, identifiée par le code de suivi ${trackingCode}, est en attente de retrait à notre adresse. 📦 Vous pouvez suivre son avancement à tout moment en visitant notre site : 👉 www.blackflightlogistics.com 📲 Pour ne rien manquer de nos départs, actualités, offres et nouveautés, enregistrez notre numéro dès maintenant en cliquant ici : 👉 https://wa.me/33628258414 Nous restons à votre disposition pour toute question ou information complémentaire. Cordialement, Black Flight Logistics`,
        destinatario: `⏳ Commande en attente de retrait Bonjour, Votre commande, identifiée par le code de suivi ${trackingCode}, est en attente de retrait à notre adresse. 📦 Vous pouvez suivre son avancement à tout moment en visitant notre site : 👉 www.blackflightlogistics.com 📲 Pour ne rien manquer de nos départs, actualités, offres et nouveautés, enregistrez notre numéro dès maintenant en cliquant ici : 👉 https://wa.me/33628258414 Nous restons à votre disposition pour toute question ou information complémentaire. Cordialement, Black Flight Logistics`,
      },
      entregue: {
        remetente: `✅ Commande livrée avec succès 🎉 Bonjour ! Votre commande, identifiée par le code de suivi O138970762, a été livrée avec succès. 📦✨ Un grand merci pour votre fidélité et la confiance que vous nous accordez 🙏💙 C’est toujours un plaisir de vous servir ! 📲 Pour ne rien manquer de nos départs, actualités, offres et nouveautés, enregistrez notre numéro dès maintenant en cliquant ici : 👉 https://wa.me/33628258414 À très bientôt, Black Flight Logistics ✈️🚀`,
        destinatario: `✅ Commande livrée avec succès 🎉 Bonjour ! Votre commande, identifiée par le code de suivi O138970762, a été livrée avec succès. 📦✨ Un grand merci pour votre fidélité et la confiance que vous nous accordez 🙏💙 C’est toujours un plaisir de vous servir ! 📲 Pour ne rien manquer de nos départs, actualités, offres et nouveautés, enregistrez notre numéro dès maintenant en cliquant ici : 👉 https://wa.me/33628258414 À très bientôt, Black Flight Logistics ✈️🚀`,
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
