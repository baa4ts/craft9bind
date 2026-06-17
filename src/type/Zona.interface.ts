export type RecordType =
	| "A"
	| "AAAA"
	| "CNAME"
	| "MX"
	| "NS"
	| "TXT"
	| "PTR"
	| "SOA"
	| "SRV";
export const RECORD_TYPES: RecordType[] = [
	"A",
	"AAAA",
	"CNAME",
	"MX",
	"NS",
	"TXT",
	"PTR",
	"SOA",
	"SRV",
];

export type RecordClass = "IN" | "CH" | "HS";
export const RECORD_CLASSES: RecordClass[] = ["IN", "CH", "HS"];

export interface ZoneRecord {
	name: string;
	ttl?: number;
	class?: RecordClass;
	type: RecordType;
	value: string;
	priority?: number;
}
