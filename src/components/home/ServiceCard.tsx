interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
  }
  
  const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
    return (
      <div className="bg-[#FFF9F5] rounded-xl border border-orangeBorder p-6 text-left shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-center w-12 h-12 bg-orange/10 rounded-full mb-4">
          <div className="text-orange text-xl">{icon}</div>
        </div>
        <h3 className="font-bold font-primary text-black text-base mb-2">{title}</h3>
        <p className="font-secondary text-sm font-normal text-black/80 leading-snug">{description}</p>
      </div>
    );
  };
  
  export default ServiceCard;
  