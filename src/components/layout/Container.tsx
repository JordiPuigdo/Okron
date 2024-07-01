export default function Container({
  children,
  enablePading = true,
  className,
}: {
  children: React.ReactNode;
  enablePading?: boolean;
  className?: string;
}) {
  return <div>{children}</div>;
}
