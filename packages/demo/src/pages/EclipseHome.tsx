import { css, type Component } from "dreamland/core";
import {
	AVAILABLE_TRANSPORTS,
	type AvailableTransports,
	type SearchEngine,
	demoSettingsStore,
	normalizeMaxRequests,
	normalizeSearchEngine,
	normalizeTransport,
	normalizeWispUrl,
} from "../store";
import { applyTabCloak } from "../tabCloak";
import { browserState } from "./BrowserView";
import { controller, getTransport } from "..";

const LandingPage: Component<{
	active: boolean;
	onStart: () => void;
}> = function () {
	return (
		<main
			class={use(this.active).map(
				(active) => `eclipse-home ${active ? "active" : ""}`,
			)}
		>
			<div class="home-shell">
				<header class="brand-row">
					<div class="brand-mark" aria-hidden="true">
						<span></span>
						<span></span>
					</div>
					<span class="brand-name">ECLIPSE</span>
					<span class="brand-divider"></span>
					<span class="brand-caption">A quieter way to explore</span>
				</header>

				<section class="hero">
					<div class="eyebrow">
						<span></span> YOUR WEB, YOUR WAY
					</div>
					<h1>
						Step beyond
						<br />
						the <span>ordinary.</span>
					</h1>
					<p class="hero-copy">
						A thoughtfully designed space for exploring the web. Enter a
						destination, choose how Eclipse works for you, and make the
						experience your own.
					</p>
					<button class="start-button" on:click={this.onStart}>
						Start Browsing <span aria-hidden="true">-&gt;</span>
					</button>
					<div class="button-note">
						<span></span> Your browsing settings stay on this device
					</div>
				</section>

				<section class="about">
					<div class="section-kicker">A LITTLE ABOUT ECLIPSE</div>
					<h2>How your browsing works</h2>
					<p>
						Eclipse is a web-proxy demo built on Scramjet. It routes web
						requests through a configurable transport, then rewrites and
						sandboxes pages so they can be explored inside this browser view.
						This can help with compatibility in restricted environments and
						provides tools for inspecting how web pages behave.
					</p>
					<div class="feature-grid">
						<article class="feature-card">
							<div class="feature-icon">01</div>
							<h3>Choose your route</h3>
							<p>Select a search provider and transport before you browse.</p>
						</article>
						<article class="feature-card">
							<div class="feature-icon">02</div>
							<h3>Sandboxed pages</h3>
							<p>
								Web content is rewritten and isolated within the proxy view.
							</p>
						</article>
						<article class="feature-card">
							<div class="feature-icon">03</div>
							<h3>Make it yours</h3>
							<p>
								Optional tab cloaking and other preferences are yours to set.
							</p>
						</article>
					</div>
					<p class="privacy-note">
						Eclipse is a demo, not an anonymity or security service. Your
						network operator and the sites you visit may still observe activity;
						only browse content you trust.
					</p>
				</section>
				<footer class="home-footer">
					<span>
						ECLIPSE <span class="footer-dot">/</span> POWERED BY SCRAMJET
					</span>
					<span>Explore thoughtfully.</span>
					<a
						href="https://github.com/suchir-alt/Eclipse"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub <span aria-hidden="true">↗</span>
					</a>
				</footer>
			</div>
		</main>
	);
};

