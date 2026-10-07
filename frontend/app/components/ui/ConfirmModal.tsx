"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Info, Loader2, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ConfirmModalVariant = "default" | "warning" | "danger";
type Phase = "open" | "closing" | "closed";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  variant?: ConfirmModalVariant;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

type VariantConfig = {
  Icon: LucideIcon;
  iconWrapper: string;
  confirmButton: string;
};

const VARIANTS: Record<ConfirmModalVariant, VariantConfig> = {
  default: {
    Icon: Info,
    iconWrapper: "bg-slate-100 text-slate-700",
    confirmButton:
      "bg-slate-900 hover:bg-slate-800 active:bg-slate-950 focus-visible:ring-slate-900",
  },
  warning: {
    Icon: AlertTriangle,
    iconWrapper: "bg-amber-100 text-amber-600",
    confirmButton:
      "bg-amber-600 hover:bg-amber-700 active:bg-amber-800 focus-visible:ring-amber-600",
  },
  danger: {
    Icon: AlertTriangle,
    iconWrapper: "bg-red-100 text-red-600",
    confirmButton:
      "bg-red-600 hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600",
  },
};

const ANIMATION_MS = 250;
const ENTER_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const EXIT_EASING = "ease-in";
const DESKTOP_QUERY = "(min-width: 640px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const prefersReducedMotion = () =>
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loadingText = "Processing…",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const isMounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [phase, setPhase] = useState<Phase>(isOpen ? "open" : "closed");
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const messageId = useId();

  const { Icon, iconWrapper, confirmButton } = VARIANTS[variant];
  const isDestructive = variant !== "default";

  if (isOpen && phase !== "open") {
    setPhase("open");
  } else if (!isOpen && phase === "open") {
    setPhase("closing");
  }

  useLayoutEffect(() => {
    if (!isMounted || phase === "closed") return;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;
    if (typeof panel.animate !== "function" || prefersReducedMotion()) return;

    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
    const isEntering = phase === "open";

    const panelFrames: Keyframe[] = isDesktop
      ? [
          { opacity: 0, transform: "scale(0.95)" },
          { opacity: 1, transform: "scale(1)" },
        ]
      : [
          { transform: "translateY(100%)" },
          { transform: "translateY(0)" },
        ];
    const overlayFrames: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];

    const options: KeyframeAnimationOptions = {
      duration: ANIMATION_MS,
      easing: isEntering ? ENTER_EASING : EXIT_EASING,
      direction: isEntering ? "normal" : "reverse",
      fill: isEntering ? "none" : "forwards",
    };

    const animations = [
      panel.animate(panelFrames, options),
      overlay.animate(overlayFrames, options),
    ];

    return () => {
      animations.forEach((animation) => animation.cancel());
    };
  }, [phase, isMounted]);

  useEffect(() => {
    if (phase !== "closing") return;

    const delay = prefersReducedMotion() ? 0 : ANIMATION_MS;
    const timer = window.setTimeout(() => setPhase("closed"), delay);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (!isOpen || !isMounted) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const initialTarget = isDestructive
      ? cancelButtonRef.current
      : confirmButtonRef.current;
    initialTarget?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, isMounted, isDestructive]);

  useEffect(() => {
    if (isOpen && loading) {
      panelRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen, loading]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!loading) {
          event.stopPropagation();
          onCancel();
        }
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isMounted || phase === "closed") return null;

  return createPortal(
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/40 backdrop-blur-[2px] sm:items-center sm:p-4 ${
        isOpen ? "" : "pointer-events-none"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel();
        }
      }}
    >
      <div
        ref={panelRef}
        role={isDestructive ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        aria-busy={loading}
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-1rem)] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_24px_64px_-12px_rgba(15,23,42,0.28)] outline-none sm:max-h-[calc(100dvh-2rem)] sm:max-w-md sm:rounded-2xl sm:p-6"
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close dialog"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div
            aria-hidden="true"
            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${iconWrapper}`}
          >
            <Icon size={20} strokeWidth={2} />
          </div>
          <h2
            id={titleId}
            className="min-w-0 break-words text-base font-semibold leading-6 text-slate-900"
          >
            {title}
          </h2>
        </div>

        <p
          id={messageId}
          className="mt-3 whitespace-pre-line break-words pl-[3.25rem] text-sm leading-5 text-slate-600"
        >
          {message}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:h-10 sm:w-auto"
          >
            {cancelText}
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 sm:h-10 sm:w-auto ${confirmButton}`}
          >
            {loading && (
              <Loader2
                size={16}
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
            )}
            <span>{loading ? loadingText : confirmText}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}