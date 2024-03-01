import LoginChecker from "./LoginChecker";

export default function ContainerCRM({
  children,
  enablePading = true,
}: {
  children: React.ReactNode;
  enablePading?: boolean;
}) {
  return (
    <div
      className={`bg-gray-100 h-screen overflow-y-auto ${
        enablePading ? "mt-14 p-16" : ""
      } `}
    >
      {children}
    </div>
  );
}
