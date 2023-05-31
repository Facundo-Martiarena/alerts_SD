import React from "react";
import { Button } from "react-bootstrap";
import { FaExclamationTriangle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import '../App.css';
import logo from "../assets/logo.png";

function Home() {
    const location = useLocation()

    const handleDashboardClick = () => {
        // Lógica para redirigir al dashboard
        // history("/dashboard");
    };

    const handleSensorRepairClick = () => {
        // Lógica para redirigir a la página de reparación de sensores
        // history("/sensor-repair");
    };
    return (
        <div className="container">
            <div className="homepage">
                <div className="app-bar">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1 className="app-title">Alertas Uruguay</h1>
                </div>

                <h1>
                    Bienvenido {location.state.id}!
                </h1>

                <div className="button-container">
                    <Button variant="primary" onClick={handleDashboardClick}>
                        Ver Dashboard
                    </Button>
                    <Button variant="secondary" onClick={handleSensorRepairClick}>
                        Arreglo de Sensores
                    </Button>
                </div>

                <div className="content">
                    {/* Contenido adicional de la página */}
                </div>
            </div>

            <footer className="bottom-bar">
                <p>
                    <FaExclamationTriangle className="warning-icon" /> <strong>NO HAY ALERTAS!</strong>
                </p>
            </footer>
        </div>

    )
}

export default Home