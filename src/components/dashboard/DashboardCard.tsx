import type { ReactNode } from "react";

const DashboardCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative glass-card rounded-2xl h-full border border-primary strong-shadow">
      {children}
    </div>
  </div>
);

export default DashboardCard;