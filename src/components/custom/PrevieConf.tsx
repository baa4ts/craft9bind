import React from "react";

export const PrevieConf = React.memo(({ nombre }: { nombre?: string }) => {
	return (
		<div className="rounded-md border bg-muted/40 p-4">
			<pre className="overflow-x-auto text-sm">
				<code className="font-mono">
					{`zone "example.local" {
  type master;
  file "/etc/bind/zones/${nombre}";
};`}
				</code>
			</pre>
		</div>
	);
});
