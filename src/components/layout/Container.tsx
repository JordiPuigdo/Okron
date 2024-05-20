export default function Container({
  children,
  enablePading = true,
  className,
}: {
  children: React.ReactNode;
  enablePading?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-gray-100 h-screen overflow-y-auto p-8 py-24`}>
      {children}
    </div>
  );
}
