import { FaWhatsapp } from "react-icons/fa";

const  Header = () => {
  return (
    <>
      <div className="flex    items-center justify-between  bg-orange pl-[2rem]  pr-[2rem]">
        <div className="flex mt-1 mb-1  gap-2 items-center">
          <FaWhatsapp className="text-white" />
          <p className="hidden sm:block font-base text-base font-normal text-white">
            +237 69 12 043 93
          </p>
          <img
            src="/email.svg"
            alt="logo"
            className="w-[1rem] h-[1rem]"
          />
          <p className="hidden sm:block font-base text-base font-normal text-white">
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
            className="w-[1rem] h-[1rem]"
          />
          <img
            src="/linkedin.svg"
            alt="github"
            className="w-[1rem] h-[1rem]"
          />
        </div>
      </div>
    </>
  );
};

export default Header;
