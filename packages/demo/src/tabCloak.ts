const CLOAK_TITLE = "New Tab";
const CLOAK_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23111111'/%3E%3C/svg%3E";

let originalTitle: string | null = null;
let originalFaviconHref: string | null = null;
let faviconLink: HTMLLinkElement | null = null;

export function applyTabCloak(enabled: boolean) {
  if (typeof document === "undefined") return;

  if (enabled) {
    if (originalTitle === null) originalTitle = document.title;
    if (originalFaviconHref === null) {
      const existing = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (existing) originalFaviconHref = existing.href;
    }

    document.title = CLOAK_TITLE;

    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = CLOAK_FAVICON;
    return;
  }

  if (originalTitle !== null) document.title = originalTitle;
  if (originalFaviconHref !== null && faviconLink) {
    faviconLink.href = originalFaviconHref;
  }

  if (originalTitle !== null || originalFaviconHref !== null) {
    originalTitle = null;
    originalFaviconHref = null;
  }
}
