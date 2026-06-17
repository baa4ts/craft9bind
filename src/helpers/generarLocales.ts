export const generarLocales = (nombres: string[]) => {
	return nombres
		.map(
			(n) =>
				`zone "${n}" {
    type master;
    file "/etc/bind/zones/${n}";
};`,
		)
		.join("\n\n");
};
