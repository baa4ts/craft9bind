import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/registros/$zona')({
  component: RouteComponent,
})

function RouteComponent() {
  const { zona } = Route.useParams();

  return (
    <section className="flex flex-1 flex-col gap-6 p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>
            Registros de {zona}
          </CardTitle>
          <CardDescription>
            Gestiona los registros DNS de la zona {zona}
          </CardDescription>
        </CardHeader>

        <CardContent>

        </CardContent>
      
      </Card>
    </section>
  )
}