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
    <div className="pt-16">
      <div className="p-6 gap-2">
        <div className="p-2">
          <p>Menu - WorkOrders</p>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
