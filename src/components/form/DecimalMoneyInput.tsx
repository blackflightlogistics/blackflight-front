import { useRef } from "react";

interface DecimalMoneyInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  decimalPlaces?: number;
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
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDisplay = (val: string) => {
    const trimmed = (val ?? "").trim();
    if (trimmed === "") return "";
    const num = parseFloat(trimmed.replace(",", "."));
    return isNaN(num) ? "" : num.toFixed(decimalPlaces);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    if (onlyDigits === "") {
      onChange("");
      return;
    }
    const divisor = Math.pow(10, decimalPlaces);
    const formatted = (parseInt(onlyDigits, 10) / divisor).toFixed(decimalPlaces);
    onChange(formatted);
  };

  const displayValue = formatDisplay(value);

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
        ref={inputRef}
        id={id}
        type="text"
        inputMode="decimal"
        pattern="[0-9]*"
        value={displayValue}
        onChange={handleChange}
        className={`p-2 border rounded w-full ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}
