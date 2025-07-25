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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    const divisor = Math.pow(10, decimalPlaces);
    const formatted = (parseInt(onlyDigits || "0.0", 10) / divisor).toFixed(decimalPlaces);
    onChange(formatted);
  };

  const formatDisplay = (val: string) => {
    const num = parseFloat(val.replace(",", "."));
    return isNaN(num) ? "0.0" : num.toFixed(decimalPlaces);
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
        ref={inputRef}
        id={id}
        type="text"
        inputMode="decimal"
        pattern="[0-9]*"
        value={formatDisplay(value)}
        onChange={handleChange}
        className={`p-2 border rounded w-full ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}
