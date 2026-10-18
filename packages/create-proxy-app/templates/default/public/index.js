const form = document.getElementById("sj-form");
const address = document.getElementById("sj-address");
const frameWrapper = document.getElementById("sj-frame-wrapper");
const frameElement = document.getElementById("sj-frame");
const frameUrl = document.getElementById("sj-frame-url");
const tabCloak = document.getElementById("sj-tab-cloak");
const homeButton = document.getElementById("sj-home");
const searchEngine = document.getElementById("sj-search-engine");
const errorMessage = document.getElementById("sj-error");
const errorCode = document.getElementById("sj-error-code");

const originalTitle = document.title;
const cloakFavicon = document.createElement("link");
cloakFavicon.rel = "icon";
cloakFavicon.href =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23111111'/%3E%3C/svg%3E";

function applyTabCloak(enabled) {
	if (enabled) {
		document.title = "New Tab";
		if (!cloakFavicon.isConnected) document.head.appendChild(cloakFavicon);
		return;
	}

	document.title = originalTitle;
	cloakFavicon.remove();
}

tabCloak.addEventListener("change", () => applyTabCloak(tabCloak.checked));

let controller;
let frame;
async function init() {
	controller = await initBootstrap();

	const cachePlugin = new $scramjetUtils.HttpCachePlugin();
	const urlWatcher = new $scramjetUtils.UrlWatcherPlugin((url) => {
		frameUrl.textContent = url;
	});
	const catchEscapedLinks = new $scramjetUtils.CatchEscapedLinksPlugin(
		(url) => new URL(`/?goto=${encodeURIComponent(url.href)}`, location.origin)
	);

	frame = controller.createFrame(frameElement, {
		plugins: [cachePlugin, urlWatcher, catchEscapedLinks],
	});
}

function showErrorScreen(error, details) {
	frameWrapper.style.display = "none";
	errorMessage.textContent = error;
	errorCode.textContent = details;
}

function resolveDestination(value) {
	const input = value.trim();
	if (!input) return "";
	if (/^https?:\/\//i.test(input)) return input;
	if (!/\s/.test(input) && (input.includes(".") || /^(localhost|127\.)/i.test(input))) {
		return `https://${input}`;
	}
	return searchEngine.value.replace("%s", encodeURIComponent(input));
}

async function navigate(url) {
	if (!frame || !controller) {
		await init();
	}
	const destination = resolveDestination(url);
	if (!destination) return;
	await frame.go(destination);
	frameWrapper.style.display = "flex";
}

homeButton.addEventListener("click", () => {
	frameWrapper.style.display = "none";
	address.focus();
});

document.querySelectorAll("[data-url]").forEach((link) => {
	link.addEventListener("click", async () => {
		address.value = link.dataset.url;
		try {
			await navigate(address.value);
		} catch (error) {
			showErrorScreen(error.message, error.stack);
		}
	});
});

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	try {
		await navigate(address.value);
	} catch (error) {
		showErrorScreen(error.message, error.stack);
	}
});

const goto = new URL(location.href).searchParams.get("goto");
if (goto) {
	history.replaceState(null, "", location.pathname);
	address.value = goto;
	navigate(goto).catch((error) => showErrorScreen(error.message, error.stack));
}
