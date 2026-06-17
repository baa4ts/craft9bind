import { createFileRoute, useNavigate } from "@tanstack/react-router";

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
import { Badge } from "@/components/ui/badge";
import { PrevieConf } from "@/components/custom/PrevieConf";
import { useForm } from "@tanstack/react-form";
import { ValidarCambio } from "@/validators/zones/nueva.validator";
import { useBindStore } from "@/store/bind.store";
import { toast } from "sonner";

export const Route = createFileRoute("/zonas/nueva")({
	component: RouteComponent,
});

function RouteComponent() {
	const agregar = useBindStore((state) => state.agregar_zona);
	const navigate = useNavigate();

	const formulario = useForm({
		defaultValues: {
			nombre: "",
		},
		onSubmit: ({ value }) => {
			const check = agregar(value.nombre);

			// Si fallo
			if (!check) {
				toast.error("La zona ya existe");
				return;
			}

			// Si es correcto
			toast.success("Zona creada " + value.nombre);
			navigate({
				to: "/zonas/$zona",
				params: { zona: value.nombre },
			});
		},
	});

	return (
		<section className="flex flex-1 flex-col gap-6 p-6 max-w-225">
			<Card>
				<CardHeader>
					<CardTitle>Nueva zona</CardTitle>

					<CardDescription>
						Crea una nueva zona DNS autoritativa para BIND9.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							formulario.handleSubmit();
						}}
						className="space-y-4"
					>
						<formulario.Field
							name="nombre"
							validators={{ onChange: ValidarCambio }}
						>
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Nombre de la zona</Label>

									<Input
										id={field.name}
										name={field.name}
										placeholder="empresa.local"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>

									<p className="text-xs text-muted-foreground">
										Se utilizara para generar la entrada en
										<code className="mx-1">named.conf.local</code>y el archivo
										de zona correspondiente.
									</p>

									{field.state.meta.errors.length > 0 && (
										<p className="text-xs text-destructive">
											{field.state.meta.errors.join(", ")}
										</p>
									)}
								</div>
							)}
						</formulario.Field>

						<Button type="submit">Crear zona</Button>
					</form>
				</CardContent>
			</Card>

			{/* Previe */}
			<Card>
				<CardHeader>
					<Badge>named.conf.local</Badge>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					<formulario.Subscribe selector={(state) => state.values.nombre}>
						{(nombre) => <PrevieConf nombre={nombre} />}
					</formulario.Subscribe>
				</CardContent>
			</Card>
		</section>
	);
}
