interface SettingsSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export default function SettingsSelect({
  label,
  value,
  onChange,
  options,
}: SettingsSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/50">{label}</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 p-3 outline-none [&>option]:bg-black"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
