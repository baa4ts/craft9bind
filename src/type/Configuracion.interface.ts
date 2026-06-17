export interface Configuracion {
	hideVersion: string;
	dnssecValidation: "auto" | "yes" | "no";
	escucha: {
		ipv4: boolean;
		ipv6: boolean;
	};
	recursionForwarders: string;
	allowQuery: string;
	allowTransfer: string;
	allowUpdate: string;
	rpzZonas: string[];
}
