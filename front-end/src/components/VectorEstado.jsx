import React from "react";
import { Table, Badge } from "react-bootstrap";

export const VectorEstado = () => {
  const servicios = [
    { 
      nombre: "📦 Envío de Paquetes", 
      estado: "Activo", 
      clientes: 12, 
      servidores: 3,
      color: "#4f46e5"
    },
    { 
      nombre: "🔄 Reclamos y Devoluciones", 
      estado: "Activo", 
      clientes: 8, 
      servidores: 2,
      color: "#8b5cf6"
    },
    { 
      nombre: "💌 Venta de Sellos y Sobres", 
      estado: "Activo", 
      clientes: 15, 
      servidores: 3,
      color: "#06b6d4"
    },
    { 
      nombre: "🏢 Atención Empresarial", 
      estado: "Activo", 
      clientes: 5, 
      servidores: 2,
      color: "#10b981"
    },
    { 
      nombre: "✉️ Postales y Envíos Especiales", 
      estado: "Activo", 
      clientes: 3, 
      servidores: 1,
      color: "#f59e0b"
    }
  ];

  const tiempos = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

  // Función para generar valores simulados más realistas
  const getSimulatedValue = (rowIndex, colIndex) => {
    const baseValues = [12, 8, 15, 5, 3];
    const base = baseValues[rowIndex];
    const variation = Math.floor(Math.random() * 6) - 3; // -3 a +3
    return Math.max(0, base + variation);
  };

  return (
    <div className="vector-estado-wrapper">
      <div className="table-responsive">
        <Table className="vector-table" borderless>
          <thead>
            <tr>
              <th className="sticky-header">
                <div className="header-content">
                  <span className="header-icon">🏪</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>Servicio</span>
                </div>
              </th>
              <th className="text-center">
                <div className="header-content">
                  <span className="header-icon">📊</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>Estado</span>
                </div>
              </th>
              <th className="text-center">
                <div className="header-content">
                  <span className="header-icon">👥</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>Clientes</span>
                </div>
              </th>
              <th className="text-center">
                <div className="header-content">
                  <span className="header-icon">🔧</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>Servidores</span>
                </div>
              </th>
              {tiempos.map((tiempo, index) => (
                <th key={index} className="text-center time-header">
                  <div className="time-badge" style={{ color: '#ffffff', fontWeight: '600' }}>
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
                </td>
                <td className="text-center">
                  <Badge bg="success" className="status-badge">
                    {servicio.estado}
                  </Badge>
                </td>
                <td className="text-center">
                  <div 
                    className="metric-badge clients-badge" 
                    style={{ backgroundColor: `${servicio.color}20`, color: servicio.color, fontWeight: '700' }}
                  >
                    {servicio.clientes}
                  </div>
                </td>
                <td className="text-center">
                  <div 
                    className="metric-badge servers-badge"
                    style={{ backgroundColor: `${servicio.color}20`, color: servicio.color, fontWeight: '700' }}
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
                        fontWeight: '700'
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
  );
};
