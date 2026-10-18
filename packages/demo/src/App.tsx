import { css, type Component } from "dreamland/core";
import FlagEditor from "./components/FlagEditor";
import BrowserView from "./pages/BrowserView";
import RequestViewer from "./pages/RequestViewer";
import PlaygroundView from "./pages/Playground";
import SettingsView from "./pages/SettingsPage";
import { Omnibox } from "./pages/BrowserView";
import { requestsState } from "./pages/RequestViewer";
import { BrowseSetup, LandingPage } from "./pages/EclipseHome";

const App: Component<
	{},
	{},
	{
		activeTab:
			| "home"
			| "setup"
			| "browser"
			| "requests"
			| "playground"
			| "settings";
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
					tab === "home" || tab === "setup" ? "workspace hidden" : "workspace"
				)}
			>
				<div class="top-bar">
					<button
						class="home-button"
						title="Return to Eclipse home"
						on:click={() => {
							this.activeTab = "home";
						}}
					>
						<span class="home-mark"></span>ECLIPSE
					</button>
					<div class="tab-bar">
						<button
							class={use(this.activeTab).map(
								(tab) => `tab-button ${tab === "browser" ? "active" : ""}`
							)}
							on:click={() => {
								this.activeTab = "browser";
							}}
						>
							Browser
						</button>
						<button
							class={use(this.activeTab).map(
								(tab) => `tab-button ${tab === "requests" ? "active" : ""}`
							)}
							on:click={() => {
								this.activeTab = "requests";
							}}
						>
							Requests{" "}
							{use(requestsState.requests).map((requests) =>
								requests.length ? `(${requests.length})` : ""
							)}
						</button>
						<button
							class={use(this.activeTab).map(
								(tab) => `tab-button ${tab === "playground" ? "active" : ""}`
							)}
							on:click={() => {
								this.activeTab = "playground";
							}}
						>
							Playground
						</button>
						<button
							class={use(this.activeTab).map(
								(tab) => `tab-button ${tab === "settings" ? "active" : ""}`
							)}
							on:click={() => {
								this.activeTab = "settings";
							}}
						>
							Settings
						</button>
						{use(this.activeTab)
							.map((tab) => tab === "browser")
							.andThen(<Omnibox />)}
					</div>
					<div class="top-actions">
						<FlagEditor inline={true} />
					</div>
				</div>
				<div
					class={use(this.activeTab).map(
						(tab) =>
							`tab-panel browser-panel ${tab === "browser" ? "active" : ""}`
					)}
				>
					<BrowserView
						active={use(this.activeTab).map((tab) => tab === "browser")}
					/>
				</div>
				<div
					class={use(this.activeTab).map(
						(tab) =>
							`tab-panel requests-panel ${tab === "requests" ? "active" : ""}`
					)}
				>
					<RequestViewer
						active={use(this.activeTab).map((tab) => tab === "requests")}
					/>
				</div>
				<div
					class={use(this.activeTab).map(
						(tab) =>
							`tab-panel playground-panel ${tab === "playground" ? "active" : ""}`
					)}
				>
					<PlaygroundView
						active={use(this.activeTab).map((tab) => tab === "playground")}
					/>
				</div>
				<div
					class={use(this.activeTab).map(
						(tab) =>
							`tab-panel settings-tab ${tab === "settings" ? "active" : ""}`
					)}
				>
					<SettingsView />
				</div>
			</div>
		</div>
	);
};

App.style = css`
	@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0");

	:scope {
		width: 100vw;
		height: 100vh;
		margin: 0;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;

		padding: 0;
		background: #09111f;
		box-sizing: border-box;
	}
	.workspace {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.workspace.hidden {
		display: none;
	}
	.material-symbols-outlined {
		font-family: "Material Symbols Outlined";
		font-weight: normal;
		font-style: normal;
		font-size: 11px;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		-webkit-font-smoothing: antialiased;
	}
	.top-bar {
		display: flex;
		align-items: stretch;
		gap: 0;
		margin-bottom: 0;
		border-bottom: 1px solid #243650;
		background: #0c1728;
	}
	.home-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 0 12px;
		border: 0;
		border-right: 1px solid #243650;
		background: transparent;
		color: #d8e7fa;
		cursor: pointer;
		font-size: 0.7rem;
		font-weight: 740;
		letter-spacing: 0.13em;
	}
	.home-button:hover {
		background: #14243a;
	}
	.home-mark {
		width: 9px;
		height: 9px;
		border: 1px solid #91c1fb;
		border-radius: 3px;
		transform: rotate(45deg);
	}
	.tab-bar {
		display: flex;
		flex: 1;
		align-items: stretch;
		gap: 0;
	}
	.tab-button {
		border: 1px solid transparent;
		border-bottom: 0;
		background: transparent;
		color: #91a0b7;
		padding: 0.24em 0.62em;
		border-radius: 0;
		cursor: pointer;
		font-size: 0.84em;
		line-height: 1.2;
		min-height: 28px;
		margin: 0;
		white-space: nowrap;
		display: inline-flex;
		align-items: center;
	}
	.tab-button:hover {
		background: #14243a;
		color: #d0e1f8;
	}
	.tab-button.active {
		background: #172942;
		color: #fff;
		border-color: #314968;
		margin-bottom: -1px;
	}
	.top-actions {
		display: flex;
		align-items: center;
		margin-left: auto;
		padding: 0 0.35em;
		min-height: 28px;
	}
	.tab-panel {
		flex: 1;
		width: 100%;
		min-width: 0;
		min-height: 0;
		display: none;
	}
	.tab-panel.active {
		display: flex;
	}
	.requests-panel {
		flex-direction: column;
	}
	.playground-panel {
		width: 100%;
		min-width: 0;
		min-height: 0;
	}
	.settings-tab {
		width: 100%;
		min-width: 0;
		min-height: 0;
	}
	@media (max-width: 680px) {
		.home-button {
			padding: 0 9px;
			font-size: 0.62rem;
		}
		.tab-button {
			padding: 0.24em 0.4em;
			font-size: 0.72em;
		}
		.top-bar {
			flex-wrap: wrap;
		}
		.tab-bar {
			overflow-x: auto;
		}
	}
`;
export default App;
