import {
	RECORD_TYPES,
	type RecordClass,
	type RecordType,
	type ZoneRecord,
} from "@/type/Zona.interface";

export function parsear_manual(raw: string, zona?: string): ZoneRecord | null {
	const partes = raw.trim().split(/\s+/);
	if (partes.length < 4) return null;

	let i = 0;
	const name = partes[i++];

	let ttl: number | undefined;
	if (!isNaN(Number(partes[i]))) {
		ttl = Number(partes[i++]);
	}

	let clase: RecordClass = "IN";
	if (["IN", "CH", "HS"].includes(partes[i])) {
		clase = partes[i++] as RecordClass;
	}

	const type = partes[i++] as RecordType;
	if (!RECORD_TYPES.includes(type)) return null;

	let priority: number | undefined;
	if ((type === "MX" || type === "SRV") && !isNaN(Number(partes[i]))) {
		priority = Number(partes[i++]);
	}

	const value = partes.slice(i).join(" ");
	if (!value) return null;

	return { name, ttl, class: clase, type, value, priority };
}
