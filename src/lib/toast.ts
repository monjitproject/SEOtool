/**
 * Zero-dependency, lightweight global Toast notifier
 */
type ToastType = "success" | "error" | "info" | "warning";
type ToastListener = (message: string, type: ToastType) => void;

const listeners = new Set<ToastListener>();

export const toast = {
  subscribe(listener: ToastListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  show(message: string, type: ToastType = "success") {
    listeners.forEach((l) => l(message, type));
  },
  success(message: string) {
    this.show(message, "success");
  },
  error(message: string) {
    this.show(message, "error");
  },
  info(message: string) {
    this.show(message, "info");
  },
  warning(message: string) {
    this.show(message, "warning");
  }
};
