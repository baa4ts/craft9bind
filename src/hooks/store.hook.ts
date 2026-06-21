import { useBindStore } from "@/store/bind.store";

export const usePuedeBuildear = () =>
	useBindStore((state) => state.validar_build());
