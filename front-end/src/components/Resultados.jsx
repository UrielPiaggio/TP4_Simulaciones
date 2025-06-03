import React from "react";
import { Card, ListGroup, Row, Col, Badge } from "react-bootstrap";

export const Resultados = () => {
  // Función para obtener la clase de color según el porcentaje de eficiencia
  const getEfficiencyBadgeClass = (percentage) => {
    const numericPercentage = parseInt(percentage.replace('%', ''));
    
    if (numericPercentage >= 95) return 'efficiency-badge-excellent';
    if (numericPercentage >= 90) return 'efficiency-badge-high';
    if (numericPercentage >= 85) return 'efficiency-badge-medium-high';
    if (numericPercentage >= 80) return 'efficiency-badge-medium';
    if (numericPercentage >= 70) return 'efficiency-badge-medium-low';
    return 'efficiency-badge-low';
  };

  const resultados = [
    {
      servicio: "📦 Envío de Paquetes",
      tiempoPromedio: "12.5 min",
      clientesAtendidos: 145,
      eficiencia: "92%",
      color: "primary"
    },
    {
      servicio: "🔄 Reclamos y Devoluciones", 
      tiempoPromedio: "8.3 min",
      clientesAtendidos: 98,
      eficiencia: "87%",
      color: "info"
    },
    {
      servicio: "💌 Sellos y Sobres",
      tiempoPromedio: "15.7 min", 
      clientesAtendidos: 203,
      eficiencia: "95%",
      color: "success"
    },
    {
      servicio: "🏢 Atención Empresarial",
      tiempoPromedio: "6.2 min",
      clientesAtendidos: 67,
      eficiencia: "89%", 
      color: "warning"
    },
    {
      servicio: "✉️ Envíos Especiales",
      tiempoPromedio: "4.8 min",
      clientesAtendidos: 34,
      eficiencia: "91%",
      color: "secondary"
    }
  ];

  const estadisticasGenerales = {
    totalClientes: resultados.reduce((sum, r) => sum + r.clientesAtendidos, 0),
    tiempoPromedioGeneral: "9.5 min",
    eficienciaGeneral: "91%",
    ingresoTotal: "$15,420"
  };

  return (
    <>
      {/* Estadísticas Generales */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="stats-card h-100" style={{ borderLeft: "4px solid #4f46e5" }}>
            <Card.Body className="text-center">
              <h4 style={{ color: "#4f46e5", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
                👥 {estadisticasGenerales.totalClientes}
              </h4>
              <small style={{ color: "#6b7280", fontWeight: "500" }}>
                Total Clientes Atendidos
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stats-card h-100" style={{ borderLeft: "4px solid #059669" }}>
            <Card.Body className="text-center">
              <h4 style={{ color: "#059669", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
                ⏱️ {estadisticasGenerales.tiempoPromedioGeneral}
              </h4>
              <small style={{ color: "#6b7280", fontWeight: "500" }}>
                Tiempo Promedio
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stats-card h-100" style={{ borderLeft: "4px solid #d97706" }}>
            <Card.Body className="text-center">
              <h4 style={{ color: "#d97706", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
                📊 {estadisticasGenerales.eficienciaGeneral}
              </h4>
              <small style={{ color: "#6b7280", fontWeight: "500" }}>
                Eficiencia General
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stats-card h-100" style={{ borderLeft: "4px solid #0891b2" }}>
            <Card.Body className="text-center">
              <h4 style={{ color: "#0891b2", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
                💰 {estadisticasGenerales.ingresoTotal}
              </h4>
              <small style={{ color: "#6b7280", fontWeight: "500" }}>
                Ingresos Totales
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Resultados por Servicio */}
      <Card className="results-card">
        <Card.Header>
          <span>📈 Resultados Detallados por Servicio</span>
        </Card.Header>
        <ListGroup variant="flush">
          {resultados.map((resultado, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center" style={{ padding: "1.5rem" }}>
              <div className="text-start" style={{ flex: "1", marginRight: "1rem" }}>
                <h6 className="mb-1 fw-bold" style={{ color: "#374151", margin: "0 0 0.5rem 0", fontSize: "1.05rem" }}>
                  {resultado.servicio}
                </h6>
                <div style={{ color: "#6b7280", lineHeight: "1.5", fontSize: "0.9rem" }}>
                  <span style={{ marginRight: "1rem" }}>
                    ⏰ <strong>{resultado.tiempoPromedio}</strong>
                  </span>
                  <span>
                    👤 <strong>{resultado.clientesAtendidos}</strong> clientes
                  </span>
                </div>
              </div>
              <div className="d-flex gap-3 align-items-center">
                <div className={`badge ${getEfficiencyBadgeClass(resultado.eficiencia)}`} style={{ 
                  padding: "0.6rem 1rem", 
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  borderRadius: "8px"
                }}>
                  {resultado.eficiencia} eficiencia
                </div>
                <div className="text-center" style={{ minWidth: "60px" }}>
                  <div className="fw-bold" style={{ 
                    color: "#4f46e5", 
                    fontSize: "1.3rem",
                    margin: "0 0 0.2rem 0",
                    lineHeight: "1"
                  }}>
                    {resultado.clientesAtendidos}
                  </div>
                  <small style={{ 
                    color: "#6b7280", 
                    fontSize: "0.75rem",
                    display: "block",
                    textAlign: "center"
                  }}>
                    atendidos
                  </small>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      {/* Nota informativa */}
      <div className="info-note">
        <small>
          <strong style={{ color: "#374151" }}>💡 Nota:</strong> Los resultados mostrados son simulados y se actualizan en tiempo real 
          basándose en los parámetros configurados en el formulario superior. Los colores de eficiencia van del rojo (menor eficiencia) 
          al verde (mayor eficiencia).
        </small>
      </div>
    </>
  );
};
