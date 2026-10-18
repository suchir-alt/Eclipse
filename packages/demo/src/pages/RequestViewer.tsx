import { css, createState, type Component } from "dreamland/core";
import { Plugin } from "@mercuryworkshop/scramjet";
import type { Frame } from "@mercuryworkshop/scramjet-controller";
import Monaco from "../components/Monaco";
import { demoSettingsStore } from "../store";
import { browserState } from "./BrowserView";

type RequestEntry = {
  id: string;
  method: string;
  url: string;
  destination?: string;
  status?: number;
  statusText?: string;
  durationMs?: number;
  contentType?: string;
  requestHeadersPre: Array<[string, string]>;
  requestHeaders: Array<[string, string]>;
  responseHeadersPre?: Array<[string, string]>;
  responseHeaders?: Array<[string, string]>;
  requestBodyPreview?: string;
  responseBodyPreview?: string;
};

const normalizeHeaders = (
  headers?: Headers | Array<[string, string]> | Record<string, string> | null,
): Array<[string, string]> => {
  if (!headers) return [];
  if (Array.isArray(headers)) return headers;
  const rawHeaders = headers as Headers & {
    toRawHeaders?: () => Array<[string, string]>;
  };
  if (rawHeaders.toRawHeaders) return rawHeaders.toRawHeaders();
  if (headers instanceof Headers) return [...headers.entries()];
  return Object.entries(headers);
};

export const requestsState = createState({
  requests: [] as RequestEntry[],
});

const RequestViewer: Component<
  {
    active?: boolean;
  },
  {
    selectedId: string | null;
    search: string;
    captureStreamBodies: boolean;
    selectedRequest: RequestEntry | null;
    responseHeadersView: "pre" | "post";
    requestHeadersView: "pre" | "post";
    responseBodyView: "pre" | "post";
    pluginReady: boolean;
    requestSeq: number;
    requestIdByRequest: WeakMap<object, string>;
    requestStartByRequest: WeakMap<object, number>;
    listEl?: HTMLDivElement;
    pendingListRestore?: number;
    listAnchor?: {
      x: number;
      y: number;
    };
    toggleSheet: boolean;
  }
