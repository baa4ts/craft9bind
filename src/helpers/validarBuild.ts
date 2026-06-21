// src/helpers/validarBuild.ts
import type { Configuracion } from "@/type/Configuracion.interface";
import type { SoaHead } from "@/type/SoaHead.interface";
import type { ZoneRecord } from "@/type/Zona.interface";

const validar_soa = (soa: SoaHead): boolean => {
	if (!soa.origin || !soa.adminEmail || !soa.authoritativeServer) return false;
	if (!soa.nameServers || soa.nameServers.length === 0) return false;
	if (!soa.serial || !soa.ttl || !soa.refresh || !soa.retry || !soa.expire)
		return false;
	return true;
};

export const validar_build = (
	zonas: Record<string, SoaHead>,
	registros: Record<string, ZoneRecord[]>,
	_configuracion: Configuracion,
): boolean => {
	const nombres = Object.keys(zonas);

	if (nombres.length === 0) return false;

	return nombres.every((nombre) => {
		const soa = zonas[nombre];
		if (!validar_soa(soa)) return false;

		const tieneRegistros = (registros[nombre]?.length ?? 0) > 0;
		return tieneRegistros;
	});
};
