import type { Configuracion } from "@/type/Configuracion.interface";
import type { SoaHead } from "@/type/SoaHead.interface"
import { persist } from "zustand/middleware"
import { create } from "zustand"

interface BindStore {
    configuracion: Configuracion,
    zonas: Record<string, SoaHead>,

    agregar_zona: (zona: string) => boolean,
    eliminar_zona: (zona: string) => boolean,
    actualizar_zona: (nombre: string, soa: SoaHead) => boolean,

    actualizar_configuracion: (conf: Configuracion) => boolean,
}

export const useBindStore = create<BindStore, [["zustand/persist", BindStore]]>(
    persist(
        (set, get) => ({

            /**
             * 
             * Configuracion por defecto que se carga
             * 
             */
            configuracion: {
                hideVersion: "CraftBind DNS",
                dnssecValidation: "auto",
                escucha: {
                    ipv4: true,
                    ipv6: false,
                },
                recursionForwarders: "1.1.1.1",
                allowQuery: "any;",
                allowTransfer: "none;",
                allowUpdate: "none;",
            },

            zonas: {},


            /**
             * 
             * Configuracion: /etc/bind/<zona>
             * 
             */
            agregar_zona: (key) => {
                const actuales = get().zonas;

                if (key in actuales) {
                    return false;
                }

                set({
                    zonas: {
                        ...actuales,
                        [key]: {
                            adminEmail: "admin.localhost",
                            authoritativeServer: "localhost",
                            expire: "86400",
                            nameServers: ["localhost"],
                            negativeTtl: "60",
                            origin: key,
                            refresh: "3600",
                            retry: "600",
                            serial: "1",
                            ttl: "60",
                        },
                    },
                });

                return true
            },

            eliminar_zona: (key) => {
                const actuales = get().zonas;

                if (!(key in actuales)) {
                    return false;
                }

                const copiaZonas = { ...actuales };
                delete copiaZonas[key];

                set({
                    zonas: copiaZonas,
                });

                return true;
            },

            actualizar_zona: (nombre, soa) => {
                const actuales = get().zonas;

                if (!(nombre in actuales)) {
                    return false;
                }

                set({
                    zonas: {
                        ...actuales,
                        [nombre]: soa
                    }
                });

                return true;
            },

            /**
             * 
             * Archivo: named.conf.options 
             * 
             */
            actualizar_configuracion: (conf) => {
                set({
                    configuracion: conf
                })
                return true;
            }

        }),
        {
            name: "craftbind-storage",
            version: 1
        }
    )
)