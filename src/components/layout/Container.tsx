export default function ContainerCRM({
  children,
  enablePading = true,
}: {
  children: React.ReactNode;
  enablePading?: boolean;
}) {
  return (
    <div
      className={`mx-auto bg-gray-200 h-screen overflow-y-auto   ${
        enablePading ? "mt-14 p-16" : ""
      } `}
    >
      {children}
    </div>
  );
}
