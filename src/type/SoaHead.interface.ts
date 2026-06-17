export interface SoaHead {
	ttl: string;
	origin: string;
	authoritativeServer: string;
	adminEmail: string;
	serial: string;
	refresh: string;
	retry: string;
	expire: string;
	negativeTtl: string;
	nameServers: string[];
}
