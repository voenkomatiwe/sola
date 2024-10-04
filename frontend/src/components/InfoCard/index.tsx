export const InfoCard = ({
  title,
  value,
  icon,
  className,
}: {
  title: string;
  value: string;
  icon: JSX.Element;
  className?: string;
}) => {
  return (
    <div
      className={`p-6 rounded-xl flex flex-row border bg-card text-card-foreground items-center justify-between shadow ${className}`}
    >
      <div className="flex flex-col justify-between space-y-0">
        <div className="text-2xl text-slate-700">{value}</div>
        <h4 className="text-slate-400 tracking-tight text-sm">{title}</h4>
      </div>
      {icon}
    </div>
  );
};
