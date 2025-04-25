const Header = () => {
  return (
    <>
      <div className="flex    items-center justify-between  bg-orange pl-[2rem]  pr-[2rem]">
        <div className="flex mt-1 mb-1  gap-2 items-center">
          <img
            src="phone.svg"
            alt="logo"
            className="w-[1rem] h-[1rem]"
          />
          <p className="font-base text-base font-normal text-white">
            (11) 4567-8900
          </p>
          <img
            src="email.svg"
            alt="logo"
            className="w-[1rem] h-[1rem]"
          />
          <p className="font-base text-base font-normal text-white">
            contato@blackflight.com.br
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <img
            src="instagram.svg"
            alt="github"
            className="w-[1rem] h-[1rem]"
          />
          <img
            src="facebook.svg"
            alt="github"
            className="w-[1rem] h-[1rem]"
          />
          <img
            src="linkedin.svg"
            alt="github"
            className="w-[1rem] h-[1rem]"
          />
        </div>
      </div>
    </>
  );
};

export default Header;
