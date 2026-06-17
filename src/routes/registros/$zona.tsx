import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBindStore } from "@/store/bind.store";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
	type ZoneRecord,
	type RecordType,
	type RecordClass,
	RECORD_TYPES,
	RECORD_CLASSES,
} from "@/type/Zona.interface";
import { parsear_manual } from "@/helpers/format";

export const Route = createFileRoute("/registros/$zona")({
	component: RouteComponent,
});

type Modo = "form" | "manual";

function RouteComponent() {
	const { zona } = Route.useParams();
	const navigate = useNavigate();

	const zonas = useBindStore((s) => s.zonas);
	const registros = useBindStore((s) => s.registros);
	const agregar_registro = useBindStore((s) => s.agregar_registro);
	const eliminar_registro = useBindStore((s) => s.eliminar_registro);

	const [modo, setModo] = useState<Modo>("form");
	const [manual, setManual] = useState("");
	const [error_manual, setErrorManual] = useState<string | null>(null);

	useEffect(() => {
		if (!(zona in zonas)) {
			navigate({ to: "/" });
		}
	}, [zona, zonas]);

	const lista = registros[zona] ?? [];

	const form = useForm({
		defaultValues: {
			name: "",
			ttl: "",
			class: "IN" as RecordClass,
			type: "A" as RecordType,
			value: "",
			priority: "",
		},
		onSubmit: ({ value }) => {
			if (!value.name || !value.value) return;
			const registro: ZoneRecord = {
				name: value.name,
				ttl: value.ttl ? Number(value.ttl) : undefined,
				class: value.class,
				type: value.type,
				value: value.value,
				priority: value.priority ? Number(value.priority) : undefined,
			};
			agregar_registro(zona, registro);
			form.reset();
		},
	});

	const handleManual = () => {
		setErrorManual(null);
		const registro = parsear_manual(manual, zona);
		if (!registro) {
			setErrorManual("Formato invalido. Ejemplo: www 3600 IN A 192.168.1.1");
			return;
		}
		agregar_registro(zona, registro);
		setManual("");
	};

	return (
		<section className="flex flex-1 flex-col gap-6 p-6 max-w-3xl">
			<Card>
				<CardHeader>
					<CardTitle>Registros de {zona}</CardTitle>
					<CardDescription>
						Gestiona los registros DNS de la zona {zona}
					</CardDescription>
				</CardHeader>

				<CardContent className="flex flex-col gap-4">
					{/* Toggle modo */}
					<div className="flex gap-2">
						<Button
							variant={modo === "form" ? "default" : "outline"}
							size="sm"
							onClick={() => setModo("form")}
						>
							Formulario
						</Button>
						<Button
							variant={modo === "manual" ? "default" : "outline"}
							size="sm"
							onClick={() => setModo("manual")}
						>
							Escribir a mano
						</Button>
					</div>

					{/* Modo formulario */}
					{modo === "form" && (
						<div className="flex flex-col gap-2">
							<div className="grid grid-cols-2 gap-2">
								<form.Field name="name">
									{(field) => (
										<Input
											placeholder="name (@, www, mail...)"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
									)}
								</form.Field>

								<form.Field name="ttl">
									{(field) => (
										<Input
											placeholder="TTL (opcional)"
											type="number"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
									)}
								</form.Field>

								<form.Field name="class">
									{(field) => (
										<Select
											value={field.state.value}
											onValueChange={(v) =>
												field.handleChange(v as RecordClass)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Class" />
											</SelectTrigger>
											<SelectContent>
												{RECORD_CLASSES.map((c) => (
													<SelectItem key={c} value={c}>
														{c}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								</form.Field>

								<form.Field name="type">
									{(field) => (
										<Select
											value={field.state.value}
											onValueChange={(v) => field.handleChange(v as RecordType)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Type" />
											</SelectTrigger>
											<SelectContent>
												{RECORD_TYPES.map((t) => (
													<SelectItem key={t} value={t}>
														{t}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								</form.Field>

								<form.Subscribe selector={(s) => s.values.type}>
									{(type) => (
										<>
											<form.Field name="value">
												{(field) => (
													<Input
														className={
															type === "MX" || type === "SRV"
																? ""
																: "col-span-2"
														}
														placeholder="value"
														value={field.state.value}
														onChange={(e) => field.handleChange(e.target.value)}
													/>
												)}
											</form.Field>

											{(type === "MX" || type === "SRV") && (
												<form.Field name="priority">
													{(field) => (
														<Input
															placeholder="Priority"
															type="number"
															value={field.state.value}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
														/>
													)}
												</form.Field>
											)}
										</>
									)}
								</form.Subscribe>
							</div>

							<Button onClick={form.handleSubmit}>Agregar registro</Button>
						</div>
					)}

					{/* Modo manual */}
					{modo === "manual" && (
						<div className="flex flex-col gap-2">
							<Textarea
								className="font-mono text-sm"
								placeholder="www 3600 IN A 192.168.1.1"
								value={manual}
								onChange={(e) => setManual(e.target.value)}
								rows={2}
							/>
							{error_manual && (
								<p className="text-sm text-destructive">{error_manual}</p>
							)}
							<Button onClick={handleManual}>Agregar registro</Button>
						</div>
					)}

					{/* Lista */}
					{lista.length > 0 && (
						<div className="flex flex-col gap-2 mt-2">
							{lista.map((r, i) => (
								<div
									key={i}
									className="flex items-center justify-between rounded-md border px-3 py-2 text-sm font-mono"
								>
									<span className="text-muted-foreground">
										{r.name} {r.ttl ?? ""} {r.class ?? "IN"} {r.type}{" "}
										{r.priority ? `${r.priority} ` : ""}
										{r.value}
									</span>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => eliminar_registro(zona, i)}
									>
										✕
									</Button>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</section>
	);
}
