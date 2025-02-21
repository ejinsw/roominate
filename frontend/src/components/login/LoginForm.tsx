"use client";

interface FormInputInterface {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function LoginForm({ id, label, type, value, onChange, required = false }: FormInputInterface) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#2774AE]">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 shadow-sm 
        focus:border-[#2774AE]
        hover:border-[#407ead]"
        required={required}
      />
    </div>
  );
}