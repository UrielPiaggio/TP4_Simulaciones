import React from "react"
import { Table, Badge } from "react-bootstrap"
import { getSimulationResults } from "../../services/serviceSim"

export const VectorEstado = ({
  cantidadFilas = 10,
  desdeFilaNumero = 1,
  configuracionesEspeciales = {},
}) => {
  const servicios = [
    {
      nombre: "📦 Envío de Paquetes",
      estado: "Activo",
      clientes: 12,
      servidores: 3,
      color: "#4f46e5",
    },
    {
      nombre: "🔄 Reclamos y Devoluciones",
      estado: "Activo",
      clientes: 8,
      servidores: 2,
      color: "#8b5cf6",
    },
    {
      nombre: "💌 Venta de Sellos y Sobres",
      estado: "Activo",
      clientes: 15,
      servidores: 3,
      color: "#06b6d4",
    },
    {
      nombre: "🏢 Atención Empresarial",
      estado: configuracionesEspeciales.AusenciaEmpleadoEmpresarial
        ? "Ausente"
        : "Activo",
      clientes: 5,
      servidores: configuracionesEspeciales.AusenciaEmpleadoEmpresarial ? 0 : 2,
      color: "#10b981",
    },
    {
      nombre: "✉️ Postales y Envíos Especiales",
      estado: "Activo",
      clientes: 3,
      servidores: 1,
      color: "#f59e0b",
    },
  ]

  // Agregar servicio post-entrega si está habilitado
  if (configuracionesEspeciales.NuevoServicioPostEntrega) {
    servicios.push({
      nombre: "📮 Servicio Post-Entrega",
      estado: "Activo",
      clientes: 2,
      servidores: 1,
      color: "#ef4444",
    })
  }

  // Generar array de tiempos basado en la configuración
  const tiempos = Array.from(
    { length: cantidadFilas },
    (_, i) => `T${desdeFilaNumero + i}`
  )
  // Función para generar valores simulados más realistas
  const getSimulatedValue = (rowIndex, colIndex) => {
    const baseValues = [12, 8, 15, 5, 3, 2] // Agregado valor para servicio post-entrega
    const base = baseValues[rowIndex] || 1

    // Si es servicio empresarial y está ausente, retornar 0
    if (
      rowIndex === 3 &&
      configuracionesEspeciales.AusenciaEmpleadoEmpresarial
    ) {
      return 0
    }

    // Si hay prioridad empresarial, ajustar valores para servicio empresarial
    if (
      rowIndex === 3 &&
      configuracionesEspeciales.ClientesEmpresarialesPrioridad
    ) {
      const priorityBonus = Math.floor(Math.random() * 3) + 2 // +2 a +4
      return Math.max(0, base + priorityBonus)
    }

    const variation = Math.floor(Math.random() * 6) - 3 // -3 a +3
    return Math.max(0, base + variation + (colIndex % 2)) // Pequeña variación por tiempo
  }
  return (
    <div className="vector-estado-wrapper">
      {/* Indicadores de configuraciones especiales activas */}
      {(configuracionesEspeciales.AusenciaEmpleadoEmpresarial ||
        configuracionesEspeciales.NuevoServicioPostEntrega ||
        configuracionesEspeciales.ClientesEmpresarialesPrioridad) && (
        <div className="special-config-indicators">
          <h6 className="indicators-title">
            ⚙️ Configuraciones Especiales Activas:
          </h6>
          <div className="indicators-list">
            {configuracionesEspeciales.AusenciaEmpleadoEmpresarial && (
              <span className="config-indicator ausencia">
                🏢❌ Empleado Empresarial Ausente
              </span>
            )}
            {configuracionesEspeciales.NuevoServicioPostEntrega && (
              <span className="config-indicator post-entrega">
                📦✨ Servicio Post-Entrega Activo
              </span>
            )}
            {configuracionesEspeciales.ClientesEmpresarialesPrioridad && (
              <span className="config-indicator prioridad">
                🏢⭐ Prioridad Empresarial
              </span>
            )}
          </div>
        </div>
      )}

      {/* Información de tabla */}
      <div className="table-info">
        <small className="text-muted">
          📋 Mostrando {cantidadFilas} filas desde T{desdeFilaNumero} hasta T
          {desdeFilaNumero + cantidadFilas - 1}
        </small>
      </div>

      <div className="table-responsive">
        <Table className="vector-table" borderless>
          <thead>
            <tr>
              <th className="sticky-header">
                <div className="header-content">
                  <span className="header-icon">🏪</span>
                  <span style={{ color: "#ffffff", fontWeight: "600" }}>
                    Servicio
                  </span>
                </div>
              </th>
              <th className="text-center">
                <div className="header-content">
                  <span className="header-icon">📊</span>
                  <span style={{ color: "#ffffff", fontWeight: "600" }}>
                    Estado
                  </span>
                </div>
              </th>
              <th className="text-center">
                <div className="header-content">
                  <span className="header-icon">👥</span>
                  <span style={{ color: "#ffffff", fontWeight: "600" }}>
                    Clientes
                  </span>
                </div>
              </th>
              <th className="text-center">
                <div className="header-content">
                  <span className="header-icon">🔧</span>
                  <span style={{ color: "#ffffff", fontWeight: "600" }}>
                    Servidores
                  </span>
                </div>
              </th>
              {tiempos.map((tiempo, index) => (
                <th key={index} className="text-center time-header">
                  <div
                    className="time-badge"
                    style={{ color: "#ffffff", fontWeight: "600" }}
                  >
                    {tiempo}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {servicios.map((servicio, rowIndex) => (
              <tr key={rowIndex} className="service-row">
                <td className="service-name-cell">
                  <div className="service-info">
                    <div
                      className="service-indicator"
                      style={{ backgroundColor: servicio.color }}
                    ></div>
                    <span className="service-title">{servicio.nombre}</span>
                  </div>
                </td>{" "}
                <td className="text-center">
                  <Badge
                    bg={servicio.estado === "Ausente" ? "danger" : "success"}
                    className="status-badge"
                  >
                    {servicio.estado}
                    {rowIndex === 3 &&
                    configuracionesEspeciales.ClientesEmpresarialesPrioridad &&
                    servicio.estado === "Activo"
                      ? " ⭐"
                      : ""}
                  </Badge>
                </td>
                <td className="text-center">
                  <div
                    className="metric-badge clients-badge"
                    style={{
                      backgroundColor: `${servicio.color}20`,
                      color: servicio.color,
                      fontWeight: "700",
                    }}
                  >
                    {servicio.clientes}
                  </div>
                </td>
                <td className="text-center">
                  <div
                    className="metric-badge servers-badge"
                    style={{
                      backgroundColor: `${servicio.color}20`,
                      color: servicio.color,
                      fontWeight: "700",
                    }}
                  >
                    {servicio.servidores}
                  </div>
                </td>
                {tiempos.map((_, colIndex) => (
                  <td key={colIndex} className="text-center time-cell">
                    <div
                      className="time-value"
                      style={{
                        backgroundColor: `${servicio.color}15`,
                        color: servicio.color,
                        border: `1px solid ${servicio.color}40`,
                        fontWeight: "700",
                      }}
                    >
                      {getSimulatedValue(rowIndex, colIndex)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
