/** Format camelCase to Title Case: "accountAge" → "Account Age" */
export function formatCamelCase(key: string): string {
	return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}

/** Create a Record proxy that returns overrides or auto-formats unknown keys */
export function createLabelProxy(overrides: Record<string, string>): Record<string, string> {
	return new Proxy(overrides, {
		get(target, prop: string) {
			return target[prop] ?? formatCamelCase(prop);
		},
	});
}
