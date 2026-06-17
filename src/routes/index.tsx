import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex h-full w-full flex-1 items-center justify-center">
			<div className="flex items-center gap-4">
				<div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-violet-600 text-5xl font-black text-white">
					9
				</div>

				<span className="text-5xl font-bold">craftbind</span>
			</div>
		</div>
	);
}
