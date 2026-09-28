// lib/scrollWhenReady.ts
//
// Scrolls an element into view once the browser has actually caught up on
// layout, rather than on the next paint or two. A plain requestAnimationFrame
// is enough on a fast device with a small DOM, but a large grid (hundreds of
// calendar cells) or a slower device can still be mid-layout a frame or two
// after mount -- scrollIntoView called too early measures a stale position.
//
// requestIdleCallback waits for the browser to genuinely finish pending work,
// with a timeout so it still fires even if the browser is never truly idle.
// Safari (desktop and iOS) has no requestIdleCallback at all, so there it
// falls back to a fixed, more generous delay.
export function scrollIntoViewWhenReady(
  el: HTMLElement | null | undefined,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center' }
): () => void {
  if (!el || typeof window === 'undefined') return () => {};

  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(() => el.scrollIntoView(options), { timeout: 500 });
    return () => w.cancelIdleCallback?.(id);
  }

  const timeoutId = window.setTimeout(() => el.scrollIntoView(options), 300);
  return () => window.clearTimeout(timeoutId);
}
