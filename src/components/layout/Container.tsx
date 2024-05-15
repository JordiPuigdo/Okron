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
    <div
      className={`bg-gray-100 h-screen overflow-y-auto pb-12 ${
        enablePading ? "px-2 pt-24" : ""
      } `}
    >
      {children}
    </div>
  );
}