LandingPage.style = css`
	:scope {
		display: none;
		flex: 1;
		min-width: 0;
		min-height: 0;
		overflow: auto;
		background:
			radial-gradient(
				ellipse at 50% 5%,
				rgba(45, 92, 155, 0.2),
				transparent 38%
			),
			linear-gradient(145deg, #080f1d 0%, #0b1425 54%, #0a1020 100%);
		color: #e9f0ff;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			"Segoe UI",
			sans-serif;
	}
	:scope.active {
		display: block;
	}
	.home-shell {
		width: min(1040px, calc(100% - 48px));
		margin: 0 auto;
	}
	.brand-row {
		height: 78px;
		display: flex;
		align-items: center;
		gap: 13px;
		border-bottom: 1px solid rgba(160, 187, 227, 0.12);
	}
	.brand-mark {
		position: relative;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 3px;
		border: 1px solid rgba(126, 178, 255, 0.55);
		border-radius: 9px;
		transform: rotate(45deg);
		background: linear-gradient(
			145deg,
			rgba(67, 126, 210, 0.28),
			rgba(16, 34, 62, 0.4)
		);
	}
	.brand-mark span {
		width: 3px;
		height: 13px;
		border-radius: 4px;
		background: #92c5ff;
		box-shadow: 0 0 10px rgba(106, 177, 255, 0.5);
	}
	.brand-mark span:last-child {
		height: 8px;
		opacity: 0.65;
	}
	.brand-name {
		font-size: 0.83rem;
		font-weight: 760;
		letter-spacing: 0.2em;
	}
	.brand-divider {
		height: 16px;
		width: 1px;
		background: rgba(160, 187, 227, 0.25);
		margin-left: 2px;
	}
	.brand-caption {
		color: #8394b1;
		font-size: 0.78rem;
		letter-spacing: 0.02em;
	}
	.hero {
		max-width: 700px;
		margin: 0 auto;
		padding: clamp(64px, 10vh, 104px) 0 84px;
		text-align: center;
	}
	.eyebrow,
	.section-kicker {
		color: #8fbef5;
		font-size: 0.69rem;
		font-weight: 700;
		letter-spacing: 0.18em;
	}
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		padding: 8px 12px;
		border: 1px solid rgba(115, 164, 231, 0.2);
		border-radius: 99px;
		background: rgba(39, 73, 119, 0.17);
	}
	.eyebrow span,
	.button-note span {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #68d8c7;
		box-shadow: 0 0 10px rgba(104, 216, 199, 0.7);
	}
	h1 {
		margin: 26px 0 18px;
		font-size: clamp(3.1rem, 8vw, 5.8rem);
		line-height: 0.98;
		font-weight: 620;
		letter-spacing: -0.075em;
	}
	h1 span {
		color: #85baff;
		background: linear-gradient(100deg, #91c5ff, #8a9eff 75%);
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.hero-copy {
		max-width: 550px;
		margin: 0 auto;
		color: #a4b1c8;
		font-size: 1rem;
		line-height: 1.8;
	}
	.start-button {
		margin-top: 32px;
		padding: 15px 22px;
		border: 1px solid #a3c9ff;
		border-radius: 9px;
		background: linear-gradient(135deg, #b4d6ff, #86b6f5);
		box-shadow: 0 8px 28px rgba(82, 143, 222, 0.24);
		color: #09172a;
		cursor: pointer;
		font: inherit;
		font-size: 0.92rem;
		font-weight: 730;
		transition:
			transform 160ms ease,
			box-shadow 160ms ease;
	}
	.start-button span {
		margin-left: 15px;
		font-size: 1.1rem;
	}
	.start-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 34px rgba(82, 143, 222, 0.35);
	}
	.button-note {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		margin-top: 14px;
		color: #73839e;
		font-size: 0.74rem;
	}
	.button-note span {
		width: 5px;
		height: 5px;
	}
	.about {
		border-top: 1px solid rgba(160, 187, 227, 0.14);
		padding: 46px 0 54px;
	}
	.about h2 {
		margin: 12px 0 10px;
		font-size: 1.75rem;
		font-weight: 570;
		letter-spacing: -0.04em;
	}
	.about > p {
		max-width: 760px;
		margin: 0;
		color: #9cabc3;
		font-size: 0.92rem;
		line-height: 1.8;
	}
	.feature-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
		margin-top: 26px;
	}
	.feature-card {
		padding: 19px;
		border: 1px solid rgba(145, 176, 222, 0.14);
		border-radius: 12px;
		background: linear-gradient(
			145deg,
			rgba(23, 40, 67, 0.68),
			rgba(13, 25, 44, 0.58)
		);
	}
	.feature-icon {
		color: #7bb7ff;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
	}
	.feature-card h3 {
		margin: 13px 0 7px;
		font-size: 0.95rem;
		font-weight: 630;
	}
	.feature-card p {
		margin: 0;
		color: #8e9db5;
		font-size: 0.8rem;
		line-height: 1.65;
	}
	.about .privacy-note {
		margin-top: 20px;
		color: #75849b;
		font-size: 0.76rem;
	}
	.home-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 14px;
		padding: 18px 0 25px;
		border-top: 1px solid rgba(160, 187, 227, 0.12);
		color: #687992;
		font-size: 0.68rem;
		letter-spacing: 0.06em;
	}
	.home-footer a {
		color: #91bdf0;
		text-decoration: none;
	}
	.home-footer a:hover {
		color: #c7e0ff;
		text-decoration: underline;
	}
	.footer-dot {
		padding: 0 5px;
		color: #8fbef5;
	}
	@media (max-width: 620px) {
		.home-shell {
			width: min(100% - 32px, 480px);
		}
		.brand-caption,
		.brand-divider {
			display: none;
		}
		.hero {
			padding: 66px 0 60px;
		}
		.feature-grid {
			grid-template-columns: 1fr;
		}
		.home-footer {
			gap: 14px;
			flex-wrap: wrap;
		}
	}
`;

