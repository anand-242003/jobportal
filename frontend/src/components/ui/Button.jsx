export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}) {
  const baseStyles = 'px-8 py-3.5 text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-yellow text-black border-2 border-black hover:bg-black hover:text-white',
    secondary: 'bg-white text-black border-2 border-black hover:bg-black hover:text-white',
    tertiary: 'bg-black text-white border-2 border-black hover:bg-white hover:text-black',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
