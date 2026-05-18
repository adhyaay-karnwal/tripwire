/** Safe `location.search` → `?a=b` suffix for hrefs (handles string or parsed object). */
export function locationSearchToQuerySuffix(search: unknown): string {
	if (search == null || search === "") return "";
	if (typeof search === "string") {
		if (search === "" || search === "?") return "";
		return search.startsWith("?") ? search : `?${search}`;
	}
	if (typeof search === "object") {
		const sp = new URLSearchParams(
			Object.entries(search as Record<string, unknown>)
				.filter(([, v]) => v != null && v !== "")
				.map(([k, v]) => [k, String(v)]),
		);
		const s = sp.toString();
		return s ? `?${s}` : "";
	}
	return "";
}
