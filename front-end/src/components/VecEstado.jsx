import React from "react"

export default function VecEstado() {
  const tipoServicio = [
    {
      nombre: "Envío de Paquetes",
      servidores: 3,
      cola: 1,
      tiempoEsperaPromedio: 0,
      porcentajeOcupacion: 0,
    },
    {
      nombre: "Reclamos y Devoluciones",
      servidores: 2,
      cola: 1,
      tiempoEsperaPromedio: 0,
      porcentajeOcupacion: 0,
    },
    {
      nombre: "Venta de Sellos y Sobres",
      servidores: 3,
      cola: 1,
      tiempoEsperaPromedio: 0,
      porcentajeOcupacion: 0,
    },
    {
      nombre: "Atención Empresarial",
      servidores: 2,
      cola: 1,
      tiempoEsperaPromedio: 0,
      porcentajeOcupacion: 0,
    },
    {
      nombre: "Postales y Envíos Especiales",
      servidores: 1,
      cola: 1,
      tiempoEsperaPromedio: 0,
      porcentajeOcupacion: 0,
    },
  ]

  return (
    <div className="overflow-x-auto p-4">
      <table className="border-collapse border border-black w-full text-center text-sm">
        <thead>
          {/* Fila 1: Columnas fijas + nombre del servicio */}
          <tr>
            <th rowSpan={3} className="border px-4 py-2 bg-gray-300 text-base">
              N
            </th>
            <th rowSpan={3} className="border px-4 py-2 bg-gray-300 text-base">
              Evento
            </th>
            <th rowSpan={3} className="border px-4 py-2 bg-gray-300 text-base">
              Reloj
            </th>

            {/* Servicios */}
            {tipoServicio.map((servicio, index) => {
              const colSpan =
                3 + // Llegada Cliente
                2 +
                servicio.servidores + // Fin de Atención
                1 + // Cola
                servicio.servidores + // Estado Servidores
                2 // Nuevas columnas: Tiempo Espera y Porcentaje Ocupación
              return (
                <th
                  key={index}
                  colSpan={colSpan}
                  className="border px-4 py-2 bg-gray-300 text-base"
                >
                  {servicio.nombre}
                </th>
              )
            })}
          </tr>

          {/* Fila 2: Subcategorías */}
          <tr>
            {tipoServicio.map((servicio, index) => (
              <React.Fragment key={index}>
                <th colSpan={3} className="border px-2 py-1 bg-yellow-100">
                  Llegada Cliente
                </th>
                <th
                  colSpan={2 + servicio.servidores}
                  className="border px-2 py-1 bg-green-100"
                >
                  Fin de Atención
                </th>
                <th className="border px-2 py-1 bg-blue-100">Cola</th>
                <th
                  colSpan={servicio.servidores}
                  className="border px-2 py-1 bg-purple-100"
                >
                  Estado Servidores
                </th>
                <th colSpan={2} className="border px-2 py-1 bg-pink-100">
                  Métricas
                </th>
              </React.Fragment>
            ))}
          </tr>

          {/* Fila 3: Sub-subcolumnas */}
          <tr>
            {tipoServicio.map((servicio, index) => (
              <React.Fragment key={index}>
                {/* Llegada Cliente */}
                <th className="border px-3 py-1 bg-yellow-50">RND</th>
                <th className="border px-3 py-1 bg-yellow-50">Tiempo</th>
                <th className="border px-3 py-1 bg-yellow-50">Llegada</th>

                {/* Fin de Atención */}
                <th className="border px-3 py-1 bg-green-50">RND</th>
                <th className="border px-3 py-1 bg-green-50">Tiempo</th>
                {Array.from({ length: servicio.servidores }, (_, i) => (
                  <th
                    key={`fin-${index}-${i}`}
                    className="border px-3 py-1 bg-green-50"
                  >
                    Fin de Atencion {i + 1}
                  </th>
                ))}

                {/* Cola */}
                <th className="border px-3 py-1 bg-blue-50">Cola</th>

                {/* Estado de cada servidor */}
                {Array.from({ length: servicio.servidores }, (_, i) => (
                  <th
                    key={`estado-${index}-${i}`}
                    className="border px-3 py-1 bg-purple-50"
                  >
                    Servidor {i + 1}
                  </th>
                ))}

                {/* Métricas adicionales */}
                <th className="border px-3 py-1 bg-pink-50">T. Espera Prom.</th>
                <th className="border px-3 py-1 bg-pink-50">% Ocupación</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            {/* Columnas fijas */}
            <td className="border px-4 py-2">1</td>
            <td className="border px-4 py-2">Inicializacion</td>
            <td className="border px-4 py-2">10.25</td>

            {/* Columnas dinámicas por servicio */}
            {tipoServicio.map((servicio, index) => {
              const finAtencionCeldas = Array.from(
                { length: servicio.servidores },
                (_, i) => (
                  <td key={`fa-${index}-${i}`} className="border px-2 py-1">
                    --
                  </td>
                )
              )

              const estadoServidoresCeldas = Array.from(
                { length: servicio.servidores },
                (_, i) => (
                  <td key={`es-${index}-${i}`} className="border px-2 py-1">
                    Libre
                  </td>
                )
              )

              return (
                <React.Fragment key={index}>
                  {/* Llegada Cliente */}
                  <td className="border px-2 py-1">0.12</td>
                  <td className="border px-2 py-1">2.00</td>
                  <td className="border px-2 py-1">12.25</td>

                  {/* Fin de Atención */}
                  <td className="border px-2 py-1">0.65</td>
                  <td className="border px-2 py-1">3.00</td>
                  {finAtencionCeldas}

                  {/* Cola */}
                  <td className="border px-2 py-1">1</td>

                  {/* Estado Servidores */}
                  {estadoServidoresCeldas}

                  {/* Atributos adicionales */}
                  <td className="border px-2 py-1">
                    {servicio.tiempoEsperaPromedio}
                  </td>
                  <td className="border px-2 py-1">
                    {servicio.porcentajeOcupacion}
                  </td>
                </React.Fragment>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
