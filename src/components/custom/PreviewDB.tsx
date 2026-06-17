import type { SoaHead } from "@/type/SoaHead.interface";

export const PreviewSoaHeader = ({ datos }: { datos: SoaHead }) => {
	const {
		ttl,
		origin,
		authoritativeServer,
		adminEmail,
		serial,
		refresh,
		retry,
		expire,
		negativeTtl,
		nameServers,
	} = datos;

	return (
		<div className="rounded-md border bg-muted/40 p-4">
			<pre className="overflow-x-auto text-sm">
				<code className="font-mono">
					{`$TTL ${ttl}
$ORIGIN ${origin}.
@   IN SOA  ${authoritativeServer}. ${adminEmail}. (
                ${serial}          ; Serial
                ${refresh}       ; Refresh
                ${retry}        ; Retry
                ${expire}      ; Expire
                ${negativeTtl} )       ; Negative TTL

${nameServers.map((ns) => `@   IN NS   ${ns}.`).join("\n")}
`}
				</code>
			</pre>
		</div>
	);
};
