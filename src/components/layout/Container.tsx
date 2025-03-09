export default function Container({
  children,
  className = '',
}: {
  children: React.ReactNode;
  enablePading?: boolean;
  className?: string;
}) {
  return (
    <div className={`pt-20 mx-6 w-full h-full ${className}`}>{children}</div>
  );
}
