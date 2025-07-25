import type { PublishParam, ToastVariant } from "./Toaster";

// Internal implementation - `event bus` design-pattern.

type EventHandler = (payload: PublishParam) => void;

const listeners = new Set<EventHandler>();

export function subscribe(handler: EventHandler) {
  listeners.add(handler);
  return () => listeners.delete(handler);
}

function publish(payload: PublishParam) {
  for (const handler of listeners) handler(payload);
}

// ----

function showToast(description: string, variant: ToastVariant, time = 5000) {
  publish({ description, variant, time });
}

export const toast = {
  success: (msg: string, time?: number) => showToast(msg, "success", time),
  danger: (msg: string, time?: number) => showToast(msg, "danger", time),
  info: (msg: string, time?: number) => showToast(msg, "info", time),
};
