const DashboardSkeleton = ({ variant = "tool" }) => {
  if (variant === "tool") {
    return (
      <div className="bg-secondary border border-primary rounded-2xl p-4 flex flex-col gap-3">
        <div className="w-20 h-20 mx-auto bg-primary/20 animate-pulse rounded-xl" />
        <div className="h-4 bg-primary/20 animate-pulse rounded-lg w-2/3 mx-auto" />
        <div className="h-5 w-16 bg-primary/20 animate-pulse rounded-full mx-auto" />
      </div>
    );
  }
  if (variant === "certificate") {
    return (
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-10" />
        <div className="relative bg-secondary border border-primary rounded-2xl overflow-hidden">
          <div className="w-full aspect-[16/11.5] bg-primary/20 animate-pulse" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-secondary border border-primary rounded-2xl p-4 flex flex-col gap-3">
      <div className="w-full aspect-[16/8] bg-primary/20 animate-pulse rounded-xl" />
      <div className="h-4 bg-primary/20 animate-pulse rounded-lg w-3/4" />
      <div className="h-3 bg-primary/20 animate-pulse rounded-lg w-full" />
      <div className="flex gap-1.5 mt-1">
        <div className="h-5 w-16 bg-primary/20 animate-pulse rounded-full" />
        <div className="h-5 w-12 bg-primary/20 animate-pulse rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-primary mt-auto">
        <div className="w-24 h-7 bg-primary/20 animate-pulse rounded-lg" />
        <div className="w-32 h-7 bg-primary/20 animate-pulse rounded-lg" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;