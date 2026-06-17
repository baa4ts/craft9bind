import type { Configuracion } from "@/type/Configuracion.interface";

const normalizar = (raw: string): string =>
	raw
		.split(/[\n,]+/)
		.map((s) => s.trim())
		.filter(Boolean)
		.map((s) => (s.endsWith(";") ? s : `${s};`))
		.join(" ");

export const generarOpciones = (conf: Configuracion): string => {
	const rpz =
		(conf.rpzZonas ?? []).length > 0
			? `\n    response-policy { ${conf.rpzZonas.map((z) => `zone "${z}"`).join("; ")}; };`
			: "";

	return `options {
    directory "/var/cache/bind";

    version "${conf.hideVersion}";

    dnssec-validation ${conf.dnssecValidation};

    listen-on { ${conf.escucha.ipv4 ? "any" : "none"}; };
    listen-on-v6 { ${conf.escucha.ipv6 ? "any" : "none"}; };

    forwarders { ${normalizar(conf.recursionForwarders)} };
    recursion yes;

    allow-query { ${normalizar(conf.allowQuery)} };
    allow-transfer { ${normalizar(conf.allowTransfer)} };
    allow-update { ${normalizar(conf.allowUpdate)} };${rpz}
};`;
};
