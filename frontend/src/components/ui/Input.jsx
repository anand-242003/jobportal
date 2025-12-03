export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm uppercase tracking-wider font-bold mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-4 bg-white border-2 border-black text-base focus:border-yellow focus:outline-none placeholder:text-gray-400 ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-black mt-1 block font-bold">{error}</span>}
    </div>
  );
}
