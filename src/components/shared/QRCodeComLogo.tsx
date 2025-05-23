import QRCode from "qrcode";

export async function gerarQrBase64PNG(valor: string): Promise<string> {
  try {
    return await QRCode.toDataURL(valor, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Erro ao gerar QR Code:", err);
    return "";
  }
}
