import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { locationSearchToQuerySuffix } from "./search-serialization";

export const Route = createFileRoute("/_app/$orgHandle/rules")({
	beforeLoad: ({ location, params }) => {
		const { orgHandle } = params as { orgHandle: string };
		if (location.pathname === `/${orgHandle}/rules`) {
			const qs = locationSearchToQuerySuffix(location.search);
			const hash = typeof location.hash === "string" ? location.hash : "";
			throw redirect({
				href: `/${orgHandle}/rules/${qs}${hash}`,
				replace: true,
			});
		}
	},
	component: RulesLayout,
});

function RulesLayout() {
	return <Outlet />;
}