const BrowseSetup: Component<
	{
		active: boolean;
		onCancel: () => void;
		onBrowse: () => void;
	},
	{
		query: string;
		searchEngine: SearchEngine;
		transport: AvailableTransports;
		tabCloak: boolean;
		tabCloakTitle: string;
		wispUrl: string;
		maxRequests: string;
		error: string;
	}
> = function () {
	this.query ??= "";
	this.searchEngine ??= demoSettingsStore.searchEngine;
	this.transport ??= demoSettingsStore.transport;
	this.tabCloak ??= demoSettingsStore.tabCloak;
	this.tabCloakTitle ??= demoSettingsStore.tabCloakTitle;
	this.wispUrl ??= demoSettingsStore.wispUrl;
	this.maxRequests ??= String(demoSettingsStore.maxRequests);
	this.error ??= "";

	const start = async (event: SubmitEvent) => {
		event.preventDefault();
		this.error = "";
		const query = this.query.trim();
		if (!query) {
			this.error = "Enter a website address or search query to continue.";
			return;
		}

		try {
			const searchEngine = normalizeSearchEngine(this.searchEngine);
			const transport = normalizeTransport(this.transport);
			const wispUrl = normalizeWispUrl(this.wispUrl);
			const maxRequests = normalizeMaxRequests(this.maxRequests);
			const tabCloakTitle = this.tabCloakTitle.trim();
			if (this.tabCloak && !tabCloakTitle) {
				throw new TypeError("Enter a tab name to use tab cloaking.");
			}

			const looksLikeUrl =
				/^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(query) ||
				/^(localhost|[\w-]+\.)+[\w-]{2,}(?::\d+)?(?:\/.*)?$/i.test(query);
			const rawTargetUrl = looksLikeUrl
				? /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(query)
					? new URL(query).toString()
					: new URL(`https://${query}`).toString()
				: {
						google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
						duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
						bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
					}[searchEngine];
			const parsedTargetUrl = new URL(rawTargetUrl);
			if (
				parsedTargetUrl.protocol !== "http:" &&
				parsedTargetUrl.protocol !== "https:"
			) {
				throw new TypeError("Only HTTP and HTTPS web addresses are supported.");
			}
			const targetUrl = parsedTargetUrl.toString();
			const frame = browserState.frame;
			if (!frame) {
				throw new Error("The browser is still initializing. Please try again.");
			}

			const transportChanged =
				transport !== demoSettingsStore.transport ||
				wispUrl !== demoSettingsStore.wispUrl;
			demoSettingsStore.searchEngine = searchEngine;
			demoSettingsStore.transport = transport;
			demoSettingsStore.wispUrl = wispUrl;
			demoSettingsStore.maxRequests = maxRequests;
			demoSettingsStore.homeUrl = targetUrl;
			demoSettingsStore.tabCloak = Boolean(this.tabCloak);
			demoSettingsStore.tabCloakTitle = tabCloakTitle || "New Tab";

			if (transportChanged) controller.setTransport(getTransport());
			applyTabCloak(
				demoSettingsStore.tabCloak,
				demoSettingsStore.tabCloakTitle,
			);
			browserState.url = targetUrl;
			frame.go(targetUrl);
			this.onBrowse();
		} catch (error) {
			this.error =
				error instanceof Error ? error.message : "Unable to start browsing.";
		}
	};

	return (
		<main
			class={use(this.active).map(
				(active) => `eclipse-setup ${active ? "active" : ""}`,
			)}
		>
			<div class="setup-shell">
				<header class="setup-header">
					<button type="button" class="back-link" on:click={this.onCancel}>
						<span aria-hidden="true">&lt;-</span> Back
					</button>
					<div class="setup-brand">
						<span class="mini-mark"></span>ECLIPSE
					</div>
				</header>
				<section class="setup-intro">
					<div class="section-kicker">YOUR NEXT DESTINATION</div>
					<h1>Make it yours.</h1>
					<p>Choose what to explore and tune the details before you go.</p>
				</section>
				<form class="setup-form" on:submit={start}>
					<label class="field">
						<span class="field-label">Where would you like to go?</span>
						<input
							class="query-input"
							type="text"
							autofocus
							placeholder="Search the web or enter a URL"
							value={use(this.query)}
							on:input={(event: InputEvent) => {
								this.query = (event.target as HTMLInputElement).value;
							}}
						/>
						<span class="field-hint">
							Try a search, example.com, or a full web address.
						</span>
					</label>
					<div class="settings-card">
						<div class="settings-card-heading">
							<div>
								<div class="section-kicker">YOUR PREFERENCES</div>
								<h2>Browsing settings</h2>
							</div>
							<span class="settings-badge">SAVED ON THIS DEVICE</span>
						</div>
						<div class="settings-grid">
							<label class="field">
								<span class="field-label">Search provider</span>
								<select
									value={use(this.searchEngine)}
									on:change={(event: Event) => {
										this.searchEngine = normalizeSearchEngine(
											(event.target as HTMLSelectElement).value,
										);
									}}
								>
									<option value="google">Google (default)</option>
									<option value="duckduckgo">DuckDuckGo</option>
									<option value="bing">Bing</option>
								</select>
							</label>
							<label class="field">
								<span class="field-label">Proxy transport</span>
								<select
									value={use(this.transport)}
									on:change={(event: Event) => {
										this.transport = normalizeTransport(
											(event.target as HTMLSelectElement).value,
										);
									}}
								>
									{AVAILABLE_TRANSPORTS.map((option) => (
										<option value={option.value}>
											{option.label}
											{option.value === "libcurl" ? " (default)" : ""}
										</option>
									))}
								</select>
							</label>
						</div>
						<label class="cloak-toggle">
							<input
								type="checkbox"
								checked={use(this.tabCloak)}
								on:change={(event: Event) => {
									this.tabCloak = (event.target as HTMLInputElement).checked;
								}}
							/>
							<span class="switch-track">
								<span></span>
							</span>
							<span class="cloak-copy">
								<strong>Enable tab cloaking</strong>
								<small>
									Use a custom title and icon while this page is open.
								</small>
							</span>
							<span class="optional-tag">OPTIONAL</span>
						</label>
						{use(this.tabCloak).andThen(
							<label class="field cloak-name">
								<span class="field-label">Cloaked tab name</span>
								<input
									type="text"
									maxLength={60}
									placeholder="For example, Study Notes"
									value={use(this.tabCloakTitle)}
									on:input={(event: InputEvent) => {
										this.tabCloakTitle = (
											event.target as HTMLInputElement
										).value;
									}}
								/>
							</label>,
						)}
						<details class="advanced-settings">
							<summary>
								Advanced settings <span>Wisp server and request log limit</span>
							</summary>
							<div class="advanced-grid">
								<label class="field">
									<span class="field-label">Wisp server</span>
									<input
										type="text"
										spellcheck={false}
										value={use(this.wispUrl)}
										on:input={(event: InputEvent) => {
											this.wispUrl = (event.target as HTMLInputElement).value;
										}}
									/>
									<span class="field-hint">
										Default: configured Wisp address.
									</span>
								</label>
								<label class="field">
									<span class="field-label">Request log limit</span>
									<input
										type="number"
										min="10"
										max="5000"
										step="10"
										value={use(this.maxRequests)}
										on:input={(event: InputEvent) => {
											this.maxRequests = (
												event.target as HTMLInputElement
											).value;
										}}
									/>
									<span class="field-hint">
										Default: 200 entries. Choose 10-5000.
									</span>
								</label>
							</div>
							<p class="advanced-note">
								Request history is held in memory and limited to the selected
								number of entries.
							</p>
						</details>
					</div>
					{use(this.error).map((error) =>
						error ? (
							<div class="setup-error" role="alert">
								{error}
							</div>
						) : null,
					)}
					<button class="browse-button" type="submit">
						Open in Eclipse <span aria-hidden="true">-&gt;</span>
					</button>
					<p class="form-note">
						Proxy browsing is not a substitute for a VPN or an anonymity
						service.
					</p>
				</form>
			</div>
		</main>
	);
};

