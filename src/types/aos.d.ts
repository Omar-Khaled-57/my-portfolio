declare module "aos" {
  export interface AosOptions {
    once?: boolean;
    offset?: number;
    duration?: number;
    easing?: string;
    delay?: number;
  }
  export function init(
    options?: AosOptions | Record<string, unknown>,
    duration?: number,
  ): void;
  export function refresh(): void;
  export function refreshHard(): void;
  const AOS: {
    init: (options?: AosOptions | Record<string, unknown>, duration?: number) => void;
    refresh: () => void;
    refreshHard: () => void;
  };
  export default AOS;
}

declare module "aos/dist/aos.css";