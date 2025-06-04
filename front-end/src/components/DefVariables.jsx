import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import { useState } from "react";

export const DefVariables = ({ onSendData }) => {
  const [formDatos, setFormDatos] = useState({
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
  });

  console.log(formDatos);

  const handleChange = (e) => {
    setFormDatos({
      ...formDatos,
      [e.target.name]: parseInt(e.target.value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendData(formDatos);
  };

  const serviceConfigs = [
    {
      title: "📦 Envío de Paquetes",
      icon: "📦",
      prefix: "TS1",
      color: "#6366f1"
    },
    {
      title: "🔄 Reclamos y Devoluciones", 
      icon: "🔄",
      prefix: "TS2",
      color: "#8b5cf6"
    },
    {
      title: "💌 Venta de Sellos y Sobres",
      icon: "💌", 
      prefix: "TS3",
      color: "#06b6d4"
    },
    {
      title: "🏢 Atención Empresarial",
      icon: "🏢",
      prefix: "TS4", 
      color: "#10b981"
    },
    {
      title: "✉️ Postales y Envíos Especiales",
      icon: "✉️",
      prefix: "TS5",
      color: "#f59e0b"
    }
  ];

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div className="service-columns-container">
          {serviceConfigs.map((service, index) => (
            <div key={index} className="service-column">
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
                    name={`LlegadaCT${service.prefix}`}
                    defaultValue={formDatos[`LlegadaCT${service.prefix}`]}
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
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="primary" className="simulate-btn" type="submit">
            🚀 Ejecutar Simulación
          </Button>
        </div>
      </Form>
    </>
  );
};
