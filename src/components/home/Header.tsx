import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLanguage } from "../../context/useLanguage";
import { formatarLinkWhatsapp } from "../../utils/formatarLinkWhatsapp";

const  Header = () => {
  const { translations } = useLanguage();

  return (
    <>
      <div className="flex    items-center justify-between  bg-orange pl-[2rem]  pr-[2rem]">
        <div className="flex mt-1 mb-1  gap-2 items-center">
          <FaWhatsapp className="text-white"  onClick={()=> window.open("https://wa.me/237691204393", "_blank")}/>
          <p className="hidden sm:block font-base text-base font-normal text-white" >
           {formatarLinkWhatsapp("+237 69 12 043 93")}
          </p>
          <img
            src="/email.svg"
            alt="logo"
            className="w-[1rem] h-[1rem]"
          />
          <p className="hidden sm:block font-base text-base font-normal text-white" onClick={()=>{
              navigator.clipboard.writeText("contato@blackflight.com.br")
            toast.success(translations.copied_to_clipboard)

          }}>
            contato@blackflight.com.br
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <img
            src="/instagram.svg"
            alt="github"
            className="w-[1rem] h-[1rem]"
          />
          <img
            src="/facebook.svg"
            alt="github"
            className="w-[1rem] h-[1rem] cursor-pointer"
            onClick={() => window.open("https://www.facebook.com/p/Black-Flight-Logistics-61575183301827", "_blank")}
          />
          {/* <img
            src="/linkedin.svg"
            alt="github"
            className="w-[1rem] h-[1rem]"
          /> */}
        </div>
      </div>
    </>
  );
};

export default Header;
