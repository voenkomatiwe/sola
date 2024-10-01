export const InfoCard = ({
  title,
  icon,
  value,
  className,
}: {
  title: string;
  icon: JSX.Element;
  value: string;
  className?: string;
}) => {
  return (
    <div
      className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}
    >
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
};
