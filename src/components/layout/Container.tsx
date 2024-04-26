export default function Container({
  children,
  enablePading = true,
}: {
  children: React.ReactNode;
  enablePading?: boolean;
}) {
  return (
    <div
      className={`bg-gray-100 h-screen overflow-y-auto ${
        enablePading ? "px-8 pt-28" : ""
      } `}
    >
      {children}
    </div>
  );
}
