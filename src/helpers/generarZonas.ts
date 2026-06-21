import type { SoaHead } from "@/type/SoaHead.interface";
import type { ZoneRecord } from "@/type/Zona.interface";

export const generarZonaDb = (
	soa: SoaHead,
	registros: ZoneRecord[],
	nombre?: string,
): string => {
	const records = registros
		.map(
			(r) =>
				`${r.name.padEnd(20)} ${r.ttl ?? ""}${r.ttl ? " " : ""}${r.class ?? "IN"} ${r.type} ${r.priority ? `${r.priority} ` : ""}${r.value}`,
		)
		.join("\n");

	return `$ORIGIN ${soa.origin}.
$TTL ${soa.ttl}

@ IN SOA ${soa.authoritativeServer}. ${soa.adminEmail}. (
    ${soa.serial}      ; serial
    ${soa.refresh}     ; refresh
    ${soa.retry}       ; retry
    ${soa.expire}      ; expire
    ${soa.negativeTtl} ; negative ttl
)

${soa.nameServers.map((ns) => `@ IN NS ${ns}.`).join("\n")}

${records}`;
};
