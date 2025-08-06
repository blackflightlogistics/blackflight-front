import { useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useLanguage } from "../../context/useLanguage";

const FrequentlyQuestion = () => {
  const { translations } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Criar array de 15 perguntas usando as traduções
  const faqItems = Array.from({ length: 15 }, (_, index) => ({
    question: translations[`faq_question_${index + 1}` as keyof typeof translations] as string,
    answer: translations[`faq_answer_${index + 1}` as keyof typeof translations] as string,
  }));

  // Mostrar apenas as primeiras 3 perguntas se showAll for false
  const visibleFaqItems = showAll ? faqItems : faqItems.slice(0, 3);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
    // Fechar qualquer pergunta aberta ao expandir/recolher
    setOpenIndex(null);
  };

  return (
    <section id="faq" className="py-6 px-6 bg-white">
      <h2 className="text-center text-lg font-bold font-primary text-black mb-8">
        {translations.faq_title}
      </h2>

      <div className="max-w-7xl mx-auto space-y-4">
        {visibleFaqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="bg-orangeBorder rounded-md overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-left p-4 flex items-center justify-between"
              >
                <span className="text-sm font-normal font-primary text-black">{item.question}</span>
                <FaChevronRight
                  className={`text-black opacity-70 transform transition-transform duration-300 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  <p className="text-sm font-secondary text-black/80 whitespace-pre-line">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Botão para mostrar mais/menos perguntas */}
        <div className="flex justify-center mt-6">
          <button
            onClick={toggleShowAll}
            className="flex items-center gap-2 px-6 py-3 bg-orange hover:bg-orange/90 text-white font-medium rounded-lg transition-colors duration-300"
          >
            <span className="text-sm font-primary">
              {showAll ? translations.faq_show_less : translations.faq_show_more}
            </span>
            <FaChevronDown
              className={`text-white transform transition-transform duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FrequentlyQuestion;
