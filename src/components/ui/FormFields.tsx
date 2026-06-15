interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  min?: string;
  max?: string;
  readOnly?: boolean;
  autoComplete?: string;
}

export function FormInput({
  id,
  label,
  type = "text",
  value = "",
  onChange,
  error,
  required,
  min,
  max,
  readOnly,
  autoComplete,
}: FormInputProps) {
  const hasValue = (value || "").trim().length > 0;

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={type === "date" ? undefined : " "}
          min={min}
          max={max}
          readOnly={readOnly}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-required={required}
          className={`peer w-full rounded-xl border bg-white px-4 text-charcoal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400/40 ${
            type === "date" ? "pt-7 pb-2" : "pt-6 pb-2"
          } placeholder-shown:pt-6 placeholder-shown:pb-2 ${
            readOnly ? "bg-cream/60 cursor-not-allowed" : ""
          } ${
            error
              ? "border-red-400 focus:border-red-400"
              : "border-gold-200/80 focus:border-gold-400"
          }`}
        />
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-300 pointer-events-none ${
            type === "date" || hasValue
              ? "top-2 text-xs text-gold-600 font-medium"
              : "top-1/2 -translate-y-1/2 text-warm-gray peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gold-600 peer-focus:font-medium"
          }`}
        >
          {label}
          {required ? " *" : ""}
        </label>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormSelectProps {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: readonly string[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormSelect({
  id,
  label,
  value = "",
  onChange,
  options,
  error,
  required,
  placeholder = "Select an option",
}: FormSelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gold-600 mb-2">
        {label}
        {required ? " *" : ""}
      </label>
      <select
        id={id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-required={required}
        className={`w-full rounded-xl border bg-white px-4 py-3.5 text-charcoal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400/40 ${
          error
            ? "border-red-400 focus:border-red-400"
            : "border-gold-200/80 focus:border-gold-400"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormTextareaProps {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  rows?: number;
}

export function FormTextarea({
  id,
  label,
  value = "",
  onChange,
  error,
  required,
  rows = 4,
}: FormTextareaProps) {
  return (
    <div>
      <div className="relative">
        <textarea
          id={id}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          rows={rows}
          aria-invalid={!!error}
          aria-required={required}
          className={`peer w-full rounded-xl border bg-white px-4 pt-6 pb-2 text-charcoal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400 resize-none ${
            error
              ? "border-red-400 focus:border-red-400"
              : "border-gold-200/80"
          }`}
        />
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-300 pointer-events-none ${
            (value || "").trim()
              ? "top-2 text-xs text-gold-600 font-medium"
              : "top-4 text-warm-gray peer-focus:top-2 peer-focus:text-xs peer-focus:text-gold-600 peer-focus:font-medium"
          }`}
        >
          {label}
          {required ? " *" : ""}
        </label>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormRadioGroupProps {
  name: string;
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  error?: string;
  required?: boolean;
}

export function FormRadioGroup({
  name,
  label,
  value = "",
  onChange,
  options,
  error,
  required,
}: FormRadioGroupProps) {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gold-600 mb-3">
        {label}
        {required ? " *" : ""}
      </legend>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm cursor-pointer transition-all duration-300 ${
              value === option.value
                ? "border-gold-400 bg-gold-50 text-gold-800"
                : "border-gold-200/80 bg-white text-charcoal hover:border-gold-300"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

interface FormFileUploadProps {
  id: string;
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  required?: boolean;
  hint?: string;
}

export function FormFileUpload({
  id,
  label,
  accept,
  file,
  onChange,
  error,
  required,
  hint,
}: FormFileUploadProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gold-600 mb-2">
        {label}
        {required ? " *" : ""}
      </label>
      <div
        className={`rounded-xl border-2 border-dashed bg-white p-6 transition-all duration-300 ${
          error
            ? "border-red-400"
            : "border-gold-200/80 hover:border-gold-400"
        }`}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          aria-invalid={!!error}
          aria-required={required}
          className="w-full text-sm text-warm-gray file:mr-4 file:rounded-full file:border-0 file:bg-gold-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gold-700 hover:file:bg-gold-100"
        />
        {file && (
          <p className="mt-3 text-sm text-charcoal">
            Selected: <span className="font-medium">{file.name}</span> (
            {(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
        {hint && <p className="mt-2 text-xs text-warm-gray">{hint}</p>}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormCheckboxGroupProps {
  label: string;
  values?: string[]; // ← was required, now optional
  onChange: (values: string[]) => void;
  options: readonly string[];
}

export function FormCheckboxGroup({
  label,
  values = [], // ← add default empty array
  onChange,
  options,
}: FormCheckboxGroupProps) {
  const toggle = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gold-600 mb-3">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm cursor-pointer transition-all duration-300 ${
              values.includes(option)
                ? "border-gold-400 bg-gold-50 text-gold-800"
                : "border-gold-200/80 bg-white text-charcoal hover:border-gold-300"
            }`}
          >
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={() => toggle(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}