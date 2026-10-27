interface ToggleProps {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export default function Toggle({ on, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="flex items-center gap-3"
      aria-pressed={on}
    >
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-all duration-300 ${
          on ? 'border-gold/60 bg-gold/20' : 'border-ink-border bg-black/60'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full transition-all duration-300 ${
            on ? 'translate-x-6 bg-gold shadow-gold' : 'translate-x-1 bg-neutral-600'
          }`}
        />
      </span>
      {label && <span className="text-sm text-neutral-300">{label}</span>}
    </button>
  );
}
