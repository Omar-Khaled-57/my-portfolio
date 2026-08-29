import { X } from "lucide-react";

const DashboardModal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div
      className="relative z-10 w-full max-w-2xl flex flex-col"
      style={{ maxHeight: "calc(100vh - 24px)" }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-20 pointer-events-none" />
      <div className="relative bg-secondary border border-primary rounded-2xl flex flex-col overflow-hidden strong-shadow">
        <div className="flex items-center justify-between px-5 py-4 border-b border-primary shrink-0">
          <h2 className="text-base font-semibold text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-secondary hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  </div>
);

export default DashboardModal;