"use client";

interface FormSelectMultipleInterface {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    required?: boolean;
  }
  
  export function LoginFormMultiple({ id, label, value, onChange, options, required = false }: FormSelectMultipleInterface) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-semibold text-[#2774AE]">
          {label}
        </label>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 shadow-sm 
          focus:border-[#2774AE]
          hover:border-[#407ead]"
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }