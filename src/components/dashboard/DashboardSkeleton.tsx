const DashboardSkeleton = ({ variant = "tool" }: { variant?: "tool" | "certificate" | "project" }) => {
  if (variant === "tool") {
    return (
      <div className="bg-secondary border border-primary rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/20 animate-pulse rounded-lg shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 bg-primary/20 animate-pulse rounded-md w-2/3" />
            <div className="h-4 w-10 bg-primary/20 animate-pulse rounded border shrink-0" />
          </div>
          <div className="h-2.5 bg-primary/20 animate-pulse rounded w-1/2" />
        </div>
        <div className="w-14 h-6 bg-primary/20 animate-pulse rounded-lg shrink-0" />
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