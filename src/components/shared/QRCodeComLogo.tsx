import { QRCodeSVG } from "qrcode.react";

interface Props {
  value: string;
  size?: number;
  logo?: string;
}

const QRCodeComLogo = ({ value, size = 128, logo = "/minimal_logo_black.svg" }: Props) => {
  return (
    <div className="relative w-[128px] h-[128px]">
      <QRCodeSVG
        value={value}
        size={size}
        level="H"
        bgColor="#ffffff"
        fgColor="#000000"
        className="w-full h-full"
      />
      <img
        src={logo}
        alt="Logo"
        className="absolute top-1/2 left-1/2 w-10 h-10 transform -translate-x-1/2 -translate-y-1/2  bg-white p-1 shadow"
      />
    </div>
  );
};

export default QRCodeComLogo;
