import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";

const faqItems = [
  {
    question: "List item",
    answer: "Supporting line text lorem ipsum dolor sit amet, consectetur.",
  },
  {
    question: "List item",
    answer: "Supporting line text lorem ipsum dolor sit amet, consectetur.",
  },
  {
    question: "List item",
    answer: "Supporting line text lorem ipsum dolor sit amet, consectetur.",
  },
];

const FrequentlyQuestion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-6 px-6 bg-white">
      <h2 className="text-center text-lg font-bold font-primary text-black mb-8">
        Frequently asked questions
      </h2>

      <div className="max-w-7xl mx-auto space-y-4">
        {faqItems.map((item, index) => {
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
                  <p className="text-sm font-secondary text-black/80">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FrequentlyQuestion;
