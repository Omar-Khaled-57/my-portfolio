import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

const DashboardInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  hint,
  dir,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  hint?: string;
  dir?: string;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs text-accent-primary uppercase tracking-wider font-semibold">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      dir={dir}
      className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all"
    />
    {hint && <p className="text-[11px] text-secondary/70 leading-snug">{hint}</p>}
  </div>
);

export default DashboardInput;