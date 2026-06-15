export const ValidarCambio = ({ value }: { value: string }) => {
  if (!value) {
    return 'El nombre de la zona es obligatorio'
  }

  if (!/^[a-zA-Z0-9.-]+$/.test(value)) {
    return 'Solo se permiten letras, numeros, puntos y guiones'
  }

  return undefined
}