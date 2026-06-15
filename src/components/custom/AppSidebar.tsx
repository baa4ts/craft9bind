import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useBindStore } from '@/store/bind.store'
import { Link } from '@tanstack/react-router'

import { FileSliders, SquarePlus, Trash2, BookOpenText } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'sonner'

export function AppSidebar() {
    const zonas = useBindStore((state) => state.zonas)
    const eliminarZona = useBindStore((state) => state.eliminar_zona)

    const eliminar = useCallback((nombre: string) => {
        const confirmado = confirm(`¿Estas seguro de que quieres eliminar la zona "${nombre}"?`);
        if (confirmado) {
            toast.success("Zona eliminada: " + nombre)
            eliminarZona(nombre);
            return;
        }

        toast.error("No se puedo eliminar: " + nombre)
    }, [eliminarZona])

    const listaZonasKeys = Object.keys(zonas)

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-xl font-black text-white">
                        9
                    </div>
                    <span className="text-lg font-bold">
                        craftbind
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>General</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link to='/configuracion'>
                                <SidebarMenuButton>
                                    <FileSliders />
                                    <span>Configuracion general</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link to="/zonas/nueva">
                                <SidebarMenuButton>
                                    <SquarePlus />
                                    <span>Nueva zona</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Zonas</SidebarGroupLabel>
                    <SidebarMenu>
                        {listaZonasKeys.length > 0 ? (
                            listaZonasKeys.map((nombreZona) => (
                                <SidebarMenuItem
                                    key={nombreZona}
                                    className="group/item relative flex items-center justify-between rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-3 py-1.5 transition-colors"
                                >
                                    <Link
                                        to='/zonas/$zona'
                                        params={{ zona: nombreZona }}
                                        className="flex-1 text-sm font-medium truncate pr-2 hover:cursor-pointer"
                                    >
                                        {nombreZona}
                                    </Link>

                                    <div className="flex items-center justify-center gap-1 opacity-100 transition-opacity duration-150">

                                        {/* Ir a reglas */}
                                        <Link to="/registros/$zona" params={{ zona: nombreZona }}>
                                            <button
                                                className="p-1 rounded bg-sidebar-background text-violet-500 cursor-pointer"
                                                title="Ver detalles"
                                            >
                                                <BookOpenText className="h-4 w-4" />
                                            </button>
                                        </Link>

                                        {/* Eliminar */}
                                        <button
                                            onClick={() => { eliminar(nombreZona) }}
                                            className="p-1 rounded bg-sidebar-background text-destructive cursor-pointer"
                                            title="Eliminar zona"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </SidebarMenuItem>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground text-xs p-4 italic">
                                No hay ninguna zona
                            </div>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter />
        </Sidebar>
    )
}