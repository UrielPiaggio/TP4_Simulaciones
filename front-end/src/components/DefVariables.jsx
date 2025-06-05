import React from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/FloatingLabel"
import Button from "react-bootstrap/Button"
import { useState } from "react"
import { postSimulationData } from "../../services/serviceSim"

export const DefVariables = ({
  onSendData,
  onSimulationResults,
  onSimulationError,
  onSimulationStart,
}) => {
  const [formDatos, setFormDatos] = useState({
    // Parámetros de simulación
    numeroIteraciones: 100000,
    // Datos de servicios existentes
    LlegadaCTS1: 25,
    CantiSerTS1: 3,
    TasaLlegadaTS1: 10,
    LlegadaCTS2: 15,
    CantiSerTS2: 2,
    TasaLlegadaTS2: 7,
    LlegadaCTS3: 30,
    CantiSerTS3: 3,
    TasaLlegadaTS3: 18,
    LlegadaCTS4: 10,
    CantiSerTS4: 2,
    TasaLlegadaTS4: 5,
    LlegadaCTS5: 8,
    CantiSerTS5: 1,
    TasaLlegadaTS5: 3,
    // Configuración de tabla
    CantidadFilaAMostrar: 300,
    DesdeFilaAMostrar: 1,
    // Configuraciones especiales
    AusenciaEmpleadoEmpresarial: false,
    NuevoServicioPostEntrega: true,
    ClientesEmpresarialesPrioridad: false,
    // Nuevos campos para el servicio especial
    TiempoAtencionNuevoServicio: 5, // Tasa de servicio para nuevo servicio
    CantidadEmpleadosNuevoServicio: 1, // Número de empleados para nuevo servicio
  })

  console.log(formDatos)
  const handleChange = (e) => {
    setFormDatos({
      ...formDatos,
      [e.target.name]: parseInt(e.target.value),
    })
  }

  const handleCheckboxChange = (e) => {
    setFormDatos({
      ...formDatos,
      [e.target.name]: e.target.checked,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Transformar los datos del formulario al formato esperado por el backend
    const backendData = {
      numeroIteraciones: formDatos.numeroIteraciones,
      iteracionAMostrarPrimero: formDatos.DesdeFilaAMostrar,
      cantidadDeFilasAMostrar: formDatos.CantidadFilaAMostrar,
      tiemposAtencion: {
        tiempoAtencionEnvioPaquetes: 1 / formDatos.TasaLlegadaTS1, // Convertir tasa a tiempo
        tiempoAtencionRyD: 1 / formDatos.TasaLlegadaTS2,
        tiempoVentaSyS: 1 / formDatos.TasaLlegadaTS3,
        tiempoAtencionEmpresarial: 1 / formDatos.TasaLlegadaTS4,
        tiempoAtencionPyES: 1 / formDatos.TasaLlegadaTS5,
      },
      tiemposLlegada: {
        tiempoLlegadaEnvioPaquetes: {
          distribucion: "exponencial",
          media: 1 / formDatos.LlegadaCTS1, // Convertir llegadas por hora a tiempo promedio
        },
        tiempoLlegadaRyD: {
          distribucion: "exponencial",
          media: 1 / formDatos.LlegadaCTS2,
        },
        tiempoLlegadaSyS: {
          distribucion: "exponencial",
          media: 1 / formDatos.LlegadaCTS3,
        },
        tiempoLlegadaEmpresarial: {
          distribucion: "exponencial",
          media: 1 / formDatos.LlegadaCTS4,
        },
        tiempoLlegadaPyES: {
          distribucion: "exponencial",
          media: 1 / formDatos.LlegadaCTS5,
        },
      },
      empleados: {
        empleadosEnvioPaquetes: formDatos.CantiSerTS1,
        empleadosRyD: formDatos.CantiSerTS2,
        empleadosSyS: formDatos.CantiSerTS3,
        empleadosEmpresarial: formDatos.CantiSerTS4,
        empleadosPyES: formDatos.CantiSerTS5,
      },
      ausenciaEmpleadoEmpresarial: formDatos.AusenciaEmpleadoEmpresarial,
      nuevoServicio: {
        tiempoAtencion: 1 / formDatos.TiempoAtencionNuevoServicio,
        numeroEmpleados: formDatos.CantidadEmpleadosNuevoServicio,
        habilitado: formDatos.NuevoServicioPostEntrega,
      },
      prioridadEnEmpresarial: formDatos.ClientesEmpresarialesPrioridad,
    }

    onSendData(backendData)

    // Iniciar simulación
    onSimulationStart()

    try {
      const response = await postSimulationData(backendData)
      console.log("Datos enviados correctamente:", response)
      onSimulationResults(response)
    } catch (error) {
      console.error("Error al enviar los datos:", error)
      onSimulationError(error.message || "Error al ejecutar la simulación")
    }
  }

  const serviceConfigs = [
    {
      title: "📦 Envío de Paquetes",
      icon: "📦",
      prefix: "TS1",
      color: "#6366f1",
    },
    {
      title: "🔄 Reclamos y Devoluciones",
      icon: "🔄",
      prefix: "TS2",
      color: "#8b5cf6",
    },
    {
      title: "💌 Venta de Sellos y Sobres",
      icon: "💌",
      prefix: "TS3",
      color: "#06b6d4",
    },
    {
      title: "🏢 Atención Empresarial",
      icon: "🏢",
      prefix: "TS4",
      color: "#10b981",
    },
    {
      title: "✉️ Postales y Envíos Especiales",
      icon: "✉️",
      prefix: "TS5",
      color: "#f59e0b",
    },
  ]

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div className="service-columns-container">
          <Row>
            {serviceConfigs.map((service, index) => (
              <Col key={index} md={4} className="mb-4">
                <div className="service-label">
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>
                    {service.icon}
                  </div>
                  <div style={{ fontSize: "0.95rem", lineHeight: "1.3" }}>
                    {service.title}
                  </div>
                </div>

                <div className="service-inputs-container">
                  <FloatingLabel
                    controlId={`llegada-${service.prefix}`}
                    label="👥 Clientes por hora"
                  >
                    <Form.Control
                      type="number"
                      name={`LlegadaC${service.prefix}`}
                      defaultValue={formDatos[`LlegadaC${service.prefix}`]}
                      onChange={handleChange}
                      min="1"
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId={`servidores-${service.prefix}`}
                    label="🏪 Cantidad Servidores"
                  >
                    <Form.Control
                      name={`CantiSer${service.prefix}`}
                      type="number"
                      defaultValue={formDatos[`CantiSer${service.prefix}`]}
                      onChange={handleChange}
                      min="1"
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId={`tasa-${service.prefix}`}
                    label="⚡ Tasa de Servicio"
                  >
                    <Form.Control
                      name={`TasaLlegada${service.prefix}`}
                      type="number"
                      defaultValue={formDatos[`TasaLlegada${service.prefix}`]}
                      onChange={handleChange}
                      min="1"
                    />
                  </FloatingLabel>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Configuración del Nuevo Servicio */}
        <div className="table-config-section">
          <h5 className="config-title">
            📮 Configuración del Nuevo Servicio Post-Entrega
          </h5>
          <Row className="g-3">
            <Col md={6}>
              <FloatingLabel
                controlId="tiempoAtencionNuevoServicio"
                label="⚡ Tasa de Servicio (clientes por hora)"
              >
                <Form.Control
                  type="number"
                  name="TiempoAtencionNuevoServicio"
                  defaultValue={formDatos.TiempoAtencionNuevoServicio}
                  onChange={handleChange}
                  min="1"
                  disabled={!formDatos.NuevoServicioPostEntrega}
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
                controlId="cantidadEmpleadosNuevoServicio"
                label="👥 Número de Empleados"
              >
                <Form.Control
                  type="number"
                  name="CantidadEmpleadosNuevoServicio"
                  defaultValue={formDatos.CantidadEmpleadosNuevoServicio}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  disabled={!formDatos.NuevoServicioPostEntrega}
                />
              </FloatingLabel>
            </Col>
          </Row>
        </div>

        {/* Configuración de simulación */}
        <div className="table-config-section">
          <h5 className="config-title">🔬 Configuración de Simulación</h5>
          <Row className="g-3">
            <Col md={4}>
              <FloatingLabel
                controlId="numeroIteraciones"
                label="🔄 Número de iteraciones"
              >
                <Form.Control
                  type="number"
                  name="numeroIteraciones"
                  defaultValue={formDatos.numeroIteraciones}
                  onChange={handleChange}
                  min="1000"
                  max="1000000"
                />
              </FloatingLabel>
            </Col>
            <Col md={4}>
              <FloatingLabel
                controlId="cantidadFilaAMostrar"
                label="📋 Cantidad de filas a mostrar"
              >
                <Form.Control
                  type="number"
                  name="CantidadFilaAMostrar"
                  defaultValue={formDatos.CantidadFilaAMostrar}
                  onChange={handleChange}
                  min="1"
                  max="1000"
                />
              </FloatingLabel>
            </Col>
            <Col md={4}>
              <FloatingLabel
                controlId="desdeFilaAMostrar"
                label="🔢 Desde fila número"
              >
                <Form.Control
                  type="number"
                  name="DesdeFilaAMostrar"
                  defaultValue={formDatos.DesdeFilaAMostrar}
                  onChange={handleChange}
                  min="1"
                />
              </FloatingLabel>
            </Col>
          </Row>{" "}
        </div>

        {/* Configuraciones Especiales */}
        <div className="special-config-section">
          <h5 className="special-config-title">
            ⚙️ Configuraciones Especiales del Sistema
          </h5>
          <Row className="g-4">
            <Col md={4}>
              <div
                className="checkbox-card"
                onClick={() =>
                  handleCheckboxChange({
                    target: {
                      name: "AusenciaEmpleadoEmpresarial",
                      checked: !formDatos.AusenciaEmpleadoEmpresarial,
                    },
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <Form.Check
                  type="checkbox"
                  id="ausenciaEmpleadoEmpresarial"
                  name="AusenciaEmpleadoEmpresarial"
                  checked={formDatos.AusenciaEmpleadoEmpresarial}
                  onChange={handleCheckboxChange}
                  className="custom-checkbox"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="checkbox-content">
                  <div className="checkbox-icon">👷🏻‍♂️❌</div>
                  <div className="checkbox-label">
                    <strong>Ausencia de Empleado</strong>
                    <small>Empleado de atención empresarial ausente</small>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div
                className="checkbox-card"
                onClick={() =>
                  handleCheckboxChange({
                    target: {
                      name: "NuevoServicioPostEntrega",
                      checked: !formDatos.NuevoServicioPostEntrega,
                    },
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <Form.Check
                  type="checkbox"
                  id="nuevoServicioPostEntrega"
                  name="NuevoServicioPostEntrega"
                  checked={formDatos.NuevoServicioPostEntrega}
                  onChange={handleCheckboxChange}
                  className="custom-checkbox"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="checkbox-content">
                  <div className="checkbox-icon">📦✨</div>
                  <div className="checkbox-label">
                    <strong>Servicio Post-Entrega</strong>
                    <small>
                      Nuevo servicio después de entrega de paquetes/postales
                    </small>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div
                className="checkbox-card"
                onClick={() =>
                  handleCheckboxChange({
                    target: {
                      name: "ClientesEmpresarialesPrioridad",
                      checked: !formDatos.ClientesEmpresarialesPrioridad,
                    },
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <Form.Check
                  type="checkbox"
                  id="clientesEmpresarialesPrioridad"
                  name="ClientesEmpresarialesPrioridad"
                  checked={formDatos.ClientesEmpresarialesPrioridad}
                  onChange={handleCheckboxChange}
                  className="custom-checkbox"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="checkbox-content">
                  <div className="checkbox-icon">👨🏼‍💼⭐</div>
                  <div className="checkbox-label">
                    <strong>Prioridad Empresarial</strong>
                    <small>
                      Clientes empresariales con atención prioritaria
                    </small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div className="text-center">
          <Button variant="primary" className="simulate-btn" type="submit">
            🚀 Ejecutar Simulación
          </Button>
        </div>
      </Form>
    </>
  )
}
