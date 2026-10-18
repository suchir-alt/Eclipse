import { css, type Component, createState } from "dreamland/core";
import {
  CatchEscapedLinksPlugin,
  UrlWatcherPlugin,
} from "@mercuryworkshop/scramjet-utils";
import { versionInfo } from "@mercuryworkshop/scramjet";
import { cachePlugin, controller } from "..";
import { demoSettingsStore } from "../store";
import homepage from "./homepage.html?raw";
import type { Frame } from "@mercuryworkshop/scramjet-controller";

export const browserState = createState({
  url: demoSettingsStore.homeUrl,
  frame: null as Frame | null,
  omniboxCollapsed: false,
});

export const Omnibox: Component = function (cx) {
  const navigate = () => {
    if (!browserState.url.startsWith("http")) {
      browserState.url = `https://${browserState.url}`;
    }
    demoSettingsStore.homeUrl = browserState.url;
    browserState.frame?.go(browserState.url);
  };
  return (
    <div
      class={use(browserState.omniboxCollapsed).map(
        (collapsed) => `floating-omnibox ${collapsed ? "collapsed" : ""}`,
      )}
    >
      <form
        class="url-form"
        on:submit={(e: SubmitEvent) => {
          e.preventDefault();
          navigate();
        }}
      >
        <div class="browser-omnibox-shell">
          <span class="address-indicator" aria-hidden="true"></span>
          <input
            id="search"
            class="url-input"
            type="text"
            value={use(browserState.url)}
            spellcheck="false"
            aria-label="Current web address"
            placeholder="Enter URL or search..."
          />
          <div class="omnibox-nav">
            <button
              type="button"
              class="nav-btn"
              aria-label="Go back"
              on:click={() => browserState.frame?.back()}
            >
              <span class="nav-arrow" aria-hidden="true">
                ←
              </span>
            </button>
            <button
              type="button"
              class="nav-btn"
              aria-label="Go forward"
              on:click={() => browserState.frame?.forward()}
            >
              <span class="nav-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <button
              type="button"
              class="nav-btn"
              aria-label="Reload page"
              on:click={() => browserState.frame?.reload()}
            >
              <svg
                class="refresh-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                />
              </svg>
            </button>
          </div>
          <button
            class="omnibox-toggle"
            type="button"
            aria-label={use(browserState.omniboxCollapsed).map((collapsed) =>
              collapsed ? "Show address bar" : "Hide address bar",
            )}
            title={use(browserState.omniboxCollapsed).map((collapsed) =>
              collapsed ? "Show address bar" : "Hide address bar",
            )}
            on:click={() => {
              browserState.omniboxCollapsed = !browserState.omniboxCollapsed;
            }}
          >
            <span aria-hidden="true">
              {use(browserState.omniboxCollapsed).map((collapsed) =>
                collapsed ? "↓" : "↑",
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
Omnibox.style = css`
  :scope {
    position: absolute;
    z-index: 5;
    top: 12px;
    left: 50%;
    width: min(620px, calc(100% - 28px));
    transform: translate(-50%, 0);
    transition:
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
      width 320ms cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
  }
  :scope.collapsed {
    width: 48px;
    transform: translate(-50%, calc(-100% + 48px));
  }
  .url-form {
    width: 100%;
    margin: 0;
    pointer-events: auto;
  }
  :scope.collapsed .url-form {
    pointer-events: none;
  }
  .browser-omnibox-shell {
    display: flex;
    width: 100%;
    min-height: 48px;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 7px 10px 7px 14px;
    border: 1px solid rgba(93, 212, 191, 0.26);
    border-radius: 15px;
    background: linear-gradient(
      135deg,
      rgba(17, 37, 48, 0.97),
      rgba(9, 17, 28, 0.97)
    );
    box-shadow:
      0 12px 36px rgba(0, 0, 0, 0.42),
      0 0 24px rgba(49, 178, 166, 0.1),
      inset 0 1px 0 rgba(188, 255, 240, 0.06);
    box-sizing: border-box;
    backdrop-filter: blur(18px);
    transition:
      opacity 220ms ease,
      transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
      border-color 220ms ease,
      width 320ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  :scope.collapsed .browser-omnibox-shell {
    gap: 0;
    padding: 0;
    border-color: rgba(93, 212, 191, 0.34);
    border-radius: 0 0 14px 14px;
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.4);
  }
  :scope.collapsed .address-indicator,
  :scope.collapsed .url-input,
  :scope.collapsed .omnibox-nav {
    width: 0;
    min-width: 0;
    flex: 0 0 0;
    margin: 0;
    padding: 0;
    border: 0;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    transition:
      opacity 120ms ease,
      width 300ms ease;
  }
  .omnibox-nav {
    display: flex;
    align-items: center;
    gap: 2px;
    padding-left: 8px;
    border-left: 1px solid rgba(153, 187, 196, 0.14);
  }
  .nav-btn {
    border: 0;
    background: transparent;
    color: #9bb8bd;
    width: 29px;
    height: 29px;
    padding: 0;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
      background 160ms ease,
      color 160ms ease;
  }
  .nav-btn:hover {
    background: rgba(75, 191, 176, 0.14);
    color: #a4f0dc;
  }
  .refresh-icon {
    display: block;
    width: 17px;
    height: 17px;
  }
  .nav-arrow {
    display: inline-block;
    font-family: inherit;
    font-size: 1.05rem;
    font-weight: 500;
    line-height: 1;
    transform: translateY(-1px);
    transition: transform 160ms ease;
  }
  .nav-btn:hover .nav-arrow {
    transform: translate(2px, -1px);
  }
  .nav-btn:first-child:hover .nav-arrow {
    transform: translate(-2px, -1px);
  }
  .url-input {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding: 7px 3px;
    font-size: 0.82rem;
    font-family: "JetBrains Mono", monospace;
    border: 1px solid transparent;
    border-radius: 7px;
    background: transparent;
    color: #d4ece9;
    outline: none;
  }
  .url-input:focus {
    border-color: rgba(83, 204, 182, 0.28);
    background: rgba(67, 177, 160, 0.06);
  }
  .url-input::placeholder {
    color: #759097;
  }
  .address-indicator {
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border: 1px solid #75dfc1;
    border-radius: 50%;
    background: #54cbaa;
    box-shadow: 0 0 11px rgba(84, 203, 170, 0.65);
  }
  .omnibox-toggle {
    display: inline-flex;
    flex: 0 0 30px;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    margin-left: 3px;
    border: 1px solid rgba(93, 212, 191, 0.17);
    border-radius: 9px;
    background: rgba(62, 170, 157, 0.09);
    color: #8ce3cc;
    font: inherit;
    font-size: 0.88rem;
    cursor: pointer;
    pointer-events: auto;
    opacity: 1;
    transition:
      color 180ms ease,
      background 180ms ease,
      opacity 160ms ease,
      margin 260ms ease;
  }
  .omnibox-toggle:hover {
    background: #12313a;
    color: #c0ffeb;
  }
  :scope.collapsed .omnibox-toggle {
    flex-basis: 48px;
    width: 48px;
    height: 48px;
    margin: 0;
    border: 0;
    border-radius: 0 0 14px 14px;
    background: transparent;
  }
  .omnibox-toggle span {
    display: block;
    transition: transform 220ms ease;
  }
  :scope.collapsed .omnibox-toggle span {
    transform: translateY(2px);
  }
`;

const BrowserView: Component<
  {
    active: boolean;
  },
  {},
  {
    frameel: HTMLIFrameElement;
  }
> = function (cx) {
  cx.mount = async () => {
    await controller.wait();

    let urlWatcher = new UrlWatcherPlugin((url) => {
      browserState.url = url;
    });
    let catchEscapedLinks = new CatchEscapedLinksPlugin(
      (url) =>
        new URL(`/?goto=${encodeURIComponent(url.href)}`, location.origin),
    );
    browserState.frame = controller.createFrame(this.frameel, {
      plugins: [cachePlugin, urlWatcher, catchEscapedLinks],
    });
    let realHomepage = homepage;
    realHomepage = realHomepage.replaceAll(
      "{{SCRAMJET_VERSION}}",
      String(versionInfo.version),
    );
    realHomepage = realHomepage.replaceAll(
      "{{SCRAMJET_BUILD}}",
      String(versionInfo.build),
    );
    realHomepage = realHomepage.replaceAll(
      "{{SCRAMJET_DATE_PRETTY}}",
      new Date(versionInfo.date).toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      }),
    );
    this.frameel.src = `data:text/html;base64,${btoa(realHomepage)}`;

    let goto = new URL(location.href).searchParams.get("goto");
    if (goto) {
      browserState.frame?.go(goto);
      history.replaceState(null, "", location.href.split("?")[0]);
    }
  };

  return (
    <div
      class={use(this.active).map(
        (active) => `tab-panel browser-view ${active ? "active" : ""}`,
      )}
    >
      <iframe this={use(this.frameel)}></iframe>
    </div>
  );
};

BrowserView.style = css`
  :scope {
    flex: 1;
    width: 100%;
    min-width: 0;
    min-height: 0;
    display: none;
    flex-direction: column;
  }
  :scope.active {
    display: flex;
  }

  iframe {
    background: white;
    flex: 1;
    border: none;
  }
`;

export default BrowserView;
