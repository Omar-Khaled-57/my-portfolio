import "react";

declare global {
  interface WindowEventMap {
    portfolioDataLoaded: Event;
    portfolioTabChange: CustomEvent<{ tab: number | null }>;
  }
}

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    itemScope?: boolean;
    itemType?: string;
    itemProp?: string;
  }
}