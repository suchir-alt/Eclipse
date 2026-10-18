import { css, type Component } from "dreamland/core";
import {
	AVAILABLE_TRANSPORTS,
	type AvailableTransports,
	type SearchEngine,
	demoSettingsStore,
	normalizeSearchEngine,
	normalizeTransport,
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
						<span class="start-label">Start Browsing</span>
						<span class="start-arrow" aria-hidden="true">
							→
						</span>
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
						GitHub{" "}
						<span class="footer-arrow" aria-hidden="true">
							→
						</span>
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
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		background:
			radial-gradient(
				ellipse at 50% 5%,
				rgba(40, 116, 111, 0.14),
				transparent 38%
			),
			linear-gradient(145deg, #0b111a 0%, #101b23 54%, #0c151b 100%);
		color: #e5eee9;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			"Segoe UI",
			sans-serif;
	}
	:scope.active {
		display: flex;
	}
	.home-shell {
		width: min(920px, calc(100% - 48px));
		margin: 0 auto;
		padding-bottom: 12px;
	}
	.brand-row {
		height: 78px;
		display: flex;
		align-items: center;
		gap: 13px;
		border-bottom: 1px solid rgba(158, 196, 185, 0.13);
	}
	.brand-mark {
		position: relative;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 3px;
		border: 1px solid rgba(112, 205, 177, 0.55);
		border-radius: 9px;
		transform: rotate(45deg);
		background: linear-gradient(
			145deg,
			rgba(44, 131, 113, 0.28),
			rgba(19, 47, 47, 0.4)
		);
	}
	.brand-mark span {
		width: 3px;
		height: 13px;
		border-radius: 4px;
		background: #83dfc0;
		box-shadow: 0 0 10px rgba(106, 219, 180, 0.42);
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
		background: rgba(158, 196, 185, 0.24);
		margin-left: 2px;
	}
	.brand-caption {
		color: #8394b1;
		font-size: 0.78rem;
		letter-spacing: 0.02em;
	}
	.hero {
		max-width: 640px;
		margin: 0 auto;
		padding: clamp(42px, 7vh, 68px) 0 52px;
		text-align: center;
	}
	.eyebrow,
	.section-kicker {
		color: #83d6bd;
		font-size: 0.69rem;
		font-weight: 700;
		letter-spacing: 0.18em;
	}
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		padding: 8px 12px;
		border: 1px solid rgba(106, 190, 160, 0.23);
		border-radius: 99px;
		background: rgba(36, 91, 77, 0.17);
	}
	.eyebrow span,
	.button-note span {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #70d8b7;
		box-shadow: 0 0 10px rgba(104, 216, 169, 0.58);
	}
	h1 {
		margin: 21px 0 15px;
		font-size: clamp(2.45rem, 5.2vw, 4.1rem);
		line-height: 1.04;
		font-weight: 610;
		letter-spacing: -0.065em;
	}
	h1 span {
		color: #81d9bd;
		background: linear-gradient(100deg, #83dfc0, #a6d2bb 75%);
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.hero-copy {
		max-width: 550px;
		margin: 0 auto;
		color: #a3b4af;
		font-size: 0.94rem;
		line-height: 1.72;
	}
	.start-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 26px;
		padding: 13px 20px;
		border: 1px solid #79cfb0;
		border-radius: 8px;
		background: linear-gradient(135deg, #a8e8ce, #83d2b4);
		box-shadow: 0 8px 25px rgba(64, 165, 128, 0.18);
		color: #10211d;
		cursor: pointer;
		font: inherit;
		font-size: 0.92rem;
		font-weight: 730;
		transition:
			transform 160ms ease,
			box-shadow 160ms ease,
			background 160ms ease;
	}
	.start-label {
		letter-spacing: 0.005em;
	}
	.start-arrow {
		display: inline-block;
		color: #123d31;
		font-size: 1.45rem;
		font-weight: 450;
		line-height: 1;
		transition:
			transform 180ms ease,
			color 180ms ease;
		transform: translateY(-1px);
	}
	.start-button:hover {
		transform: translateY(-2px);
		background: linear-gradient(135deg, #b8f0d9, #8cdbbd);
		box-shadow: 0 12px 32px rgba(64, 165, 128, 0.28);
	}
	.start-button:hover .start-arrow {
		transform: translateX(4px);
		color: #0b5940;
	}
	.start-button:focus-visible {
		outline: 3px solid rgba(131, 214, 189, 0.55);
		outline-offset: 4px;
	}
	@media (prefers-reduced-motion: reduce) {
		.start-button,
		.start-arrow {
			transition: none;
		}
	}
	.button-note {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		margin-top: 14px;
		color: #7d928a;
		font-size: 0.74rem;
	}
	.button-note span {
		width: 5px;
		height: 5px;
	}
	.about {
		border-top: 1px solid rgba(158, 196, 185, 0.14);
		padding: 32px 0 38px;
	}
	.about h2 {
		margin: 12px 0 10px;
		font-size: 1.48rem;
		font-weight: 570;
		letter-spacing: -0.04em;
	}
	.about > p {
		max-width: 760px;
		margin: 0;
		color: #a3b4af;
		font-size: 0.87rem;
		line-height: 1.72;
	}
	.feature-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0;
		margin-top: 22px;
	}
	.feature-card {
		padding: 8px 20px 8px 0;
		border-right: 1px solid rgba(158, 196, 185, 0.14);
		background: transparent;
	}
	.feature-card + .feature-card {
		padding-left: 20px;
	}
	.feature-card:last-child {
		border-right: 0;
	}
	.feature-icon {
		color: #7ed7b8;
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
		color: #91a49d;
		font-size: 0.8rem;
		line-height: 1.65;
	}
	.about .privacy-note {
		margin-top: 20px;
		color: #7d9189;
		font-size: 0.76rem;
	}
	.home-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 14px;
		padding: 18px 0 25px;
		border-top: 1px solid rgba(158, 196, 185, 0.12);
		color: #71857d;
		font-size: 0.68rem;
		letter-spacing: 0.06em;
	}
	.home-footer a {
		color: #83d6bd;
		text-decoration: none;
	}
	.home-footer a:hover {
		color: #c2f1dc;
		text-decoration: underline;
	}
	.footer-arrow {
		display: inline-block;
		margin-left: 3px;
		font-size: 1.15em;
		font-weight: 450;
		line-height: 1;
		transform: translateY(-1px);
		transition: transform 160ms ease;
	}
	.home-footer a:hover .footer-arrow {
		transform: translate(2px, -1px);
	}
	.footer-dot {
		padding: 0 5px;
		color: #83d6bd;
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
			padding: 46px 0 42px;
		}
		.feature-grid {
			grid-template-columns: 1fr;
		}
		.feature-card,
		.feature-card + .feature-card {
			padding: 14px 0;
			border-right: 0;
			border-bottom: 1px solid rgba(158, 196, 185, 0.14);
		}
		.feature-card:last-child {
			border-bottom: 0;
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
		error: string;
	}
> = function () {
	this.query ??= "";
	this.searchEngine ??= demoSettingsStore.searchEngine;
	this.transport ??= demoSettingsStore.transport;
	this.tabCloak ??= demoSettingsStore.tabCloak;
	this.tabCloakTitle ??= demoSettingsStore.tabCloakTitle;
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

			const transportChanged = transport !== demoSettingsStore.transport;
			demoSettingsStore.searchEngine = searchEngine;
			demoSettingsStore.transport = transport;
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
							<span class="switch-track" aria-hidden="true">
								<span class="switch-thumb"></span>
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
					</div>
					{use(this.error).map((error) =>
						error ? (
							<div class="setup-error" role="alert">
								{error}
							</div>
						) : null,
					)}
					<button class="browse-button" type="submit">
						Open in Eclipse
						<span class="setup-arrow" aria-hidden="true">
							→
						</span>
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
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		background:
			radial-gradient(
				ellipse at 75% 0%,
				rgba(40, 116, 111, 0.13),
				transparent 35%
			),
			#0b111a;
		color: #e5eee9;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			"Segoe UI",
			sans-serif;
	}
	:scope.active {
		display: flex;
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
		border-bottom: 1px solid rgba(158, 196, 185, 0.13);
	}
	.back-link {
		padding: 8px 0;
		border: 0;
		background: transparent;
		color: #9aada5;
		cursor: pointer;
		font: inherit;
		font-size: 0.83rem;
	}
	.back-link:hover {
		color: #dcf0e8;
	}
	.back-link span {
		padding-right: 5px;
		color: #83d6bd;
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
		border: 1px solid #83d6bd;
		border-radius: 3px;
		transform: rotate(45deg);
		box-shadow: 0 0 12px rgba(117, 216, 184, 0.24);
	}
	.setup-intro {
		padding: 44px 0 23px;
	}
	.section-kicker {
		color: #83d6bd;
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
		color: #9aada5;
		font-size: 0.9rem;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
	.field-label {
		color: #d7e7df;
		font-size: 0.79rem;
		font-weight: 620;
	}
	input,
	select {
		width: 100%;
		min-width: 0;
		padding: 12px 13px;
		border: 1px solid #2b403e;
		border-radius: 8px;
		outline: none;
		background: #101b22;
		color: #e5eee9;
		font: inherit;
		font-size: 0.86rem;
	}
	input::placeholder {
		color: #718780;
	}
	input:focus,
	select:focus {
		border-color: #78c8a9;
		box-shadow: 0 0 0 3px rgba(89, 180, 145, 0.13);
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
		border-color: #36514a;
		background: rgba(13, 27, 29, 0.92);
		font-size: 0.95rem;
	}
	.field-hint {
		color: #7486a1;
		font-size: 0.73rem;
	}
	.settings-card {
		margin-top: 24px;
		padding: 19px 0 0;
		border-top: 1px solid rgba(158, 196, 185, 0.16);
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
		color: #81948a;
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.1em;
	}
	.settings-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}
	.cloak-toggle {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
		margin-top: 20px;
		padding: 15px 0;
		border-top: 1px solid rgba(158, 196, 185, 0.12);
		border-bottom: 1px solid rgba(158, 196, 185, 0.12);
		cursor: pointer;
	}
	.switch-track {
		display: flex;
		flex: 0 0 40px;
		align-items: center;
		box-sizing: border-box;
		width: 40px;
		height: 24px;
		padding: 3px;
		border: 1px solid #354946;
		border-radius: 999px;
		background: #1b2a2b;
		transition:
			background 140ms ease,
			border-color 140ms ease;
	}
	.switch-thumb {
		display: block;
		flex: 0 0 16px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #82968e;
		transition:
			transform 140ms ease,
			background 140ms ease;
	}
	.cloak-toggle input:checked + .switch-track {
		border-color: #78c8a9;
		background: #285347;
	}
	.cloak-toggle input:checked + .switch-track span {
		transform: translateX(16px);
		background: #b7ecd4;
	}
	.cloak-toggle input:focus-visible + .switch-track {
		outline: 2px solid #9be1c3;
		outline-offset: 3px;
	}
	.cloak-copy {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
		gap: 4px;
	}
	.optional-tag {
		flex: 0 0 auto;
		white-space: nowrap;
	}
	.cloak-copy strong {
		font-size: 0.82rem;
		font-weight: 630;
	}
	.cloak-copy small {
		color: #8da199;
		font-size: 0.72rem;
		line-height: 1.5;
	}
	.cloak-name {
		margin: 16px 0;
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
		border: 1px solid #79cfb0;
		border-radius: 8px;
		background: linear-gradient(135deg, #a2e4c9, #78c6ab);
		color: #10211d;
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
	.setup-arrow {
		display: inline-block;
		font-size: 1.3rem;
		font-weight: 450;
		line-height: 1;
		transform: translateY(-1px);
		transition: transform 160ms ease;
	}
	.browse-button:hover .setup-arrow {
		transform: translate(3px, -1px);
	}
	.form-note {
		margin: 12px 0 0;
		color: #7d928a;
		font-size: 0.7rem;
		line-height: 1.55;
		text-align: center;
	}
	@media (max-width: 580px) {
		.settings-grid {
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
	}
`;

export { LandingPage, BrowseSetup };
