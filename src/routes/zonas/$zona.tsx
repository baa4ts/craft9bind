import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { useForm, useStore } from "@tanstack/react-form";
import { PreviewSoaHeader } from "@/components/custom/PreviewDB";
import { useBindStore } from "@/store/bind.store";
import { toast } from "sonner";

export const Route = createFileRoute("/zonas/$zona")({
	loader: async ({ params }) => {
		const { zona } = params;
		const zonaData = useBindStore.getState().zonas[zona];

		return zonaData ?? null;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { zona } = Route.useParams();
	const loaderData = Route.useLoaderData();
	const actualizar = useBindStore((state) => state.actualizar_zona);

	const formulario = useForm({
		defaultValues: loaderData,
		onSubmit: async ({ value }) => {
			const success = actualizar(zona, value);
			if (success) {
				toast.success("Zona actualizada");
				return;
			}

			toast.error("Error al actualizar la zona");
		},
	});

	//
	// Reactividad
	//
	const nameServers = useStore(
		formulario.store,
		(state) => state.values.nameServers,
	);
	const code = useStore(formulario.store, (state) => state.values);

	//
	// Acciones
	//
	const removerNameServer = (index: number) => {
		formulario.setFieldValue(
			"nameServers",
			nameServers.filter((_, i) => i !== index),
		);
	};

	const agregarNameServer = () => {
		formulario.setFieldValue("nameServers", [...nameServers, ""]);
	};

	return (
		<section className="flex flex-1 flex-col gap-6 p-6 max-w-225">
			<Card>
				<CardHeader>
					<CardTitle>SOA / NS</CardTitle>
					<CardDescription>
						Configuracion base de la zona {zona}
					</CardDescription>
				</CardHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						formulario.handleSubmit();
					}}
					className="space-y-4"
				>
					<CardContent className="flex flex-col gap-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Soa host */}
							<div className="flex flex-col gap-1.5">
								<formulario.Field name="authoritativeServer">
									{(field) => (
										<>
											<Label htmlFor="authoritativeServer">
												Servidor autoritativo (SOA)
											</Label>
											<Input
												id="authoritativeServer"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="localhost"
											/>
										</>
									)}
								</formulario.Field>
							</div>

							{/* Soa email */}
							<div className="flex flex-col gap-1.5">
								<formulario.Field name="adminEmail">
									{(field) => (
										<>
											<Label htmlFor="adminEmail">
												Email del administrador
											</Label>
											<Input
												id="adminEmail"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="admin.localhost"
											/>
										</>
									)}
								</formulario.Field>
							</div>
						</div>

						<div className="border-t pt-4">
							<p className="text-sm text-muted-foreground mb-3">
								Parametros de tiempo (segundos)
							</p>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
								{[
									{ id: "ttl" as const, label: "TTL" },
									{ id: "serial" as const, label: "Serial" },
									{ id: "refresh" as const, label: "Refresh" },
									{ id: "retry" as const, label: "Retry" },
									{ id: "expire" as const, label: "Expire" },
									{ id: "negativeTtl" as const, label: "Negative TTL" },
								].map((F) => (
									<div key={F.id} className="bg-muted rounded-md p-3">
										<formulario.Field name={F.id}>
											{(field) => (
												<>
													<Label
														htmlFor={F.id}
														className="text-xs text-muted-foreground"
													>
														{F.label}
													</Label>
													<Input
														id={F.id}
														type="number"
														value={field.state.value}
														onChange={(e) => field.handleChange(e.target.value)}
														placeholder={String(field.state.value)}
													/>
												</>
											)}
										</formulario.Field>
									</div>
								))}
							</div>
						</div>

						<div className="border-t pt-4">
							<div className="flex items-center justify-between mb-3">
								<p className="text-sm text-muted-foreground">
									Servidores de nombres (NS)
								</p>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={agregarNameServer}
									className="h-7 gap-1"
								>
									<Plus className="size-3.5" />
									Agregar NS
								</Button>
							</div>

							<div className="flex flex-col gap-2">
								{nameServers.map((_, index) => (
									<formulario.Field
										key={index}
										name={`nameServers[${index}]` as any}
									>
										{(field) => (
											<div className="flex items-center gap-2">
												<Input
													value={field.state.value}
													placeholder="ns1.red.lan."
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													className="max-w-sm"
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => removerNameServer(index)}
													disabled={nameServers.length === 1}
													className="h-9 w-9 text-muted-foreground"
												>
													<X className="size-4" />
												</Button>
											</div>
										)}
									</formulario.Field>
								))}
							</div>
						</div>

						<div className="flex justify-end">
							<Button type="submit">Guardar</Button>
						</div>
					</CardContent>
				</form>
			</Card>

			<Card>
				<CardHeader>
					<Badge>/etc/bind/zones/{zona}</Badge>
				</CardHeader>
				<CardContent>
					<PreviewSoaHeader datos={code} />
				</CardContent>
			</Card>
		</section>
	);
}
