const CLOAK_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23111111'/%3E%3C/svg%3E";

let originalTitle: string | null = null;
let faviconLink: HTMLLinkElement | null = null;

export function applyTabCloak(enabled: boolean, title = "New Tab") {
  if (typeof document === "undefined") return;

  if (enabled) {
    if (originalTitle === null) originalTitle = document.title;
    document.title = title.trim() || "New Tab";

    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = CLOAK_FAVICON;
    return;
  }

  if (originalTitle !== null) document.title = originalTitle;
  faviconLink?.remove();
  faviconLink = null;
  originalTitle = null;
}
