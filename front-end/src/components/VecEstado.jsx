import React from "react"
import { Spinner, Alert, Table } from "react-bootstrap"

export default function VecEstado({
  simulationData,
  vectorEstados,
  isLoading,
  error,
}) {
  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando vector de estado...</span>
        </Spinner>
        <div className="mt-3">
          <p>Generando vector de estado...</p>
          <small className="text-muted">Esto puede tomar unos momentos</small>
        </div>
      </div>
    )
  }

  // Mostrar error si existe
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error al generar vector de estado</Alert.Heading>
        <p>{error}</p>
      </Alert>
    )
  }

  // Si no hay datos de vectores de estado, mostrar mensaje
  if (!vectorEstados || vectorEstados.length === 0) {
    return (
      <div className="text-center p-4">
        <div className="mb-3" style={{ fontSize: "3rem" }}>
          📊
        </div>
        <h5>No hay vector de estado disponible</h5>
        <p className="text-muted">
          Configure los parámetros y ejecute la simulación para ver el vector de
          estado.
        </p>
      </div>
    )
  }

  const tipoServicio = [
    {
      nombre: "Envío de Paquetes",
      key: "EnvioPaquetes",
      servidores: simulationData?.empleados?.empleadosEnvioPaquetes || 3,
    },
    {
      nombre: "Reclamos y Devoluciones",
      key: "RyD",
      servidores: simulationData?.empleados?.empleadosRyD || 2,
    },
    {
      nombre: "Venta de Sellos y Sobres",
      key: "SyS",
      servidores: simulationData?.empleados?.empleadosSyS || 3,
    },
    {
      nombre: "Atención Empresarial",
      key: "Empresarial",
      servidores: simulationData?.empleados?.empleadosEmpresarial || 2,
    },
    {
      nombre: "Postales y Envíos Especiales",
      key: "PyES",
      servidores: simulationData?.empleados?.empleadosPyES || 1,
    },
  ]

  // Agregar servicio post-entrega si está habilitado
  if (simulationData?.nuevoServicio?.habilitado) {
    tipoServicio.push({
      nombre: "Servicio Post Despacho Paquetes",
      key: "ServicioEspecial",
      servidores: simulationData?.nuevoServicio?.numeroEmpleados || 2,
    })
  }

  return (
    <div
      className="overflow-x-auto p-4"
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <div className="mb-3">
        <small className="text-muted">
          Mostrando {vectorEstados.length} filas del vector de estado
        </small>
      </div>
      <table className="border-collapse border border-black w-full text-center text-sm sticky-header-table">
        {/* Añadido sticky-header-table */}
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
                <th
                  colSpan={3}
                  className="border px-2 py-1"
                  style={{ backgroundColor: "#FFD700" }}
                >
                  Llegada Cliente
                </th>
                <th
                  colSpan={2 + servicio.servidores}
                  className="border px-2 py-1"
                  style={{ backgroundColor: "#98FF98" }}
                >
                  Fin de Atención
                </th>
                <th className="border px-2 py-1">Cola</th>
                <th
                  colSpan={servicio.servidores}
                  className="border px-2 py-1"
                  style={{ backgroundColor: "#ADD8E6" }}
                >
                  Estado Servidores
                </th>
                <th
                  colSpan={2}
                  className="border px-2 py-1"
                  style={{ backgroundColor: "#FFDAB9" }}
                >
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
          {vectorEstados.map((fila, filaIndex) => (
            <tr key={filaIndex}>
              {/* Columnas fijas */}
              <td className="border px-4 py-2">
                {fila.numeroIteracion || filaIndex + 1}
              </td>
              <td className="border px-4 py-2">
                {fila.evento || "Simulación"}
              </td>
              <td className="border px-4 py-2">
                {fila.horario?.toFixed(4) || "0.0000"}
              </td>

              {/* Columnas dinámicas por servicio */}
              {tipoServicio.map((servicio, servicioIndex) => {
                const datosServicio = fila[servicio.key] || {}

                // Extraer datos de llegada
                const llegada = datosServicio.LlegadaCliente || {}

                // Extraer datos de fin de atención
                const finAtencion = datosServicio.FinAtencion || {}

                // Extraer estado de servidores
                const estadoServidores = datosServicio.EstadoServidores || {}

                // Extraer métricas
                const metricas = datosServicio.Metricas || {}

                const finAtencionCeldas = Array.from(
                  { length: servicio.servidores },
                  (_, i) => (
                    <td
                      key={`fa-${servicioIndex}-${i}`}
                      className="border px-2 py-1"
                    >
                      {finAtencion[`FinAtencion${i + 1}`]
                        ? finAtencion[`FinAtencion${i + 1}`].toFixed(4)
                        : "0.0000"}
                    </td>
                  )
                )

                const estadoServidoresCeldas = Array.from(
                  { length: servicio.servidores },
                  (_, i) => (
                    <td
                      key={`es-${servicioIndex}-${i}`}
                      className="border px-2 py-1"
                    >
                      {estadoServidores[`Servidor${i + 1}`] === "O"
                        ? "Ocupado"
                        : "Libre"}
                    </td>
                  )
                )

                return (
                  <React.Fragment key={servicioIndex}>
                    {/* Llegada Cliente */}
                    <td className="border px-2 py-1">
                      {llegada.RND?.toFixed(4) || "0.0000"}
                    </td>
                    <td className="border px-2 py-1">
                      {llegada.tiempo?.toFixed(4) || "0.0000"}
                    </td>
                    <td className="border px-2 py-1">
                      {llegada.llegada?.toFixed(4) || "0.0000"}
                    </td>

                    {/* Fin de Atención */}
                    <td className="border px-2 py-1">
                      {finAtencion.RND?.toFixed(4) || "0.0000"}
                    </td>
                    <td className="border px-2 py-1">
                      {finAtencion.tiempo?.toFixed(4) || "0.0000"}
                    </td>
                    {finAtencionCeldas}

                    {/* Cola */}
                    <td className="border px-2 py-1">
                      {datosServicio.Cola || 0}
                    </td>

                    {/* Estado Servidores */}
                    {estadoServidoresCeldas}

                    {/* Métricas */}
                    <td className="border px-2 py-1">
                      {metricas.esperaPromedio?.toFixed(4) || "0.0000"}
                    </td>
                    <td className="border px-2 py-1">
                      {metricas.porcentajeOcupacion?.toFixed(2) || "0.00"}%
                    </td>
                  </React.Fragment>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Información adicional */}
      <div className="mt-3">
        <small className="text-muted">
          <strong>💡 Información:</strong> El vector de estado muestra el estado
          del sistema en cada iteración de la simulación. Los datos mostrados
          incluyen tiempos de llegada, atención, estado de servidores y métricas
          calculadas.
        </small>
      </div>
    </div>
  )
}
