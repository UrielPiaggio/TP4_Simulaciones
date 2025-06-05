import React from "react";
import { Card, ListGroup, Row, Col, Badge, Spinner, Alert } from "react-bootstrap";

export const Resultados = ({ simulationData, resultados, isLoading, error }) => {
  // Función para obtener la clase de color según el porcentaje de eficiencia
  const getEfficiencyBadgeClass = (percentage) => {
    const numericPercentage = parseFloat(percentage);
    
    if (numericPercentage >= 95) return 'efficiency-badge-excellent';
    if (numericPercentage >= 90) return 'efficiency-badge-high';
    if (numericPercentage >= 85) return 'efficiency-badge-medium-high';
    if (numericPercentage >= 80) return 'efficiency-badge-medium';
    if (numericPercentage >= 70) return 'efficiency-badge-medium-low';
    return 'efficiency-badge-low';
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Ejecutando simulación...</span>
        </Spinner>
        <div className="mt-3">
          <p>Ejecutando simulación...</p>
          <small className="text-muted">Esto puede tomar unos momentos</small>
        </div>
      </div>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error en la simulación</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  // Si no hay datos de simulación, mostrar mensaje
  if (!resultados) {
    return (
      <div className="text-center p-4">
        <div className="mb-3" style={{ fontSize: "3rem" }}>📊</div>
        <h5>No hay resultados disponibles</h5>
        <p className="text-muted">Configure los parámetros y ejecute la simulación para ver los resultados.</p>
      </div>
    );
  }

  // Mapeo de servicios para mostrar iconos y nombres
  const serviciosMapeados = [
    {
      key: "envioPaquetes",
      nombre: "📦 Envío de Paquetes",
      icon: "📦",
      color: "primary"
    },
    {
      key: "ryD",
      nombre: "🔄 Reclamos y Devoluciones",
      icon: "🔄", 
      color: "info"
    },
    {
      key: "syS",
      nombre: "💌 Sellos y Sobres",
      icon: "💌",
      color: "success"
    },
    {
      key: "pyES",
      nombre: "✉️ Envíos Especiales",
      icon: "✉️",
      color: "secondary"
    }
  ];

  // Manejar servicio empresarial según configuración de prioridades
  if (simulationData?.prioridadEnEmpresarial) {
    // Si está activada la prioridad, mostrar ambos como resultados distintos
    serviciosMapeados.push({
      key: "empresarialAltaPrioridad",
      nombre: "🏢 Empresarial (Alta Prioridad)",
      icon: "🏢",
      color: "warning"
    });
    serviciosMapeados.push({
      key: "empresarialBajaPrioridad", 
      nombre: "🏢 Empresarial (Baja Prioridad)",
      icon: "🏢",
      color: "warning"
    });
  } else {
    // Si no está activada, usar solo baja prioridad (que incluye a todos los empresariales)
    serviciosMapeados.push({
      key: "empresarialBajaPrioridad",
      nombre: "🏢 Atención Empresarial",
      icon: "🏢",
      color: "warning"
    });
  }

  // Agregar servicio especial si está habilitado
  if (simulationData?.nuevoServicio?.habilitado) {
    serviciosMapeados.push({
      key: "nuevoServicio",
      nombre: "🚀 Servicio Post-Entrega",
      icon: "🚀",
      color: "dark"
    });
  }

  // Función para formatear tiempo de espera
  const formatearTiempo = (minutos) => {
    if (minutos >= 60) {
      const horas = minutos / 60;
      return `${horas.toFixed(2).replace('.', ',')} horas`;
    } else {
      return `${minutos.toFixed(2).replace('.', ',')} min`;
    }
  };

  // Convertir resultados del backend al formato de visualización
  const resultadosFormateados = serviciosMapeados.map(servicio => {
    const tiempoEsperaHoras = resultados.promediosEspera?.[servicio.key] || 0;
    const tiempoEsperaMinutos = tiempoEsperaHoras * 60; // Convertir horas a minutos
    
    // Para ocupación, usar la clave correcta según el servicio
    let ocupacion = 0;
    if (servicio.key === "empresarialAltaPrioridad" || servicio.key === "empresarialBajaPrioridad") {
      ocupacion = resultados.promediosOcupacion?.empresarial || 0;
    } else {
      ocupacion = resultados.promediosOcupacion?.[servicio.key] || 0;
    }

    return {
      servicio: servicio.nombre,
      tiempoPromedio: formatearTiempo(tiempoEsperaMinutos),
      eficiencia: `${ocupacion.toFixed(1)}%`,
      color: servicio.color
    };
  });

  // Función para obtener el nombre formateado del servicio
  const obtenerNombreServicio = (claveBackend) => {
    const servicioEncontrado = serviciosMapeados.find(s => s.key === claveBackend);
    if (servicioEncontrado) {
      return servicioEncontrado.nombre;
    }
    
    // Mapeos adicionales para claves que puedan venir del backend
    const mapeoAdicional = {
      'envioPaquetes': '📦 Envío de Paquetes',
      'ryD': '🔄 Reclamos y Devoluciones', 
      'syS': '💌 Sellos y Sobres',
      'pyES': '✉️ Envíos Especiales',
      'empresarial': '🏢 Atención Empresarial',
      'empresarialAltaPrioridad': '🏢 Empresarial (Alta Prioridad)',
      'empresarialBajaPrioridad': '🏢 Empresarial (Baja Prioridad)',
      'nuevoServicio': '🚀 Servicio Post-Entrega'
    };
    
    return mapeoAdicional[claveBackend] || claveBackend.replace(/([A-Z])/g, ' $1').trim();
  };

  // Calcular estadísticas generales
  const promedioOcupacionGeneral = Object.values(resultados.promediosOcupacion || {})
    .reduce((sum, val) => sum + val, 0) / Object.keys(resultados.promediosOcupacion || {}).length;
  const promedioEsperaGeneral = Object.values(resultados.promediosEspera || {})
    .reduce((sum, val) => sum + val, 0) / Object.keys(resultados.promediosEspera || {}).length;

  const estadisticasGenerales = {
    tiempoPromedioGeneral: formatearTiempo(promedioEsperaGeneral * 60), // Convertir a minutos y formatear
    eficienciaGeneral: `${promedioOcupacionGeneral.toFixed(1)}%`,
    ingresoTotal: "N/A" // No disponible en los datos actuales
  };

  return (
    <>
      {/* Estadísticas Generales */}
      <Row className="mb-4">
        <Col md={4} sm={6} className="mb-3">
          <Card className="stats-card h-100" style={{ borderLeft: "4px solid #059669" }}>
            <Card.Body className="text-center">
              <h4 style={{ color: "#059669", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
                ⏱️ {estadisticasGenerales.tiempoPromedioGeneral}
              </h4>
              <small style={{ color: "#6b7280", fontWeight: "500" }}>
                Tiempo Promedio de Espera
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} className="mb-3">
          <Card className="stats-card h-100" style={{ borderLeft: "4px solid #d97706" }}>
            <Card.Body className="text-center">
              <h4 style={{ color: "#d97706", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
                📊 {estadisticasGenerales.eficienciaGeneral}
              </h4>
              <small style={{ color: "#6b7280", fontWeight: "500" }}>
                Ocupación Promedio
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} className="mb-3">
          <Card className="stats-card h-100" style={{ borderLeft: "4px solid #0891b2" }}>
            <Card.Body className="text-center">
              <h4 style={{ color: "#0891b2", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
                📦 {resultados.promedioGenteEnColaEnvioPaquetes?.toFixed(2) || "N/A"}
              </h4>
              <small style={{ color: "#6b7280", fontWeight: "500" }}>
                Promedio Cola Paquetes
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Métricas Especiales */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="stats-card h-100" style={{ borderLeft: "4px solid #e11d48" }}>
            <Card.Body className="text-center">
              <h4 style={{ color: "#e11d48", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
                ⚠️ {resultados.probabilidadClientesPaquetesAtendidosEnMasDe15?.toFixed(2) || "N/A"}%
              </h4>
              <small style={{ color: "#6b7280", fontWeight: "500" }}>
                Probabilidad Atención &gt; 15min (Paquetes)
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="stats-card h-100" style={{ borderLeft: "4px solid #7c3aed" }}>
            <Card.Body className="text-center">
              <h4 style={{ color: "#7c3aed", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
                📊 {Math.max(...Object.values(resultados.cantidadMaximaEnCola || {})) || "N/A"}
              </h4>
              <small style={{ color: "#6b7280", fontWeight: "500" }}>
                Máxima Cola Registrada
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
          {resultadosFormateados.map((resultado, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center" style={{ padding: "1.5rem" }}>
              <div className="text-start" style={{ flex: "1", marginRight: "1rem" }}>
                <h6 className="mb-1 fw-bold" style={{ color: "#374151", margin: "0 0 0.5rem 0", fontSize: "1.05rem" }}>
                  {resultado.servicio}
                </h6>
                <div style={{ color: "#6b7280", lineHeight: "1.5", fontSize: "0.9rem" }}>
                  <span style={{ marginRight: "1rem" }}>
                    ⏰ <strong>Espera: {resultado.tiempoPromedio}</strong>
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
                  {resultado.eficiencia} ocupación
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      {/* Colas Máximas por Servicio */}
      <Card className="results-card mt-4">
        <Card.Header>
          <span>📊 Colas Máximas Registradas</span>
        </Card.Header>
        <Card.Body>
          <Row>
            {Object.entries(resultados.cantidadMaximaEnCola || {}).map(([servicio, maxCola], index) => (
              <Col md={4} sm={6} key={index} className="mb-3">
                <div className="text-center p-3" style={{ backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "1.5rem", color: "#4f46e5", fontWeight: "700" }}>
                    {maxCola}
                  </div>
                  <small style={{ color: "#6b7280" }}>
                    {obtenerNombreServicio(servicio)}
                  </small>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Nota informativa */}
      <div className="info-note">
        <small>
          <strong style={{ color: "#374151" }}>💡 Nota:</strong> Los resultados mostrados provienen de la simulación ejecutada 
          con {simulationData?.numeroIteraciones?.toLocaleString() || "N/A"} iteraciones.
          {simulationData?.prioridadEnEmpresarial && " Los servicios empresariales se muestran separados por prioridad."}
        </small>
      </div>
    </>
  );
};
