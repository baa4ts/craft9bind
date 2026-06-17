import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/AppSidebar";
import { Toaster } from "sonner";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<SidebarProvider>
			<AppSidebar />

			<main className="flex flex-1 flex-col">
				<header className="border-b-2 border-black/20 h-12 flex flex-row items-center">
					<SidebarTrigger />
				</header>
				<Outlet />
				<Toaster position="top-center" />
			</main>
		</SidebarProvider>
	);
}
