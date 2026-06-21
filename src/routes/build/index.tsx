import { generarLocales } from "@/helpers/generarLocales";
import { generarOpciones } from "@/helpers/generarOpciones";
import { generarZonaDb } from "@/helpers/generarZonas";
import { useBindStore } from "@/store/bind.store";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import JSZip from "jszip";

export const Route = createFileRoute("/build/")({
	component: RouteComponent,
});

function RouteComponent() {
	const configuracion = useBindStore((s) => s.configuracion);
	const zonas = useBindStore((s) => s.zonas);
	const registros = useBindStore((s) => s.registros);

	const archivos: { nombre: string; contenido: string }[] = [
		{
			nombre: "named.conf.options",
			contenido: generarOpciones(configuracion),
		},
		{
			nombre: "named.conf.local",
			contenido: generarLocales(Object.keys(zonas)),
		},
		...Object.entries(zonas).map(([nombre, soa]) => ({
			nombre: `zones/${nombre}`,
			contenido: generarZonaDb(soa, registros[nombre] ?? [], nombre),
		})),
	];

	const descargar = async () => {
		const zip = new JSZip();
		archivos.forEach(({ nombre, contenido }) => zip.file(nombre, contenido));
		const blob = await zip.generateAsync({ type: "blob" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "bind9-config.zip";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<section className="flex flex-1 flex-col gap-6 p-6 max-w-3xl">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Build</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Genera y descarga los archivos de configuracion de BIND9.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Archivos generados</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					{archivos.map(({ nombre }) => (
						<div
							key={nombre}
							className="flex items-center gap-2 rounded-md border px-3 py-2"
						>
							<Badge variant="secondary" className="font-mono text-xs">
								{nombre}
							</Badge>
						</div>
					))}
				</CardContent>
			</Card>

			<Button onClick={descargar} className="w-fit">
				Descargar ZIP
			</Button>
		</section>
	);
}