> = function (cx) {
  this.search ??= "";
  this.captureStreamBodies ??= false;
  this.selectedId ??= "";
  this.selectedRequest ??= null;
  this.responseHeadersView ??= "pre";
  this.requestHeadersView ??= "pre";
  this.responseBodyView ??= "pre";
  this.pluginReady ??= false;
  this.requestSeq ??= 0;
  this.requestIdByRequest ??= new WeakMap();
  this.requestStartByRequest ??= new WeakMap();
  this.pendingListRestore ??= 0;
  this.listAnchor ??= { x: 0, y: 0 };
  this.toggleSheet ??= false;

  const initializeRequestCapture = (frame: Frame) => {
    if (this.pluginReady) return;

    const plugin = new Plugin("demo-request-viewer");
    plugin.tap(frame.hooks.fetch.request, (context, props) => {
      const request = context.request as object;
      const id = `${Date.now()}-${++this.requestSeq}`;
      const entry: RequestEntry = {
        id,
        method: context.request.method,
        url: props.url?.toString?.() ?? context.parsed.url.toString(),
        destination: context.request.destination,
        requestHeadersPre: normalizeHeaders(
          context.request.initialHeaders.toRawHeaders(),
        ),
        requestHeaders: normalizeHeaders(props.init?.headers),
      };

      this.requestIdByRequest.set(request, id);
      this.requestStartByRequest.set(request, performance.now());
      requestsState.requests = [...requestsState.requests, entry].slice(
        -demoSettingsStore.maxRequests,
      );

      if (!this.selectedId) {
        this.selectedId = id;
        this.selectedRequest = entry;
      }
    });

    plugin.tap(frame.hooks.fetch.response, (context, props) => {
      const request = context.request as object;
      const id = this.requestIdByRequest.get(request);
      if (!id) return;

      const response = props.response;
      const responseHeaders = normalizeHeaders(response.headers);
      const contentType = response.headers.get("content-type") ?? undefined;
      const start = this.requestStartByRequest.get(request);
      const updatedEntry = requestsState.requests.find(
        (entry) => entry.id === id,
      );
      if (!updatedEntry) return;

      const nextEntry: RequestEntry = {
        ...updatedEntry,
        status: response.status,
        statusText: response.statusText,
        durationMs:
          start === undefined
            ? undefined
            : Math.max(0, Math.round(performance.now() - start)),
        contentType,
        responseHeaders,
      };
      requestsState.requests = requestsState.requests.map((entry) =>
        entry.id === id ? nextEntry : entry,
      );
      if (this.selectedId === id) this.selectedRequest = nextEntry;
    });

    this.pluginReady = true;
  };

  const activeSignal = use(this.active ?? false, browserState.frame).map(
    ([active, frame]) => {
      if (active && frame) initializeRequestCapture(frame);
      return active;
    },
  );

  const renderRequestRow = (entry: RequestEntry, idx: number) => {
    const isSelected = this.selectedId === entry.id;
    const filtered = use(this.search).map((q) => {
      const lower = q.toLowerCase();
      const haystack = [
        entry.method,
        entry.url,
        entry.destination ?? "",
        entry.status?.toString() ?? "",
        entry.contentType ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return lower === "" || haystack.includes(lower);
    });
    const show = filtered === true || filtered === undefined;
    if (!show) return null;

    return (
      <div
        class={`request-item ${isSelected ? "request-item--active" : ""}`}
        on:click={() => {
          this.selectedId = entry.id;
          this.selectedRequest = entry;
        }}
        tabindex="0"
        role="button"
        aria-label={`View request ${entry.url}`}
      >
        <div class="request-item-main">
          <div class="request-item-method">{entry.method}</div>
          <div class="request-item-url" title={entry.url}>
            {entry.url}
          </div>
        </div>
        <div class="request-item-meta">
          <span class="request-item-status">
            {entry.status ?? "–"}
            {entry.statusText ? ` ${entry.statusText}` : ""}
          </span>
          <span class="request-item-duration">
            {entry.durationMs ? `${entry.durationMs}ms` : "–"}
          </span>
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    const entry = this.selectedRequest;
    if (!entry)
      return <div class="requests-empty">Select a request to inspect</div>;

    const headers = (view: "pre" | "post", type: "request" | "response") => {
      const pre =
        type === "request" ? entry.requestHeadersPre : entry.responseHeadersPre;
      const post =
        type === "request" ? entry.requestHeaders : entry.responseHeaders;
      const preferred = view === "pre" ? pre : post;
      const fallback = view === "pre" ? post : pre;
      const arr = preferred?.length ? preferred : fallback || [];
      return arr.map(([k, v]) => (
        <div class="detail-meta-row">
          <span class="detail-meta-key">{k}</span>
          <span class="header-value">{v}</span>
        </div>
      ));
    };

    return (
      <div class="request-detail">
        <div class="detail-header">
          <span class="detail-method">{entry.method}</span>
          <span class="detail-url" title={entry.url}>
            {entry.url}
          </span>
          <span class="detail-status">
            {entry.status ?? "–"}{" "}
            {entry.statusText ? `${entry.statusText}` : ""}
          </span>
        </div>

        <div class="detail-sections">
          <div class="detail-section">
            <div class="detail-section-header">
              <span class="detail-section-title">Request URL</span>
            </div>
            <div class="detail-body">
              <code class="detail-code">{entry.url}</code>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-header">
              <span class="detail-section-title">Request Method</span>
            </div>
            <div class="detail-body">
              <code class="detail-code">{entry.method}</code>
            </div>
          </div>

          <div class="detail-section">
            <details class="detail-section">
              <summary class="detail-section-title">Request Headers</summary>
              <div class="detail-body">
                <div class="detail-meta-table">
                  {headers(this.requestHeadersView, "request") || (
                    <div class="headers-empty">No request headers captured</div>
                  )}
                </div>
              </div>
            </details>
          </div>

          <div class="detail-section">
            <details class="detail-section">
              <summary class="detail-section-title">Response Headers</summary>
              <div class="detail-body">
                <div class="detail-meta-table">
                  {headers(this.responseHeadersView, "response") || (
                    <div class="headers-empty">
                      No response headers captured
                    </div>
                  )}
                </div>
              </div>
            </details>
          </div>

          <div class="detail-section">
            <details class="detail-section">
              <summary class="detail-section-title">Request Body</summary>
              <div class="detail-body">
                {entry.requestBodyPreview ? (
                  <Monaco
                    value={entry.requestBodyPreview}
                    language={"json"}
                    fill={true}
                  />
                ) : (
                  <div class="headers-empty">No request body captured</div>
                )}
              </div>
            </details>
          </div>

          <div class="detail-section">
            <details class="detail-section">
              <summary class="detail-section-title">Response Body</summary>
              <div class="detail-body">
                {entry.responseBodyPreview ? (
                  <Monaco
                    value={entry.responseBodyPreview}
                    language={
                      entry.responseBodyPreview.includes("\n")
                        ? "plaintext"
                        : "json"
                    }
                    fill={true}
                  />
                ) : (
                  <div class="headers-empty">No response body captured</div>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      class={use(this.active).map((active) =>
        active ? "tab-panel requests-panel active" : "tab-panel",
      )}
    >
      {activeSignal.map(() => null)}
      <div class="requests-grid">
        <div class="requests-list-area">
          <div class="requests-toolbar">
            <div class="requests-search">
              <input
                class="requests-search-input"
                type="text"
                placeholder="Filter requests..."
                value={use(this.search)}
                on:input={(e) => {
                  this.search = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
            <div class="requests-count">
              {use(requestsState.requests).map((requests) =>
                requests.length ? `${requests.length} captured` : "0 captured",
              )}
            </div>
          </div>

          <div class="requests-list-scroll">
            <div
              class="requests-list"
              ref={(el) => {
                this.listEl = el;
              }}
            >
              {use(requestsState.requests).map((requests, listIdx) =>
                requests.map((entry, idx) => renderRequestRow(entry, idx)),
              )}
              {use(requestsState.requests).map((requests) =>
                requests.length === 0 ? (
                  <div class="requests-empty">No requests captured yet.</div>
                ) : null,
              )}
            </div>
          </div>
        </div>

        <div class="requests-detail-area">
          <div class="requests-detail-scroll">{renderDetail()}</div>
        </div>
      </div>
    </div>
  );
};

RequestViewer.style = css`
  :scope {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    min-height: 0;
    background: var(--bg-base);
    color: var(--text-primary);
  }

  .requests-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 16px;
    flex: 1;
    min-width: 0;
    min-height: 0;
    padding: 16px;
  }

  .requests-list-area {
    display: flex;
    flex-direction: column;
    min-width: 0;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .requests-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-bottom: 1px solid var(--border-default);
    background: var(--bg-surface-2);
  }

  .requests-search {
    flex: 1;
    min-width: 0;
  }

  .requests-search-input {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid var(--border-default);
    border-radius: var(--radius-sm);
    background: var(--bg-input);
    color: var(--text-primary);
    font-family: var(--font-sans);
    font-size: 0.85rem;
    box-sizing: border-box;
    outline: none;
  }

  .requests-search-input::placeholder {
    color: var(--text-muted);
  }

  .requests-search-input:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .requests-count {
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }

  .requests-list-scroll {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  .requests-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px;
  }

  .request-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    background: var(--bg-surface-2);
    cursor: pointer;
    transition:
      border-color 160ms ease,
      background 160ms ease,
      box-shadow 160ms ease;
  }

  .request-item:hover {
    border-color: rgba(106, 140, 255, 0.25);
    background: var(--bg-elevated);
  }

  .request-item--active {
    border-color: var(--accent-primary);
    background: var(--accent-glow);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .request-item-main {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 2px;
  }

  .request-item-method {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--accent-primary);
    letter-spacing: 0.06em;
  }

  .request-item-url {
    font-size: 0.78rem;
    color: var(--text-secondary);
    word-break: break-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .request-item-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .request-item-status {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .request-item-duration {
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  .request-detail {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .request-detail .detail-header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .detail-method {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--accent-primary);
    letter-spacing: 0.06em;
  }

  .detail-url {
    flex: 1;
    min-width: 0;
    font-size: 0.82rem;
    color: var(--text-primary);
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .detail-status {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .detail-sections {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .detail-section summary {
    list-style: none;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-primary);
    user-select: none;
  }

  .detail-section summary::-webkit-details-marker {
    display: none;
  }

  .detail-section summary::before {
    content: "▸";
    color: var(--text-muted);
    transition: transform 150ms ease;
    margin-right: 8px;
  }

  .detail-section[open] summary::before {
    transform: rotate(90deg);
  }

  .detail-body {
    margin-top: 10px;
  }

  .detail-code,
  .headers-empty {
    font-family: var(--font-mono);
    font-size: 0.74rem;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  .detail-code {
    background: var(--bg-input);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-sm);
    padding: 10px 12px;
    display: block;
    color: var(--text-primary);
    word-break: break-all;
  }

  .headers-empty {
    color: var(--text-muted);
    font-style: italic;
  }

  .detail-meta-table {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .detail-meta-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 12px;
    padding: 6px 8px;
    border-bottom: 1px solid var(--border-default);
  }

  .detail-meta-row:last-child {
    border-bottom: none;
  }

  .detail-meta-key {
    color: var(--text-muted);
    font-size: 0.72rem;
    letter-spacing: 0.02em;
  }

  .detail-meta-value {
    color: var(--text-secondary);
    word-break: break-word;
    line-height: 1.35;
  }

  .requests-empty {
    padding: 40px 16px;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  @media (max-width: 900px) {
    .requests-grid {
      grid-template-columns: 1fr;
    }

    .requests-list-area {
      order: 1;
    }

    .requests-detail-area {
      order: 2;
    }
  }
`;

export default RequestViewer;
