export default function Container({
  children,
}: {
  children: React.ReactNode;
  enablePading?: boolean;
  className?: string;
}) {
  return (
    <div className="pt-12">
      <div className="p-6 gap-2">
        <div>{children}</div>
      </div>
    </div>
  );
}
