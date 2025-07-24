export function Logo({ size = 36, className = '' }) {
  return (
    <img
      src="/logo.svg"
      alt="Lunarswap Logo"
      width={size}
      height={size}
      className={className}
    />
  );
}
