import { css, type Component } from "dreamland/core";
import BrowserView from "./pages/BrowserView";
import { Omnibox } from "./pages/BrowserView";
import { BrowseSetup, LandingPage } from "./pages/EclipseHome";

const App: Component<
  {},
  {},
  {
    activeTab: "home" | "setup" | "browser";
  }
> = function (cx) {
  this.activeTab ??= "home";
  return (
    <div class="app-shell">
      <LandingPage
        active={use(this.activeTab).map((tab) => tab === "home")}
        onStart={() => {
          this.activeTab = "setup";
        }}
      />
      <BrowseSetup
        active={use(this.activeTab).map((tab) => tab === "setup")}
        onCancel={() => {
          this.activeTab = "home";
        }}
        onBrowse={() => {
          this.activeTab = "browser";
        }}
      />
      <div
        class={use(this.activeTab).map((tab) =>
          tab === "home" || tab === "setup" ? "workspace hidden" : "workspace",
        )}
      >
        <div class="browser-stage">
          <Omnibox />
          <BrowserView
            active={use(this.activeTab).map((tab) => tab === "browser")}
          />
        </div>
      </div>
    </div>
  );
};

App.style = css`
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");

  :scope {
    width: 100vw;
    height: 100vh;
    display: flex;
    margin: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    background: #060913;
    box-sizing: border-box;
  }

  :scope {
    --bg-base: #060913;
    --bg-surface: #0c1222;
    --bg-surface-2: #101a30;
    --bg-elevated: #16203a;
    --bg-input: #0f172a;

    --border-subtle: rgba(255, 255, 255, 0.08);
    --border-focus: #6a8cff;
    --border-default: rgba(255, 255, 255, 0.12);

    --text-primary: #f0f4fa;
    --text-secondary: #93a5c8;
    --text-muted: #5b6f8c;

    --accent-primary: #6a8cff;
    --accent-primary-hover: #82a6ff;
    --accent-glow: rgba(106, 140, 255, 0.18);
    --accent-warning: #55c9d5;
    --accent-danger: #57a8d8;
    --accent-success: #6ee7b7;

    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;
    --radius-xl: 18px;

    --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.35);
    --shadow-md: 0 6px 20px rgba(0, 0, 0, 0.25);
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.18);

    --font-sans: "Inter", system-ui, -apple-system, sans-serif;
    --font-mono: "JetBrains Mono", "SF Mono", Consolas, monospace;
  }

  .app-shell {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }

  .workspace {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }

  .browser-stage {
    position: relative;
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    background: #060a11;
  }

  .workspace.hidden {
    display: none;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export default App;
