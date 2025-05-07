// src/components/form/DecimalMoneyInput.tsx
import { useState, useEffect } from "react";

interface DecimalMoneyInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  decimalPlaces?: number; // 1 para peso, 2 para dinheiro
}

export default function DecimalMoneyInput({
  value,
  onChange,
  label,
  id = "decimalInput",
  placeholder = "0.00",
  className = "",
  decimalPlaces = 2,
}: DecimalMoneyInputProps) {
  const [raw, setRaw] = useState("");

  useEffect(() => {
    const cleaned = value.replace(/\D/g, "");
    setRaw(cleaned);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    setRaw(onlyDigits);
    onChange(formatValue(onlyDigits));
  };

  const formatValue = (digits: string) => {
    const divisor = Math.pow(10, decimalPlaces);
    const num = (parseInt(digits || "0", 10) / divisor).toFixed(decimalPlaces);
    return num;
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="\d*"
        value={raw === "" ? "" : formatValue(raw)} // ⬅️ Aqui está a mudança
        onChange={handleChange}
        className={`p-2 border rounded w-full ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}