BrowseSetup.style = css`
	:scope {
		display: none;
		flex: 1;
		min-width: 0;
		min-height: 0;
		overflow: auto;
		background:
			radial-gradient(
				ellipse at 75% 0%,
				rgba(39, 82, 143, 0.18),
				transparent 35%
			),
			#09111f;
		color: #e7eefb;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			"Segoe UI",
			sans-serif;
	}
	:scope.active {
		display: block;
	}
	.setup-shell {
		width: min(760px, calc(100% - 36px));
		margin: 0 auto;
		padding-bottom: 50px;
	}
	.setup-header {
		height: 68px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid rgba(160, 187, 227, 0.12);
	}
	.back-link {
		padding: 8px 0;
		border: 0;
		background: transparent;
		color: #9aabc4;
		cursor: pointer;
		font: inherit;
		font-size: 0.83rem;
	}
	.back-link:hover {
		color: #dceaff;
	}
	.back-link span {
		padding-right: 5px;
		color: #8fbef5;
	}
	.setup-brand {
		display: flex;
		align-items: center;
		gap: 9px;
		font-size: 0.75rem;
		font-weight: 750;
		letter-spacing: 0.17em;
	}
	.mini-mark {
		width: 10px;
		height: 10px;
		border: 1px solid #90c1fb;
		border-radius: 3px;
		transform: rotate(45deg);
		box-shadow: 0 0 12px rgba(117, 177, 248, 0.3);
	}
	.setup-intro {
		padding: 44px 0 23px;
	}
	.section-kicker {
		color: #83b8f3;
		font-size: 0.66rem;
		font-weight: 720;
		letter-spacing: 0.17em;
	}
	.setup-intro h1 {
		margin: 11px 0 7px;
		font-size: clamp(2.1rem, 5vw, 2.8rem);
		font-weight: 610;
		letter-spacing: -0.06em;
	}
	.setup-intro p {
		margin: 0;
		color: #94a4bd;
		font-size: 0.9rem;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
	.field-label {
		color: #dce7f8;
		font-size: 0.79rem;
		font-weight: 620;
	}
	input,
	select {
		width: 100%;
		min-width: 0;
		padding: 12px 13px;
		border: 1px solid #283a55;
		border-radius: 8px;
		outline: none;
		background: #0b1729;
		color: #e6eefc;
		font: inherit;
		font-size: 0.86rem;
	}
	input::placeholder {
		color: #647792;
	}
	input:focus,
	select:focus {
		border-color: #77aef0;
		box-shadow: 0 0 0 3px rgba(89, 150, 225, 0.13);
	}
	select {
		cursor: pointer;
	}
	input[type="checkbox"] {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
	}
	.query-input {
		padding: 15px 16px;
		border-color: #314968;
		background: rgba(13, 26, 45, 0.92);
		font-size: 0.95rem;
	}
	.field-hint,
	.advanced-note {
		color: #7486a1;
		font-size: 0.73rem;
	}
	.settings-card {
		margin-top: 24px;
		padding: 22px;
		border: 1px solid rgba(127, 161, 207, 0.19);
		border-radius: 13px;
		background: linear-gradient(
			145deg,
			rgba(17, 32, 54, 0.92),
			rgba(12, 24, 42, 0.88)
		);
		box-shadow: 0 18px 54px rgba(0, 0, 0, 0.12);
	}
	.settings-card-heading {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 12px;
		margin-bottom: 20px;
	}
	.settings-card-heading h2 {
		margin: 6px 0 0;
		font-size: 1.14rem;
		font-weight: 620;
		letter-spacing: -0.025em;
	}
	.settings-badge,
	.optional-tag {
		color: #7c91ae;
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.1em;
	}
	.settings-grid,
	.advanced-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}
	.cloak-toggle {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 20px;
		padding: 15px 0;
		border-top: 1px solid rgba(144, 169, 205, 0.12);
		border-bottom: 1px solid rgba(144, 169, 205, 0.12);
		cursor: pointer;
	}
	.switch-track {
		flex: 0 0 36px;
		height: 21px;
		padding: 3px;
		border: 1px solid #34445b;
		border-radius: 20px;
		background: #18263a;
		transition:
			background 140ms ease,
			border-color 140ms ease;
	}
	.switch-track span {
		display: block;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #8292a8;
		transition:
			transform 140ms ease,
			background 140ms ease;
	}
	.cloak-toggle input:checked + .switch-track {
		border-color: #79aef0;
		background: #234d7d;
	}
	.cloak-toggle input:checked + .switch-track span {
		transform: translateX(15px);
		background: #b8d7ff;
	}
	.cloak-toggle input:focus-visible + .switch-track {
		outline: 2px solid #9bc7ff;
		outline-offset: 3px;
	}
	.cloak-copy {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 4px;
	}
	.cloak-copy strong {
		font-size: 0.82rem;
		font-weight: 630;
	}
	.cloak-copy small {
		color: #8292aa;
		font-size: 0.72rem;
		line-height: 1.5;
	}
	.cloak-name {
		margin: 16px 0;
	}
	.advanced-settings {
		margin-top: 15px;
		border-top: 1px solid rgba(144, 169, 205, 0.12);
		padding-top: 15px;
	}
	.advanced-settings summary {
		color: #cad8ec;
		cursor: pointer;
		font-size: 0.79rem;
		font-weight: 620;
	}
	.advanced-settings summary span {
		margin-left: 8px;
		color: #7789a3;
		font-size: 0.7rem;
		font-weight: 400;
	}
	.advanced-grid {
		margin-top: 16px;
	}
	.advanced-note {
		margin: 11px 0 0;
		line-height: 1.5;
	}
	.setup-error {
		margin-top: 14px;
		padding: 11px 13px;
		border: 1px solid rgba(255, 125, 135, 0.35);
		border-radius: 8px;
		background: rgba(117, 34, 49, 0.2);
		color: #ffabb2;
		font-size: 0.8rem;
	}
	.browse-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		width: 100%;
		margin-top: 18px;
		padding: 14px 18px;
		border: 1px solid #a3c9ff;
		border-radius: 9px;
		background: linear-gradient(135deg, #b4d6ff, #86b6f5);
		color: #09172a;
		cursor: pointer;
		font: inherit;
		font-size: 0.88rem;
		font-weight: 730;
		transition:
			filter 140ms ease,
			transform 140ms ease;
	}
	.browse-button:hover {
		filter: brightness(1.06);
		transform: translateY(-1px);
	}
	.form-note {
		margin: 12px 0 0;
		color: #73839a;
		font-size: 0.7rem;
		line-height: 1.55;
		text-align: center;
	}
	@media (max-width: 580px) {
		.settings-card {
			padding: 17px;
		}
		.settings-grid,
		.advanced-grid {
			grid-template-columns: 1fr;
		}
		.settings-badge {
			max-width: 78px;
			line-height: 1.5;
			text-align: right;
		}
		.optional-tag {
			display: none;
		}
		.advanced-settings summary span {
			display: block;
			margin: 5px 0 0;
		}
	}
`;

export { LandingPage, BrowseSetup };
