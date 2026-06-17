import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import type { Configuracion } from "@/type/Configuracion.interface";
import { useBindStore } from "@/store/bind.store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracion/")({
	loader: async () => {
		return useBindStore.getState().configuracion;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const valores: Configuracion = Route.useLoaderData();
	const actualizar = useBindStore((state) => state.actualizar_configuracion);
	const zonas = useBindStore((state) => state.zonas);
	const zonasDisponibles = Object.keys(zonas);
	const sinZonas = zonasDisponibles.length === 0;

	const formulario = useForm({
		defaultValues: {
			...valores,
			rpzZonas: valores.rpzZonas ?? [],
		},
		onSubmit: async ({ value }) => {
			const check = actualizar(value);

			if (!check) {
				toast.error("No se pudieron actualizar las configuraciones");
			}

			toast.success("Configuracion actualizada correctamente");
		},
	});

	return (
		<section className="flex flex-1 flex-col gap-6 p-6 max-w-225">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					formulario.handleSubmit();
				}}
			>
				{/* Header de la pagina */}
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Configuracion general
					</h1>

					<p className="mt-2 text-sm text-muted-foreground">
						Administra las opciones globales del servidor DNS.
					</p>
				</div>

				{/* Informacion basica */}
				<Card>
					<CardHeader>
						<CardTitle>named.conf.options</CardTitle>
					</CardHeader>

					<CardContent>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Configura parametros globales como servidores forwarders,
							recursion, interfaces de escucha, permisos de consulta y politicas
							RPZ. Los valores definidos aqui se utilizaran para generar
							automaticamente el archivo de configuracion principal de BIND9.
						</p>
					</CardContent>
				</Card>

				{/* General */}
				<Card>
					<CardHeader>
						<CardTitle>General</CardTitle>
						<CardDescription>
							Configuracion general y basica del servidor DNS.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						<div className="space-y-2">
							<formulario.Field name="hideVersion">
								{(field) => (
									<>
										<p className="font-medium">Ocultar version</p>
										<Input
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="CraftBind DNS"
										/>
										<p className="text-xs text-muted-foreground">
											Valor que se mostrara cuando un host consulte la version
											del servidor DNS.
										</p>
									</>
								)}
							</formulario.Field>
						</div>

						<div className="space-y-2">
							<p className="font-medium">Validacion DNSSEC</p>
							<formulario.Field name="dnssecValidation">
								{(field) => (
									<Select
										value={field.state.value}
										onValueChange={(value) =>
											field.handleChange(
												value as Configuracion["dnssecValidation"],
											)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecciona una opcion" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="auto">
												Automatica (Recomendado)
											</SelectItem>
											<SelectItem value="yes">Habilitada</SelectItem>
											<SelectItem value="no">Deshabilitada</SelectItem>
										</SelectContent>
									</Select>
								)}
							</formulario.Field>
							<p className="text-xs text-muted-foreground">
								Configura la directiva <code>dnssec-validation</code>.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Escucha */}
				<Card>
					<CardHeader>
						<CardTitle>Escucha</CardTitle>
						<CardDescription>
							Configura las interfaces de escucha para IPv4 e IPv6.
						</CardDescription>
					</CardHeader>

					<CardContent className="grid gap-4 md:grid-cols-2">
						<formulario.Field name="escucha.ipv4">
							{(field) => (
								<div className="flex items-center justify-between rounded-lg border p-4">
									<div>
										<p className="font-medium">IPv4</p>
										<p className="text-sm text-muted-foreground">
											Escuchar consultas mediante IPv4.
										</p>
									</div>
									<Checkbox
										checked={field.state.value}
										onCheckedChange={(checked) => field.handleChange(!!checked)}
									/>
								</div>
							)}
						</formulario.Field>

						<formulario.Field name="escucha.ipv6">
							{(field) => (
								<div className="flex items-center justify-between rounded-lg border p-4">
									<div>
										<p className="font-medium">IPv6</p>
										<p className="text-sm text-muted-foreground">
											Escuchar consultas mediante IPv6.
										</p>
									</div>
									<Checkbox
										checked={field.state.value}
										onCheckedChange={(checked) => field.handleChange(!!checked)}
									/>
								</div>
							)}
						</formulario.Field>
					</CardContent>
				</Card>

				{/* Recursion */}
				<formulario.Field name="recursionForwarders">
					{(field) => (
						<Card>
							<CardHeader>
								<CardTitle>Recursion</CardTitle>
								<CardDescription>
									Permite que el servidor DNS consulte servidores externos para
									resolver nombres que no puedan responderse con las zonas
									configuradas localmente.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<Textarea
									className="h-24"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Ingrese las direcciones IP de los servidores DNS externos, separadas por comas."
								/>
								<p className="text-sm text-muted-foreground">
									Ejemplo: 1.1.1.1, 8.8.8.8
								</p>
							</CardContent>
						</Card>
					)}
				</formulario.Field>

				{/* Allow Query */}
				<formulario.Field name="allowQuery">
					{(field) => (
						<Card>
							<CardHeader>
								<CardTitle>Permitir consultas</CardTitle>
								<CardDescription>
									Define que direcciones IP o redes pueden realizar consultas
									DNS a este servidor.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Textarea
									className="min-h-24 font-mono"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="any;"
								/>
								<p className="mt-2 text-xs text-muted-foreground">
									Ejemplos de valores validos para la directiva{" "}
									<code>allow-query</code>.
								</p>
								<div className="mt-2 flex flex-wrap gap-2">
									<Badge variant="secondary">any;</Badge>
									<Badge variant="secondary">none;</Badge>
									<Badge variant="secondary">192.168.1.10;</Badge>
									<Badge variant="secondary">192.168.1.0/24;</Badge>
									<Badge variant="secondary">
										192.168.1.10; 192.168.1.11; 192.168.1.12;
									</Badge>
								</div>
							</CardContent>
						</Card>
					)}
				</formulario.Field>

				{/* Allow Transfer */}
				<formulario.Field name="allowTransfer">
					{(field) => (
						<Card>
							<CardHeader>
								<CardTitle>Permitir transferencias de zona</CardTitle>
								<CardDescription>
									Define que servidores pueden copiar las zonas DNS configuradas
									en este servidor. Se recomienda mantener esta opcion
									deshabilitada salvo que utilices servidores secundarios.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Textarea
									className="min-h-24 font-mono"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="none;"
								/>
								<p className="mt-2 text-xs text-muted-foreground">
									Ejemplos de valores validos para la directiva{" "}
									<code>allow-transfer</code>.
								</p>
								<div className="mt-2 flex flex-wrap gap-2">
									<Badge variant="secondary">none;</Badge>
									<Badge variant="secondary">any;</Badge>
									<Badge variant="secondary">192.168.1.20;</Badge>
									<Badge variant="secondary">192.168.1.20; 192.168.1.21;</Badge>
									<Badge variant="secondary">192.168.1.0/24;</Badge>
								</div>
							</CardContent>
						</Card>
					)}
				</formulario.Field>

				{/* Allow Update */}
				<formulario.Field name="allowUpdate">
					{(field) => (
						<Card>
							<CardHeader>
								<CardTitle>Permitir actualizaciones dinamicas</CardTitle>
								<CardDescription>
									Define que hosts pueden modificar registros DNS mediante
									actualizaciones dinamicas (DDNS). En la mayoria de los
									entornos esta opcion debe permanecer deshabilitada.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Textarea
									className="min-h-24 font-mono"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="none;"
								/>
								<p className="mt-2 text-xs text-muted-foreground">
									Ejemplos de valores validos para la directiva{" "}
									<code>allow-update</code>.
								</p>
								<div className="mt-2 flex flex-wrap gap-2">
									<Badge variant="secondary">none;</Badge>
									<Badge variant="secondary">192.168.1.50;</Badge>
									<Badge variant="secondary">192.168.1.60;</Badge>
									<Badge variant="secondary">192.168.1.0/24;</Badge>
								</div>
							</CardContent>
						</Card>
					)}
				</formulario.Field>

				{/* RPZ */}
				<formulario.Field name="rpzZonas">
					{(field) => (
						<Card className={sinZonas ? "opacity-50" : ""}>
							<CardHeader>
								<CardTitle>Response Policy Zones (RPZ)</CardTitle>
								<CardDescription>
									{sinZonas
										? "Debes crear al menos una zona para habilitar RPZ."
										: "Selecciona las zonas que actuaran como politicas de respuesta DNS."}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								{sinZonas ? (
									<p className="text-sm text-muted-foreground">
										Ve a <span className="font-medium">Zonas</span> para crear
										una zona primero.
									</p>
								) : (
									zonasDisponibles.map((zona) => {
										const activa = (field.state.value ?? []).includes(zona);
										return (
											<div
												key={zona}
												className="flex items-center justify-between rounded-lg border p-4"
											>
												<div>
													<p className="font-medium font-mono">{zona}</p>
													<p className="text-sm text-muted-foreground">
														zone "{zona}"
													</p>
												</div>
												<Checkbox
													checked={activa}
													onCheckedChange={(checked) => {
														if (checked) {
															field.handleChange([
																...(field.state.value ?? []),
																zona,
															]);
														} else {
															field.handleChange(
																(field.state.value ?? []).filter(
																	(z) => z !== zona,
																),
															);
														}
													}}
												/>
											</div>
										);
									})
								)}
							</CardContent>
						</Card>
					)}
				</formulario.Field>

				{/* Aplicar */}
				<Card>
					<CardHeader>
						<CardTitle>Aplicar cambios</CardTitle>
						<CardDescription>
							Guarda y aplica la configuracion del servidor DNS.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Los cambios se aplicaran inmediatamente al sistema.
						</p>
						<Button type="submit" className="px-6">
							Actualizar
						</Button>
					</CardContent>
				</Card>
			</form>
		</section>
	);
}
